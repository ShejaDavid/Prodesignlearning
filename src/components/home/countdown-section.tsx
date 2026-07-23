"use client";

import { useEffect, useState } from "react";
import { Calendar, Users } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";

interface CountdownSectionProps {
  cohortStartDate?: string;
  seatsTotal?: number;
  seatsAvailable?: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function CountdownSection({
  cohortStartDate = "2026-08-05",
  seatsTotal = 15,
  seatsAvailable = 15,
}: CountdownSectionProps) {
  const targetDate = new Date(cohortStartDate);
  // Starts at all-zeros so the server-rendered markup matches the client's
  // first render exactly; the real value is filled in after mount (below),
  // since computing it from Date.now() during render would drift by the
  // network+render delay and trigger a hydration mismatch.
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(targetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [cohortStartDate]);

  const seatsTaken = seatsTotal - seatsAvailable;
  const fillPercentage = Math.round((seatsTaken / seatsTotal) * 100);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Next Cohort"
          title="Secure Your Seat"
          subtitle="Limited spots available for our upcoming Revit Foundation cohort. Register before seats fill up."
        />

        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="rounded-2xl border border-border bg-card p-8 premium-shadow">
              <div className="mb-8 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">
                    Starts {formatDate(cohortStartDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium">
                    {seatsAvailable} of {seatsTotal} seats remaining
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {timeUnits.map((unit) => (
                  <div
                    key={unit.label}
                    className="rounded-2xl bg-muted p-4 text-center"
                  >
                    <p className="text-3xl font-bold tabular-nums text-foreground sm:text-4xl">
                      {String(unit.value).padStart(2, "0")}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {unit.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    Seat availability
                  </span>
                  <span className="text-muted-foreground">
                    {fillPercentage}% filled
                  </span>
                </div>
                <Progress value={fillPercentage} className="h-3" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
