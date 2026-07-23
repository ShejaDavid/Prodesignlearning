import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { AffiliationsMarquee } from "@/components/home/affiliations-marquee";
import { CountdownSection } from "@/components/home/countdown-section";
import { CoursePreview } from "@/components/home/course-preview";
import { AboutCompanySection } from "@/components/home/about-company-section";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { CourseComparison } from "@/components/home/course-comparison";
import { CertificateShowcase } from "@/components/home/certificate-showcase";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { CtaSection } from "@/components/home/cta-section";
import Script from "next/script";
import { SITE_CONFIG } from "@/lib/constants";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  legalName: SITE_CONFIG.legalName,
  url: SITE_CONFIG.mainSiteUrl,
  logo: `${SITE_CONFIG.url}/logo.png`,
  description: SITE_CONFIG.description,
  email: SITE_CONFIG.email,
  telephone: SITE_CONFIG.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "First Floor, Building No.2, Industrial Building, Valentina Industrial Estate",
    addressLocality: SITE_CONFIG.city,
    postalCode: "73553",
    addressCountry: "MU",
  },
  sameAs: [
    "https://linkedin.com/company/prodesign-mauritius",
    "https://facebook.com/prodesignmauritius",
  ],
};

export default function HomePage() {
  return (
    <>
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSection />
      <StatsSection />
      <AffiliationsMarquee />
      <CountdownSection />
      <CoursePreview />
      <AboutCompanySection />
      <TestimonialsCarousel />
      <CourseComparison />
      <CertificateShowcase />
      <NewsletterSection />
      <CtaSection />
    </>
  );
}
