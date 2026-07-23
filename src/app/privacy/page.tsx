import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_CONFIG.name} — how we collect, use, and protect your personal data.`,
};

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content:
      "We collect personal information you provide during registration and contact forms, including your name, email address, phone number, date of birth, occupation, and company. We also collect payment transaction data and course enrollment records.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your information is used to process enrollments, communicate about courses, send transactional emails (confirmations, reminders, certificates), improve our services, and comply with legal obligations. We do not sell your personal data to third parties.",
  },
  {
    title: "3. Data Storage & Security",
    content:
      "Personal data is stored securely on encrypted servers. We implement industry-standard security measures including HTTPS encryption, hashed passwords, and access controls. Payment data is processed through PCI-compliant payment providers.",
  },
  {
    title: "4. Third-Party Services",
    content:
      "We use trusted third-party services including email delivery (Resend), payment processing, and analytics. These providers are bound by data processing agreements and may only use your data to perform services on our behalf.",
  },
  {
    title: "5. Cookies",
    content:
      "Our website uses essential cookies for authentication and session management, and analytics cookies to understand site usage. You can control cookie preferences through your browser settings.",
  },
  {
    title: "6. Your Rights",
    content:
      "Under applicable data protection laws, you have the right to access, correct, delete, or export your personal data. You may also withdraw consent for marketing communications at any time by contacting us.",
  },
  {
    title: "7. Data Retention",
    content:
      "We retain enrollment and payment records for 7 years for legal and accounting purposes. Marketing contact data is retained until you unsubscribe or request deletion.",
  },
  {
    title: "8. Contact",
    content:
      "For privacy-related inquiries or to exercise your data rights, contact our Data Protection Officer at training@prodesign.mu.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
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
            Questions about our privacy practices? Email{" "}
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
