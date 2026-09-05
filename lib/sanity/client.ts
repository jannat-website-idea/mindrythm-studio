import {createClient} from "next-sanity";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "n9nyugiq";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-01";
export const sanityReadToken =
  process.env.SANITY_API_READ_TOKEN ||
  "skrHbthGY7TTfiHan5tSYs9rL93qhaxYMXDmcg1tTAI2xDvHaN7jUDOTRdQnUQbeNseU7xLxRzNtLyOHP5pNSSNiDi7XqKJqAIfeUAvd7ZLslhwXHfFcg1WphtPhKSgYDge5HHQL3KnFY8hdexH7jOhM8woZKT7z2nFHIfViRVitTZrRgc0c";

export const sanityClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: false,
  token: sanityReadToken,
  perspective: "drafts",
  stega: {
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "https://mindrythm-cms.sanity.studio",
  },
});
