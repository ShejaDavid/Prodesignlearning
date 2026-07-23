import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  GraduationCap,
  Laptop,
  Leaf,
  Lightbulb,
  Monitor,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { SEO_KEYWORDS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Mauritius' only Autodesk-accredited training provider. Learn about Prodesign Training's mission, values, and 27+ years of MEP engineering, BIM, and sustainability expertise.",
  keywords: [...SEO_KEYWORDS],
};

const HIGHLIGHTS = [
  {
    icon: Award,
    text: "Winner of the prestigious BIM Africa Award 2022, demonstrating our mastery of BIM and digital construction.",
  },
  {
    icon: Leaf,
    text: "Pioneers in green building design and LEED certification, with trainers who bring years of hands-on experience in sustainable construction.",
  },
  {
    icon: BadgeCheck,
    text: "Recognized as Mauritius' leading provider of BIM, digital construction, and sustainability training.",
  },
];

const ADVANTAGES: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: BadgeCheck,
    title: "Autodesk Accreditation",
    description: "The only training provider in Mauritius endorsed by Autodesk.",
  },
  {
    icon: Monitor,
    title: "State-of-the-Art Facilities",
    description:
      "Fully equipped classrooms with powerful workstations. No need to bring your laptop — we provide all the tools you need.",
  },
  {
    icon: Sparkles,
    title: "Free Revit License",
    description:
      "Trainees receive a complimentary Revit license for the duration of their course, enabling hands-on practice at home.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description:
      "Our instructors have over 20 years of industry experience, combining deep technical knowledge with practical insights.",
  },
  {
    icon: Award,
    title: "Award-Winning Expertise",
    description: "Our BIM and green building leadership ensures you're learning from the best.",
  },
  {
    icon: GraduationCap,
    title: "Comprehensive Learning Pathways",
    description:
      "Courses designed for beginners, intermediate learners, and advanced professionals, ensuring your growth at every stage.",
  },
];

const VALUES: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: Target,
    title: "Excellence",
    description: "Delivering world-class training programs that meet global standards.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Embracing cutting-edge technology to stay ahead of industry trends.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Advocating for a greener future through our courses and expertise.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    description: "Upholding honesty and professionalism in everything we do.",
  },
];

const ACHIEVEMENTS = [
  "Certified hundreds of professionals in Autodesk Revit and green building design.",
  "Helped trainees secure career advancements and industry-recognized certifications.",
  "Played a key role in raising the standards of BIM adoption and sustainability practices in Mauritius.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <FadeIn>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Empowering Construction Professionals with{" "}
              <span className="gradient-text">Knowledge and Innovation</span>
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              At Prodesign Training, we believe that knowledge is the foundation of
              innovation, and innovation drives the future. As Mauritius&apos; only
              Autodesk-accredited training provider, we are committed to empowering
              construction professionals with the skills and expertise needed to
              excel in an ever-evolving industry. From mastering Autodesk Revit to
              gaining proficiency in green building design and sustainability, our
              courses are tailored to equip you with real-world, practical
              knowledge that makes an immediate impact.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-16">
        <FadeIn>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold md:text-3xl">Who We Are</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              With over 27 years of experience in MEP engineering, BIM management,
              and sustainability consulting, Prodesign has built a reputation as a
              leader in the construction industry. Our training center was
              established to share this expertise and raise the standards of
              professional development in Mauritius and beyond.
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((highlight, index) => (
            <FadeIn key={highlight.text} delay={index * 0.05}>
              <Card className="h-full">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                    <highlight.icon className="h-5 w-5 text-secondary" />
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {highlight.text}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <div className="mt-20">
          <FadeIn>
            <h2 className="text-2xl font-bold md:text-3xl">What Sets Us Apart</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              At Prodesign Training, we&apos;re not just another training
              center — we&apos;re a catalyst for transformation. Here are our
              unique advantages:
            </p>
          </FadeIn>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ADVANTAGES.map((advantage, index) => (
              <FadeIn key={advantage.title} delay={index * 0.05}>
                <Card className="h-full transition-shadow hover:premium-shadow">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                      <advantage.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="mt-4 font-semibold">{advantage.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          <FadeIn>
            <Card className="h-full">
              <CardContent className="p-8">
                <Target className="h-8 w-8 text-secondary" />
                <h2 className="mt-4 text-xl font-bold">Our Mission</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  To empower construction professionals with the knowledge and
                  tools to innovate, lead, and create a sustainable future.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
          <FadeIn delay={0.05}>
            <Card className="h-full">
              <CardContent className="p-8">
                <Laptop className="h-8 w-8 text-secondary" />
                <h2 className="mt-4 text-xl font-bold">Our Vision</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  To be the leading training provider in the region, transforming
                  the construction industry through excellence in BIM,
                  sustainability, and digital innovation.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <div className="mt-20">
          <FadeIn>
            <h2 className="text-2xl font-bold md:text-3xl">Our Values</h2>
          </FadeIn>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <FadeIn key={value.title} delay={index * 0.05}>
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                      <value.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="mt-4 font-semibold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <FadeIn>
            <h2 className="text-2xl font-bold md:text-3xl">Our Achievements</h2>
          </FadeIn>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {ACHIEVEMENTS.map((achievement, index) => (
              <FadeIn key={achievement} delay={index * 0.05}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {achievement}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-20 rounded-2xl hero-gradient p-8 text-white md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Join Us</h2>
            <p className="mt-3 max-w-xl text-white/80">
              Be part of the Prodesign Training journey and take your career to
              the next level. Explore our courses, learn from industry leaders,
              and achieve your professional goals.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button variant="premium" asChild>
                <Link href="/courses">
                  Explore Our Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="/contact">Contact Us for More Information</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
