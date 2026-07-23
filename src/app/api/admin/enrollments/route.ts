import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminEnrollSchema } from "@/lib/validations";
import { createPasswordSetToken } from "@/lib/tokens";
import {
  sendEmail,
  setPasswordEmail,
  enrollmentConfirmationEmail,
} from "@/lib/email";
import { SITE_CONFIG } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { syncCohortSeats } from "@/lib/cohort-seats";

export async function POST(request: Request) {
  try {
    // Admin-only: verify server-side, never trust the client.
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = adminEnrollSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, cohortId, accessExpiresAt } =
      parsed.data;

    const cohort = await db.cohort.findUnique({
      where: { id: cohortId },
      include: { course: true },
    });
    if (!cohort) {
      return NextResponse.json({ error: "Cohort not found" }, { status: 404 });
    }

    // Upsert the student by email. New users are created unactivated (no password).
    let user = await db.user.findUnique({ where: { email } });
    const isNewUser = !user;
    if (!user) {
      user = await db.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone: phone || null,
          role: "STUDENT",
        },
      });
    } else {
      user = await db.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName,
          phone: phone || null,
        },
      });
    }

    const parsedExpiry =
      accessExpiresAt && accessExpiresAt.trim() !== ""
        ? new Date(accessExpiresAt)
        : null;
    const expiry =
      parsedExpiry && !Number.isNaN(parsedExpiry.getTime()) ? parsedExpiry : null;

    // Enrol — idempotent on the unique [userId, cohortId] pair.
    const existingEnrollment = await db.enrollment.findUnique({
      where: { userId_cohortId: { userId: user.id, cohortId } },
    });
    const enrollment = await db.$transaction(async (tx) => {
      const saved = existingEnrollment
        ? await tx.enrollment.update({
            where: { id: existingEnrollment.id },
            data: {
              status: "ENROLLED",
              enrolledAt: existingEnrollment.enrolledAt ?? new Date(),
              accessExpiresAt: expiry,
            },
          })
        : await tx.enrollment.create({
            data: {
              userId: user.id,
              courseId: cohort.courseId,
              cohortId,
              status: "ENROLLED",
              enrolledAt: new Date(),
              accessExpiresAt: expiry,
            },
          });

      await syncCohortSeats(tx, cohortId);
      return saved;
    });

    // Notify: unactivated users get a set-password link; already-activated
    // users just get an enrolment confirmation.
    const needsActivation = !user.passwordHash;
    if (needsActivation) {
      const rawToken = await createPasswordSetToken(user.id);
      const link = `${SITE_CONFIG.url}/set-password/${rawToken}`;
      const mail = setPasswordEmail(
        `${firstName} ${lastName}`,
        link,
        cohort.course.title
      );
      await sendEmail({
        to: email,
        subject: mail.subject,
        html: mail.html,
        userId: user.id,
        emailType: "set_password",
      });
    } else {
      const mail = enrollmentConfirmationEmail(
        `${user.firstName} ${user.lastName}`,
        cohort.course.title,
        formatDate(cohort.startDate),
        cohort.schedule
      );
      await sendEmail({
        to: email,
        subject: mail.subject,
        html: mail.html,
        userId: user.id,
        emailType: "enrollment_confirmation",
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      enrollmentId: enrollment.id,
      isNewUser,
      activationSent: needsActivation,
      alreadyEnrolled: Boolean(existingEnrollment),
    });
  } catch (error) {
    console.error("Admin enroll error:", error);
    return NextResponse.json(
      { error: "Failed to enrol student. Please try again." },
      { status: 500 }
    );
  }
}
