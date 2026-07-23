import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { FUTURE_COURSES } from "@/lib/constants";
import { getCourseBySlug } from "@/lib/course-data";
import { cn, formatDuration } from "@/lib/utils";
import { MagneticEnrollButton } from "@/components/shared/magnetic-enroll-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";

type FutureCourse = (typeof FUTURE_COURSES)[number];

const STATIC_FEATURES = [
  { label: "Format", value: "Face-to-Face" },
  { label: "Certificate", value: true },
];

function FeatureCell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-success" />
    ) : (
      <span className="text-muted-foreground">—</span>
    );
  }
  return <span className="text-sm">{value}</span>;
}

function StatusCell({ course }: { course: FutureCourse }) {
  if (course.status === "registration-open") {
    return (
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Registration Open
        </span>
        {course.dates && <p className="text-xs text-muted-foreground">{course.dates}</p>}
      </div>
    );
  }

  if (course.status === "full-booked") {
    return (
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Fully Booked
        </span>
        <p className="text-xs text-muted-foreground">{course.note}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
        <Clock className="h-3 w-3" />
        Coming Soon
      </span>
      <p className="text-xs text-muted-foreground">{course.dates ?? course.note ?? null}</p>
    </div>
  );
}

export function CourseComparison() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Course Roadmap"
          title="Current & Upcoming Courses"
          subtitle="Explore our current and upcoming training programs."
        />

        <FadeIn>
          <div className="overflow-x-auto rounded-2xl border border-border premium-shadow">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">
                    Course
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-foreground">
                    Max Seats
                  </th>
                  {STATIC_FEATURES.map((feature) => (
                    <th
                      key={feature.label}
                      className="px-6 py-4 text-sm font-semibold text-foreground"
                    >
                      {feature.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FUTURE_COURSES.map((course, index) => {
                  const fullCourse = getCourseBySlug(course.slug);
                  const duration = fullCourse
                    ? formatDuration(fullCourse.durationHours, fullCourse.durationDays)
                    : course.status === "coming-soon" ||
                        course.status === "registration-open"
                      ? "2 Days"
                      : "TBA";
                  const maxSeats = fullCourse?.cohorts[0]?.seatsTotal ?? "TBA";
                  const href = fullCourse ? `/courses/${course.slug}` : "/courses";
                  const isLinkable = course.status !== "coming-soon";

                  return (
                    <tr
                      key={course.slug}
                      className={cn(
                        "border-b border-border last:border-0",
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      )}
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={href}
                          className={cn(
                            "font-medium transition-colors",
                            isLinkable
                              ? "text-secondary hover:underline"
                              : "text-foreground"
                          )}
                        >
                          {course.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <StatusCell course={course} />
                      </td>
                      <td className="px-6 py-4 text-center text-muted-foreground">
                        <span className="text-sm">{duration}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-muted-foreground">
                        <span className="text-sm">{maxSeats}</span>
                      </td>
                      {STATIC_FEATURES.map((feature) => (
                        <td
                          key={feature.label}
                          className="px-6 py-4 text-center text-muted-foreground"
                        >
                          <FeatureCell value={feature.value} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-8 text-center">
            <MagneticEnrollButton href="/courses" icon="arrow-right">
              Enroll Now
            </MagneticEnrollButton>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
