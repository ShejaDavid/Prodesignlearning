"use client";

import Link from "next/link";
import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Clock,
  GraduationCap,
  Laptop,
  MessageCircle,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import type {
  CourseFeature,
  CurriculumModule,
  FaqItem,
  Instructor,
} from "@/lib/course-data";

// Feature icons are resolved from a string key here (inside the Client
// Component) rather than being passed down from the server page — React Server
// Components can't serialize component functions across the boundary.
const FEATURE_ICONS: Record<string, LucideIcon> = {
  Clock,
  Users,
  Award,
  BadgeCheck,
  Laptop,
  BookOpen,
  MessageCircle,
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 3);
}

interface CourseAccordionProps {
  learningOutcomes: string[];
  curriculum: CurriculumModule[];
  features: CourseFeature[];
  instructor: Instructor;
  faq: FaqItem[];
}

export function CourseAccordion({
  learningOutcomes,
  curriculum,
  features,
  instructor,
  faq,
}: CourseAccordionProps) {
  const sections: { value: string; title: string; content: React.ReactNode }[] = [];

  if (learningOutcomes.length > 0) {
    sections.push({
      value: "learn",
      title: "What You'll Learn",
      content: (
        <ul className="grid gap-3 sm:grid-cols-2">
          {learningOutcomes.map((outcome) => (
            <li
              key={outcome}
              className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm text-foreground"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                ✓
              </span>
              {outcome}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (curriculum.length > 0) {
    sections.push({
      value: "curriculum",
      title: "Course Curriculum",
      content: (
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
                    <li key={topic} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ),
    });
  }

  if (features.length > 0) {
    sections.push({
      value: "features",
      title: "Course Features",
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = FEATURE_ICONS[feature.icon] ?? Award;
            return (
              <Card key={feature.title}>
                <CardContent className="flex gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                    <Icon className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ),
    });
  }

  // Individual trainers to show with their own avatar. Falls back to a single
  // entry (the combined name) for courses that don't list separate people.
  const people =
    instructor.people && instructor.people.length > 0
      ? instructor.people
      : [{ name: instructor.name, image: instructor.image }];

  sections.push({
    value: "instructor",
    title: people.length > 1 ? "Your Instructors" : "Your Instructor",
    content: (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {people.map((person) => (
            <div key={person.name} className="flex items-center gap-3">
              {person.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-14 w-14 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent text-base font-bold text-white">
                  {initials(person.name)}
                </div>
              )}
              <div>
                <p className="font-semibold text-foreground">{person.name}</p>
                <p className="text-xs text-secondary">{instructor.title}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {instructor.bio}
        </p>

        {instructor.credentials.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {instructor.credentials.map((credential) => (
              <span
                key={credential}
                className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground"
              >
                <GraduationCap className="h-3.5 w-3.5 text-secondary" />
                {credential}
              </span>
            ))}
          </div>
        )}

        <Link
          href="/instructor"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
        >
          <Briefcase className="h-4 w-4" />
          View full profile
        </Link>
      </div>
    ),
  });

  if (faq.length > 0) {
    sections.push({
      value: "faq",
      title: "Frequently Asked Questions",
      content: (
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
      ),
    });
  }

  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {sections.map((section) => (
        <AccordionItem
          key={section.value}
          id={section.value}
          value={section.value}
          className="scroll-mt-24 rounded-2xl border border-border bg-card px-5 premium-shadow"
        >
          <AccordionTrigger className="py-5 text-lg font-bold text-foreground hover:text-foreground hover:no-underline md:text-xl">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="pb-6">{section.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
