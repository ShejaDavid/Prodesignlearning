"use client";

import MuxPlayer from "@mux/mux-player-react";
import type { MuxPlaybackTokens } from "@/lib/mux";

// Renders a supporting course video. The video data is only ever passed here
// after the server has confirmed a valid enrolment for the viewer — this
// component performs no access checks of its own.
export function VideoPlayer({
  url,
  muxPlaybackId,
  muxTokens,
  title = "Course video",
}: {
  url?: string | null;
  muxPlaybackId?: string | null;
  muxTokens?: MuxPlaybackTokens | null;
  title?: string;
}) {
  if (muxPlaybackId) {
    if (!muxTokens) {
      return (
        <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-muted text-center text-sm text-muted-foreground">
          Mux signed playback is not configured yet.
        </div>
      );
    }

    return (
      <MuxPlayer
        playbackId={muxPlaybackId}
        tokens={{
          playback: muxTokens.playback,
          thumbnail: muxTokens.thumbnail,
          storyboard: muxTokens.storyboard,
        }}
        metadataVideoTitle={title}
        className="aspect-video w-full overflow-hidden rounded-2xl bg-black"
      />
    );
  }

  if (!url) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-muted text-center text-sm text-muted-foreground">
        Video source not configured.
      </div>
    );
  }

  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const isVimeo = url.includes("vimeo.com");

  // Normalise YouTube watch URLs to embed format
  const embedUrl = isYouTube
    ? url
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "www.youtube.com/embed/")
    : url;

  if (isYouTube || isVimeo) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    );
  }

  return (
    <video
      src={url}
      controls
      className="w-full rounded-2xl bg-black"
      style={{ maxHeight: "540px" }}
    >
      Your browser does not support the video tag.
    </video>
  );
}
