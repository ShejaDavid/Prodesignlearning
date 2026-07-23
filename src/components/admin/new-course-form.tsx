"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { adminCourseSchema, type AdminCourseFormData } from "@/lib/validations";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Pencil } from "lucide-react";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface ExistingCourse extends AdminCourseFormData {
  id: string;
}

interface CourseFormProps {
  mode?: "create" | "edit";
  course?: ExistingCourse;
}

export function CourseForm({ mode = "create", course }: CourseFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(mode === "edit");

  // Input type (form fields, pre-coercion) differs from output type (validated,
  // coerced), so useForm takes both: <Input, Context, Output>.
  const form = useForm<z.input<typeof adminCourseSchema>, unknown, AdminCourseFormData>({
    resolver: zodResolver(adminCourseSchema),
    defaultValues: course ?? {
      title: "",
      slug: "",
      description: "",
      overview: "",
      price: 0,
      taxRate: 0,
      durationHours: 1,
      durationDays: 1,
      maxSeats: 20,
      instructorName: "",
      instructorBio: "",
      isActive: true,
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(data: AdminCourseFormData) {
    setError(null);
    const res = await fetch("/api/admin/courses", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "edit" ? { ...data, id: course!.id } : data),
    });
    const json = await res.json();
    if (!res.ok) {
      const message = json.error || `Failed to ${mode === "edit" ? "update" : "create"} course.`;
      setError(message);
      toast.error(message);
      return;
    }
    toast.success(mode === "edit" ? `"${data.title}" updated.` : `"${data.title}" created.`);
    if (mode === "create") {
      reset();
      setSlugEdited(false);
    }
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
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      );
    }
    return (
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        New Course
      </Button>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${mode}-${course?.id ?? "new"}`}>Title</Label>
              <Input
                id={`title-${mode}-${course?.id ?? "new"}`}
                {...register("title", {
                  onChange: (e) => {
                    if (mode === "create" && !slugEdited) {
                      setValue("slug", slugify(e.target.value));
                    }
                  },
                })}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`slug-${mode}-${course?.id ?? "new"}`}>Slug</Label>
              <Input
                id={`slug-${mode}-${course?.id ?? "new"}`}
                {...register("slug", { onChange: () => setSlugEdited(true) })}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${mode}-${course?.id ?? "new"}`}>
              Short description
            </Label>
            <Textarea
              id={`description-${mode}-${course?.id ?? "new"}`}
              rows={2}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`overview-${mode}-${course?.id ?? "new"}`}>Overview</Label>
            <Textarea
              id={`overview-${mode}-${course?.id ?? "new"}`}
              rows={3}
              {...register("overview")}
            />
            {errors.overview && (
              <p className="text-sm text-red-500">{errors.overview.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor={`price-${mode}-${course?.id ?? "new"}`}>Price (MUR)</Label>
              <Input
                id={`price-${mode}-${course?.id ?? "new"}`}
                type="number"
                step="0.01"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`durationHours-${mode}-${course?.id ?? "new"}`}>Hours</Label>
              <Input
                id={`durationHours-${mode}-${course?.id ?? "new"}`}
                type="number"
                {...register("durationHours")}
              />
              {errors.durationHours && (
                <p className="text-sm text-red-500">{errors.durationHours.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`durationDays-${mode}-${course?.id ?? "new"}`}>Days</Label>
              <Input
                id={`durationDays-${mode}-${course?.id ?? "new"}`}
                type="number"
                {...register("durationDays")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`maxSeats-${mode}-${course?.id ?? "new"}`}>Max seats</Label>
              <Input
                id={`maxSeats-${mode}-${course?.id ?? "new"}`}
                type="number"
                {...register("maxSeats")}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`instructorName-${mode}-${course?.id ?? "new"}`}>
                Instructor name
              </Label>
              <Input
                id={`instructorName-${mode}-${course?.id ?? "new"}`}
                {...register("instructorName")}
              />
              {errors.instructorName && (
                <p className="text-sm text-red-500">
                  {errors.instructorName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`instructorBio-${mode}-${course?.id ?? "new"}`}>
                Instructor bio
              </Label>
              <Input
                id={`instructorBio-${mode}-${course?.id ?? "new"}`}
                {...register("instructorBio")}
              />
              {errors.instructorBio && (
                <p className="text-sm text-red-500">
                  {errors.instructorBio.message}
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4" />
            Active (visible to students)
          </label>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" variant="premium" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Saving…" : "Creating…"}
                </>
              ) : mode === "edit" ? (
                "Save changes"
              ) : (
                "Create course"
              )}
            </Button>
            <Button
              type="button"
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
      </CardContent>
    </Card>
  );
}
