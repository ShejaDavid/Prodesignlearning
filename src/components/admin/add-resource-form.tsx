"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

export function AddResourceForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    if (!fileUrl.trim()) return setError("A file link is required.");

    setBusy(true);
    const res = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, title, fileUrl }),
    });
    const json = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(json.error || "Failed to add resource.");
      return;
    }

    toast.success(`"${title}" added.`);
    setTitle("");
    setFileUrl("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        Add material
      </Button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-3 rounded-xl border border-border bg-muted/30 p-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor={`resource-title-${courseId}`}>Title</Label>
        <Input
          id={`resource-title-${courseId}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Training Manual"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`resource-url-${courseId}`}>File link</Label>
        <Input
          id={`resource-url-${courseId}`}
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="https://... (Google Drive, Dropbox, or a direct link)"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Save
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setOpen(false)}
          disabled={busy}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
