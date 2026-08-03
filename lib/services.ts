import { defaultServices, type ContentItem, type ServiceContent } from "@/lib/content";

export type ServiceKey = "real-estate" | "hospitality" | "wellness" | "wedding";

export type ServiceDefinition = ServiceContent;
export const serviceItems: readonly ServiceDefinition[] = defaultServices;

export function isServiceKey(value: string | null, services: readonly ServiceDefinition[] = serviceItems): value is ServiceKey {
  return services.some((service) => service.key === value);
}

export function getServiceProjects(projects: ContentItem[], key: ServiceKey, services: readonly ServiceDefinition[] = serviceItems): ContentItem[] {
  const service = services.find((item) => item.key === key);
  if (!service) return [];

  return service.projectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is ContentItem => Boolean(project));
}

export function getProjectService(project: ContentItem, services: readonly ServiceDefinition[] = serviceItems): ServiceKey | null {
  return services.find((service) => service.projectIds.includes(project.id))?.key ?? null;
}
