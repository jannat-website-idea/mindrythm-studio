"use client";

import { useEffect, useRef, useState } from "react";
import { type ContentItem } from "@/lib/content";

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onSelect(items[currentIndex - 1]);
      if (e.key === "ArrowRight" && hasNext) onSelect(items[currentIndex + 1]);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasPrev, hasNext, items, onClose, onSelect]);

  useEffect(() => {
    setAspectRatio(null);
    if (selected.mediaType === "video" || /\.(mp4|webm|mov)(\?.*)?$/i.test(selected.mediaUrl)) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = selected.mediaUrl;
      video.onloadedmetadata = () => {
        if (video.videoWidth && video.videoHeight) {
          setAspectRatio(video.videoWidth / video.videoHeight);
        }
      };
    } else {
      const img = new Image();
      img.src = selected.mediaUrl;
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setAspectRatio(img.naturalWidth / img.naturalHeight);
        }
      };
    }
  }, [selected.mediaUrl, selected.mediaType]);

  useEffect(() => {
    if (wrapperRef.current && aspectRatio) {
      wrapperRef.current.style.setProperty("--media-aspect", String(aspectRatio));
    }
  }, [aspectRatio]);

  return (
    <div className="lightbox-immersive" role="dialog" aria-modal="true" aria-label={selected.title}>
      <div className="lightbox-stage">
        <div
          ref={wrapperRef}
          className="lightbox-media-wrapper"
          onClick={goNext}
          role="button"
          tabIndex={0}
          aria-label="Click image to view next"
        >
          {selected.mediaType === "video" || /\.(mp4|webm|mov)(\?.*)?$/i.test(selected.mediaUrl) ? (
            <video
              src={selected.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              preload="auto"
              className="lightbox-media"
              aria-label={selected.title}
            />
          ) : (
            <img
              src={selected.mediaUrl}
              alt={selected.mediaAlt || selected.title}
              className="lightbox-media"
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
