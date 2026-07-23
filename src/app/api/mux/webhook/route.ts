import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getMuxClient } from "@/lib/mux-server";

// Mux calls this endpoint; the signature check (not a session) is what
// authenticates the request, so it must stay public.
export async function POST(request: Request) {
  const mux = getMuxClient();
  if (!mux) {
    // Mux not configured — acknowledge so Mux doesn't retry forever.
    return NextResponse.json({ ignored: true });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = await mux.webhooks.unwrap(
      rawBody,
      request.headers,
      process.env.MUX_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Mux webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "video.asset.ready") {
      const data = event.data as {
        id?: string;
        passthrough?: string | null;
        playback_ids?: Array<{ id: string; policy: string }>;
      };
      const videoId = data.passthrough;
      // Only ever store a SIGNED playback id — a public one would bypass the gate.
      const signed = data.playback_ids?.find((p) => p.policy === "signed");

      if (videoId && signed) {
        // updateMany so a since-deleted video doesn't throw.
        await db.video.updateMany({
          where: { id: videoId, provider: "MUX" },
          data: { muxAssetId: data.id ?? null, muxPlaybackId: signed.id },
        });
      }
    } else if (event.type === "video.asset.errored") {
      const data = event.data as { passthrough?: string | null };
      console.error("Mux asset errored for video:", data.passthrough);
    }
  } catch (error) {
    console.error("Mux webhook handling error:", error);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
