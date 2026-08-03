import { getSiteContent } from "@/lib/site-content";
import { Experience } from "./experience";

export const dynamic = "force-dynamic";

export default async function Home() {
  return <Experience content={await getSiteContent()} />;
}
