import Link from "next/link";
import { Users } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDuration, formatDate } from "@/lib/utils";
import { CourseForm, type ExistingCourse } from "@/components/admin/new-course-form";
import { DeleteCourseButton } from "@/components/admin/delete-course-button";
import { CohortForm, type ExistingCohort } from "@/components/admin/cohort-form";
import { DeleteCohortButton } from "@/components/admin/delete-cohort-button";
import { syncMissingLegacyCourses } from "@/lib/public-courses";

export const dynamic = "force-dynamic";

const PUBLIC_STATUS_LABELS = {
  ACTIVE: "Active",
  FULLY_BOOKED: "Fully booked",
  NEW_COHORT_COMING_SOON: "New cohort coming soon",
  COMING_SOON: "Coming soon",
} as const;

const PUBLIC_STATUS_CLASS_NAMES = {
  ACTIVE: "bg-success/10 text-success",
  FULLY_BOOKED: "bg-amber-50 text-amber-700",
  NEW_COHORT_COMING_SOON: "bg-blue-50 text-blue-700",
  COMING_SOON: "bg-muted text-muted-foreground",
} as const;

interface AdminCohort extends ExistingCohort {
  enrollmentCount: number;
}

interface AdminCourse extends ExistingCourse {
  enrollmentCount: number;
  cohorts: AdminCohort[];
}

async function getCourses(): Promise<{ courses: AdminCourse[]; fromDb: boolean }> {
  try {
    await syncMissingLegacyCourses();

    const courses = await db.course.findMany({
      include: {
        cohorts: { include: { _count: { select: { enrollments: true } } } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return {
      fromDb: true,
      courses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        overview: c.overview,
        price: Number(c.price),
        taxRate: Number(c.taxRate),
        durationHours: c.durationHours,
        durationDays: c.durationDays,
        maxSeats: c.maxSeats,
        instructorName: c.instructorName,
        instructorBio: c.instructorBio,
        isActive: c.isActive,
        publicStatus: c.publicStatus,
        enrollmentCount: c._count.enrollments,
        cohorts: c.cohorts.map((cohort) => ({
          id: cohort.id,
          courseId: cohort.courseId,
          name: cohort.name,
          startDate: cohort.startDate.toISOString(),
          endDate: cohort.endDate ? cohort.endDate.toISOString() : "",
          schedule: cohort.schedule,
          deliveryMethod: cohort.deliveryMethod,
          venue: cohort.venue ?? "",
          seatsTotal: cohort.seatsTotal,
          seatsAvailable: cohort.seatsAvailable,
          status: cohort.status,
          enrollmentCount: cohort._count.enrollments,
        })),
      })),
    };
  } catch {
    return { fromDb: false, courses: [] };
  }
}

export default async function AdminCoursesPage() {
  const { courses, fromDb } = await getCourses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Course Management</h1>
        <p className="text-muted-foreground mt-1">View and manage academy courses and cohorts</p>
      </div>

      {!fromDb && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Course data could not be loaded from the database. Editing is disabled
          until the connection is restored.
        </div>
      )}

      {fromDb && <CourseForm mode="create" />}

      {fromDb && courses.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No courses yet. Create your first course to start adding cohorts and videos.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(course.price)} · {formatDuration(course.durationHours, course.durationDays)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  PUBLIC_STATUS_CLASS_NAMES[course.publicStatus]
                }`}>
                  {PUBLIC_STATUS_LABELS[course.publicStatus]}
                </span>
                {!course.isActive && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Hidden
                  </span>
                )}
                {fromDb && <CourseForm mode="edit" course={course} />}
                {fromDb && (
                  <DeleteCourseButton
                    courseId={course.id}
                    title={course.title}
                    enrollments={course.enrollmentCount}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>{course.enrollmentCount} enrollments</span>
                  <span>{course.cohorts.length} cohorts</span>
                </div>
                {fromDb && <CohortForm mode="create" courseId={course.id} />}
              </div>

              {course.cohorts.length > 0 && (
                <div className="space-y-2">
                  {course.cohorts.map((cohort) => (
                    <div key={cohort.id} className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/50 px-4 py-2 text-sm">
                        <div>
                          <span className="font-medium">{cohort.name}</span>
                          <span className="ml-2 text-muted-foreground">
                            {formatDate(cohort.startDate)} · {cohort.schedule}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">
                            {cohort.seatsAvailable}/{cohort.seatsTotal} seats
                          </span>
                          <span className="rounded-full bg-background px-2 py-0.5 text-xs font-medium">
                            {cohort.status}
                          </span>
                          {fromDb && (
                            <Link
                              href={`/admin/cohorts/${cohort.id}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
                            >
                              <Users className="h-3.5 w-3.5" />
                              Roster ({cohort.enrollmentCount})
                            </Link>
                          )}
                          {fromDb && (
                            <>
                              <CohortForm
                                mode="edit"
                                courseId={course.id}
                                cohort={cohort}
                              />
                              <DeleteCohortButton
                                cohortId={cohort.id}
                                name={cohort.name}
                                enrollments={cohort.enrollmentCount}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
