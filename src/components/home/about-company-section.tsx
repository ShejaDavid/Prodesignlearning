import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Leaf,
  Monitor,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";

const REASONS: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: BadgeCheck,
    title: "Mauritius' Only Autodesk-Accredited Training Provider",
    description:
      "Our certification is your assurance of high-quality, industry-standard training.",
  },
  {
    icon: Monitor,
    title: "Fully Equipped Training Facilities",
    description:
      "Trainees benefit from powerful workstations, so there is no need to bring your laptop.",
  },
  {
    icon: Sparkles,
    title: "Free Revit License",
    description:
      "Practice at home with a complimentary license for the duration of your training.",
  },
  {
    icon: Users,
    title: "Expert Trainers with Real-World Experience",
    description:
      "Our trainers bring over 20 years of practical industry expertise to every session.",
  },
  {
    icon: Award,
    title: "Award-Winning Excellence",
    description:
      "As the winner of the BIM Africa Award 2022, we are recognized as a leader in BIM and digital construction.",
  },
  {
    icon: Leaf,
    title: "Green Building Pioneers",
    description:
      "With extensive experience in LEED-certified projects, we are the go-to experts for sustainability training.",
  },
];

export function AboutCompanySection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why Prodesign Training?"
          title="Why Prodesign Training?"
          subtitle="At Prodesign Training, we take pride in offering a unique and unmatched learning experience. Here is why we stand out:"
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <FadeIn key={reason.title} delay={index * 0.08}>
              <Card className="h-full transition-shadow hover:premium-shadow">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                    <reason.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-lg">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-12 flex justify-center">
            <Button variant="premium" size="lg" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
