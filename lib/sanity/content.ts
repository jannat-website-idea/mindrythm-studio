import {
  defaultContent,
  type ContentItem,
  type LegalPageContent,
  type ServiceContent,
  type SiteContent,
} from "@/lib/content";
import {sanityClient} from "@/lib/sanity/client";
import {siteContentQuery} from "@/lib/sanity/query";

type RawSanityContent = {
  siteSettings?: Record<string, unknown> | null;
  hero?: Record<string, unknown> | null;
  about?: Record<string, unknown> | null;
  contact?: Record<string, unknown> | null;
  social?: Record<string, unknown> | null;
  footer?: Record<string, unknown> | null;
  seo?: Record<string, unknown> | null;
  privacyPolicy?: LegalPageContent | null;
  termsConditions?: LegalPageContent | null;
  processBanner?: Record<string, unknown> | null;
  visualPortfolio?: Record<string, unknown> | null;
  services?: Array<Record<string, unknown>>;
  projects?: Array<Record<string, unknown>>;
  gallery?: Array<Record<string, unknown>>;
  team?: Array<Record<string, unknown>>;
  testimonials?: Array<Record<string, unknown>>;
};

const text = (value: unknown, fallback = "") => typeof value === "string" && value.trim() ? value : fallback;
const strings = (value: unknown, fallback: string[]) => Array.isArray(value) && value.every((item) => typeof item === "string") && value.length ? value : fallback;

function itemFromSanity(raw: Record<string, unknown>, kind: ContentItem["kind"], fallbackOrder: number): ContentItem | null {
  const rawId = text(raw.id, typeof raw._id === "string" ? raw._id : "");
  const title = text(raw.title, "Untitled");
  const id = rawId || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (!id) return null;

  return {
    id,
    kind,
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : fallbackOrder,
    title,
    eyebrow: text(raw.eyebrow),
    body: text(raw.body),
    mediaUrl: text(raw.mediaUrl),
    mediaAlt: text(raw.mediaAlt, title),
    category: text(raw.category, "Spaces"),
    mediaType: (text(raw.mediaType).toLowerCase() === "video" ? "video" : "image") as ContentItem["mediaType"],
    layoutType: text(raw.layoutType, "large") as ContentItem["layoutType"],
    year: text(raw.year),
    href: text(raw.href),
    accent: text(raw.accent, "forest"),
    services: Array.isArray(raw.services) ? raw.services.filter((s): s is string => typeof s === "string") : [],
  };
}

function legal(value: LegalPageContent | null | undefined, fallback: LegalPageContent): LegalPageContent {
  return value?.title && value.sections?.length ? value : fallback;
}

