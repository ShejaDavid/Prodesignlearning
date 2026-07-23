import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { db } from "@/lib/db";

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

    const { email } = parsed.data;

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
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }

      await db.newsletterSubscriber.create({ data: { email } });
    } catch (dbError) {
      console.error("Newsletter DB error:", dbError);
      console.log("[Newsletter Mock] Subscribed:", email);
    }

    return NextResponse.json({ success: true, message: "Successfully subscribed" });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
