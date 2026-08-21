"use client";

import { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("modal-open");
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Scroll to initial member slide on mount
    const targetElement = document.getElementById(`team-showcase-${initialMemberId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "instant", block: "start" });
    }

    // Observe active slide to update URL query
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const memberId = entry.target.getAttribute("data-member-id");
            if (memberId && typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.set("member", memberId);
              window.history.replaceState(null, "", url.toString());
            }
          }
        }
      },
      { root: container, threshold: 0.5 }
    );

    const slides = container.querySelectorAll(".team-showcase-slide");
    slides.forEach((slide) => observer.observe(slide));

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
    };
  }, [initialMemberId, onClose]);

  return (
    <div
      ref={containerRef}
      className="team-showcase-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Mindrythm Team Showcase"
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

      <div className="team-showcase-track">
        {team.map((member) => {
          const role = member.category || member.eyebrow;
          const socialUrl = normalizeSocialUrl(member.href);

          return (
            <section
              key={member.id}
              id={`team-showcase-${member.id}`}
              data-member-id={member.id}
              className="team-showcase-slide"
            >
              <div className="team-showcase-card">
                {/* Left side: Large portrait image with blurred background */}
                <div
                  className="team-showcase-media-area"
                  style={{
                    backgroundImage: member.mediaUrl ? `url(${member.mediaUrl})` : undefined,
                  }}
                >
                  <div className="team-showcase-media-frame">
                    {member.mediaUrl ? (
                      <img
                        src={member.mediaUrl}
                        alt={member.mediaAlt || member.title}
                        className="team-showcase-img"
                      />
                    ) : null}
                  </div>
                </div>

                {/* Right side: Light ivory editorial text panel */}
                <div className="team-showcase-copy-area">
                  <div className="team-showcase-copy-inner">
                    {role && <span className="team-showcase-role">{role}</span>}
                    <h2 className="team-showcase-name">{member.title}</h2>
                    {member.body && (
                      <div className="team-showcase-bio">
                        {member.body}
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
                          aria-label={`Connect with ${member.title} on Instagram`}
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
