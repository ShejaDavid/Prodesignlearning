import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import {
  FORM_NOTIFICATION_RECIPIENTS,
  newsletterNotificationEmail,
  sendEmail,
} from "@/lib/email";
import { normalizeEmail } from "@/lib/email-normalize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }

    const email = normalizeEmail(parsed.data.email);
    let message = "Successfully subscribed";

    try {
      const existing = await db.newsletterSubscriber.findUnique({
        where: { email },
      });

      if (existing) {
        if (!existing.isActive) {
          await db.newsletterSubscriber.update({
            where: { email },
            data: { isActive: true },
          });
        }
        message = "Already subscribed";
      } else {
        await db.newsletterSubscriber.create({ data: { email } });
      }
    } catch (dbError) {
      console.error("Newsletter DB error:", dbError);
      console.log("[Newsletter Mock] Subscribed:", email);
    }

    const notification = newsletterNotificationEmail(email);
    await Promise.all(
      FORM_NOTIFICATION_RECIPIENTS.map((recipient) =>
        sendEmail({
          to: recipient,
          subject: notification.subject,
          html: notification.html,
          emailType: "newsletter_signup",
        })
      )
    );

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
