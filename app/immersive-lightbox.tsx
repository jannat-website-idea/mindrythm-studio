"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoaded(false);
    setDims(null);
    const mediaUrl = safeUrl(selected.mediaUrl);
    if (!mediaUrl) return;
    let cancelled = false;
    getMediaDimensions(mediaUrl, selected.mediaType).then((result) => {
      if (!cancelled) setDims(result);
    });
    return () => {
      cancelled = true;
    };
  }, [selected.id, selected.mediaUrl, selected.mediaType]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);
    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onSelect(items[currentIndex - 1]);
      if (e.key === "ArrowRight" && hasNext) onSelect(items[currentIndex + 1]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasPrev, hasNext, items, onClose, onSelect]);

  const fitStyle = useMemo(() => {
    if (!dims || viewport.width === 0 || viewport.height === 0) return {};
    const padX = 32;
    const padY = 24;
    const toolbarY = 80;
    const copyY = 140;
    const availableWidth = Math.max(1, viewport.width - padX * 2);
    const availableHeight = Math.max(1, viewport.height - padY * 2 - toolbarY - copyY);
    const scale = Math.min(
      availableWidth / dims.width,
      availableHeight / dims.height,
      1
    );
    const displayWidth = Math.round(dims.width * scale);
    const displayHeight = Math.round(dims.height * scale);
    return {
      width: displayWidth,
      height: displayHeight,
      maxWidth: "none",
      maxHeight: "none",
    } as React.CSSProperties;
  }, [dims, viewport]);

  const mediaUrl = safeUrl(selected.mediaUrl);
  const isVideo = Boolean(mediaUrl && isVideoUrl(mediaUrl, selected.mediaType));

  if (!mediaUrl) {
    return (
      <div className="lightbox-immersive" role="dialog" aria-modal="true" aria-label={selected.title}>
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
        <div className="lightbox-docked-copy">
          <div className="lightbox-copy-inner">
            <span>{selected.category || selected.eyebrow}</span>
            <h2>{selected.title}</h2>
            {selected.body && <p>{selected.body}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lightbox-immersive" role="dialog" aria-modal="true" aria-label={selected.title}>
      <div ref={wrapperRef} className="lightbox-stage" onClick={goNext} role="button" tabIndex={0} aria-label="Click image to view next">
        <div className="lightbox-media-wrapper">
          {isVideo ? (
            <video
              key={selected.id}
              src={mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="auto"
              className="lightbox-media"
              style={fitStyle}
              aria-label={selected.title}
              onLoadedData={() => setLoaded(true)}
            />
          ) : (
            <img
              key={selected.id}
              src={mediaUrl}
              alt={selected.mediaAlt || selected.title}
              className={`lightbox-media ${loaded ? "is-loaded" : ""}`}
              style={fitStyle}
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
      </div>
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
      <div className="lightbox-docked-copy">
        <div className="lightbox-copy-inner">
          <span>{selected.category || selected.eyebrow}</span>
          <h2>{selected.title}</h2>
          {selected.body && <p>{selected.body}</p>}
        </div>
      </div>
    </div>
  );
}
