import { createSign } from "crypto";

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 30;

type MuxAudience = "v" | "t" | "s";

export interface MuxPlaybackTokens {
  playback: string;
  thumbnail: string;
  storyboard: string;
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getMuxPrivateKey() {
  const raw = process.env.MUX_SIGNING_PRIVATE_KEY;
  if (!raw) return null;

  // Mux hands you the signing private key as a base64-encoded PEM. Support all
  // three ways it might land in the env:
  //   1. already-decoded PEM with real newlines,
  //   2. PEM with escaped "\n" (e.g. pasted into a single-line env var),
  //   3. the raw base64 blob straight from the Mux dashboard.
  const unescape = (v: string) => (v.includes("\\n") ? v.replace(/\\n/g, "\n") : v);

  if (raw.includes("BEGIN")) {
    const key = unescape(raw);
    return key.includes("END PRIVATE KEY") || key.includes("END RSA PRIVATE KEY")
      ? key
      : null;
  }

  try {
    const decoded = Buffer.from(raw, "base64").toString("utf-8");
    if (
      decoded.includes("BEGIN") &&
      (decoded.includes("END PRIVATE KEY") || decoded.includes("END RSA PRIVATE KEY"))
    ) {
      return decoded;
    }
  } catch {
    // not valid base64 — fall through
  }

  const key = unescape(raw);
  return key.includes("END PRIVATE KEY") || key.includes("END RSA PRIVATE KEY")
    ? key
    : null;
}

function signMuxJwt({
  playbackId,
  audience,
  expiresAt,
}: {
  playbackId: string;
  audience: MuxAudience;
  expiresAt: number;
}) {
  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
  const privateKey = getMuxPrivateKey();

  if (!signingKeyId || !privateKey) {
    return null;
  }

  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: signingKeyId,
  };
  const payload = {
    sub: playbackId,
    aud: audience,
    exp: expiresAt,
  };

  const signingInput = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(payload)
  )}`;
  const signer = createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();

  try {
    return `${signingInput}.${base64Url(signer.sign(privateKey))}`;
  } catch (error) {
    console.error("Failed to sign Mux playback token. Check MUX_SIGNING_PRIVATE_KEY format.", error);
    return null;
  }
}

export function createMuxPlaybackTokens(
  playbackId: string,
  ttlSeconds = DEFAULT_TOKEN_TTL_SECONDS
): MuxPlaybackTokens | null {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  const playback = signMuxJwt({ playbackId, audience: "v", expiresAt });
  const thumbnail = signMuxJwt({ playbackId, audience: "t", expiresAt });
  const storyboard = signMuxJwt({ playbackId, audience: "s", expiresAt });

  if (!playback || !thumbnail || !storyboard) {
    return null;
  }

  return { playback, thumbnail, storyboard };
}
