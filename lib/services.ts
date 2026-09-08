import { defaultServices, type ContentItem, type ServiceContent } from "@/lib/content";

export type ServiceKey = string;

export type ServiceDefinition = ServiceContent;
export const serviceItems: readonly ServiceDefinition[] = defaultServices;

export function isServiceKey(value: string | null, services: readonly ServiceDefinition[] = serviceItems): value is ServiceKey {
  return services.some((service) => service.key === value);
}

export function getServiceProjects(projects: ContentItem[], key: ServiceKey, services: readonly ServiceDefinition[] = serviceItems): ContentItem[] {
  const service = services.find((item) => item.key === key);
  if (!service) return projects;

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

  // Flexible category & keyword matching for future items added via CMS
  const keyTerms = service.key.toLowerCase().split("-").filter((term) => term.length > 2);
  const titleTerms = service.title.toLowerCase().split(/[\s+,()]+/).filter((term) => term.length > 2);
  const terms = Array.from(new Set([...keyTerms, ...titleTerms]));

  const categoryMatches = projects.filter((project) => {
    const cat = (project.category || "").toLowerCase();
    const eyebrow = (project.eyebrow || "").toLowerCase();
    const title = (project.title || "").toLowerCase();
    return terms.some((term) => cat.includes(term) || eyebrow.includes(term) || title.includes(term));
  });

  if (categoryMatches.length > 0) return categoryMatches;

  // Fallback to initial projects so the gallery frame is always rich and error-free
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
  if (!service) return gallery.slice(0, 6);

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

  // 3. Fallback: first 6 gallery items so the mini-gallery is always complete
  return gallery.slice(0, 6);
}

