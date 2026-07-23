import { db } from "@/lib/db";

/**
 * A "valid" enrolment is one that grants access to protected course content:
 *   - status is ENROLLED (activated manually by an admin or by the payment webhook), and
 *   - access has not expired (accessExpiresAt is null = never expires, or in the future).
 *
 * PENDING / PAYMENT_PENDING / COMPLETED / CANCELLED enrolments do NOT grant access.
 */
export function validEnrollmentFilter(now: Date = new Date()) {
  return {
    status: "ENROLLED" as const,
    OR: [{ accessExpiresAt: null }, { accessExpiresAt: { gt: now } }],
  };
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
        },
      },
    },
  });
}

export type EnrolledCourse = NonNullable<
  Awaited<ReturnType<typeof getEnrolledCourseForUser>>
>;
