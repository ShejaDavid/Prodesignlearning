import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminCohortSchema, adminCohortUpdateSchema } from "@/lib/validations";
import { syncCohortSeats } from "@/lib/cohort-seats";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminCohortSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const course = await db.course.findUnique({ where: { id: data.courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const cohort = await db.cohort.create({
      data: {
        courseId: data.courseId,
        name: data.name,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        schedule: data.schedule,
        deliveryMethod: data.deliveryMethod,
        venue: data.venue || null,
        seatsTotal: data.seatsTotal,
        // A new cohort starts fully open — seatsAvailable is not user input here.
        seatsAvailable: data.seatsTotal,
        status: data.status,
      },
    });

    return NextResponse.json({ success: true, id: cohort.id });
  } catch (error) {
    console.error("Cohorts POST error:", error);
    return NextResponse.json({ error: "Failed to create cohort" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminCohortUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    // A cohort's course is fixed at creation; courseId in the payload (if any)
    // is intentionally ignored on edit.
    const { id, ...data } = parsed.data;

    const cohort = await db.cohort.findUnique({ where: { id } });
    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    }
    await db.$transaction(async (tx) => {
      await tx.cohort.update({
        where: { id },
        data: {
          name: data.name,
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          schedule: data.schedule,
          deliveryMethod: data.deliveryMethod,
          venue: data.venue || null,
          seatsTotal: data.seatsTotal,
          status: data.status,
        },
      });
      await syncCohortSeats(tx, id);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cohorts PATCH error:", error);
    return NextResponse.json({ error: "Failed to update cohort" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing cohort id" }, { status: 400 });
    }

    const cohort = await db.cohort.findUnique({
      where: { id },
      include: { _count: { select: { enrollments: true } } },
    });
    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    }
    if (cohort._count.enrollments > 0) {
      return NextResponse.json(
        {
          error:
            "This cohort has enrolments and cannot be deleted. Remove or cancel those enrolments first.",
        },
        { status: 409 }
      );
    }

    await db.cohort.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cohorts DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete cohort" }, { status: 500 });
  }
}
