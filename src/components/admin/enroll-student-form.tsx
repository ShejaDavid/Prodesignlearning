"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminEnrollSchema, type AdminEnrollFormData } from "@/lib/validations";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

export interface CohortOption {
  id: string;
  label: string;
}

export function EnrollStudentForm({
  cohorts,
  defaults,
}: {
  cohorts: CohortOption[];
  defaults?: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}) {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminEnrollFormData>({
    resolver: zodResolver(adminEnrollSchema),
    defaultValues: {
      firstName: defaults?.firstName ?? "",
      lastName: defaults?.lastName ?? "",
      email: defaults?.email ?? "",
      phone: defaults?.phone ?? "",
      cohortId: "",
      accessExpiresAt: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  async function onSubmit(data: AdminEnrollFormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const res = await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      const message = json.error || "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
      return;
    }

    const who = data.email;
    const verb = json.alreadyEnrolled ? "Updated enrolment for" : "Enrolled";
    const note = json.activationSent
      ? "A set-password activation email was sent."
      : "An enrolment confirmation email was sent (existing account).";
    setSuccess(`${verb} ${who}. ${note}`);
    toast.success(`${verb} ${who}.`);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" {...register("phone")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cohortId">Cohort</Label>
        <select
          id="cohortId"
          {...register("cohortId")}
          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select a cohort…</option>
          {cohorts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        {errors.cohortId && (
          <p className="text-sm text-red-500">{errors.cohortId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="accessExpiresAt">Access expires (optional)</Label>
        <Input id="accessExpiresAt" type="date" {...register("accessExpiresAt")} />
        <p className="text-xs text-muted-foreground">
          Leave blank for access that never expires.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <Button type="submit" variant="premium" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enrolling…
          </>
        ) : (
          "Enrol student & send access"
        )}
      </Button>
    </form>
  );
}
