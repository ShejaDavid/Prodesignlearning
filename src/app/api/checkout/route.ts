import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkoutSchema } from "@/lib/validations";
import { calculateTax } from "@/lib/utils";
import { getPaymentProvider } from "@/lib/payments";
import { SITE_CONFIG } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid checkout data" },
        { status: 400 }
      );
    }

    const { enrollmentId, paymentMethod } = parsed.data;

    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: true,
        cohort: true,
        user: true,
        payment: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    if (session?.user?.id && enrollment.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (enrollment.payment?.status === "COMPLETED") {
      return NextResponse.json({ error: "Payment already completed" }, { status: 400 });
    }

    const price = Number(enrollment.course.price);
    const taxRate = Number(enrollment.course.taxRate);
    const taxAmount = calculateTax(price, taxRate);
    const totalAmount = price + taxAmount;

    let payment = enrollment.payment;

    if (!payment) {
      payment = await db.payment.create({
        data: {
          userId: enrollment.userId,
          enrollmentId: enrollment.id,
          amount: price,
          taxAmount,
          totalAmount,
          currency: "MUR",
          method: paymentMethod,
          status: "PROCESSING",
        },
      });
    } else {
      payment = await db.payment.update({
        where: { id: payment.id },
        data: { method: paymentMethod, status: "PROCESSING" },
      });
    }

    const provider = getPaymentProvider();
    const session_result = await provider.createSession({
      amount: totalAmount,
      currency: "MUR",
      description: `${enrollment.course.title} — ${enrollment.cohort.name}`,
      customerEmail: enrollment.user.email,
      customerName: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
      enrollmentId: enrollment.id,
      returnUrl: `${SITE_CONFIG.url}/checkout/success`,
      cancelUrl: `${SITE_CONFIG.url}/checkout/failed?enrollment=${enrollment.id}`,
    });

    await db.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: session_result.sessionId,
        mipsReference: paymentMethod === "MIPS" ? session_result.sessionId : null,
        metadata: { sessionId: session_result.sessionId },
      },
    });

    return NextResponse.json({
      paymentId: payment.id,
      sessionId: session_result.sessionId,
      paymentUrl: session_result.paymentUrl,
      status: session_result.status,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout. Please try again." },
      { status: 500 }
    );
  }
}
