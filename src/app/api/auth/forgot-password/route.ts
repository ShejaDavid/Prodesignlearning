import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validations";
import { createPasswordSetToken } from "@/lib/tokens";
import { sendEmail, resetPasswordEmail } from "@/lib/email";
import { SITE_CONFIG } from "@/lib/constants";
import { emailEquals, normalizeEmail } from "@/lib/email-normalize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    const user = await db.user.findFirst({ where: { email: emailEquals(email) } });

    // Always respond the same way whether or not the account exists, so this
    // endpoint can't be used to discover which emails are registered.
    if (user) {
      const rawToken = await createPasswordSetToken(user.id);
      const link = `${SITE_CONFIG.url}/set-password/${rawToken}`;
      const mail = resetPasswordEmail(`${user.firstName} ${user.lastName}`, link);
      await sendEmail({
        to: email,
        subject: mail.subject,
        html: mail.html,
        userId: user.id,
        emailType: "password_reset",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
