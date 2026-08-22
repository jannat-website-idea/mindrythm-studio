"use client";

import { useEffect, useMemo, useState } from "react";
import { type ContentItem } from "@/lib/content";

function isVideoUrl(url: string, mediaType?: string) {
  if (mediaType === "video") return true;
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
}

function safeUrl(url: string): string | null {
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

function getMediaDimensions(
  url: string,
  mediaType?: string
): Promise<{ width: number; height: number }> {
  if (isVideoUrl(url, mediaType)) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.crossOrigin = "anonymous";
      video.src = url;
      const finish = () => {
        if (video.videoWidth && video.videoHeight) {
          resolve({ width: video.videoWidth, height: video.videoHeight });
        } else {
          resolve({ width: 16, height: 9 });
        }
      };
      video.onloadedmetadata = finish;
      video.onerror = finish;
    });
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    const finish = () => {
      if (img.naturalWidth && img.naturalHeight) {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      } else {
        resolve({ width: 3, height: 2 });
      }
    };
    img.onload = finish;
    img.onerror = finish;
  });
}

type LightboxLayout = "portrait" | "tall-portrait" | "square" | "landscape" | "cinematic";

function classifyLayout(width: number, height: number): LightboxLayout {
  if (!width || !height || width === height) return "square";
  const ratio = width / height;
  if (ratio >= 2) return "cinematic";
  if (ratio <= 0.65) return "tall-portrait";
  if (width > height) return "landscape";
  return "portrait";
}

export function ImmersiveLightbox({
  selected,
  items,
  onClose,
  onSelect,
}: {
  selected: ContentItem;
  items: ContentItem[];
  onClose: () => void;
  onSelect: (item: ContentItem) => void;
}) {
  const currentIndex = items.findIndex((item) => item.id === selected.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;
  const goPrev = () => hasPrev && onSelect(items[currentIndex - 1]);
  const goNext = () => (hasNext ? onSelect(items[currentIndex + 1]) : onClose());
  const [loaded, setLoaded] = useState(false);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    setLoaded(false);
    setDims(null);
    const mediaUrl = safeUrl(selected.mediaUrl);
    if (!mediaUrl) return;
    let mounted = true;
    getMediaDimensions(mediaUrl, selected.mediaType).then((d) => {
      if (mounted) setDims(d);
    });
    return () => {
      mounted = false;
    };
  }, [selected]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onSelect(items[currentIndex - 1]);
      if (e.key === "ArrowRight" && hasNext) onSelect(items[currentIndex + 1]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasPrev, hasNext, items, onClose, onSelect]);

  const layout = useMemo(() => {
    if (!dims) return "landscape";
    return classifyLayout(dims.width, dims.height);
  }, [dims]);

  const isPortraitLike = layout === "portrait" || layout === "tall-portrait" || layout === "square";

  const mediaUrl = safeUrl(selected.mediaUrl);
  const isVideo = Boolean(mediaUrl && isVideoUrl(mediaUrl, selected.mediaType));

  return (
    <div
      className={`lightbox-immersive lightbox-layout-${layout}`}
      role="dialog"
      aria-modal="true"
      aria-label={selected.title}
    >
      <div className="lightbox-immersive-toolbar">
        <button type="button" className="lightbox-grid-btn" onClick={onClose} aria-label="Close to gallery">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="4" cy="4" r="2" />
            <circle cx="12" cy="4" r="2" />
            <circle cx="20" cy="4" r="2" />
            <circle cx="4" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="20" cy="12" r="2" />
            <circle cx="4" cy="20" r="2" />
            <circle cx="12" cy="20" r="2" />
            <circle cx="20" cy="20" r="2" />
          </svg>
        </button>
        <button type="button" className="lightbox-close-btn" onClick={onClose} aria-label="Close">
          Close ×
        </button>
      </div>

      {hasPrev && (
        <button type="button" className="lightbox-nav lightbox-nav-prev" onClick={goPrev} aria-label="Previous image">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      {hasNext && (
        <button type="button" className="lightbox-nav lightbox-nav-next" onClick={goNext} aria-label="Next image">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <div
        className="lightbox-media-area"
        onClick={goNext}
        role="button"
        tabIndex={0}
        aria-label="Click image to view next"
        style={{
          backgroundImage: isPortraitLike && !isVideo && mediaUrl ? `url(${mediaUrl})` : undefined,
        }}
      >
        <div className="lightbox-media-frame">
          {isVideo ? (
            <video
              key={selected.id}
              src={mediaUrl!}
              autoPlay
              loop
              muted
              playsInline
              controls
              preload="auto"
              className={`lightbox-media ${loaded ? "is-loaded" : ""}`}
              aria-label={selected.title}
              onLoadedData={() => setLoaded(true)}
              onClick={(e) => e.stopPropagation()}
            />
          ) : mediaUrl ? (
            <img
              key={selected.id}
              src={mediaUrl}
              alt={selected.mediaAlt || selected.title}
              className={`lightbox-media ${loaded ? "is-loaded" : ""}`}
              onLoad={() => setLoaded(true)}
            />
          ) : null}
        </div>
      </div>

      <div className={`lightbox-copy-area ${isPortraitLike ? "lightbox-copy-side" : "lightbox-copy-docked"}`}>
        <div className="lightbox-copy-inner">
          <span>{selected.category || selected.eyebrow}</span>
          <h2>{selected.title}</h2>
          {selected.body && <div className="lightbox-copy-body">{selected.body}</div>}
        </div>
      </div>
    </div>
  );
}
