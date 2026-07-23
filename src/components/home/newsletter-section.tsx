"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-8 text-center text-white premium-shadow sm:p-12">
            <Mail className="mx-auto h-10 w-10 text-accent" />

            <SectionHeading
              title="Stay in the Loop"
              subtitle={`Get course updates, cohort announcements, and BIM career tips from ${SITE_CONFIG.name}.`}
              className="mb-8 [&_h2]:text-white [&_p]:text-white/80"
            />

            {submitted ? (
              <p className="rounded-2xl bg-white/10 px-6 py-4 text-sm font-medium backdrop-blur-sm">
                Thank you! You&apos;re on the list. Watch your inbox for updates.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="shrink-0 bg-white text-primary hover:bg-white/90"
                >
                  Subscribe
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}

            <p className="mt-4 text-xs text-white/60">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
