"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  adminCohortSchema,
  type AdminCohortFormData,
} from "@/lib/validations";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Pencil } from "lucide-react";

export interface ExistingCohort extends AdminCohortFormData {
  id: string;
  seatsAvailable: number;
}

interface CohortFormProps {
  mode?: "create" | "edit";
  courseId: string;
  cohort?: ExistingCohort;
}

function toDateInputValue(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function CohortForm({ mode = "create", courseId, cohort }: CohortFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<
    z.input<typeof adminCohortSchema>,
    unknown,
    AdminCohortFormData
  >({
    resolver: zodResolver(adminCohortSchema),
    defaultValues: cohort
      ? { ...cohort, startDate: toDateInputValue(cohort.startDate), endDate: toDateInputValue(cohort.endDate) }
      : {
          courseId,
          name: "",
          startDate: "",
          endDate: "",
          schedule: "",
          deliveryMethod: "IN_PERSON",
          venue: "",
          seatsTotal: 20,
          status: "UPCOMING",
        },
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(data: AdminCohortFormData) {
    setError(null);
    const res = await fetch("/api/admin/cohorts", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        mode === "edit"
          ? { ...data, id: cohort!.id }
          : { ...data, courseId }
      ),
    });
    const json = await res.json();
    if (!res.ok) {
      const message = json.error || `Failed to ${mode === "edit" ? "update" : "create"} cohort.`;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(mode === "edit" ? `"${data.name}" updated.` : `"${data.name}" created.`);
    if (mode === "create") reset();
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    if (mode === "edit") {
      return (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      );
    }
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        Add cohort
      </Button>
    );
  }

  const idPrefix = `${mode}-${cohort?.id ?? courseId}`;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`name-${idPrefix}`}>Cohort name</Label>
          <Input id={`name-${idPrefix}`} {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`schedule-${idPrefix}`}>Schedule</Label>
          <Input
            id={`schedule-${idPrefix}`}
            placeholder="Mon, Wed & Fri · 2-hour sessions"
            {...register("schedule")}
          />
          {errors.schedule && (
            <p className="text-sm text-red-500">{errors.schedule.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor={`startDate-${idPrefix}`}>Start date</Label>
          <Input id={`startDate-${idPrefix}`} type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`endDate-${idPrefix}`}>End date (optional)</Label>
          <Input id={`endDate-${idPrefix}`} type="date" {...register("endDate")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`deliveryMethod-${idPrefix}`}>Delivery</Label>
          <select
            id={`deliveryMethod-${idPrefix}`}
            {...register("deliveryMethod")}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="IN_PERSON">In person</option>
            <option value="ONLINE">Online</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`seatsTotal-${idPrefix}`}>Total seats</Label>
          <Input
            id={`seatsTotal-${idPrefix}`}
            type="number"
            {...register("seatsTotal")}
          />
          {errors.seatsTotal && (
            <p className="text-sm text-red-500">{errors.seatsTotal.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`venue-${idPrefix}`}>Venue (optional)</Label>
          <Input id={`venue-${idPrefix}`} {...register("venue")} />
        </div>
        {mode === "edit" && (
          <div className="space-y-1.5">
            <Label htmlFor={`status-${idPrefix}`}>Status</Label>
            <select
              id={`status-${idPrefix}`}
              {...register("status")}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {mode === "edit" && cohort && (
        <p className="text-xs text-muted-foreground">
          Seats available are calculated automatically from enrolments. Current
          availability: {cohort.seatsAvailable} of {cohort.seatsTotal}.
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" variant="premium" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : mode === "edit" ? (
            "Save changes"
          ) : (
            "Create cohort"
          )}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
