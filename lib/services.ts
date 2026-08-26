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
