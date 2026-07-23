"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/providers/toast-provider";

export function DeleteVideoButton({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!window.confirm(`Remove "${title}"? This also deletes its Mux asset.`)) {
      return;
    }
    setDeleting(true);
    const res = await fetch(`/api/admin/videos?id=${videoId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    setDeleting(false);
    if (!res.ok) {
      toast.error(json.error || "Failed to delete video.");
      return;
    }
    toast.success(`"${title}" removed.`);
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
      Remove
    </button>
  );
}
