import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for ${SITE_CONFIG.name} courses and services.`,
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By enrolling in any course or using the services of Prodesign Learning Centre, you agree to be bound by these Terms and Conditions. If you do not agree, please do not proceed with enrollment.",
  },
  {
    title: "2. Course Enrollment",
    content:
      "Enrollment is confirmed upon receipt of full payment or the first installment as agreed. Seat availability is limited and allocated on a first-come, first-served basis. Prodesign Learning Centre reserves the right to cancel or reschedule courses with reasonable notice.",
  },
  {
    title: "3. Payment Terms",
    content:
      "All prices are quoted in Mauritian Rupees (MUR) and are subject to applicable VAT at the prevailing rate. Payment must be completed within 7 days of registration unless an installment plan has been approved in writing.",
  },
  {
    title: "4. Cancellation & Refunds",
    content:
      "Cancellations made more than 14 days before the course start date are eligible for a full refund minus a 10% administrative fee. Cancellations within 14 days of the start date are non-refundable but may be transferred to a future cohort at our discretion.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "All course materials, workbooks, exercise files, and content provided during training remain the intellectual property of Prodesign Mauritius. Reproduction or distribution without written consent is prohibited.",
  },
  {
    title: "6. Certification",
    content:
      "Certificates of completion are issued to students who attend the full duration of the course. Prodesign Learning Centre certificates are not official Autodesk certifications.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "Prodesign Learning Centre shall not be liable for any indirect, incidental, or consequential damages arising from course participation. Our total liability is limited to the fees paid for the specific course.",
  },
  {
    title: "8. Governing Law",
    content:
      "These terms are governed by the laws of the Republic of Mauritius. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mauritius.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight">Terms & Conditions</h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: June 2026 · {SITE_CONFIG.fullName}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-10">
          {SECTIONS.map((section, index) => (
            <FadeIn key={section.title} delay={index * 0.03}>
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {section.content}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <p className="mt-12 text-sm text-muted-foreground">
            For questions about these terms, contact us at{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-secondary hover:underline"
            >
              {SITE_CONFIG.email}
            </a>
            .
          </p>
        </FadeIn>
      </section>
    </div>
  );
}
