"use client";

import Link from "next/link";
import { Calendar, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EXTERNAL_REGISTRATION_URL } from "@/lib/constants";
import { calculateTax, formatCurrency, formatDate, formatDuration } from "@/lib/utils";
import type { Course } from "@/lib/course-data";

interface CourseSidebarProps {
  course: Course;
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const nextCohort = course.cohorts[0];
  const hasTax = course.taxRate > 0;
  const tax = calculateTax(course.price, course.taxRate);
  const total = course.price + tax;
  const seatsTaken = nextCohort
    ? nextCohort.seatsTotal - nextCohort.seatsAvailable
    : 0;
  const isFull = Boolean(nextCohort && nextCohort.seatsAvailable <= 0);
  const isLeedCourse = course.slug === "managing-leed-projects";
  const fillPercentage = nextCohort
    ? (seatsTaken / nextCohort.seatsTotal) * 100
    : 0;

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
        </div>

        {nextCohort && (
          <div className="space-y-3 rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-secondary" />
              Next cohort: {formatDate(nextCohort.startDate)}
            </div>
            <p className="text-sm text-muted-foreground">{nextCohort.schedule}</p>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-secondary" />
              {isFull
                ? `${seatsTaken} of ${nextCohort.seatsTotal} seats filled · Full`
                : `${nextCohort.seatsAvailable} of ${nextCohort.seatsTotal} seats available`}
            </div>
            <Progress value={fillPercentage} className="h-2" />
          </div>
        )}

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            ✓{" "}
            {isLeedCourse
              ? `${course.durationHours} Hours of expert-led training`
              : `${formatDuration(course.durationHours, course.durationDays)} of expert-led training`}
          </li>
          <li>✓ Prodesign Learning Centre certificate</li>
          <li>✓ Course materials & exercise files</li>
          {!isLeedCourse && <li>✓ Instructor support via WhatsApp</li>}
        </ul>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t border-border bg-muted/20 pt-6">
        <Button variant="premium" size="lg" className="w-full" asChild>
          <Link href={EXTERNAL_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
            {isFull ? "Register for Next Cohort" : "Enroll Now"}
          </Link>
        </Button>
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
