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

  for (const service of ["Real-estate", "Hospitality", "Wellness", "Wedding / Moments"]) {
    assert.match(experience, new RegExp(service.replace("/", "\\/")));
  }
  assert.doesNotMatch(experience, /title: "Fashion"/);
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
  assert.match(experience, /details className="vision-note"/);
  assert.match(experience, /loaderProgress/);
  assert.match(experience, /loader-reference-count/);
  assert.match(editorial, /href="\/#home"/);
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
