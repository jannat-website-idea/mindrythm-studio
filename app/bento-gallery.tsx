"use client";

import { defaultItems, type ContentItem } from "@/lib/content";
import { Media } from "@/app/media";

export function BentoGalleryGrid({
  items,
  editorialText,
  onOpen,
}: {
  items: ContentItem[];
  editorialText: string;
  editorialEyebrow?: string;
  onOpen: (item: ContentItem) => void;
}) {
  const isCelebrations = editorialText.toUpperCase().includes("WEDDING") || editorialText.toUpperCase().includes("CELEBRATION");
  
  const fallbackSpaces = defaultItems.filter(
    (i) => i.kind === "gallery" && i.category?.toLowerCase() === "spaces"
  );
  const fallbackCelebrations = defaultItems.filter(
    (i) => i.kind === "gallery" && i.category?.toLowerCase() === "celebrations"
  );
  const fallbackPool = isCelebrations
    ? (fallbackCelebrations.length ? fallbackCelebrations : defaultItems)
    : (fallbackSpaces.length ? fallbackSpaces : defaultItems);

  // Guarantee at least 7 filled slots for the primary bento
  const pool = items.length ? items : fallbackPool;
  const displayItems = [...pool];
  let fallbackIndex = 0;
  while (displayItems.length < 7 && fallbackPool.length > 0) {
    const candidate = fallbackPool[fallbackIndex % fallbackPool.length];
    if (!displayItems.some((d) => d.id === candidate.id)) {
      displayItems.push(candidate);
    } else {
      displayItems.push({ ...candidate, id: `${candidate.id}-fallback-${displayItems.length}` });
    }
    fallbackIndex++;
  }

  const slot1 = displayItems[0]; // Col 1 Top (Short - Minimal Elegance)
  const slot2 = displayItems[1]; // Col 2 Top (Tall - Soft Details)
  const slot3 = displayItems[2]; // Col 3 Top (Short - Hand-painted Murals)
  const slot4 = displayItems[3]; // Col 1 Bottom (Tall - Wellness Redefined)
  const slot5 = displayItems[4]; // Col 3 Bottom (Tall - Minimal Living)
  const slot6 = displayItems[5]; // Col 4 Bottom (Short - Warm Natural Interiors)
  const slot7 = displayItems[6]; // Col 2 Bottom (Short - Arambol)

  const extraMedia = displayItems.slice(7);
  const additionalGroups: ContentItem[][] = [];
  for (let i = 0; i < extraMedia.length; i += 8) {
    additionalGroups.push(extraMedia.slice(i, i + 8));
  }

  return (
    <div className="bento-stream">
      {/* Primary Bento Board (100% exact match to reference screenshot) */}
      <div className="bento-board">
        {/* Column 1: Short Top (Minimal Elegance) + Tall Bottom (Wellness Redefined) */}
        <div className="bento-col bento-col-a">
          {slot1 && (
            <button
              type="button"
              className="bento-card bento-card-short"
              onClick={() => onOpen(slot1)}
              aria-label={`Open ${slot1.title}`}
            >
              <Media item={slot1} priority />
              <span className="bento-badge">{slot1.title}</span>
            </button>
          )}
          {slot4 && (
            <button
              type="button"
              className="bento-card bento-card-tall"
              onClick={() => onOpen(slot4)}
              aria-label={`Open ${slot4.title}`}
            >
              <Media item={slot4} />
              <span className="bento-badge">{slot4.title}</span>
            </button>
          )}
        </div>

        {/* Column 2: Tall Top (Soft Details) + Short Bottom (Arambol) */}
        <div className="bento-col bento-col-b">
          {slot2 && (
            <button
              type="button"
              className="bento-card bento-card-tall"
              onClick={() => onOpen(slot2)}
              aria-label={`Open ${slot2.title}`}
            >
              <Media item={slot2} priority />
              <span className="bento-badge">{slot2.title}</span>
            </button>
          )}
          {slot7 && (
            <button
              type="button"
              className="bento-card bento-card-short"
              onClick={() => onOpen(slot7)}
              aria-label={`Open ${slot7.title}`}
            >
              <Media item={slot7} />
              <span className="bento-badge">{slot7.title}</span>
            </button>
          )}
        </div>

        {/* Column 3: Short Top (Hand-painted Murals) + Tall Bottom (Minimal Living) */}
        <div className="bento-col bento-col-a">
          {slot3 && (
            <button
              type="button"
              className="bento-card bento-card-short"
              onClick={() => onOpen(slot3)}
              aria-label={`Open ${slot3.title}`}
            >
              <Media item={slot3} priority />
              <span className="bento-badge">{slot3.title}</span>
            </button>
          )}
          {slot5 && (
            <button
              type="button"
              className="bento-card bento-card-tall"
              onClick={() => onOpen(slot5)}
              aria-label={`Open ${slot5.title}`}
            >
              <Media item={slot5} />
              <span className="bento-badge">{slot5.title}</span>
            </button>
          )}
        </div>

        {/* Column 4: Tall Top (Editorial Card) + Short Bottom (Warm Natural Interiors) */}
        <div className="bento-col bento-col-b">
          <article className="bento-card bento-card-editorial">
            <p className="bento-editorial-statement">{editorialText}</p>
            <button
              type="button"
              className="bento-editorial-link"
              onClick={() => slot1 && onOpen(slot1)}
            >
              OPEN THE FULL GALLERY
            </button>
          </article>
          {slot6 && (
            <button
              type="button"
              className="bento-card bento-card-short"
              onClick={() => onOpen(slot6)}
              aria-label={`Open ${slot6.title}`}
            >
              <Media item={slot6} />
              <span className="bento-badge">{slot6.title}</span>
            </button>
          )}
        </div>
      </div>

      {/* Subsequent Bento Boards for extra media beyond 7 */}
      {additionalGroups.map((group, groupIdx) => (
        <div className="bento-board bento-board-subsequent" key={`extra-group-${groupIdx + 2}`}>
          <div className="bento-col bento-col-a">
            {group[0] && (
              <button type="button" className="bento-card bento-card-short" onClick={() => onOpen(group[0])}>
                <Media item={group[0]} />
                <span className="bento-badge">{group[0].title}</span>
              </button>
            )}
            {group[4] && (
              <button type="button" className="bento-card bento-card-tall" onClick={() => onOpen(group[4])}>
                <Media item={group[4]} />
                <span className="bento-badge">{group[4].title}</span>
              </button>
            )}
          </div>
          <div className="bento-col bento-col-b">
            {group[1] && (
              <button type="button" className="bento-card bento-card-tall" onClick={() => onOpen(group[1])}>
                <Media item={group[1]} />
                <span className="bento-badge">{group[1].title}</span>
              </button>
            )}
            {group[5] && (
              <button type="button" className="bento-card bento-card-short" onClick={() => onOpen(group[5])}>
                <Media item={group[5]} />
                <span className="bento-badge">{group[5].title}</span>
              </button>
            )}
          </div>
          <div className="bento-col bento-col-a">
            {group[2] && (
              <button type="button" className="bento-card bento-card-short" onClick={() => onOpen(group[2])}>
                <Media item={group[2]} />
                <span className="bento-badge">{group[2].title}</span>
              </button>
            )}
            {group[6] && (
              <button type="button" className="bento-card bento-card-tall" onClick={() => onOpen(group[6])}>
                <Media item={group[6]} />
                <span className="bento-badge">{group[6].title}</span>
              </button>
            )}
          </div>
          <div className="bento-col bento-col-b">
            {group[3] && (
              <button type="button" className="bento-card bento-card-tall" onClick={() => onOpen(group[3])}>
                <Media item={group[3]} />
                <span className="bento-badge">{group[3].title}</span>
              </button>
            )}
            {group[7] && (
              <button type="button" className="bento-card bento-card-short" onClick={() => onOpen(group[7])}>
                <Media item={group[7]} />
                <span className="bento-badge">{group[7].title}</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
