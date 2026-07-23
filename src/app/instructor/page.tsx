import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InstructorProfile } from "@/components/course/instructor-profile";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/constants";
import { getCourseBySlug } from "@/lib/course-data";

export const metadata: Metadata = {
  title: "Instructors",
  description:
    "Meet the trainers at Prodesign Learning Centre Mauritius — practical, industry-led Autodesk Revit and sustainable construction (LEED) training.",
  keywords: [...SEO_KEYWORDS, "BIM instructor Mauritius", "Autodesk trainer"],
};

export default function InstructorPage() {
  const revit = getCourseBySlug("revit-foundation");
  const leed = getCourseBySlug("managing-leed-projects");

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Meet Your <span className="gradient-text">Trainers</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Learn from industry practitioners who bring real-world BIM and
              construction experience into every classroom session.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl space-y-16 px-4 py-16">
        {revit && (
          <div>
            <h2 className="mb-6 text-xl font-bold">{revit.title}</h2>
            <InstructorProfile instructor={revit.instructor} variant="full" />
          </div>
        )}

        {leed && (
          <div>
            <h2 className="mb-6 text-xl font-bold">{leed.title}</h2>
            <InstructorProfile instructor={leed.instructor} variant="full" />
          </div>
        )}

        <FadeIn delay={0.3}>
          <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h2 className="text-xl font-bold">Train with Our Expert Trainers</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Enroll in an upcoming session and learn directly from Mauritius&apos;s
              practicing AEC and sustainable construction professionals.
            </p>
            <Button variant="premium" className="mt-6" asChild>
              <Link href="/courses">
                Browse Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <p className="text-center text-sm text-muted-foreground">
            Questions about our trainers? Reach us at{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-secondary hover:underline"
            >
              {SITE_CONFIG.email}
            </a>
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
