"use client";

import { useMemo } from "react";
import { type ContentItem, type LayoutType } from "@/lib/content";
import { Media } from "@/app/media";
import { SocialIcon } from "@/app/social-icon";

export type BentoPattern = "home" | "gallery" | "compact";

type ContentSlot = {
  id: string;
  kind: "content";
  layoutType: LayoutType;
  className: string;
};

type StaticSlot = {
  id: string;
  kind: "static";
  type: "social-bar" | "editorial" | "social-info";
  className: string;
};

type BentoCell = ContentSlot | StaticSlot;

type ColumnDef = {
  id: string;
  cells: BentoCell[];
};

// Predefined, deterministic column layouts. The frontend owns the geometry;
// CMS items only fill the available content slots by layoutType.
const PATTERNS: Record<BentoPattern, ColumnDef[]> = {
  home: [
    {
      id: "home-col-1",
      cells: [
        { id: "home-medium-01", kind: "content", layoutType: "medium", className: "bento-card-medium" },
        { id: "home-social-bar", kind: "static", type: "social-bar", className: "bento-card-social-bar" },
        { id: "home-large-02", kind: "content", layoutType: "large", className: "bento-card-large" },
      ],
    },
    {
      id: "home-col-2",
      cells: [
        { id: "home-large-01", kind: "content", layoutType: "large", className: "bento-card-large" },
        { id: "home-medium-03", kind: "content", layoutType: "medium", className: "bento-card-medium" },
      ],
    },
    {
      id: "home-col-3",
      cells: [
        { id: "home-medium-02", kind: "content", layoutType: "medium", className: "bento-card-medium" },
        { id: "home-large-03", kind: "content", layoutType: "large", className: "bento-card-large" },
      ],
    },
    {
      id: "home-col-4",
      cells: [
        { id: "home-editorial", kind: "static", type: "editorial", className: "bento-card-editorial" },
        { id: "home-social-info", kind: "static", type: "social-info", className: "bento-card-social" },
      ],
    },
  ],
  gallery: [
    {
      id: "gallery-col-1",
      cells: [
        { id: "gallery-medium-01", kind: "content", layoutType: "medium", className: "bento-card-medium" },
        { id: "gallery-large-02", kind: "content", layoutType: "large", className: "bento-card-large" },
      ],
    },
    {
      id: "gallery-col-2",
      cells: [
        { id: "gallery-large-01", kind: "content", layoutType: "large", className: "bento-card-large" },
        { id: "gallery-medium-03", kind: "content", layoutType: "medium", className: "bento-card-medium" },
      ],
    },
    {
      id: "gallery-col-3",
      cells: [
        { id: "gallery-medium-02", kind: "content", layoutType: "medium", className: "bento-card-medium" },
        { id: "gallery-large-03", kind: "content", layoutType: "large", className: "bento-card-large" },
      ],
    },
    {
      id: "gallery-col-4",
      cells: [
        { id: "gallery-editorial", kind: "static", type: "editorial", className: "bento-card-editorial" },
        { id: "gallery-medium-04", kind: "static", type: "editorial", className: "bento-card-medium" },
      ],
    },
  ],
  compact: [
    {
      id: "compact-col-1",
      cells: [
        { id: "compact-medium-01", kind: "content", layoutType: "medium", className: "bento-card-medium" },
        { id: "compact-large-02", kind: "content", layoutType: "large", className: "bento-card-large" },
      ],
    },
    {
      id: "compact-col-2",
      cells: [
        { id: "compact-large-01", kind: "content", layoutType: "large", className: "bento-card-large" },
        { id: "compact-medium-03", kind: "content", layoutType: "medium", className: "bento-card-medium" },
      ],
    },
    {
      id: "compact-col-3",
      cells: [
        { id: "compact-medium-02", kind: "content", layoutType: "medium", className: "bento-card-medium" },
        { id: "compact-large-03", kind: "content", layoutType: "large", className: "bento-card-large" },
      ],
    },
    {
      id: "compact-col-4",
      cells: [
        { id: "compact-editorial", kind: "static", type: "editorial", className: "bento-card-editorial" },
      ],
    },
  ],
};

function useBentoColumns(items: ContentItem[], pattern: BentoPattern) {
  return useMemo(() => {
    const columns = PATTERNS[pattern];
    const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

    const queues: Record<LayoutType, ContentItem[]> = {
      large: [],
      medium: [],
      tall: [],
      small: [],
      wide: [],
    };

    for (const item of sorted) {
      const type = item.layoutType || "large";
      if (queues[type]) queues[type].push(item);
      else queues.large.push(item);
    }

    return columns.map((column) => ({
      ...column,
      cells: column.cells.map((cell) =>
        cell.kind === "content"
          ? { ...cell, item: queues[cell.layoutType].shift() || null }
          : cell
      ),
    }));
  }, [items, pattern]);
}

function BentoMediaCard({
  item,
  className,
  onOpen,
  priority = false,
}: {
  item: ContentItem;
  className: string;
  onOpen: (item: ContentItem) => void;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      className={`bento-card ${className}`}
      onClick={() => onOpen(item)}
      aria-label={`Open ${item.title}`}
    >
      <Media item={item} priority={priority} />
      {item.category && <span className="bento-badge-tag">{item.category}</span>}
      <div className="bento-card-gradient">
        {item.eyebrow && <span className="bento-item-eyebrow">{item.eyebrow}</span>}
        <h3 className="bento-item-title">{item.title}</h3>
      </div>
    </button>
  );
}

