"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  "PENDING",
  "PAYMENT_PENDING",
  "ENROLLED",
  "COMPLETED",
  "CANCELLED",
] as const;

export function EnrollmentStatusSelect({
  enrollmentId,
  status,
  studentName,
}: {
  enrollmentId: string;
  status: string;
  studentName: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  async function onChange(next: string) {
    if (next === status) return;
    setSaving(true);
    const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      toast.error(json.error || "Failed to update status.");
      return;
    }
    toast.success(`${studentName}'s status set to ${next.replace(/_/g, " ")}.`);
    router.refresh();
  }

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={status}
        disabled={saving}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-lg border border-input bg-background px-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
    </div>
  );
}
