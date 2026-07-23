"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/ui/fade-in";
import type { CurriculumModule } from "@/lib/course-data";

interface CurriculumAccordionProps {
  curriculum: CurriculumModule[];
}

export function CurriculumAccordion({ curriculum }: CurriculumAccordionProps) {
  return (
    <FadeIn>
      <Accordion type="single" collapsible className="w-full">
        {curriculum.map((mod) => (
          <AccordionItem key={mod.module} value={`module-${mod.module}`}>
            <AccordionTrigger className="text-left text-base hover:no-underline">
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-sm font-semibold text-secondary">
                  {mod.module}
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Module {mod.module}
                  </span>
                  <span className="font-semibold text-foreground">{mod.title}</span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-11 space-y-2">
                {mod.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {topic}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </FadeIn>
  );
}
