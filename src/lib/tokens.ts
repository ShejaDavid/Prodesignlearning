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

/**
 * Issues a single-use, expiring email-verification token for a user and
 * returns the RAW token. Mirrors createPasswordSetToken — any of the user's
 * outstanding verification tokens are invalidated first.
 */
export async function createEmailVerificationToken(userId: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.$transaction([
    db.emailVerificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
    db.emailVerificationToken.create({ data: { userId, tokenHash, expiresAt } }),
  ]);

  return rawToken;
}

/**
 * Verifies a raw email-verification token: if valid, marks the user's email
 * verified and burns the token in one transaction. Returns true on success,
 * false if the token is missing, used, or expired (link already consumed or
 * stale — never blocks the user's ability to log in either way).
 */
export async function verifyEmailToken(rawToken: string): Promise<boolean> {
  const token = await db.emailVerificationToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });
  if (!token || token.usedAt || token.expiresAt <= new Date()) return false;

  await db.$transaction([
    db.user.update({
      where: { id: token.userId },
      data: { emailVerified: new Date() },
    }),
    db.emailVerificationToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return true;
}
