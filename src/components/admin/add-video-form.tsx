"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

type Mode = "MUX_UPLOAD" | "MUX_ID" | "URL";

export function AddVideoForm({
  moduleId,
  muxEnabled,
}: {
  moduleId: string;
  muxEnabled: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(muxEnabled ? "MUX_UPLOAD" : "MUX_ID");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [muxPlaybackId, setMuxPlaybackId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tab = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`rounded-lg px-3 py-1 text-xs font-medium ${
        mode === m ? "bg-secondary text-white" : "bg-muted text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    if (mode === "URL" && !url.trim()) return setError("A video URL is required.");
    if (mode === "MUX_ID" && !muxPlaybackId.trim())
      return setError("A Mux playback ID is required.");
    if (mode === "MUX_UPLOAD" && !file)
      return setError("Choose a video file to upload.");

    setBusy(true);
    try {
      setStatus("Saving…");
      const payload =
        mode === "URL"
          ? { moduleId, title, provider: "URL", url }
          : mode === "MUX_ID"
            ? { moduleId, title, provider: "MUX", muxPlaybackId }
            : { moduleId, title, provider: "MUX" };

      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        const message = json.error || "Failed to add video.";
        setError(message);
        toast.error(message);
        return;
      }

      if (mode === "MUX_UPLOAD" && json.uploadUrl && file) {
        setStatus("Uploading to Mux…");
        const put = await fetch(json.uploadUrl, { method: "PUT", body: file });
        if (!put.ok) {
          const message = "File upload to Mux failed. The video was created but has no media.";
          setError(message);
          toast.error(message);
          return;
        }
      }

      toast.success(`"${title}" added.`);
      setTitle("");
      setUrl("");
      setMuxPlaybackId("");
      setFile(null);
      setOpen(false);
      router.refresh();
    } catch {
      const message = "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
      setStatus(null);
    }
  }

  if (!open) {
    return (
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" />
        Add video
      </Button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-border bg-background p-3"
    >
      <div className="flex flex-wrap gap-2">
        {muxEnabled && tab("MUX_UPLOAD", "Upload (Mux, protected)")}
        {tab("MUX_ID", "Existing Mux ID")}
        {tab("URL", "Link (YouTube/URL)")}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`title-${moduleId}`}>Title</Label>
        <Input
          id={`title-${moduleId}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {mode === "URL" && (
        <div className="space-y-1.5">
          <Label htmlFor={`url-${moduleId}`}>Video URL</Label>
          <Input
            id={`url-${moduleId}`}
            placeholder="https://youtube.com/watch?v=…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}

      {mode === "MUX_ID" && (
        <div className="space-y-1.5">
          <Label htmlFor={`pid-${moduleId}`}>Mux playback ID (signed)</Label>
          <Input
            id={`pid-${moduleId}`}
            placeholder="e.g. ayPsejnrzVRIq4M72nFDQ9X78F9Jv02dVfVrAQDOll01w"
            value={muxPlaybackId}
            onChange={(e) => setMuxPlaybackId(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Paste a playback ID from a Mux asset with a <strong>signed</strong>{" "}
            policy. Public IDs are rejected.
          </p>
        </div>
      )}

      {mode === "MUX_UPLOAD" && (
        <div className="space-y-1.5">
          <Label htmlFor={`file-${moduleId}`}>Video file</Label>
          <input
            id={`file-${moduleId}`}
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Uploaded to Mux with a signed playback policy — only enrolled students
            can watch it.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" variant="premium" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {status ?? "Saving…"}
            </>
          ) : (
            "Add video"
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
          disabled={busy}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
