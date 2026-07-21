import { getSiteContent } from "@/db/content";
import { EditorialPage } from "../editorial-page";

export const dynamic = "force-dynamic";
export default async function StoryPage() { return <EditorialPage content={await getSiteContent()} page="story" />; }
