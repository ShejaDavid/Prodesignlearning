import Image from "next/image";
import { Award, BadgeCheck, Shield, Star } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";

const certificateFeatures = [
  {
    icon: BadgeCheck,
    title: "Verified Credentials",
    description: "Unique certificate number for employer verification",
  },
  {
    icon: Shield,
    title: "Industry Recognized",
    description: "Backed by Prodesign Mauritius' 15+ years in AEC",
  },
  {
    icon: Star,
    title: "Portfolio Ready",
    description: "Demonstrate practical BIM skills to employers",
  },
];

export function CertificateShowcase() {
  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Certification"
          title="Earn Your Prodesign Certificate"
          subtitle="Upon successful completion, receive an official certificate recognized by employers across Mauritius and the region."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn direction="right">
            <Card className="relative mx-auto max-w-md overflow-hidden border border-secondary/20 bg-white text-slate-900 shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(165,67,153,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)]" />
              <div className="absolute inset-4 rounded-[24px] border border-secondary/15" />
              <div className="absolute inset-6 rounded-[20px] border border-slate-200/80" />
              <CardContent className="relative p-6 sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-4">
                    <div className="inline-flex rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200 shadow-sm">
                      <Image
                        src="/logo.png"
                        alt={SITE_CONFIG.fullName}
                        width={378}
                        height={190}
                        className="h-8 w-auto"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-secondary">
                        Certificate of Completion
                      </p>
                      <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
                        Awarded in recognition of successful participation and
                        demonstrated competence in a professional training programme.
                      </p>
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-secondary/20 bg-secondary/5">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    This certifies that
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Student Name
                  </p>
                  <div className="mx-auto mt-4 h-px w-40 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
                  <p className="mt-5 text-xs uppercase tracking-[0.22em] text-slate-500">
                    has successfully completed
                  </p>
                  <p className="mx-auto mt-3 max-w-sm text-xl font-semibold leading-tight text-secondary sm:text-2xl">
                    Autodesk Revit Foundation Program
                  </p>
                  <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-slate-500">
                    Delivered by Prodesign Learning Centre with hands-on, instructor-led
                    training focused on practical BIM workflows and industry-ready skills.
                  </p>
                </div>

                <div className="mt-8 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Issued By
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-900">
                        {SITE_CONFIG.fullName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Mauritius</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                        Date Issued
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-900">
                        23 July 2026
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Instructor-led training completion
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Certificate No.
                    </p>
                    <p className="mt-2 font-mono text-sm font-semibold text-slate-950">
                      CERT-2026-00001
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                      Unique record for internal validation and employer verification.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="h-px w-24 bg-slate-300" />
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      Authorized Signature
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Prodesign Learning Centre
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      Training &amp; Certification
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="space-y-6">
            {certificateFeatures.map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.1} direction="left">
                <Card>
                  <CardHeader className="flex-row items-start gap-4 space-y-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
                      <feature.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription className="mt-1 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
