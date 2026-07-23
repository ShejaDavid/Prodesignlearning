"use client";

import { BadgeCheck, Calendar, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticEnrollButton } from "@/components/shared/magnetic-enroll-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EXTERNAL_REGISTRATION_URL, PRICE_VALUE_NOTE } from "@/lib/constants";
import { calculateTax, formatCurrency, formatDate, formatDuration } from "@/lib/utils";
import type { Course } from "@/lib/course-data";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const cohorts = course.cohorts;
  const hasTax = course.taxRate > 0;
  const tax = calculateTax(course.price, course.taxRate);
  const total = course.price + tax;
  const isFull = course.status === "fully-booked";
  const actionLabel =
    course.status === "fully-booked"
      ? "Register for Next Cohort"
      : course.status === "new-cohort-coming-soon"
        ? "Register Interest"
        : "Enroll Now";

  // Per-cohort seat maths. When the course is marked full, every seat reads as
  // filled so the count can't contradict the "Full" label — seatsAvailable
  // tracks in-system enrolments, which is decoupled from the admin's
  // fully-booked status (real registrations come through the external form).
  const seatInfo = (cohort: Course["cohorts"][number]) => {
    const taken = isFull
      ? cohort.seatsTotal
      : cohort.seatsTotal - cohort.seatsAvailable;
    return {
      label: isFull
        ? `${taken} of ${cohort.seatsTotal} seats filled · Full`
        : `${cohort.seatsAvailable} of ${cohort.seatsTotal} seats available`,
      percent: cohort.seatsTotal > 0 ? (taken / cohort.seatsTotal) * 100 : 0,
    };
  };

  return (
    <Card className="sticky top-24 overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <CardTitle className="text-2xl">Course Enrollment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div>
          <p className="text-sm text-muted-foreground">Course fee</p>
          <p className="text-3xl font-bold">{formatCurrency(course.price)}</p>
          {hasTax ? (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                + {formatCurrency(tax)} VAT ({(course.taxRate * 100).toFixed(0)}%)
              </p>
              <p className="mt-2 text-lg font-semibold text-secondary">
                Total: {formatCurrency(total)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">No VAT or additional fees</p>
          )}
          {course.price > 0 && (
            <p className="mt-3 inline-flex items-start gap-1.5 rounded-lg bg-success/10 px-2.5 py-1.5 text-xs font-semibold text-success">
              <BadgeCheck className="h-4 w-4 shrink-0" />
              {PRICE_VALUE_NOTE}
            </p>
          )}
        </div>

        {cohorts.length > 0 && (
          <div className="space-y-3 rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-secondary" />
              {cohorts.length === 1
                ? `Next cohort: ${formatDate(cohorts[0].startDate)}`
                : "Upcoming cohorts"}
            </div>
            <ul className="space-y-3">
              {cohorts.map((cohort) => {
                const info = seatInfo(cohort);
                return (
                  <li
                    key={cohort.id}
                    className={
                      cohorts.length > 1
                        ? "space-y-1.5 border-t border-border/60 pt-3 first:border-0 first:pt-0"
                        : "space-y-2"
                    }
                  >
                    <p className="text-sm text-muted-foreground">{cohort.schedule}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-secondary" />
                      {info.label}
                    </div>
                    <Progress value={info.percent} className="h-2" />
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            ✓{" "}
            {course.slug === "managing-leed-projects"
              ? `${course.durationHours} Hours of expert-led training`
              : `${formatDuration(course.durationHours, course.durationDays)} of expert-led training`}
          </li>
          <li>✓ Prodesign Learning Centre certificate</li>
          <li>✓ Course materials & exercise files</li>
          <li>✓ Instructor support via WhatsApp</li>
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border bg-muted/20 pt-6">
        <MagneticEnrollButton
          href={EXTERNAL_REGISTRATION_URL}
          external
          size="lg"
          className="w-full"
        >
          {actionLabel}
        </MagneticEnrollButton>
        {course.brochureUrl && (
          <Button variant="outline" size="default" className="w-full" asChild>
            <a href={course.brochureUrl} download>
              <Download className="h-4 w-4" />
              Download Brochure
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
