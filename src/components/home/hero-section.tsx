import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, CheckCircle2, Users } from "lucide-react";
import { SITE_CONFIG, EXTERNAL_REGISTRATION_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";

const trustBadges = [
  { icon: BadgeCheck, label: "MQA Approved Courses" },
  { icon: Award, label: "Certified Training" },
  { icon: Users, label: "500+ Alumni" },
  { icon: CheckCircle2, label: "Industry Recognized" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/90 to-accent/80" />
      <div className="hero-gradient absolute inset-0" />
      <div className="hero-orb-a absolute -top-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-white/20 blur-3xl mix-blend-screen" />
      <div className="hero-orb-b absolute -bottom-40 -right-10 h-[32rem] w-[32rem] rounded-full bg-secondary/50 blur-3xl mix-blend-screen" />
      <div className="hero-orb-c absolute top-1/3 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#c084fc]/40 blur-3xl mix-blend-screen" />
      <div className="hero-scanline absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent mix-blend-screen" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              Mauritius&apos; Premier Construction & BIM Learning Centre
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Empowering Construction Professionals with industry-leading.{" "}

            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
              {SITE_CONFIG.taglineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="premium" size="lg" asChild>
                <Link href={EXTERNAL_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                  Enroll Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/courses">View Course Details</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
                >
                  <badge.icon className="h-4 w-4 text-accent" />
                  {badge.label}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
