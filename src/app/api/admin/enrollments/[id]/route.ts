import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminEnrollmentUpdateSchema } from "@/lib/validations";
import { syncCohortSeats } from "@/lib/cohort-seats";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = adminEnrollmentUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const enrollment = await db.enrollment.findUnique({ where: { id } });
    if (!enrollment) {
      return NextResponse.json({ error: "Enrolment not found" }, { status: 404 });
    }

    const { status } = parsed.data;

    await db.$transaction(async (tx) => {
      await tx.enrollment.update({
        where: { id },
        data: {
          status,
          enrolledAt:
            status === "ENROLLED" && !enrollment.enrolledAt
              ? new Date()
              : enrollment.enrolledAt,
          completedAt:
            status === "COMPLETED"
              ? new Date()
              : status === "CANCELLED"
                ? null
                : enrollment.completedAt,
        },
      });
      await syncCohortSeats(tx, enrollment.cohortId);
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enrollment PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update enrolment" },
      { status: 500 }
    );
  }
}
