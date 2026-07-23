import { db } from "@/lib/db";
import { EnrollmentStatus } from "@prisma/client";

/**
 * A "valid" enrolment is one that grants access to protected course content:
 *   - status is ENROLLED or COMPLETED, and
 *   - access has not expired (accessExpiresAt is null = never expires, or in the future).
 *
 * PENDING / PAYMENT_PENDING / CANCELLED enrolments do NOT grant access.
 */
export function validEnrollmentFilter(now: Date = new Date()) {
  return {
    status: { in: [EnrollmentStatus.ENROLLED, EnrollmentStatus.COMPLETED] },
    OR: [{ accessExpiresAt: null }, { accessExpiresAt: { gt: now } }],
  };
}

function enrollmentPriority(status: string) {
  switch (status) {
    case "ENROLLED":
      return 0;
    case "COMPLETED":
      return 1;
    case "PAYMENT_PENDING":
      return 2;
    case "PENDING":
      return 3;
    case "CANCELLED":
      return 4;
    default:
      return 5;
  }
}

export async function getPrimaryEnrollment(userId: string) {
  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: { course: true, cohort: true, payment: true, certificate: true },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    enrollments.sort((a, b) => {
      const byPriority = enrollmentPriority(a.status) - enrollmentPriority(b.status);
      if (byPriority !== 0) return byPriority;

      return b.updatedAt.getTime() - a.updatedAt.getTime();
    })[0] ?? null
  );
}

/**
 * Courses the user may currently open — one entry per valid enrolment.
 * Backs the "My Courses" page.
 */
export function getMyCourses(userId: string) {
  return db.enrollment.findMany({
    where: { userId, ...validEnrollmentFilter() },
    include: { course: true, cohort: true },
    orderBy: [{ enrolledAt: "desc" }, { createdAt: "desc" }],
  });
}

/**
 * The single authorization gate for the protected learn page.
 *
 * Returns the enrolment (with the course, its ordered modules, and each module's
 * ordered videos) ONLY when the given user has a valid enrolment in the course
 * with this slug. Returns null otherwise — not logged in for this course, not
 * enrolled, wrong course id, or access expired all collapse to the same "no access".
 *
 * Because the enrolment check and the content fetch are the same query, there is
 * no way to load the videos without first passing the check.
 */
export function getEnrolledCourseForUser(userId: string, slug: string) {
  return db.enrollment.findFirst({
    where: {
      userId,
      ...validEnrollmentFilter(),
      course: { slug },
    },
    include: {
      cohort: true,
      course: {
        include: {
          modules: {
            orderBy: { sortOrder: "asc" },
            include: {
              videos: { orderBy: { sortOrder: "asc" } },
            },
          },
          resources: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });
}

export type EnrolledCourse = NonNullable<
  Awaited<ReturnType<typeof getEnrolledCourseForUser>>
>;
