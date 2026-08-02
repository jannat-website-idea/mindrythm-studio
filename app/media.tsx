"use client";

import { useEffect, useRef } from "react";
import type { ContentItem } from "@/lib/content";

type MediaProps = {
  item: ContentItem;
  priority?: boolean;
  active?: boolean;
};

export function Media({ item, priority = false, active = true }: MediaProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(item.mediaUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active) {
      video.pause();
      return;
    }

    const play = () => {
      if (document.visibilityState === "visible") void video.play().catch(() => undefined);
    };

    if (priority) {
      play();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else video.pause();
      },
      { rootMargin: "160px 0px", threshold: 0.08 },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [active, item.mediaUrl, priority]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={item.mediaUrl}
        muted
        loop
        playsInline
        preload={priority ? "metadata" : "none"}
        aria-label={item.mediaAlt}
      />
    );
  }

  return (
    <img
      src={item.mediaUrl || "/images/resort-exterior.jpg"}
      alt={item.mediaAlt || item.title}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
