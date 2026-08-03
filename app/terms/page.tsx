import Link from "next/link";
import { BackToTop } from "@/app/back-to-top";
import {getSiteContent} from "@/lib/site-content";
import {Fragment} from "react";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const {termsConditions} = await getSiteContent();
  const titleParts = termsConditions.title.split("&");
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">Mindrythm</Link>
      <span>{termsConditions.eyebrow}</span>
      <h1>{titleParts.length > 1 ? <>{titleParts[0].trim()} &amp;<br />{titleParts.slice(1).join("&").trim()}</> : termsConditions.title}</h1>
      <section>
        {termsConditions.sections.map((section) => <Fragment key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></Fragment>)}
      </section>
      <BackToTop />
    </main>
  );
}
