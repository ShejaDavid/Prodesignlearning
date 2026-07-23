import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddVideoForm } from "@/components/admin/add-video-form";
import { DeleteVideoButton } from "@/components/admin/delete-video-button";
import { isMuxConfigured } from "@/lib/mux-server";
import { PlayCircle } from "lucide-react";

export const metadata = { title: "Videos" };
export const dynamic = "force-dynamic";

function statusBadge(video: {
  provider: string;
  muxPlaybackId: string | null;
}) {
  if (video.provider === "URL") {
    return { label: "Link", className: "bg-muted text-muted-foreground" };
  }
  if (video.muxPlaybackId) {
    return { label: "Ready", className: "bg-success/10 text-success" };
  }
  return { label: "Processing…", className: "bg-amber-50 text-amber-600" };
}

export default async function AdminVideosPage() {
  const muxEnabled = isMuxConfigured();
  const courses = await db.course.findMany({
    orderBy: { title: "asc" },
    include: {
      modules: {
        orderBy: { sortOrder: "asc" },
        include: { videos: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Videos</h1>
        <p className="text-muted-foreground mt-1">
          Add supporting videos to each module. Uploaded (Mux) videos are
          protected — only enrolled students can watch them.
        </p>
      </div>

      {!muxEnabled && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Mux isn&apos;t configured, so protected uploads are disabled. Add{" "}
          <code className="rounded bg-amber-100 px-1">MUX_TOKEN_ID</code> and{" "}
          <code className="rounded bg-amber-100 px-1">MUX_TOKEN_SECRET</code> to
          enable them. You can still add link (URL) videos.
        </div>
      )}

      {courses.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No courses yet. Create a course first.
        </p>
      )}

      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {course.modules.length === 0 && (
              <p className="text-sm text-muted-foreground">No modules yet.</p>
            )}
            {course.modules.map((mod) => (
              <div key={mod.id} className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-medium">
                    {mod.moduleNumber}. {mod.title}
                  </p>
                  <AddVideoForm moduleId={mod.id} muxEnabled={muxEnabled} />
                </div>

                {mod.videos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No videos yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {mod.videos.map((video) => {
                      const badge = statusBadge(video);
                      return (
                        <li
                          key={video.id}
                          className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2 text-sm"
                        >
                          <span className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-secondary" />
                            {video.title}
                          </span>
                          <span className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}
                            >
                              {badge.label}
                            </span>
                            <DeleteVideoButton
                              videoId={video.id}
                              title={video.title}
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
