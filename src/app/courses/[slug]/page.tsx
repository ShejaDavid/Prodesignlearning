import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Clock,
  Laptop,
  MessageCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import { CourseHero } from "@/components/course/course-hero";
import { CurriculumAccordion } from "@/components/course/curriculum-accordion";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { InstructorProfile } from "@/components/course/instructor-profile";
import { CourseFaq } from "@/components/course/course-faq";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/constants";
import { getPublicCourseBySlug } from "@/lib/public-courses";
import { calculateTax, formatCurrency } from "@/lib/utils";

const FEATURE_ICONS: Record<string, LucideIcon> = {
  Clock,
  Users,
  Award,
  BadgeCheck,
  Laptop,
  BookOpen,
  MessageCircle,
};

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug);

  if (!course || course.status !== "active") {
    return { title: "Course Not Found" };
  }

  return {
    title: course.title,
    description: course.description,
    keywords: [...SEO_KEYWORDS, course.title],
    openGraph: {
      title: `${course.title} | ${SITE_CONFIG.name}`,
      description: course.description,
      url: `${SITE_CONFIG.url}/courses/${course.slug}`,
      siteName: SITE_CONFIG.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: course.title,
      description: course.description,
    },
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug);

  if (!course || course.status !== "active") {
    notFound();
  }

  const tax = calculateTax(course.price, course.taxRate);
  const total = course.price + tax;
  const nextCohort = course.cohorts[0];

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.fullName,
      url: SITE_CONFIG.url,
    },
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "MUR",
      availability: "https://schema.org/InStock",
      validFrom: nextCohort?.startDate,
    },
    hasCourseInstance: nextCohort
      ? {
          "@type": "CourseInstance",
          courseMode: "blended",
          startDate: nextCohort.startDate,
          endDate: nextCohort.endDate,
          location: {
            "@type": "Place",
            name: SITE_CONFIG.address,
          },
        }
      : undefined,
    instructor: {
      "@type": "Person",
      name: course.instructor.name,
      jobTitle: course.instructor.title,
    },
    timeRequired: `PT${course.durationHours}H`,
  };

  return (
    <>
      <Script
        id={`course-jsonld-${course.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      {course.faq.length > 0 && (
        <Script
          id={`course-faq-jsonld-${course.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: course.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            }),
          }}
        />
      )}

      <CourseHero course={course} />

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-16 lg:col-span-2">
            <FadeIn>
              <section>
                <h2 className="text-2xl font-bold md:text-3xl">Course Overview</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {course.overview}
                </p>
              </section>
            </FadeIn>

            {course.learningOutcomes.length > 0 && (
              <FadeIn>
                <section>
                  <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                    What You&apos;ll Learn
                  </h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {course.learningOutcomes.map((outcome) => (
                      <li
                        key={outcome}
                        className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                          ✓
                        </span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </section>
              </FadeIn>
            )}

            {course.curriculum.length > 0 && (
              <section id="curriculum">
                <FadeIn>
                  <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                    Course Curriculum
                  </h2>
                </FadeIn>
                <CurriculumAccordion curriculum={course.curriculum} />
              </section>
            )}

            {course.features.length > 0 && (
              <FadeIn>
                <section>
                  <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                    Course Features
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {course.features.map((feature) => {
                      const Icon = FEATURE_ICONS[feature.icon] ?? Award;
                      return (
                        <Card key={feature.title}>
                          <CardContent className="flex gap-4 p-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                              <Icon className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{feature.title}</h3>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              </FadeIn>
            )}

            <section>
              <FadeIn>
                <h2 className="mb-6 text-2xl font-bold md:text-3xl">
                  Your Instructor
                </h2>
              </FadeIn>
              <InstructorProfile instructor={course.instructor} />
            </section>

            {course.faq.length > 0 && (
              <section id="faq">
                <CourseFaq faq={course.faq} />
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <CourseSidebar course={course} />
            <p className="mt-4 text-center text-xs text-muted-foreground lg:text-left">
              {course.taxRate > 0
                ? `Total investment: ${formatCurrency(total)} incl. VAT`
                : `Total investment: ${formatCurrency(total)} (no VAT)`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
