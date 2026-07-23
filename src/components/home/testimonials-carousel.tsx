"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";

const TESTIMONIAL_ROTATION_MS = 4000;

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, TESTIMONIAL_ROTATION_MS);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setCurrent((index + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const testimonial = TESTIMONIALS[current];

  return (
    <section className="bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Testimonials"
          title="What Our Students Say"
          subtitle="Hear from professionals who transformed their careers through Prodesign Learning Centre."
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="relative min-h-[360px] sm:min-h-[330px]">
            <div className="absolute inset-x-5 top-6 h-[calc(100%-1rem)] rotate-2 rounded-2xl border border-border bg-card/70 shadow-sm" />
            <div className="absolute inset-x-10 top-12 h-[calc(100%-2rem)] -rotate-2 rounded-2xl border border-border bg-card/45 shadow-sm" />

            <AnimatePresence mode="popLayout">
              <motion.div
                key={current}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 90, y: 18, rotate: 2.5, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, x: -90, y: -10, rotate: -2.5, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.9 }}
              >
                <Card className="relative h-full overflow-hidden border-secondary/10 bg-card shadow-xl">
                  <Quote className="absolute right-6 top-6 h-12 w-12 text-secondary/10" />
                  <CardContent className="flex h-full flex-col p-8 sm:p-10">
                    <motion.div
                      className="mb-4 flex gap-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.28 }}
                    >
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-accent text-accent"
                        />
                      ))}
                    </motion.div>

                    <motion.blockquote
                      className="text-lg leading-relaxed text-foreground sm:text-xl"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16, duration: 0.32 }}
                    >
                      &ldquo;{testimonial.content}&rdquo;
                    </motion.blockquote>

                    <motion.div
                      className="mt-auto border-t border-border pt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.22, duration: 0.3 }}
                    >
                      <p className="font-semibold text-foreground">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goTo(current - 1)}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === current
                      ? "w-8 bg-secondary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => goTo(current + 1)}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