function EmptySlot({ className }: { className: string }) {
  return <div className={`bento-card bento-card-empty ${className}`} aria-hidden="true" />;
}

function SocialBar({
  instagram,
  facebook,
  youtube,
}: {
  instagram?: string;
  facebook?: string;
  youtube?: string;
}) {
  const defaultInstagram = "https://www.instagram.com/mindrythm";
  const defaultFacebook = "https://www.facebook.com/mindrythm";
  const defaultYoutube = "https://www.youtube.com/@mindrythm";

  return (
    <div className="bento-card bento-card-social-bar" aria-label="Mindrythm social media">
      <div className="social-pill-group">
        <a href={instagram || defaultInstagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="social-pill-link">
          <SocialIcon name="instagram" />
        </a>
        <a href={facebook || defaultFacebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="social-pill-link">
          <SocialIcon name="facebook" />
        </a>
        <a href={youtube || defaultYoutube} target="_blank" rel="noreferrer" aria-label="YouTube" className="social-pill-link">
          <SocialIcon name="youtube" />
        </a>
      </div>
    </div>
  );
}

function EditorialCard({
  text,
  eyebrow,
  onAction,
  showPlay = false,
}: {
  text: string;
  eyebrow?: string;
  onAction?: () => void;
  showPlay?: boolean;
}) {
  return (
    <article className="bento-card bento-card-editorial bento-card-large">
      {eyebrow && <span className="bento-editorial-eyebrow">{eyebrow}</span>}
      <p className="bento-editorial-statement">{text}</p>
      {showPlay ? (
        <button
          type="button"
          className="bento-editorial-link bento-editorial-play"
          onClick={onAction}
          aria-label="Play reel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>
      ) : (
        <button type="button" className="bento-editorial-link" onClick={onAction}>
          OPEN THE FULL GALLERY
        </button>
      )}
    </article>
  );
}

function SocialInfoCard() {
  return (
    <div className="bento-card bento-card-social bento-card-medium">
      <div className="bento-social-infinity">∞</div>
      <div className="bento-social-content">
        <h3 className="bento-social-headline">
          ONE STUDIO.
          <br />
          MANY STORIES.
        </h3>
        <p className="bento-social-categories">Property / Events / Weddings / Film</p>
      </div>
    </div>
  );
}

function CellRenderer({
  cell,
  onOpen,
  editorialText,
  editorialEyebrow,
  socialLinks,
  firstItem,
  priority = false,
}: {
  cell: BentoCell & { item?: ContentItem | null };
  onOpen: (item: ContentItem) => void;
  editorialText: string;
  editorialEyebrow?: string;
  socialLinks?: { instagram?: string; facebook?: string; youtube?: string };
  firstItem?: ContentItem | null;
  priority?: boolean;
}) {
  if (cell.kind === "content") {
    if (cell.item) {
      return (
        <BentoMediaCard
          item={cell.item}
          className={cell.className}
          onOpen={onOpen}
          priority={priority}
        />
      );
    }
    return <EmptySlot className={cell.className} />;
  }

  if (cell.type === "social-bar") {
    return (
      <SocialBar
        instagram={socialLinks?.instagram}
        facebook={socialLinks?.facebook}
        youtube={socialLinks?.youtube}
      />
    );
  }

  if (cell.type === "social-info") {
    return <SocialInfoCard />;
  }

  return (
    <EditorialCard
      text={editorialText}
      eyebrow={editorialEyebrow}
      onAction={() => firstItem && onOpen(firstItem)}
      showPlay={!editorialEyebrow}
    />
  );
}

export function BentoTemplate({
  items,
  pattern,
  editorialText,
  editorialEyebrow,
  onOpen,
  socialLinks,
  className = "",
}: {
  items: ContentItem[];
  pattern: BentoPattern;
  editorialText: string;
  editorialEyebrow?: string;
  onOpen: (item: ContentItem) => void;
  socialLinks?: { instagram?: string; facebook?: string; youtube?: string };
  className?: string;
}) {
  const columns = useBentoColumns(items, pattern);
  const firstItem =
    columns
      .flatMap((col) => col.cells)
      .filter((cell): cell is ContentSlot & { item: ContentItem } =>
        cell.kind === "content" && cell.item !== null && cell.item !== undefined
      )[0]?.item || null;

  return (
    <div className={`bento-board ${className}`}>
      {columns.map((column, columnIndex) => (
        <div
          key={column.id}
          className={`bento-col bento-col-${columnIndex % 2 === 0 ? "a" : "b"} bento-col-index-${columnIndex + 1}`}
        >
          {column.cells.map((cell, cellIndex) => (
            <CellRenderer
              key={cell.id}
              cell={cell}
              onOpen={onOpen}
              editorialText={editorialText}
              editorialEyebrow={editorialEyebrow}
              socialLinks={socialLinks}
              firstItem={firstItem}
              priority={columnIndex === 0 && cellIndex === 0}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
