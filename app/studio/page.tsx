import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  redirect(process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "https://mindrythm-cms.sanity.studio");
}
