import { getSiteContent } from "@/db/content";
import { EditorialPage } from "../editorial-page";

export const dynamic = "force-dynamic";
export default async function TeamPage() { return <EditorialPage content={await getSiteContent()} page="team" />; }
