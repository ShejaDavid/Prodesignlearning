"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

export function DeleteCourseButton({
  courseId,
  title,
  enrollments,
}: {
  courseId: string;
  title: string;
  enrollments: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (enrollments > 0) {
      toast.error(
        `"${title}" has ${enrollments} enrolment(s) and cannot be deleted. Remove or cancel those enrolments first.`
      );
      return;
    }
    if (
      !window.confirm(
        `Delete "${title}"? This permanently removes the course, its cohorts, modules and videos.`
      )
    ) {
      return;
    }
    setDeleting(true);
    const res = await fetch(`/api/admin/courses?id=${courseId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    setDeleting(false);
    if (!res.ok) {
      toast.error(json.error || "Failed to delete course.");
      return;
    }
    toast.success(`"${title}" deleted.`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={deleting}
      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {deleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      Delete
    </button>
  );
}
