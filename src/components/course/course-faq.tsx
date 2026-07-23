"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/ui/fade-in";
import type { FaqItem } from "@/lib/course-data";

interface CourseFaqProps {
  faq: FaqItem[];
  title?: string;
  showTitle?: boolean;
}

export function CourseFaq({
  faq,
  title = "Frequently Asked Questions",
  showTitle = true,
}: CourseFaqProps) {
  return (
    <FadeIn>
      <div>
        {showTitle && (
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">{title}</h2>
        )}
        <Accordion type="single" collapsible className="w-full">
          {faq.map((item, index) => (
            <AccordionItem key={item.question} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </FadeIn>
  );
}
