"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Award, BadgeCheck, CheckCircle2, Users } from "lucide-react";
import { SITE_CONFIG, EXTERNAL_REGISTRATION_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { MagneticEnrollButton } from "@/components/shared/magnetic-enroll-button";

const trustBadges = [
  { icon: BadgeCheck, label: "MQA Approved Courses" },
  { icon: Award, label: "Certified Training" },
  { icon: Users, label: "200+ Alumni" },
  { icon: CheckCircle2, label: "Industry Recognized" },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Track scroll from when the hero's top hits the viewport top until the hero
  // has fully scrolled past — drives the parallax as the section leaves view.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Background drifts down AND slowly zooms as the page scrolls — the zoom is
  // what actually reads on a smooth gradient (a plain slide is near-invisible).
  // The content rises and fades so it clearly separates from the backdrop.
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.1]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Decorative parallax backdrop. Oversized (-inset-y-[25%]) so the drift
          never reveals an edge inside the section's overflow-hidden frame. */}
      <motion.div
        aria-hidden="true"
        style={reduceMotion ? undefined : { y: bgY, scale: bgScale }}
        className="absolute -inset-y-[25%] inset-x-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/90 to-accent/80" />
        <div className="hero-gradient absolute inset-0" />
        <div className="hero-orb-a absolute -top-32 -left-16 h-[28rem] w-[28rem] rounded-full bg-white/20 blur-3xl mix-blend-screen" />
        <div className="hero-orb-b absolute -bottom-40 -right-10 h-[32rem] w-[32rem] rounded-full bg-secondary/50 blur-3xl mix-blend-screen" />
        <div className="hero-orb-c absolute top-1/3 left-1/3 h-[26rem] w-[26rem] rounded-full bg-[#c084fc]/40 blur-3xl mix-blend-screen" />
        <div className="hero-scanline absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent mix-blend-screen" />
      </motion.div>

      <motion.div
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40"
      >
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
              <MagneticEnrollButton
                href={EXTERNAL_REGISTRATION_URL}
                external
                size="lg"
                icon="arrow-right"
              >
                Enroll Now
              </MagneticEnrollButton>
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
      </motion.div>
    </section>
  );
}
