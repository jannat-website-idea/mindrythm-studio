"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { type ContentItem } from "@/lib/content";

function normalizeSocialUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("@")) {
    return `https://www.instagram.com/${trimmed.slice(1)}/`;
  }
  if (trimmed.startsWith("instagram.com/") || trimmed.startsWith("www.instagram.com/")) {
    return `https://${trimmed}`;
  }
  if (/^[a-zA-Z0-9._]+$/.test(trimmed)) {
    return `https://www.instagram.com/${trimmed}/`;
  }
  return `https://${trimmed}`;
}

export function TeamShowcase({
  team,
  initialMemberId,
  onClose,
}: {
  team: ContentItem[];
  initialMemberId: string;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = team.findIndex(
      (m) =>
        m.id.toLowerCase() === initialMemberId.toLowerCase() ||
        m.title.toLowerCase().replace(/\s+/g, "-") === initialMemberId.toLowerCase() ||
        m.title.toLowerCase().includes(initialMemberId.toLowerCase())
    );
    return idx >= 0 ? idx : 0;
  });

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < team.length - 1;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < team.length - 1 ? prev + 1 : prev));
  }, [team.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const activeMember = team[currentIndex] || team[0];
  const role = activeMember.category || activeMember.eyebrow;
  const socialUrl = normalizeSocialUrl(activeMember.href);

  // Update URL query when active member changes
  useEffect(() => {
    if (activeMember && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("member", activeMember.id);
      window.history.replaceState(null, "", url.toString());
    }
  }, [activeMember]);

  // Keyboard navigation & lock background scroll
  useEffect(() => {
    document.body.classList.add("modal-open");
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, goNext, goPrev]);

  // Touch swipe support
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div
      className="team-showcase-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Team member ${activeMember.title}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="team-showcase-toolbar">
        <button
          type="button"
          className="team-showcase-close-btn"
          onClick={onClose}
          aria-label="Close team showcase"
        >
          CLOSE ×
        </button>
      </div>

      {/* Floating Previous & Next Navigation Arrows */}
      {hasPrev && (
        <button
          type="button"
          className="team-showcase-nav-btn team-showcase-nav-prev"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          aria-label="Previous team member"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          className="team-showcase-nav-btn team-showcase-nav-next"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          aria-label="Next team member"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      <div className="team-showcase-center">
        <div className="team-showcase-card" key={activeMember.id}>
          {/* Left side: Large portrait image with blurred background */}
          <div
            className="team-showcase-media-area"
            style={{
              backgroundImage: activeMember.mediaUrl ? `url(${activeMember.mediaUrl})` : undefined,
            }}
          >
            <div className="team-showcase-media-frame">
              {activeMember.mediaUrl ? (
                <img
                  src={activeMember.mediaUrl}
                  alt={activeMember.mediaAlt || activeMember.title}
                  className="team-showcase-img"
                />
              ) : null}
            </div>
          </div>

          {/* Right side: Light ivory editorial text panel */}
          <div className="team-showcase-copy-area">
            <div className="team-showcase-copy-inner">
              {role && <span className="team-showcase-role">{role}</span>}
              <h2 className="team-showcase-name">{activeMember.title}</h2>
              {activeMember.body && (
                <div className="team-showcase-bio">
                  {activeMember.body}
                </div>
              )}
              {socialUrl && (
                <div className="team-showcase-actions">
                  <a
                    href={socialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-showcase-connect-btn"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Connect with ${activeMember.title} on Instagram`}
                  >
                    <svg
                      className="team-showcase-ig-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span>CONNECT ↗</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
