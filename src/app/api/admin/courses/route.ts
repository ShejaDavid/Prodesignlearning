import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminCourseSchema, adminCourseUpdateSchema } from "@/lib/validations";

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
    const parsed = adminCourseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const existing = await db.course.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A course with this slug already exists." },
        { status: 409 }
      );
    }

    const course = await db.course.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        overview: data.overview,
        price: data.price,
        taxRate: data.taxRate,
        durationHours: data.durationHours,
        durationDays: data.durationDays,
        maxSeats: data.maxSeats,
        instructorName: data.instructorName,
        instructorBio: data.instructorBio,
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ success: true, id: course.id });
  } catch (error) {
    console.error("Courses POST error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminCourseUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const course = await db.course.findUnique({ where: { id } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (data.slug !== course.slug) {
      const slugTaken = await db.course.findUnique({ where: { slug: data.slug } });
      if (slugTaken) {
        return NextResponse.json(
          { error: "A course with this slug already exists." },
          { status: 409 }
        );
      }
    }

    await db.course.update({ where: { id }, data });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Courses PATCH error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing course id" }, { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id },
      include: { _count: { select: { enrollments: true } } },
    });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    // Protect student records: a course with enrolments can't be deleted.
    if (course._count.enrollments > 0) {
      return NextResponse.json(
        {
          error:
            "This course has enrolments and cannot be deleted. Remove or cancel those enrolments first.",
        },
        { status: 409 }
      );
    }

    // No enrolments → safe to remove its cohorts and modules (videos cascade).
    await db.$transaction([
      db.cohort.deleteMany({ where: { courseId: id } }),
      db.courseModule.deleteMany({ where: { courseId: id } }),
      db.course.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Courses DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
