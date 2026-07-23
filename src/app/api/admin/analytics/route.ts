import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MOCK_ANALYTICS } from "@/lib/course-data";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
      const [totalStudents, completedPayments, pendingPayments, revenueAgg, totalEnrollments] =
        await Promise.all([
          db.user.count({ where: { role: "STUDENT" } }),
          db.payment.count({ where: { status: "COMPLETED" } }),
          db.payment.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }),
          db.payment.aggregate({
            where: { status: "COMPLETED" },
            _sum: { totalAmount: true },
          }),
          db.enrollment.count(),
        ]);

      const conversionRate =
        totalEnrollments > 0
          ? Math.round((completedPayments / totalEnrollments) * 1000) / 10
          : 0;

      return NextResponse.json({
        totalStudents,
        totalRevenue: Number(revenueAgg._sum.totalAmount ?? 0),
        conversionRate,
        pendingPayments,
        enrolledStudents: await db.enrollment.count({ where: { status: "ENROLLED" } }),
        completedPayments,
      });
    } catch (dbError) {
      console.error("Analytics DB error:", dbError);
      return NextResponse.json(MOCK_ANALYTICS);
    }
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
