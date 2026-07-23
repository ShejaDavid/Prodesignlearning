import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminVideoSchema } from "@/lib/validations";
import {
  isMuxConfigured,
  createMuxDirectUpload,
  deleteMuxAsset,
} from "@/lib/mux-server";
import { SITE_CONFIG } from "@/lib/constants";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

// A public playback id streams without a token (200); a signed one is blocked
// (403). We refuse to store public ids so protected content can't be bypassed.
async function isPublicPlaybackId(playbackId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://stream.mux.com/${encodeURIComponent(playbackId)}.m3u8`,
      { method: "GET" }
    );
    return res.status === 200;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminVideoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { moduleId, title, description, provider, url, muxPlaybackId } =
      parsed.data;

    const courseModule = await db.courseModule.findUnique({
      where: { id: moduleId },
    });
    if (!courseModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    // Append to the end of the module's video list.
    const sortOrder = await db.video.count({ where: { moduleId } });

    if (provider === "URL") {
      const video = await db.video.create({
        data: {
          moduleId,
          title,
          description: description || null,
          provider: "URL",
          url: url || null,
          sortOrder,
        },
      });
      return NextResponse.json({ success: true, video });
    }

    // provider === "MUX"
    // Path A: attach an existing playback id (created in the Mux dashboard).
    // It must be SIGNED — reject public ids so nothing unprotected gets stored.
    if (muxPlaybackId && muxPlaybackId.trim()) {
      const pid = muxPlaybackId.trim();
      if (await isPublicPlaybackId(pid)) {
        return NextResponse.json(
          {
            error:
              "That playback ID is PUBLIC — anyone with it could watch the video. Create a signed playback ID and use that instead.",
          },
          { status: 400 }
        );
      }
      const video = await db.video.create({
        data: {
          moduleId,
          title,
          description: description || null,
          provider: "MUX",
          url: null,
          muxPlaybackId: pid,
          sortOrder,
        },
      });
      return NextResponse.json({ success: true, video });
    }

    // Path B: upload a new file (needs the Mux API token).
    if (!isMuxConfigured()) {
      return NextResponse.json(
        { error: "Mux is not configured. Add MUX_TOKEN_ID and MUX_TOKEN_SECRET." },
        { status: 400 }
      );
    }

    // Create the row first so we have an id to pass to Mux as `passthrough`;
    // the webhook uses it to attach the playback id once the asset is ready.
    const video = await db.video.create({
      data: {
        moduleId,
        title,
        description: description || null,
        provider: "MUX",
        url: null,
        sortOrder,
      },
    });

    try {
      const { uploadUrl } = await createMuxDirectUpload(video.id, SITE_CONFIG.url);
      return NextResponse.json({ success: true, video, uploadUrl });
    } catch (error) {
      // Roll back the row so we don't leave an orphaned "processing" video.
      await db.video.delete({ where: { id: video.id } });
      console.error("Mux upload creation failed:", error);
      return NextResponse.json(
        { error: "Failed to start the Mux upload." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Videos POST error:", error);
    return NextResponse.json({ error: "Failed to add video" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing video id" }, { status: 400 });
    }

    const video = await db.video.findUnique({ where: { id } });
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Remove the Mux asset too (best effort) so it doesn't linger/bill.
    if (video.muxAssetId) {
      await deleteMuxAsset(video.muxAssetId);
    }

    await db.video.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Videos DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
