import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE_CONFIG, EXTERNAL_REGISTRATION_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground premium-shadow sm:px-16 sm:py-20">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-accent/20" />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to Start Your BIM Journey?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
                Join the next Revit Foundation cohort and gain the skills
                employers are looking for. Limited seats — register today.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="premium" size="lg" asChild>
                  <Link href={EXTERNAL_REGISTRATION_URL} target="_blank" rel="noopener noreferrer">
                    Register Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="h-5 w-5" />
                    Contact Us
                  </Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-primary-foreground/60">
                Questions? Email us at{" "}
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="font-medium text-accent hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
