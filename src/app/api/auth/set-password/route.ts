import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { setPasswordSchema } from "@/lib/validations";
import { findValidPasswordSetToken } from "@/lib/tokens";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = setPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    const tokenRow = await findValidPasswordSetToken(token);
    if (!tokenRow) {
      return NextResponse.json(
        { error: "This link is invalid or has expired." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Set the password and burn the token in one transaction, so the link
    // can never be replayed.
    await db.$transaction([
      db.user.update({
        where: { id: tokenRow.userId },
        data: { passwordHash },
      }),
      db.passwordSetToken.update({
        where: { id: tokenRow.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
