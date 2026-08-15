"use client";

import { defaultItems, type ContentItem } from "@/lib/content";
import { Media } from "@/app/media";
import { SocialIcon } from "@/app/social-icon";

function BentoCardItem({
  item,
  onOpen,
  className,
  priority = false,
}: {
  item: ContentItem;
  onOpen: (item: ContentItem) => void;
  className: string;
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
      {item.category && (
        <span className="bento-badge-tag">{item.category}</span>
      )}
      <div className="bento-card-gradient">
        {item.eyebrow && <span className="bento-item-eyebrow">{item.eyebrow}</span>}
        <h3 className="bento-item-title">{item.title}</h3>
      </div>
    </button>
  );
}

export function BentoGalleryGrid({
  items,
  editorialText,
  onOpen,
  showSocialCard = false,
  socialLinks,
}: {
  items: ContentItem[];
  editorialText: string;
  editorialEyebrow?: string;
  onOpen: (item: ContentItem) => void;
  showSocialCard?: boolean;
  socialLinks?: { instagram?: string; facebook?: string; youtube?: string };
}) {
  const fallbackSpaces = defaultItems.filter(
    (i) => i.kind === "gallery" && (i.category?.toLowerCase().includes("space") || i.category?.toLowerCase().includes("film") || i.category?.toLowerCase().includes("photography") || i.category?.toLowerCase().includes("ritual"))
  );
  const fallbackPool = fallbackSpaces.length ? fallbackSpaces : defaultItems;

  // Fill display slots
  const pool = items.length ? items : fallbackPool;
  const displayItems = [...pool];
  let fallbackIndex = 0;
  while (displayItems.length < 6 && fallbackPool.length > 0) {
    const candidate = fallbackPool[fallbackIndex % fallbackPool.length];
    if (!displayItems.some((d) => d.id === candidate.id)) {
      displayItems.push(candidate);
    } else {
      displayItems.push({ ...candidate, id: `${candidate.id}-fallback-${displayItems.length}` });
    }
    fallbackIndex++;
  }

  // Exact 6 slots matching reference Screenshot 2:
  // Slot 1: Col 1 Top (Svabodha Wellness)
  // Slot 2: Col 2 Top (Elegant Interiors - Tall)
  // Slot 3: Col 3 Top (A Guided Pause - Short)
  // Slot 4: Col 1 Bottom (Hands of Stillness - Tall)
  // Slot 5: Col 3 Bottom (A Garden Promise - Tall)
  // Slot 6: Col 2 Bottom (Earth & Stillness - Short)
  const slot1 = displayItems[0];
  const slot2 = displayItems[1];
  const slot3 = displayItems[2];
  const slot4 = displayItems[3];
  const slot5 = displayItems[4];
  const slot6 = displayItems[5];

  const extraMedia = displayItems.slice(6);
  const additionalGroups: ContentItem[][] = [];
  for (let i = 0; i < extraMedia.length; i += 8) {
    additionalGroups.push(extraMedia.slice(i, i + 8));
  }

  const defaultInstagram = "https://www.instagram.com/mindrythm";
  const defaultFacebook = "https://www.facebook.com/mindrythm";
  const defaultYoutube = "https://www.youtube.com/@mindrythm";

  return (
    <div className="bento-stream">
      {/* Primary Bento Board (100% exact match to Reference Screenshot 2) */}
      <div className={`bento-board ${showSocialCard ? "bento-board-home" : ""}`}>
        {/* Column 1: Top Photo (Svabodha) + Social Bar + Bottom Photo (Hands of Stillness) */}
        <div className="bento-col bento-col-a">
          {slot1 && (
            <BentoCardItem
              item={slot1}
              onOpen={onOpen}
              className="bento-card-short"
              priority
            />
          )}

          {showSocialCard && (
            <div className="bento-card bento-card-social-bar" aria-label="Mindrythm social media">
              <a href={socialLinks?.instagram || defaultInstagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="social-pill-link">
                <SocialIcon name="instagram" />
              </a>
              <a href={socialLinks?.facebook || defaultFacebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="social-pill-link">
                <SocialIcon name="facebook" />
              </a>
              <a href={socialLinks?.youtube || defaultYoutube} target="_blank" rel="noreferrer" aria-label="YouTube" className="social-pill-link">
                <SocialIcon name="youtube" />
              </a>
            </div>
          )}

          {slot4 && (
            <BentoCardItem
              item={slot4}
              onOpen={onOpen}
              className="bento-card-tall"
            />
          )}
        </div>

        {/* Column 2: Top Tall (Elegant Interiors) + Bottom Short (Earth & Stillness) */}
        <div className="bento-col bento-col-b">
          {slot2 && (
            <BentoCardItem
              item={slot2}
              onOpen={onOpen}
              className="bento-card-tall"
              priority
            />
          )}
          {slot6 && (
            <BentoCardItem
              item={slot6}
              onOpen={onOpen}
              className="bento-card-short"
            />
          )}
        </div>

        {/* Column 3: Top Short (A Guided Pause) + Bottom Tall (A Garden Promise) */}
        <div className="bento-col bento-col-a">
          {slot3 && (
            <BentoCardItem
              item={slot3}
              onOpen={onOpen}
              className="bento-card-short"
              priority
            />
          )}
          {slot5 && (
            <BentoCardItem
              item={slot5}
              onOpen={onOpen}
              className="bento-card-tall"
            />
          )}
        </div>

        {/* Column 4: Top Editorial Card + Bottom Cream Social/Directory Card */}
        <div className="bento-col bento-col-b">
          {showSocialCard ? (
            <>
              {/* Editorial Quote Card */}
              <article className="bento-card bento-card-editorial">
                <span className="bento-editorial-eyebrow">Our Approach</span>
                <p className="bento-editorial-statement">
                  &ldquo;EVERY PLACE AND EVERY CELEBRATION BEGINS WITH A FEELING. OUR WORK IS TO MAKE IT VISIBLE.&rdquo;
                </p>
                <button
                  type="button"
                  className="bento-editorial-link bento-editorial-play"
                  onClick={() => slot1 && onOpen(slot1)}
                  aria-label="Play reel"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
              </article>

              {/* One Studio. Many Stories. Cream Card */}
              <div className="bento-card bento-card-social">
                <div className="bento-social-infinity">∞</div>
                <div className="bento-social-content">
                  <h3 className="bento-social-headline">ONE STUDIO.<br />MANY STORIES.</h3>
                  <p className="bento-social-categories">Property / Events / Weddings / Film</p>
                </div>
              </div>
            </>
          ) : (
            <>
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
                <BentoCardItem
                  item={slot6}
                  onOpen={onOpen}
                  className="bento-card-short"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Subsequent Bento Boards for extra media beyond 6 */}
      {!showSocialCard && additionalGroups.map((group, groupIdx) => (
        <div className="bento-board bento-board-subsequent" key={`extra-group-${groupIdx + 2}`}>
          <div className="bento-col bento-col-a">
            {group[0] && <BentoCardItem item={group[0]} onOpen={onOpen} className="bento-card-short" />}
            {group[4] && <BentoCardItem item={group[4]} onOpen={onOpen} className="bento-card-tall" />}
          </div>
          <div className="bento-col bento-col-b">
            {group[1] && <BentoCardItem item={group[1]} onOpen={onOpen} className="bento-card-tall" />}
            {group[5] && <BentoCardItem item={group[5]} onOpen={onOpen} className="bento-card-short" />}
          </div>
          <div className="bento-col bento-col-a">
            {group[2] && <BentoCardItem item={group[2]} onOpen={onOpen} className="bento-card-short" />}
            {group[6] && <BentoCardItem item={group[6]} onOpen={onOpen} className="bento-card-tall" />}
          </div>
          <div className="bento-col bento-col-b">
            {group[3] && <BentoCardItem item={group[3]} onOpen={onOpen} className="bento-card-tall" />}
            {group[7] && <BentoCardItem item={group[7]} onOpen={onOpen} className="bento-card-short" />}
          </div>
        </div>
      ))}
    </div>
  );
}
