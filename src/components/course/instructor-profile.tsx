import Link from "next/link";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import type { Instructor } from "@/lib/course-data";

interface InstructorProfileProps {
  instructor: Instructor;
  variant?: "compact" | "full";
}

export function InstructorProfile({
  instructor,
  variant = "compact",
}: InstructorProfileProps) {
  if (variant === "full") {
    return (
      <div className="space-y-8">
        <FadeIn>
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-accent text-4xl font-bold text-white">
              {instructor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{instructor.name}</h2>
              <p className="mt-1 text-lg text-secondary">{instructor.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {instructor.experienceYears}+ years of industry experience
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {instructor.bio}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h3 className="mb-4 text-xl font-semibold">Credentials & Certifications</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {instructor.credentials.map((credential) => (
              <Card key={credential}>
                <CardContent className="flex items-center gap-3 p-4">
                  <Award className="h-5 w-5 shrink-0 text-secondary" />
                  <span className="text-sm font-medium">{credential}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <FadeIn>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-accent text-xl font-bold text-white">
              {instructor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{instructor.name}</h3>
              <p className="text-sm text-secondary">{instructor.title}</p>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                {instructor.bio}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {instructor.credentials.slice(0, 2).map((credential) => (
                  <span
                    key={credential}
                    className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium"
                  >
                    <GraduationCap className="h-3 w-3" />
                    {credential}
                  </span>
                ))}
              </div>
              <Button variant="link" className="mt-3 h-auto p-0" asChild>
                <Link href="/instructor">
                  <Briefcase className="mr-1 h-4 w-4" />
                  View full profile
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
