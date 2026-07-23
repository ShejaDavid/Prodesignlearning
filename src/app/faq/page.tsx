import type { Metadata } from "next";
import Link from "next/link";
import { CourseFaq } from "@/components/course/course-faq";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/constants";
import type { FaqItem } from "@/lib/course-data";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Prodesign Learning Centre courses, enrollment, payment, and certification in Mauritius.",
  keywords: [...SEO_KEYWORDS, "Revit course FAQ", "BIM training questions"],
};

const GENERAL_FAQ: FaqItem[] = [
  {
    question: "How do I enroll in a course?",
    answer:
      "Browse our courses, choose the one that suits you, and follow the enrollment link on the course page. Our team will then confirm your place and guide you through the next steps.",
  },
  {
    question: "Where is the training delivered?",
    answer:
      "Our courses are delivered face-to-face at Prodesign Learning Centre in Phoenix, Mauritius, in an instructor-led classroom setting.",
  },
  {
    question: "Are the courses recognized?",
    answer:
      "Our courses are MQA Approved and delivered in line with Mauritius Qualifications Authority standards. Every participant who completes a course receives a Prodesign Learning Centre Certificate of Completion.",
  },
  {
    question: "What are the entry requirements?",
    answer:
      "Entry requirements vary by course. Specific prerequisites are listed on each course page — check the course you are interested in for details.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept credit cards, debit cards, and MIPS (Mauritius Interbank Payment System). Course fees are shown on each individual course page.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "It depends on the course. Some are designed for beginners with no prior experience, while others assume a working knowledge of the subject. Each course page explains who the course is intended for.",
  },
  {
    question: "How large are the classes?",
    answer:
      "We keep class sizes small to ensure personalised, hands-on instruction. The maximum number of participants is noted on each course page.",
  },
  {
    question: "Will I receive course materials?",
    answer:
      "Yes. Participants receive relevant training materials and supporting resources for their course, which are included in the course fee.",
  },
  {
    question: "Can you deliver training for my organisation?",
    answer:
      "Yes. We can arrange group or in-house training for teams and organisations. Get in touch with us to discuss your requirements.",
  },
];

export default function FaqPage() {
  const faq = GENERAL_FAQ;

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Everything you need to know about enrolling, payment, schedules, and
              certification at {SITE_CONFIG.name}.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 py-16">
        <CourseFaq faq={faq} showTitle={false} />

        <FadeIn delay={0.2}>
          <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h2 className="text-xl font-bold">Still have questions?</h2>
            <p className="mt-3 text-muted-foreground">
              Our team is happy to help. Reach out via email, phone, or WhatsApp.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button variant="premium" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/courses">View Course Details</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
