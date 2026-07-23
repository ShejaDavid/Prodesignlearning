import Link from "next/link";
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { EXTERNAL_REGISTRATION_URL } from "@/lib/constants";
import { formatCurrency, formatDate, formatDuration } from "@/lib/utils";
import type { Course } from "@/lib/course-data";

interface CourseHeroProps {
  course: Course;
}

export function CourseHero({ course }: CourseHeroProps) {
  const nextCohort = course.cohorts[0];
  const hasTax = course.taxRate > 0;
  const totalWithTax = course.price * (1 + course.taxRate);

  return (
    <section className="relative overflow-hidden hero-gradient text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="container relative mx-auto max-w-7xl px-4 py-20 md:py-28">
        <FadeIn>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Award className="h-4 w-4 text-accent" />
            Prodesign Learning Centre Certificate Included
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {course.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl">
            {course.description}
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-white/80">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-accent" />
              {formatDuration(course.durationHours, course.durationDays)}
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Users className="h-4 w-4 text-accent" />
              Max {nextCohort?.seatsTotal ?? 20} students
            </span>
            {nextCohort && (
              <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-accent" />
                Starts {formatDate(nextCohort.startDate)} · {nextCohort.schedule}
              </span>
            )}
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-accent" />
              Phoenix, Mauritius
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button variant="premium" size="lg" asChild>
              <Link href={EXTERNAL_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                Enroll Now
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link href="#curriculum">View Curriculum</Link>
            </Button>
            <p className="text-sm text-white/70">
              {hasTax ? (
                <>
                  From {formatCurrency(course.price)} + VAT ·{" "}
                  {formatCurrency(totalWithTax)} total
                </>
              ) : (
                <>{formatCurrency(course.price)} · No VAT</>
              )}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
