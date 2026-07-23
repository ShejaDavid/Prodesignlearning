import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import {
  contactNotificationEmail,
  FORM_NOTIFICATION_RECIPIENTS,
  sendEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid form data" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    try {
      await db.contactSubmission.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
        },
      });
    } catch (dbError) {
      console.error("Contact submission DB error:", dbError);
      console.log("[Contact Mock]", data);
    }

    const notification = contactNotificationEmail(data);
    await Promise.all(
      FORM_NOTIFICATION_RECIPIENTS.map((recipient) =>
        sendEmail({
          to: recipient,
          subject: notification.subject,
          html: notification.html,
          emailType: "contact_submission",
        })
      )
    );

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
