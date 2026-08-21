"use client";

import { type ContentItem } from "@/lib/content";
import { Media } from "@/app/media";
import Link from "next/link";

interface TeamMemberCardProps {
  member: ContentItem;
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
  onReadMore?: () => void;
  showExploreLink?: boolean;
}

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

function getBioSnippet(text?: string, maxChars = 110): string {
  if (!text) return "";
  const singleLine = text.replace(/\s+/g, " ").trim();
  if (singleLine.length <= maxChars) return singleLine;
  return singleLine.slice(0, maxChars).trim() + "…";
}

export function TeamMemberCard({
  member,
  isActive,
  onToggle,
  onClose,
  onReadMore,
  showExploreLink = true,
}: TeamMemberCardProps) {
  const role = member.category || member.eyebrow;
  const socialUrl = normalizeSocialUrl(member.href);
  const bioSnippet = getBioSnippet(member.body);

  return (
    <article
      className={`team-member-card ${isActive ? "active" : ""}`}
      onClick={onToggle}
      aria-label={`Team member ${member.title}`}
    >
      <button
        type="button"
        className="team-member-photo-btn"
        aria-expanded={isActive}
        aria-label={isActive ? `Close info for ${member.title}` : `View info for ${member.title}`}
      >
        <div className="team-member-media-frame">
          <Media item={member} />
        </div>
      </button>

      <div
        className={`team-member-overlay ${isActive ? "open" : ""}`}
        aria-hidden={!isActive}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="team-member-overlay-header">
          {role && <span className="team-member-role">{role}</span>}
          <button
            type="button"
            className="team-member-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="team-member-info">
          <h3 className="team-member-name">{member.title}</h3>
          {bioSnippet && <p className="team-member-bio">{bioSnippet}</p>}
        </div>

        <div className="team-member-actions">
          {socialUrl && (
            <a
              href={socialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="team-member-link"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={`Connect with ${member.title} on Instagram`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span>CONNECT ↗</span>
            </a>
          )}
          {onReadMore ? (
            <button
              type="button"
              className="team-member-readmore-btn"
              onClick={(e) => {
                e.stopPropagation();
                onReadMore();
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              Read more →
            </button>
          ) : (
            <Link
              href={`/team?member=${member.id}#${member.id}`}
              className="team-member-readmore-btn"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              Read more →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
