export type SocialIconName = "instagram" | "facebook" | "youtube" | "x";

export function SocialIcon({ name }: { name: SocialIconName }) {
  if (name === "x") return null;

  // Colored rounded-square social icons matching the reference screenshot.
  // These are inline SVGs so they render crisply at any size and stay clickable
  // when wrapped in an <a> tag.
  if (name === "instagram") {
    return (
      <svg className="social-icon-image social-icon-instagram" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <radialGradient id="ig-grad" cx="30%" cy="107%" r="75%">
            <stop offset="0%" stopColor="#fed576" />
            <stop offset="20%" stopColor="#ff9432" />
            <stop offset="40%" stopColor="#ee243d" />
            <stop offset="60%" stopColor="#dc168a" />
            <stop offset="80%" stopColor="#9c44bc" />
            <stop offset="100%" stopColor="#4e78d8" />
          </radialGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#ig-grad)" />
        <rect x="12" y="12" width="24" height="24" rx="7" fill="none" stroke="#ffffff" strokeWidth="2.6" />
        <circle cx="24" cy="24" r="6" fill="none" stroke="#ffffff" strokeWidth="2.6" />
        <circle cx="34" cy="15" r="2" fill="#ffffff" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg className="social-icon-image social-icon-facebook" viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#1877F2" />
        <path d="M30.5 25.5l0.6-4h-3.9v-2.6c0-1.1 0.5-2.2 2.3-2.2h1.8v-3.4c-0.8-0.1-1.7-0.2-2.5-0.2-2.6 0-4.4 1.6-4.4 4.5v2.9h-3.2v4h3.2v10.2h4v-10.2h3.1z" fill="#ffffff" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg className="social-icon-image social-icon-youtube" viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="12" fill="#FF0000" />
        <polygon points="19,16 34,24 19,32" fill="#ffffff" />
      </svg>
    );
  }

  return null;
}
