"use client";

import { type ContentItem } from "@/lib/content";
import { Media } from "@/app/media";

interface TeamMemberCardProps {
  member: ContentItem;
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
  showExploreLink?: boolean;
}

export function TeamMemberCard({
  member,
  isActive,
  onToggle,
  onClose,
  showExploreLink = true,
}: TeamMemberCardProps) {
  const role = member.category || member.eyebrow;

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
        aria-label={isActive ? `Close bio for ${member.title}` : `View details for ${member.title}`}
      >
        <div className="team-member-media-frame">
          <Media item={member} />
        </div>
      </button>

      <div
        className={`team-member-overlay ${isActive ? "open" : ""}`}
        aria-hidden={!isActive}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="team-member-close-btn"
          onClick={onClose}
          aria-label="Close bio"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="team-member-info">
          {role && <span className="team-member-role">{role}</span>}
          <h3 className="team-member-name">{member.title}</h3>
          {member.body && <p className="team-member-bio">{member.body}</p>}

          <div className="team-member-actions">
            {member.href && (
              <a
                href={member.href}
                target="_blank"
                rel="noreferrer"
                className="team-member-link"
                onClick={(e) => e.stopPropagation()}
              >
                Connect ↗
              </a>
            )}
            {showExploreLink && (
              <a
                href="/team"
                className="team-member-page-link"
                onClick={(e) => e.stopPropagation()}
              >
                Our Team Page →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
