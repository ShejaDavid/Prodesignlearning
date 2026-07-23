import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  sendEmail,
  paymentConfirmationEmail,
  enrollmentConfirmationEmail,
} from "@/lib/email";
import { generateInvoiceNumber, formatCurrency, formatDate } from "@/lib/utils";
import { syncCohortSeats } from "@/lib/cohort-seats";

const completeSchema = z.object({
  paymentId: z.string().min(1),
});

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_MOCK_PAYMENTS !== "true") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = completeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { paymentId } = parsed.data;

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        enrollment: { include: { course: true, cohort: true } },
        user: true,
        invoice: true,
      },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json({ success: true, paymentId, alreadyCompleted: true });
    }

    const invoiceNumber = payment.invoice?.invoiceNumber || generateInvoiceNumber();

    await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: "COMPLETED",
          paidAt: new Date(),
          transactionId: payment.transactionId || `mock_${Date.now()}`,
        },
      });

      await tx.enrollment.update({
        where: { id: payment.enrollmentId },
        data: { status: "ENROLLED", enrolledAt: new Date() },
      });

      if (!payment.invoice) {
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
      }

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
      console.error("Mock payment emails failed:", emailError);
    }

    return NextResponse.json({ success: true, paymentId, invoiceNumber });
  } catch (error) {
    console.error("Mock payment completion error:", error);
    return NextResponse.json({ error: "Failed to complete payment" }, { status: 500 });
  }
}
