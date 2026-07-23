"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

export function DeleteCohortButton({
  cohortId,
  name,
  enrollments,
}: {
  cohortId: string;
  name: string;
  enrollments: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (enrollments > 0) {
      toast.error(
        `"${name}" has ${enrollments} enrolment(s) and cannot be deleted. Remove or cancel those enrolments first.`
      );
      return;
    }
    if (!window.confirm(`Delete cohort "${name}"?`)) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/cohorts?id=${cohortId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    setDeleting(false);
    if (!res.ok) {
      toast.error(json.error || "Failed to delete cohort.");
      return;
    }
    toast.success(`Cohort "${name}" deleted.`);
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
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
      Delete
    </button>
  );
}
