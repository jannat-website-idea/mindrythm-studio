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

const dimsCache = new Map<string, { width: number; height: number }>();

function getMediaDimensionsSync(url: string, mediaType?: string): { width: number; height: number } | null {
  if (dimsCache.has(url)) return dimsCache.get(url)!;
  if (isVideoUrl(url, mediaType)) {
    const res = { width: 16, height: 9 };
    dimsCache.set(url, res);
    return res;
  }
  // Sanity image asset format: ...-3809x5714.jpg
  const match = url.match(/[-_](\d+)x(\d+)\.[a-z0-9]+$/i);
  if (match) {
    const res = { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
    dimsCache.set(url, res);
    return res;
  }
  return null;
}

function getMediaDimensions(
  url: string,
  mediaType?: string
): Promise<{ width: number; height: number }> {
  const sync = getMediaDimensionsSync(url, mediaType);
  if (sync) return Promise.resolve(sync);

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    const finish = () => {
      const res = img.naturalWidth && img.naturalHeight
        ? { width: img.naturalWidth, height: img.naturalHeight }
        : { width: 3, height: 2 };
      dimsCache.set(url, res);
      resolve(res);
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
  const mediaUrl = safeUrl(selected.mediaUrl);
  const isVideo = Boolean(mediaUrl && isVideoUrl(mediaUrl, selected.mediaType));

  const [dims, setDims] = useState<{ width: number; height: number } | null>(() => {
    return mediaUrl ? getMediaDimensionsSync(mediaUrl, selected.mediaType) : null;
  });

  useEffect(() => {
    if (!mediaUrl) return;
    const sync = getMediaDimensionsSync(mediaUrl, selected.mediaType);
    if (sync) {
      setDims(sync);
      return;
    }
    let mounted = true;
    getMediaDimensions(mediaUrl, selected.mediaType).then((d) => {
      if (mounted) setDims(d);
    });
    return () => {
      mounted = false;
    };
  }, [mediaUrl, selected.mediaType]);

  // Preload surrounding media for instant next/prev clicks
  useEffect(() => {
    const toPreload = [
      items[currentIndex + 1],
      items[currentIndex + 2],
      items[currentIndex - 1],
    ];
    toPreload.forEach((item) => {
      const url = item ? safeUrl(item.mediaUrl) : null;
      if (url && !isVideoUrl(url, item?.mediaType)) {
        const img = new Image();
        img.src = url;
        getMediaDimensions(url, item?.mediaType);
      }
    });
  }, [currentIndex, items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onSelect(items[currentIndex - 1]);
      if (e.key === "ArrowRight" && hasNext) onSelect(items[currentIndex + 1]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasPrev, hasNext, items, onClose, onSelect]);

  // Touch swipe support for mobile devices
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0 && hasNext) {
        onSelect(items[currentIndex + 1]);
      } else if (deltaX > 0 && hasPrev) {
        onSelect(items[currentIndex - 1]);
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const layout = useMemo(() => {
    if (!dims) return "landscape";
    return classifyLayout(dims.width, dims.height);
  }, [dims]);

  const isPortraitLike = layout === "portrait" || layout === "tall-portrait" || layout === "square";

  return (
    <div
      className={`lightbox-immersive lightbox-layout-${layout}`}
      role="dialog"
      aria-modal="true"
      aria-label={selected.title}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
              className="lightbox-media is-loaded"
              aria-label={selected.title}
              onClick={(e) => e.stopPropagation()}
            />
          ) : mediaUrl ? (
            <img
              key={selected.id}
              src={mediaUrl}
              alt={selected.mediaAlt || selected.title}
              className="lightbox-media is-loaded"
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
