import { defaultServices, type ContentItem, type ServiceContent } from "@/lib/content";

export type ServiceKey = string;

export type ServiceDefinition = ServiceContent;
export const serviceItems: readonly ServiceDefinition[] = defaultServices;

export function isServiceKey(value: string | null, services: readonly ServiceDefinition[] = serviceItems): value is ServiceKey {
  return services.some((service) => service.key === value);
}

export function isVisualOrDroneService(key: string): boolean {
  if (!key) return false;
  const k = key.toLowerCase().trim();
  return (
    k === "visual-production" ||
    k === "drone-imagery" ||
    k === "property" ||
    k === "events" ||
    k.includes("visual") ||
    k.includes("drone") ||
    k.includes("aerial")
  );
}

export const SERVICE_META: Record<string, { discipline: string; highlights: string[] }> = {
  "visual-production": { discipline: "Cinema & Stills", highlights: ["Luxury Properties", "Cinematic Film", "Fine-Art Stills", "Color Grading"] },
  "drone-imagery": { discipline: "Aerial Perspective", highlights: ["4K Drone Footage", "Topographic Scale", "Architectural Angles", "FPV Flythroughs"] },
  "web-development": { discipline: "Digital Infrastructure", highlights: ["Bespoke Web Design", "Next.js Architecture", "CMS Integration", "Interactive UI"] },
  "logo-generation": { discipline: "Brand Identity", highlights: ["Brand Emblems", "Vector Systems", "Typography Design", "Brand Guidelines"] },
  "meta-ads": { discipline: "Performance Growth", highlights: ["Audience Targeting", "Creative Campaigns", "Conversion Optimization", "ROI Analytics"] },
  "social-management": { discipline: "Community Cadence", highlights: ["Strategic Scheduling", "Visual Cohesion", "Audience Engagement", "Copywriting"] },
  "commercial-branding": { discipline: "Commercial Strategy", highlights: ["Brand Architecture", "Positioning Strategy", "Visual Toolkits", "Brand Guidelines"] },
  "social-creatives": { discipline: "Content Creation", highlights: ["Short-Form Video", "Editorial Carousels", "Motion Graphics", "Brand Assets"] },
};

export function getServiceMeta(service: ServiceContent): { discipline: string; highlights: string[]; deliverables: string[]; details?: string } {
  const fallback = SERVICE_META[service.key] || {
    discipline: "Studio Discipline",
    highlights: ["Bespoke Creative", "Calm Production", "High-End Standards"],
  };

  return {
    discipline: service.discipline?.trim() || fallback.discipline,
    highlights: service.highlights && service.highlights.length > 0 ? service.highlights : fallback.highlights,
    deliverables: service.deliverables && service.deliverables.length > 0 ? service.deliverables : [],
    details: service.details,
  };
}

export function getServiceProjects(projects: ContentItem[], key: ServiceKey, services: readonly ServiceDefinition[] = serviceItems): ContentItem[] {
  const service = services.find((item) => item.key === key);
  if (!service) return [];

  // ONLY Visual Production & Drone Imagery show images / project media
  if (!isVisualOrDroneService(key)) {
    return [];
  }

  // 1. Projects where this service was explicitly selected in CMS
  const taggedMatches = projects.filter((project) =>
    Array.isArray(project.services) && project.services.includes(key)
  );
  if (taggedMatches.length > 0) return taggedMatches;

  // 2. Direct projectIds defined on the service
  const directMatches = (service.projectIds || [])
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is ContentItem => Boolean(project));

  if (directMatches.length > 0) return directMatches;

  // 3. Category & keyword matching based on service key
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("drone") || lowerKey.includes("aerial")) {
    const droneMatches = projects.filter((project) => {
      const cat = (project.category || "").toLowerCase();
      const title = (project.title || "").toLowerCase();
      return cat.includes("aerial") || title.includes("resort") || title.includes("pool") || cat.includes("events");
    });
    if (droneMatches.length > 0) return droneMatches;
  }

  return projects.slice(0, 4);
}

export function getProjectService(project: ContentItem, services: readonly ServiceDefinition[] = serviceItems): ServiceKey | null {
  const direct = services.find((service) => (service.projectIds || []).includes(project.id));
  if (direct) return direct.key;

  const cat = (project.category || "").toLowerCase();
  const eyebrow = (project.eyebrow || "").toLowerCase();
  const matched = services.find((service) => {
    const keyMatch = cat.includes(service.key.replace(/-/g, " "));
    const titleMatch = service.title.toLowerCase().includes(cat) || (cat.length > 3 && service.title.toLowerCase().includes(cat));
    return keyMatch || titleMatch;
  });

  return matched?.key ?? (services[0]?.key || null);
}

export function getServiceGalleryItems(
  gallery: ContentItem[],
  key: ServiceKey,
  services: readonly ServiceDefinition[] = serviceItems
): ContentItem[] {
  const service = services.find((item) => item.key === key);
  if (!service) return [];

  // ONLY visual-production and drone-imagery have a mini-gallery (items 1 & 2 in client brief)
  const isVisualOrDrone = key === "visual-production" || key === "drone-imagery";
  if (!isVisualOrDrone && (!service.galleryItemIds || service.galleryItemIds.length === 0)) {
    return [];
  }

  // 1. Direct matches if client selected gallery items in Sanity CMS
  if (service.galleryItemIds && service.galleryItemIds.length > 0) {
    const directMatches = service.galleryItemIds
      .map((id) => gallery.find((item) => item.id === id))
      .filter((item): item is ContentItem => Boolean(item));
    if (directMatches.length > 0) return directMatches.slice(0, 6);
  }

  // 2. Intelligent category/keyword matching based on service key
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("drone") || lowerKey.includes("aerial")) {
    const aerialMatches = gallery.filter((item) => {
      const cat = (item.category || "").toLowerCase();
      const title = (item.title || "").toLowerCase();
      return cat.includes("aerial") || title.includes("pool") || title.includes("villa") || title.includes("aerial");
    });
    if (aerialMatches.length > 0) return aerialMatches.slice(0, 6);
  }

  if (lowerKey.includes("visual") || lowerKey.includes("production") || lowerKey.includes("photo") || lowerKey.includes("video")) {
    const visualMatches = gallery.filter((item) => {
      const cat = (item.category || "").toLowerCase();
      return cat.includes("spaces") || cat.includes("interiors") || cat.includes("celebrations") || item.mediaType === "video";
    });
    if (visualMatches.length > 0) return visualMatches.slice(0, 6);
  }

  return [];
}

