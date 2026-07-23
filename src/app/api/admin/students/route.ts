import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminStudentSchema } from "@/lib/validations";
import { z } from "zod";
import { emailEquals, normalizeEmail } from "@/lib/email-normalize";

const updateSchema = z.object({
  userId: z.string().min(1),
  enrollmentStatus: z.enum(["PENDING", "PAYMENT_PENDING", "ENROLLED", "COMPLETED", "CANCELLED"]).optional(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const users = await db.user.findMany({
      where: { role: "STUDENT" },
      include: {
        enrollments: {
          include: {
            course: { select: { title: true } },
            cohort: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const students = users.map((user) => {
      const latestEnrollment = user.enrollments[0] ?? null;
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        enrollmentStatus: latestEnrollment?.status ?? null,
        courseTitle: latestEnrollment?.course?.title ?? null,
        cohortName: latestEnrollment?.cohort?.name ?? null,
        enrollmentId: latestEnrollment?.id ?? null,
        enrollmentCount: user.enrollments.length,
        hasPassword: Boolean(user.passwordHash),
      };
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Students API error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminStudentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { firstName, lastName, phone } = parsed.data;
    const email = normalizeEmail(parsed.data.email);

    const existing = await db.user.findFirst({ where: { email: emailEquals(email) } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    // Created unactivated (no password). Use "Enrol Student" to grant course
    // access and send the set-password link.
    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone: phone || null,
        role: "STUDENT",
      },
    });

    return NextResponse.json({ success: true, id: user.id });
  } catch (error) {
    console.error("Students POST error:", error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing student id" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id },
      include: { _count: { select: { payments: true } } },
    });
    if (!user) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admin accounts cannot be deleted here." },
        { status: 403 }
      );
    }
    // Protect financial records: refuse to hard-delete a student who has payments.
    if (user._count.payments > 0) {
      return NextResponse.json(
        {
          error:
            "This student has payment history and cannot be deleted. Cancel their enrolment instead.",
        },
        { status: 409 }
      );
    }

    // Delete restricted children first; profile + tokens cascade, email logs null out.
    await db.$transaction([
      db.certificate.deleteMany({ where: { userId: id } }),
      db.enrollment.deleteMany({ where: { userId: id } }),
      db.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Students DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { userId, enrollmentStatus } = parsed.data;

    if (enrollmentStatus) {
      const enrollment = await db.enrollment.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (!enrollment) {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
      }

      await db.enrollment.update({
        where: { id: enrollment.id },
        data: { status: enrollmentStatus },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Students PATCH error:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}
