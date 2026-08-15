"use client";

import { defaultItems, type ContentItem } from "@/lib/content";
import { Media } from "@/app/media";
import { SocialIcon } from "@/app/social-icon";

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

  const slot1 = displayItems[0]; // Col 1 Top (Short)
  const slot2 = displayItems[1]; // Col 2 Top (Tall)
  const slot3 = displayItems[2]; // Col 3 Top (Short)
  const slot4 = displayItems[3]; // Col 1 Bottom (Tall / Split with bar)
  const slot5 = displayItems[4]; // Col 3 Bottom (Tall)
  const slot6 = displayItems[5]; // Col 4 Bottom (Short)
  const slot7 = displayItems[6]; // Col 2 Bottom (Short)

  const extraMedia = displayItems.slice(7);
  const additionalGroups: ContentItem[][] = [];
  for (let i = 0; i < extraMedia.length; i += 8) {
    additionalGroups.push(extraMedia.slice(i, i + 8));
  }

  const defaultInstagram = "https://www.instagram.com/mindrythm";
  const defaultFacebook = "https://www.facebook.com/mindrythm";
  const defaultYoutube = "https://www.youtube.com/@mindrythm";

  return (
    <div className="bento-stream">
      {/* Primary Bento Board (Exact match to reference layout) */}
      <div className={`bento-board ${showSocialCard ? "bento-board-home" : ""}`}>
        {/* Column 1: Top Photo + Social Bar + Bottom Photo */}
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
          {showSocialCard && (
            <div className="bento-card bento-card-social-bar" aria-label="Mindrythm social media">
              <a href={socialLinks?.instagram || defaultInstagram} target="_blank" rel="noreferrer" aria-label="Instagram"><SocialIcon name="instagram" /></a>
              <a href={socialLinks?.facebook || defaultFacebook} target="_blank" rel="noreferrer" aria-label="Facebook"><SocialIcon name="facebook" /></a>
              <a href={socialLinks?.youtube || defaultYoutube} target="_blank" rel="noreferrer" aria-label="YouTube"><SocialIcon name="youtube" /></a>
            </div>
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

        {/* Column 2: Tall Top + Short Bottom */}
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

        {/* Column 3: Short Top + Tall Bottom */}
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

        {/* Column 4: Editorial Top + Social/Short Bottom */}
        <div className="bento-col bento-col-b">
          {showSocialCard ? (
            <>
              {/* Editorial quote card */}
              <article className="bento-card bento-card-editorial">
                <span className="bento-editorial-eyebrow">Our Approach</span>
                <p className="bento-editorial-statement">
                  &ldquo;Every place and every celebration begins with a feeling. Our work is to make it visible.&rdquo;
                </p>
                <button
                  type="button"
                  className="bento-editorial-link bento-editorial-play"
                  onClick={() => slot1 && onOpen(slot1)}
                  aria-label="Play reel"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="3"/><line x1="9" y1="2" x2="9" y2="22"/><line x1="15" y1="2" x2="15" y2="22"/></svg>
                </button>
              </article>

              {/* Social media + infinity card */}
              <div className="bento-card bento-card-social">
                <div className="bento-social-infinity">∞</div>
                <div className="bento-social-content">
                  <h3 className="bento-social-headline">One Studio.<br />Many Stories.</h3>
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
            </>
          )}
        </div>
      </div>

      {/* Subsequent Bento Boards for extra media beyond 7 (gallery page) */}
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
