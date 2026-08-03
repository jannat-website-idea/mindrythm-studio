import { getSiteContent } from "@/lib/site-content";
import { EditorialPage } from "../editorial-page";

export const dynamic = "force-dynamic";
export default async function GalleryPage() { return <EditorialPage content={await getSiteContent()} page="gallery" />; }
