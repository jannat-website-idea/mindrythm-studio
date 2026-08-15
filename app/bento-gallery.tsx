"use client";

import { type ContentItem } from "@/lib/content";
import { BentoTemplate, type BentoPattern } from "@/app/bento-template";

export function BentoGalleryGrid({
  items,
  editorialText,
  editorialEyebrow,
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
  const pattern: BentoPattern = showSocialCard ? "home" : "gallery";
  return (
    <div className="bento-stream">
      <BentoTemplate
        items={items}
        pattern={pattern}
        editorialText={editorialText}
        editorialEyebrow={editorialEyebrow}
        onOpen={onOpen}
        socialLinks={socialLinks}
        className={showSocialCard ? "bento-board-home" : ""}
      />
    </div>
  );
}
