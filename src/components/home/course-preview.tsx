import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { getCourseBySlug } from "@/lib/course-data";
import { EXTERNAL_REGISTRATION_URL } from "@/lib/constants";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";

export function CoursePreview() {
  const course = getCourseBySlug("revit-foundation");
  if (!course) return null;

  const nextCohort = course.cohorts[0];

  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Featured Course"
          title={course.title}
          subtitle="Our flagship one-day program designed to take you from beginner to confident first-time Revit modeler."
        />

        <FadeIn>
          <Card className="mx-auto max-w-4xl overflow-hidden">
            <div className="grid lg:grid-cols-5">
              <div className="bg-gradient-to-br from-secondary to-accent p-8 text-white lg:col-span-2">
                <BookOpen className="h-10 w-10 opacity-80" />
                <h3 className="mt-4 text-2xl font-bold">{course.title}</h3>
                <p className="mt-2 text-sm text-white/80">
                  {course.description}
                </p>
                <p className="mt-6 text-3xl font-bold">
                  {formatCurrency(course.price)}
                </p>
                <p className="text-sm text-white/70">Course fee</p>
              </div>

              <div className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>
                    Everything you need to launch your BIM career
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm font-medium">
                          {formatDuration(course.durationHours, course.durationDays)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Format</p>
                        <p className="text-sm font-medium">Face-to-Face</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">Phoenix, Mauritius</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-secondary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Class Size</p>
                        <p className="text-sm font-medium">
                          Max {nextCohort?.seatsTotal ?? 20} students
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {course.features.slice(0, 4).map((feature) => (
                      <li
                        key={feature.title}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {feature.title}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="premium" className="w-full sm:w-auto" asChild>
                    <Link href={EXTERNAL_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                      Enroll Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto" asChild>
                    <Link href={`/courses/${course.slug}`}>
                      View Full Syllabus
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}
