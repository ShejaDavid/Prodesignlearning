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
            <Card className="relative mx-auto max-w-md overflow-hidden border-2 border-secondary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5" />
              <CardContent className="relative p-8 sm:p-10">
                <div className="flex items-center justify-between">
                  <Award className="h-10 w-10 text-secondary" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Certificate of Completion
                  </span>
                </div>

                <div className="my-8 text-center">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    This certifies that
                  </p>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    [Student Name]
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    has successfully completed the
                  </p>
                  <p className="mt-1 text-lg font-semibold text-secondary">
                    Autodesk Revit Foundation Program
                  </p>
                </div>

                <div className="flex items-end justify-between border-t border-border pt-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Issued by</p>
                    <p className="text-sm font-medium">{SITE_CONFIG.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Cert. No.</p>
                    <p className="font-mono text-sm font-medium">CERT-2026-00001</p>
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
