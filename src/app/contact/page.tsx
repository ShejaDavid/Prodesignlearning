import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_CONFIG, SEO_KEYWORDS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Prodesign Learning Centre Mauritius for course inquiries, corporate training, and enrollment support.",
  keywords: [...SEO_KEYWORDS],
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: SITE_CONFIG.address,
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Have questions about our courses, enrollment, or corporate training?
              We&apos;d love to hear from you.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-6">
            <FadeIn>
              <h2 className="text-xl font-semibold">Get in Touch</h2>
              <p className="mt-2 text-muted-foreground">
                Our team typically responds within 1–2 business days.
              </p>
            </FadeIn>

            {CONTACT_INFO.map((item, index) => (
              <FadeIn key={item.label} delay={index * 0.05}>
                <Card>
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                      <item.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-0.5 font-medium text-foreground hover:text-secondary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 font-medium">{item.value}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <div className="lg:col-span-2">
            <FadeIn delay={0.1}>
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h2 className="mb-6 text-xl font-semibold">Send a Message</h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
