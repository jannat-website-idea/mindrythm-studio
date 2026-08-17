import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";
import { EditorialPage } from "../editorial-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent({ stega: false });
  return {
    title: `Gallery — ${seo.title || "Mindrythm"}`,
    description: seo.description,
  };
}

export default async function GalleryPage() { return <EditorialPage content={await getSiteContent()} page="gallery" />; }
