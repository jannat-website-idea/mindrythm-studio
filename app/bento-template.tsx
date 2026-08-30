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
  item?: ContentItem | null;
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
        { id: "gallery-large-04", kind: "content", layoutType: "large", className: "bento-card-large" },
        { id: "gallery-medium-04", kind: "content", layoutType: "medium", className: "bento-card-medium" },
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

function useBentoInstances(items: ContentItem[], pattern: BentoPattern): ColumnDef[][] {
  return useMemo(() => {
    const sorted = [...items].sort((a, b) => (a.sortOrder ?? 100) - (b.sortOrder ?? 100));
    const baseColumns = PATTERNS[pattern];

    // Determine the content slot count defined by the existing Bento pattern
    const slotCount = baseColumns.reduce(
      (count, col) => count + col.cells.filter((cell) => cell.kind === "content").length,
      0
    );

    if (slotCount === 0 || sorted.length === 0) {
      return [];
    }

    // Split items into chunks matching the slotCount of the Bento pattern
    const chunks: ContentItem[][] = [];
    for (let i = 0; i < sorted.length; i += slotCount) {
      chunks.push(sorted.slice(i, i + slotCount));
    }

    // Order content slots row-first across the 4 columns for balanced visual distribution
    interface SlotRef {
      colIndex: number;
      cellIndex: number;
      cell: ContentSlot;
    }
    const contentSlots: SlotRef[] = [];
    const maxCells = Math.max(...baseColumns.map((c) => c.cells.length));
    for (let r = 0; r < maxCells; r++) {
      for (let c = 0; c < baseColumns.length; c++) {
        const cell = baseColumns[c].cells[r];
        if (cell && cell.kind === "content") {
          contentSlots.push({ colIndex: c, cellIndex: r, cell });
        }
      }
    }

    return chunks.map((chunk, instanceIndex) => {
      const pool = [...chunk];
      const assigned = new Map<string, ContentItem | null>();

      for (const slot of contentSlots) {
        const matchIdx = pool.findIndex(
          (it) => (it.layoutType === "small" || it.layoutType === "medium" ? "medium" : "large") === slot.cell.layoutType
        );
        const chosen = matchIdx >= 0 ? pool.splice(matchIdx, 1)[0] : pool.shift();
        assigned.set(`${slot.colIndex}-${slot.cellIndex}`, chosen || null);
      }

      return baseColumns.map((col, colIndex) => ({
        id: `${col.id}-inst-${instanceIndex}`,
        cells: col.cells
          .map((cell, cellIndex) => {
            if (cell.kind !== "content") {
              // Static cards only appear on the first instance if repeating
              if (instanceIndex > 0) return null;
              return {
                ...cell,
                id: `${cell.id}-inst-${instanceIndex}-${cellIndex}`,
              };
            }

            const item = assigned.get(`${colIndex}-${cellIndex}`) || null;
            if (!item) {
              return {
                ...cell,
                id: `${cell.id}-inst-${instanceIndex}-${cellIndex}-empty`,
                item: null,
              };
            }
            return {
              ...cell,
              id: `${cell.id}-inst-${instanceIndex}-${cellIndex}`,
              item,
            };
          })
          .filter(Boolean) as (BentoCell & { item?: ContentItem | null })[],
      })).filter((col) => col.cells.some((c) => c.kind !== "content" || c.item !== null));
    });
  }, [items, pattern]);
}

function EmptySlot({ className }: { className?: string }) {
  return <div className={`bento-card bento-card-empty ${className || ""}`} aria-hidden="true" />;
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
  editorialText = "",
  editorialEyebrow,
  socialLinks,
  firstItem,
  priority = false,
}: {
  cell: BentoCell & { item?: ContentItem | null };
  onOpen: (item: ContentItem) => void;
  editorialText?: string;
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
  editorialText?: string;
  editorialEyebrow?: string;
  onOpen: (item: ContentItem) => void;
  socialLinks?: { instagram?: string; facebook?: string; youtube?: string };
  className?: string;
}) {
  const instances = useBentoInstances(items, pattern);
  const firstItem =
    instances[0]
      ?.flatMap((col) => col.cells)
      .filter((cell): cell is ContentSlot & { item: ContentItem } =>
        cell.kind === "content" && cell.item !== null && cell.item !== undefined
      )[0]?.item || null;

  return (
    <div className={`bento-stream ${className}`}>
      {instances.map((columns, instanceIndex) => (
        <div
          key={`bento-board-inst-${instanceIndex}`}
          className={`bento-board ${className}`}
        >
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
                  priority={instanceIndex === 0 && columnIndex === 0 && cellIndex === 0}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