export async function getSanitySiteContent(options: {stega?: boolean} = {}): Promise<SiteContent | null> {
  try {
    const raw = (await sanityClient.fetch(siteContentQuery, {}, {
      stega: options.stega,
      perspective: "drafts",
      useCdn: false,
    })) as RawSanityContent;

    const hasContent = Boolean(raw.siteSettings || raw.hero || raw.projects?.length || raw.gallery?.length);
    if (!hasContent) return null;

    // Once Sanity responds, its collections are authoritative. This lets a client
    // remove the final item in any collection without local sample content returning.
    const projectItems =
      (raw.projects || []).map((item, index) => itemFromSanity(item, "project", index * 10)).filter((item): item is ContentItem => Boolean(item));
    const galleryItems =
      (raw.gallery || []).map((item, index) => itemFromSanity(item, "gallery", 300 + index * 10)).filter((item): item is ContentItem => Boolean(item));
    const teamItems =
      (raw.team || []).map((item, index) => itemFromSanity(item, "team", 500 + index * 10)).filter((item): item is ContentItem => Boolean(item));
    const testimonialItems =
      (raw.testimonials || []).map((item, index) => itemFromSanity(item, "testimonial", 700 + index * 10)).filter((item): item is ContentItem => Boolean(item));

    // Dynamic services: merges Sanity CMS edits onto official studio services
    const sanityServices = (raw.services || []).map((s) => ({
      key: text(s.key),
      title: text(s.title).replace(/^Premium\s+/i, ""),
      copy: text(s.copy),
      projectIds: Array.isArray(s.projectIds) ? s.projectIds.filter((p): p is string => typeof p === "string") : [],
      galleryItemIds: Array.isArray(s.galleryItemIds) ? s.galleryItemIds.filter((p): p is string => typeof p === "string") : [],
      websiteLinks: Array.isArray(s.websiteLinks)
        ? (s.websiteLinks as any[])
            .map((w) => ({ title: text(w?.title), url: text(w?.url) }))
            .filter((w) => Boolean(w.title && w.url))
        : undefined,
      logoImages: Array.isArray(s.logoImages)
        ? (s.logoImages as any[])
            .map((l) => ({ url: text(l?.url), alt: text(l?.alt), caption: text(l?.caption) }))
            .filter((l) => Boolean(l.url))
        : undefined,
    })).filter((s) => Boolean(s.key && s.title));

    const servicesMap = new Map(defaultContent.services.map((s) => [s.key, s]));
    for (const ss of sanityServices) {
      let targetKey = ss.key === "social-handling" ? "social-management" : ss.key;
      // Item 8: Normalize duplicate logo generation and aliases
      if (targetKey === "wellness" || ss.title.toLowerCase().includes("logo generation") || targetKey === "logo-generation") {
        targetKey = "logo-generation";
      }

      const existing = servicesMap.get(targetKey);
      if (existing) {
        servicesMap.set(targetKey, {
          ...existing,
          title: ss.title || existing.title,
          copy: ss.copy || existing.copy,
          projectIds: ss.projectIds.length ? ss.projectIds : existing.projectIds,
          galleryItemIds: ss.galleryItemIds.length ? ss.galleryItemIds : existing.galleryItemIds,
          websiteLinks: ss.websiteLinks?.length ? ss.websiteLinks : existing.websiteLinks,
          logoImages: ss.logoImages?.length ? ss.logoImages : existing.logoImages,
        });
      } else {
        servicesMap.set(targetKey, {
          key: targetKey as any,
          title: ss.title,
          copy: ss.copy,
          projectIds: ss.projectIds,
          galleryItemIds: ss.galleryItemIds,
          websiteLinks: ss.websiteLinks,
          logoImages: ss.logoImages,
        });
      }
    }

    // Strict deduplication by normalized key and title
    const seenKeys = new Set<string>();
    const seenTitles = new Set<string>();
    const services: ServiceContent[] = [];
    for (const s of servicesMap.values()) {
      const normKey = s.key.toLowerCase().trim();
      const normTitle = s.title.toLowerCase().trim();
      if (seenKeys.has(normKey) || seenTitles.has(normTitle)) continue;
      seenKeys.add(normKey);
      seenTitles.add(normTitle);
      services.push(s);
    }

    return {
      settings: {
        ...defaultContent.settings,
        ...(raw.siteSettings || {}),
        contactEmail: text(raw.contact?.email, defaultContent.settings.contactEmail),
        phonePrimary: text(raw.contact?.phonePrimary, defaultContent.settings.phonePrimary),
        phoneSecondary: text(raw.contact?.phoneSecondary, defaultContent.settings.phoneSecondary),
        address: text(raw.contact?.address, defaultContent.settings.address),
        instagram: text(raw.social?.instagram, defaultContent.settings.instagram),
        facebook: text(raw.social?.facebook, defaultContent.settings.facebook),
        youtube: text(raw.social?.youtube, defaultContent.settings.youtube),
        vimeo: text(raw.social?.vimeo, defaultContent.settings.vimeo),
        linkedin: text(raw.social?.linkedin, defaultContent.settings.linkedin),
        x: text(raw.social?.x, defaultContent.settings.x),
      },
      items: [...projectItems, ...galleryItems, ...teamItems, ...testimonialItems],
      hero: {
        titleLineOne: text(raw.hero?.titleLineOne, defaultContent.hero.titleLineOne),
        titleLineTwo: text(raw.hero?.titleLineTwo, defaultContent.hero.titleLineTwo),
        featuredProjectIds: strings(raw.hero?.featuredProjectIds, defaultContent.hero.featuredProjectIds),
        visionHighlights: strings(raw.hero?.visionHighlights, defaultContent.hero.visionHighlights),
      },
      copy: {
        visionParagraphs: strings(raw.about?.visionParagraphs, defaultContent.copy.visionParagraphs),
        missionParagraphs: strings(raw.about?.missionParagraphs, defaultContent.copy.missionParagraphs),
        brandTaglines: strings(raw.about?.brandTaglines, defaultContent.copy.brandTaglines),
        enquiryTaglines: strings(raw.about?.enquiryTaglines, defaultContent.copy.enquiryTaglines),
        teamIntroduction: text(raw.about?.teamIntroduction, defaultContent.copy.teamIntroduction),
        visionBridgeImages: Array.isArray(raw.about?.visionBridgeImages)
          ? (raw.about?.visionBridgeImages as any[]).filter((u): u is string => typeof u === "string" && Boolean(u))
          : undefined,
        processBanner: (() => {
          const pb = raw.processBanner || raw.about?.processBanner;
          if (pb && typeof (pb as any).mediaUrl === "string" && (pb as any).mediaUrl.trim()) {
            return {
              mediaUrl: text((pb as any).mediaUrl),
              mediaType: text((pb as any).mediaType, "image"),
              overlayBadge: text((pb as any).overlayBadge, "Brief / Plan / Capture"),
              overlayText: text((pb as any).overlayText, "A calm production gives spaces, people and real emotion room to lead."),
              ctaLabel: text((pb as any).ctaLabel, "View our work"),
              linkUrl: text((pb as any).linkUrl, "/work"),
            };
          }
          return undefined;
        })(),
      },
      visualPortfolio: (() => {
        const vp = raw.visualPortfolio;
        if (!vp) return defaultContent.visualPortfolio;
        const rawItems = Array.isArray((vp as any).items) ? (vp as any).items : [];
        const mappedItems = rawItems
          .map((item: any, index: number) => {
            const title = text(item.title);
            if (!title) return null;
            return {
              id: text(item.id, `visual-story-${index}`),
              title,
              eyebrow: text(item.eyebrow),
              category: text(item.category),
              body: text(item.body),
              mediaUrl: text(item.mediaUrl),
              mediaAlt: text(item.mediaAlt, title),
              mediaType: (text(item.mediaType).toLowerCase() === "video" ? "video" : "image") as any,
              href: text(item.href, "/work"),
            };
          })
          .filter(Boolean);

        return {
          sectionTitle: text((vp as any).sectionTitle, defaultContent.visualPortfolio?.sectionTitle || "Scroll through the visual portfolio"),
          tagline: text((vp as any).tagline, defaultContent.visualPortfolio?.tagline || "Selected stories / 2026"),
          items: mappedItems.length ? mappedItems : defaultContent.visualPortfolio?.items,
        };
      })(),
      services,
      footer: {
        callout: text(raw.footer?.callout, defaultContent.footer.callout),
        actionLabel: text(raw.footer?.actionLabel, defaultContent.footer.actionLabel),
        locationLabel: text(raw.footer?.locationLabel, defaultContent.footer.locationLabel),
        studioUrl: text(raw.footer?.studioUrl, defaultContent.footer.studioUrl),
      },
      seo: {
        title: text(raw.seo?.title, defaultContent.seo.title),
        description: text(raw.seo?.description, defaultContent.seo.description),
        shareImageUrl: text(raw.seo?.shareImageUrl, defaultContent.seo.shareImageUrl),
      },
      privacyPolicy: legal(raw.privacyPolicy, defaultContent.privacyPolicy),
      termsConditions: legal(raw.termsConditions, defaultContent.termsConditions),
    };
  } catch {
    return null;
  }
}
