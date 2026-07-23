import { createHash, randomBytes } from "crypto";
import { db } from "@/lib/db";

const TOKEN_TTL_DAYS = 7;

/** SHA-256 hex hash. Only the hash is ever stored; the raw token lives only in the emailed link. */
export function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Issues a single-use, expiring set-password token for a user and returns the
 * RAW token (returned only here). Any of the user's outstanding tokens are
 * invalidated first, so only the newest link works.
 */
export async function createPasswordSetToken(userId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.$transaction([
    db.passwordSetToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
    db.passwordSetToken.create({ data: { userId, tokenHash, expiresAt } }),
  ]);

  return rawToken;
}

/** Returns the token row only if it exists, is unused, and is unexpired; otherwise null. */
export async function findValidPasswordSetToken(rawToken: string) {
  const token = await db.passwordSetToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });
  if (!token || token.usedAt || token.expiresAt <= new Date()) return null;
  return token;
}
