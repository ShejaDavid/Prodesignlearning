import "server-only";
import Mux from "@mux/mux-node";

let cached: Mux | null = null;

/** Returns a Mux API client, or null if the API access token isn't configured. */
export function getMuxClient(): Mux | null {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) return null;
  if (!cached) cached = new Mux({ tokenId, tokenSecret });
  return cached;
}

export function isMuxConfigured(): boolean {
  return Boolean(process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET);
}

/**
 * Creates a Mux direct upload whose resulting asset uses a SIGNED playback
 * policy. This is the crux of access control: a signed asset can ONLY be
 * watched via a server-minted token (see createMuxPlaybackTokens), so a leaked
 * playback id is useless without the enrolment check that mints the token.
 *
 * `passthrough` carries our Video row id back to us on the webhook, so we can
 * attach the resulting playback id to the right video.
 */
export async function createMuxDirectUpload(
  videoId: string,
  corsOrigin: string
): Promise<{ uploadId: string; uploadUrl: string }> {
  const mux = getMuxClient();
  if (!mux) throw new Error("Mux API is not configured");

  const upload = await mux.video.uploads.create({
    cors_origin: corsOrigin,
    new_asset_settings: {
      playback_policies: ["signed"],
      passthrough: videoId,
    },
  });

  if (!upload.url) {
    throw new Error("Mux did not return an upload URL");
  }
  return { uploadId: upload.id, uploadUrl: upload.url };
}

/** Best-effort deletion of a Mux asset so removed videos don't linger in Mux. */
export async function deleteMuxAsset(assetId: string): Promise<void> {
  const mux = getMuxClient();
  if (!mux) return;
  try {
    await mux.video.assets.delete(assetId);
  } catch (error) {
    console.error("Failed to delete Mux asset", assetId, error);
  }
}
