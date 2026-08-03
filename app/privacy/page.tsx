import Link from "next/link";
import { BackToTop } from "@/app/back-to-top";
import {getSiteContent} from "@/lib/site-content";
import {Fragment} from "react";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const {privacyPolicy} = await getSiteContent();
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">Mindrythm</Link>
      <span>{privacyPolicy.eyebrow}</span>
      <h1>{privacyPolicy.title}</h1>
      <section>
        {privacyPolicy.sections.map((section) => <Fragment key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></Fragment>)}
      </section>
      <BackToTop />
    </main>
  );
}
