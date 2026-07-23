import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticEnrollButton } from "@/components/shared/magnetic-enroll-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { RevealCard } from "@/components/shared/reveal-card";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/constants";
import { getPublicCourses } from "@/lib/public-courses";
import { formatCurrency, formatDuration } from "@/lib/utils";

const COURSE_STATUS_BADGES = {
  active: {
    label: "Active",
    className: "bg-success/10 text-success",
    button: "View Course",
    disabled: false,
  },
  "fully-booked": {
    label: "Fully booked",
    className: "bg-amber-50 text-amber-700",
    button: "Register for Next Cohort",
    disabled: false,
  },
  "new-cohort-coming-soon": {
    label: "New cohort coming soon",
    className: "bg-blue-50 text-blue-700",
    button: "Register Interest",
    disabled: false,
  },
  "coming-soon": {
    label: "Coming soon",
    className: "bg-muted text-muted-foreground",
    button: "Coming Soon",
    disabled: true,
  },
} as const;

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Explore Autodesk and BIM training courses at Prodesign Learning Centre Mauritius. Start with Revit Foundation or discover upcoming programs.",
  keywords: [...SEO_KEYWORDS],
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getPublicCourses();

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Training <span className="gradient-text">Courses</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Professional Autodesk and BIM training programs designed for
              Mauritius&apos;s architecture, engineering, and construction
              professionals.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => {
            const status = COURSE_STATUS_BADGES[course.status];

            return (
              <RevealCard key={course.slug} index={index}>
                <Card className="flex h-full flex-col transition-shadow hover:premium-shadow">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                      {course.durationHours > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(course.durationHours, course.durationDays)}
                        </span>
                      )}
                    </div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {course.price > 0 && (
                      <p className="text-2xl font-bold text-secondary">
                        {formatCurrency(course.price)}
                        {course.taxRate > 0 && (
                          <span className="text-sm font-normal text-muted-foreground">
                            {" "}
                            + VAT
                          </span>
                        )}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    {!status.disabled ? (
                      <MagneticEnrollButton
                        href={`/courses/${course.slug}`}
                        icon="arrow-right"
                        className="w-full"
                      >
                        {status.button}
                      </MagneticEnrollButton>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        {status.button}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </RevealCard>
            );
          })}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold">Not sure which course is right for you?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Contact our team at {SITE_CONFIG.email} and we&apos;ll help you choose
              the best program for your career goals.
            </p>
            <Button variant="premium" className="mt-6" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
