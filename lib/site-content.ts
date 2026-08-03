import {defaultContent, type SiteContent} from "@/lib/content";
import {getSanitySiteContent} from "@/lib/sanity/content";

export async function getSiteContent(options: {stega?: boolean} = {}): Promise<SiteContent> {
  return (await getSanitySiteContent(options)) ?? defaultContent;
}
