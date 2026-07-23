import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { CourseHero } from "@/components/course/course-hero";
import { CourseAccordion } from "@/components/course/course-accordion";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/constants";
import { getPublicCourseBySlug } from "@/lib/public-courses";
import { calculateTax, formatCurrency } from "@/lib/utils";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

function isViewableCourse(status: string) {
  return status !== "coming-soon";
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug);

  if (!course || !isViewableCourse(course.status)) {
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

  if (!course || !isViewableCourse(course.status)) {
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
          <div className="space-y-8 lg:col-span-2">
            <FadeIn>
              <section>
                <h2 className="text-2xl font-bold md:text-3xl">Course Overview</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {course.overview}
                </p>
              </section>
            </FadeIn>

            <CourseAccordion
              learningOutcomes={course.learningOutcomes}
              curriculum={course.curriculum}
              features={course.features}
              instructor={course.instructor}
              faq={course.faq}
            />
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
