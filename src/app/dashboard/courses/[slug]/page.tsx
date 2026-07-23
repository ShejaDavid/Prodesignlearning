import Link from "next/link";
import { ArrowLeft, Lock, PlayCircle, Clock } from "lucide-react";
import { auth } from "@/lib/auth";
import { getEnrolledCourseForUser } from "@/lib/enrollments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { VideoPlayer } from "@/components/dashboard/video-player";
import { formatDate } from "@/lib/utils";
import { createMuxPlaybackTokens } from "@/lib/mux";

// This page renders per request, gated on the current user's enrolment.
export const dynamic = "force-dynamic";

export default async function CourseLearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const userId = session!.user!.id;

  // The single authorization gate: returns the course + modules + videos only
  // when this user has a valid (ENROLLED, not expired) enrolment in it.
  const enrollment = await getEnrolledCourseForUser(userId, slug);

  // Denied: not enrolled, expired, or the course does not exist. No video URL is
  // ever fetched or rendered on this path.
  if (!enrollment) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
            <Lock className="h-10 w-10 text-muted-foreground/50" />
            <div>
              <p className="font-medium">You don&apos;t have access to this course</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You need an active enrolment to view these materials. If you&apos;ve
                just enrolled, access appears once your place is confirmed.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/courses">Back to My Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { course, cohort, accessExpiresAt } = enrollment;
  const muxTokensByPlaybackId = new Map(
    course.modules
      .flatMap((mod) => mod.videos)
      .filter((video) => video.provider === "MUX" && video.muxPlaybackId)
      .map((video) => [
        video.muxPlaybackId!,
        createMuxPlaybackTokens(video.muxPlaybackId!),
      ])
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/courses"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          My Courses
        </Link>
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{cohort.name}</span>
          {accessExpiresAt && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Access until {formatDate(accessExpiresAt)}
            </span>
          )}
        </div>
      </div>

      {course.modules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No modules have been published for this course yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Course Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="single"
              collapsible
              defaultValue={course.modules[0]?.id}
              className="w-full"
            >
              {course.modules.map((mod) => (
                <AccordionItem key={mod.id} value={mod.id}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                        {mod.moduleNumber}
                      </span>
                      <span className="text-foreground">{mod.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5">
                    {mod.videos.length > 0 ? (
                      mod.videos.map((video) => (
                        <div key={video.id} className="space-y-2">
                          <div className="flex items-center gap-2 font-medium text-foreground">
                            <PlayCircle className="h-4 w-4 text-secondary" />
                            {video.title}
                          </div>
                          <VideoPlayer
                            url={video.url}
                            muxPlaybackId={video.muxPlaybackId}
                            muxTokens={
                              video.muxPlaybackId
                                ? muxTokensByPlaybackId.get(video.muxPlaybackId)
                                : null
                            }
                            title={video.title}
                          />
                          {video.description && (
                            <p className="text-sm text-muted-foreground">
                              {video.description}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No videos for this module yet.
                      </p>
                    )}

                    {Array.isArray(mod.topics) && mod.topics.length > 0 && (
                      <ul className="ml-1 list-inside list-disc space-y-1 text-sm">
                        {(mod.topics as string[]).map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
