"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackToMainSite } from "@/components/shared/back-to-main-site";

const footerColumns = [
  { title: "Company", links: FOOTER_LINKS.company },
  { title: "Courses", links: FOOTER_LINKS.courses },
  { title: "Support", links: FOOTER_LINKS.support },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center rounded bg-white px-3 py-2">
              <Image
                src="/logo.png"
                alt={SITE_CONFIG.name}
                width={151}
                height={76}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
              {SITE_CONFIG.description}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-6">
              <p className="mb-3 text-sm font-medium">Stay updated</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="icon"
                  aria-label="Subscribe to newsletter"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              {submitted && (
                <p className="mt-2 text-xs text-accent">Thanks for subscribing!</p>
              )}
            </form>

            <div className="mt-6">
              <BackToMainSite
                variant="outline"
                size="sm"
                className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              />
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-primary-foreground/10 pt-8 sm:flex-row">
          <div className="flex flex-wrap justify-center gap-4">
            {FOOTER_LINKS.social.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-sm text-primary-foreground/70 transition-colors hover:text-accent"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.fullName}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
