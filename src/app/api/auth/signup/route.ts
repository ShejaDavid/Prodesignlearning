import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { emailEquals, normalizeEmail } from "@/lib/email-normalize";
import { createEmailVerificationToken } from "@/lib/tokens";
import { sendEmail, verifyEmailEmail } from "@/lib/email";
import { SITE_CONFIG } from "@/lib/constants";

const signupSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone, password } = parsed.data;
    const email = normalizeEmail(parsed.data.email);

    const existing = await db.user.findFirst({ where: { email: emailEquals(email) } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        role: "STUDENT",
      },
    });

    // Verification is informational only — it never gates login. If sending
    // fails for any reason, the account still exists and signup still
    // succeeds; the user can request a new link later if needed.
    try {
      const rawToken = await createEmailVerificationToken(user.id);
      const link = `${SITE_CONFIG.url}/verify-email/${rawToken}`;
      const mail = verifyEmailEmail(`${firstName} ${lastName}`, link);
      await sendEmail({
        to: email,
        subject: mail.subject,
        html: mail.html,
        userId: user.id,
        emailType: "verify_email",
      });
    } catch (error) {
      console.error("Verification email error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
