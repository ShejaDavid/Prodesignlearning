import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";
import {
  sendEmail,
  paymentConfirmationEmail,
  enrollmentConfirmationEmail,
} from "@/lib/email";
import { generateInvoiceNumber, formatCurrency, formatDate } from "@/lib/utils";
import { syncCohortSeats } from "@/lib/cohort-seats";

interface WebhookPayload {
  event?: string;
  transactionId?: string;
  sessionId?: string;
  status?: string;
  enrollmentId?: string;
}

async function completePayment(paymentId: string) {
  const payment = await db.payment.findUnique({
    where: { id: paymentId },
    include: {
      enrollment: { include: { course: true, cohort: true } },
      user: true,
    },
  });

  if (!payment || payment.status === "COMPLETED") return payment;

  const invoiceNumber = generateInvoiceNumber();

  await db.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "COMPLETED", paidAt: new Date() },
    });

    await tx.enrollment.update({
      where: { id: payment.enrollmentId },
      data: { status: "ENROLLED", enrolledAt: new Date() },
    });

    await tx.invoice.create({
      data: {
        userId: payment.userId,
        paymentId: payment.id,
        invoiceNumber,
        subtotal: payment.amount,
        taxAmount: payment.taxAmount,
        totalAmount: payment.totalAmount,
        currency: payment.currency,
        status: "PAID",
        issuedAt: new Date(),
      },
    });

    await syncCohortSeats(tx, payment.enrollment.cohortId);
  });

  const userName = `${payment.user.firstName} ${payment.user.lastName}`;
  const courseName = payment.enrollment.course.title;

  try {
    const paymentEmail = paymentConfirmationEmail(
      userName,
      courseName,
      formatCurrency(Number(payment.totalAmount)),
      invoiceNumber
    );
    await sendEmail({
      to: payment.user.email,
      subject: paymentEmail.subject,
      html: paymentEmail.html,
      userId: payment.userId,
      emailType: "payment_confirmation",
    });

    const enrollEmail = enrollmentConfirmationEmail(
      userName,
      courseName,
      formatDate(payment.enrollment.cohort.startDate),
      payment.enrollment.cohort.schedule
    );
    await sendEmail({
      to: payment.user.email,
      subject: enrollEmail.subject,
      html: enrollEmail.html,
      userId: payment.userId,
      emailType: "enrollment_confirmation",
    });
  } catch (emailError) {
    console.error("Payment completion emails failed:", emailError);
  }

  return payment;
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("x-webhook-signature") || "";
    const payload: WebhookPayload = await request.json();

    const provider = getPaymentProvider();
    if (!provider.verifyWebhook(payload, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const transactionId = payload.transactionId || payload.sessionId;
    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { transactionId },
          { mipsReference: transactionId },
        ],
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const status = payload.status || (await provider.getPaymentStatus(transactionId));

    if (status === "completed" || status === "COMPLETED") {
      await completePayment(payment.id);
      return NextResponse.json({ success: true, paymentId: payment.id });
    }

    if (status === "failed" || status === "FAILED") {
      await db.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      return NextResponse.json({ success: true, status: "failed" });
    }

    return NextResponse.json({ success: true, status: "pending" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
