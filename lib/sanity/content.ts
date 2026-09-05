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
  };
}

function legal(value: LegalPageContent | null | undefined, fallback: LegalPageContent): LegalPageContent {
  return value?.title && value.sections?.length ? value : fallback;
}

export async function getSanitySiteContent(options: {stega?: boolean} = {}): Promise<SiteContent | null> {
  try {
    const raw = (await sanityClient.fetch(siteContentQuery, {}, {
      stega: options.stega,
      perspective: "published",
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
      title: text(s.title),
      copy: text(s.copy),
      projectIds: Array.isArray(s.projectIds) ? s.projectIds.filter((p): p is string => typeof p === "string") : [],
    })).filter((s) => Boolean(s.key && s.title));

    const servicesMap = new Map(defaultContent.services.map((s) => [s.key, s]));
    for (const ss of sanityServices) {
      const targetKey = ss.key === "social-handling" ? "social-management" : ss.key;
      const existing = servicesMap.get(targetKey);
      if (existing) {
        servicesMap.set(targetKey, {
          ...existing,
          title: ss.title || existing.title,
          copy: ss.copy || existing.copy,
          projectIds: ss.projectIds.length ? ss.projectIds : existing.projectIds,
        });
      } else {
        servicesMap.set(targetKey, {
          key: targetKey as any,
          title: ss.title,
          copy: ss.copy,
          projectIds: ss.projectIds,
        });
      }
    }
    const services = Array.from(servicesMap.values());

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
      },
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
