import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("includes the complete client narratives and service scope", async () => {
  const content = await source("lib/content.ts");
  const experience = await source("app/experience.tsx");
  const editorial = await source("app/editorial-page.tsx");

  assert.match(content, /export const visionParagraphs/);
  assert.match(content, /export const missionParagraphs/);
  assert.match(content, /export const teamIntroduction/);
  assert.match(content, /export const enquiryTaglines/);
  assert.match(content, /export const footerTaglines/);
  assert.match(content, /every meaningful project begins with a conversation/i);
  assert.match(content, /Mindrythm has never been about one person/);

  for (const service of ["Premium visual production (photography + videography)", "Drone imagery", "Website development", "Logo generation", "Meta Ads", "Social media management", "Trademark and registration", "Social media creatives"]) {
    assert.match(content, new RegExp(service.replace(/[+&()]/g, "\\$&")));
  }
  assert.doesNotMatch(experience, /title: "Fashion"/);
  assert.match(experience, /content\.services/);
  assert.match(editorial, /visionParagraphs\.map/);
  assert.match(editorial, /missionParagraphs\.map/);
});

test("uses the revised loader, menu, social links and neutral design system", async () => {
  const [experience, editorial, css, layout] = await Promise.all([
    source("app/experience.tsx"),
    source("app/editorial-page.tsx"),
    source("app/globals.css"),
    source("app/layout.tsx"),
  ]);

  assert.doesNotMatch(experience, /loader-echo/);
  assert.match(experience, /Mindrythm/);
  assert.match(experience, /loaderProgress/);
  assert.match(experience, /loader-reference-count/);
  assert.match(experience, /mindrythmSkipIntro/);
  assert.match(editorial, /mindrythmSkipIntro/);
  assert.match(editorial, /href="\/"[^>]+onClick=\{returnToHero\}/);
  assert.match(experience, /menu-overlay/);
  assert.match(experience, /settings\.facebook/);
  assert.match(editorial, /settings\.youtube/);
  assert.match(layout, /Manrope/);
  assert.match(layout, /Bodoni_Moda/);
  assert.match(css, /"Avenir Next"/);
  assert.match(css, /--paper: #ecebe6/);
  assert.match(css, /--ink: #0b0b0a/);
  assert.match(css, /services-experience/);
  assert.match(css, /backdrop-filter: blur\(22px\)/);
  assert.match(css, /scroll-snap-type: x mandatory/);
  assert.match(css, /Luxury loader, measured typography and frictionless return navigation/);
});

test("keeps Sanity collections authoritative after the CMS responds", async () => {
  const [sanityContent, seed] = await Promise.all([
    source("lib/sanity/content.ts"),
    source("sanity/seed/seed.ts"),
  ]);

  assert.doesNotMatch(sanityContent, /collectionOrFallback/);
  assert.match(sanityContent, /items: \[\.\.\.projectItems, \.\.\.galleryItems, \.\.\.teamItems, \.\.\.testimonialItems\]/);
  assert.match(sanityContent, /services,/);
  assert.match(seed, /createIfNotExists/);
  assert.doesNotMatch(seed, /createOrReplace/);
  assert.doesNotMatch(seed, /`project\.\$\{/);
  assert.doesNotMatch(seed, /`service\.\$\{/);
  assert.doesNotMatch(seed, /`teamMember\.\$\{/);
});
