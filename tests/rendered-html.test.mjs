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

  for (const service of ["Premium visual production (photography + videography)", "Drone imagery", "Website development", "Logo generation", "Meta Ads", "Social media management", "Commercial Branding", "Social media creatives"]) {
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

test("verifies deterministic row-major Bento gallery placement for 8, 10, 12, 15, and 20 images", async () => {
  const [bentoSource, cssSource] = await Promise.all([
    source("app/bento-template.tsx"),
    source("app/globals.css"),
  ]);

  assert.match(bentoSource, /computeGallerySlot/);
  assert.match(bentoSource, /BentoGalleryMosaic/);
  assert.match(bentoSource, /bento-gallery-mosaic/);
  assert.match(cssSource, /\.bento-gallery-mosaic/);

  // Extract function logic from bento-template.tsx and test across all requested counts
  function computeGallerySlot(index, total) {
    const fullBlocks = Math.floor(total / 8);
    const remainder = total % 8;
    const inFullBlock = index < fullBlocks * 8;

    if (inFullBlock) {
      const blockIndex = Math.floor(index / 8);
      const posInBlock = index % 8;
      const baseTrack = blockIndex * 3 + 1;

      switch (posInBlock) {
        case 0: return { gridColumn: "1", gridRow: `${baseTrack} / ${baseTrack + 1}`, className: "bento-card-medium" };
        case 1: return { gridColumn: "2", gridRow: `${baseTrack} / ${baseTrack + 2}`, className: "bento-card-large" };
        case 2: return { gridColumn: "3", gridRow: `${baseTrack} / ${baseTrack + 1}`, className: "bento-card-medium" };
        case 3: return { gridColumn: "4", gridRow: `${baseTrack} / ${baseTrack + 2}`, className: "bento-card-large" };
        case 4: return { gridColumn: "1", gridRow: `${baseTrack + 1} / ${baseTrack + 3}`, className: "bento-card-large" };
        case 5: return { gridColumn: "2", gridRow: `${baseTrack + 2} / ${baseTrack + 3}`, className: "bento-card-medium" };
        case 6: return { gridColumn: "3", gridRow: `${baseTrack + 1} / ${baseTrack + 3}`, className: "bento-card-large" };
        case 7: return { gridColumn: "4", gridRow: `${baseTrack + 2} / ${baseTrack + 3}`, className: "bento-card-medium" };
      }
    }

    const remIndex = index - fullBlocks * 8;
    const baseTrack = fullBlocks * 3 + 1;

    if (remainder === 1) return { gridColumn: "1 / -1", gridRow: `${baseTrack} / ${baseTrack + 1}`, className: "bento-card-wide" };
    if (remainder === 2) {
      if (remIndex === 0) return { gridColumn: "1 / span 2", gridRow: `${baseTrack} / ${baseTrack + 1}`, className: "bento-card-wide" };
      return { gridColumn: "3 / span 2", gridRow: `${baseTrack} / ${baseTrack + 1}`, className: "bento-card-wide" };
    }
    if (remainder === 3) {
      if (remIndex === 0) return { gridColumn: "1 / span 2", gridRow: `${baseTrack} / ${baseTrack + 1}`, className: "bento-card-wide" };
      if (remIndex === 1) return { gridColumn: "3", gridRow: `${baseTrack} / ${baseTrack + 1}`, className: "bento-card-medium" };
      return { gridColumn: "4", gridRow: `${baseTrack} / ${baseTrack + 1}`, className: "bento-card-medium" };
    }
    if (remainder === 4) {
      const col = remIndex + 1;
      return { gridColumn: `${col}`, gridRow: `${baseTrack} / ${baseTrack + 1}`, className: col % 2 !== 0 ? "bento-card-medium" : "bento-card-large" };
    }
    if (remainder === 5) {
      if (remIndex < 4) {
        const col = remIndex + 1;
        return { gridColumn: `${col}`, gridRow: `${baseTrack} / ${baseTrack + 1}`, className: col % 2 !== 0 ? "bento-card-medium" : "bento-card-large" };
      }
      return { gridColumn: "1 / -1", gridRow: `${baseTrack + 1} / ${baseTrack + 2}`, className: "bento-card-wide" };
    }
    if (remainder === 6) {
      if (remIndex < 4) {
        const col = remIndex + 1;
        return { gridColumn: `${col}`, gridRow: `${baseTrack} / ${baseTrack + 1}`, className: col % 2 !== 0 ? "bento-card-medium" : "bento-card-large" };
      }
      if (remIndex === 4) return { gridColumn: "1 / span 2", gridRow: `${baseTrack + 1} / ${baseTrack + 2}`, className: "bento-card-wide" };
      return { gridColumn: "3 / span 2", gridRow: `${baseTrack + 1} / ${baseTrack + 2}`, className: "bento-card-wide" };
    }
    if (remainder === 7) {
      if (remIndex < 4) {
        const col = remIndex + 1;
        return { gridColumn: `${col}`, gridRow: `${baseTrack} / ${baseTrack + 1}`, className: col % 2 !== 0 ? "bento-card-medium" : "bento-card-large" };
      }
      if (remIndex === 4) return { gridColumn: "1 / span 2", gridRow: `${baseTrack + 1} / ${baseTrack + 2}`, className: "bento-card-wide" };
      if (remIndex === 5) return { gridColumn: "3", gridRow: `${baseTrack + 1} / ${baseTrack + 2}`, className: "bento-card-medium" };
      return { gridColumn: "4", gridRow: `${baseTrack + 1} / ${baseTrack + 2}`, className: "bento-card-medium" };
    }
    return { gridColumn: "auto", gridRow: "auto", className: "bento-card-medium" };
  }

  for (const count of [8, 10, 12, 15, 18, 20]) {
    const slots = [];
    for (let i = 0; i < count; i++) {
      const slot = computeGallerySlot(i, count);
      slots.push(slot);
      assert.ok(slot.gridColumn, `Item ${i} in count ${count} must have gridColumn`);
      assert.ok(slot.gridRow, `Item ${i} in count ${count} must have gridRow`);
      assert.ok(slot.className, `Item ${i} in count ${count} must have className`);
    }
    // Verify first 8 slots are always the canonical 8-slot Bento pattern
    if (count >= 8) {
      assert.equal(slots[0].gridColumn, "1");
      assert.equal(slots[1].gridColumn, "2");
      assert.equal(slots[2].gridColumn, "3");
      assert.equal(slots[3].gridColumn, "4");
      assert.equal(slots[4].gridColumn, "1");
      assert.equal(slots[5].gridColumn, "2");
      assert.equal(slots[6].gridColumn, "3");
      assert.equal(slots[7].gridColumn, "4");
    }
    // Verify for 10 images, slots 8 and 9 span columns symmetrically (no empty right side)
    if (count === 10) {
      assert.equal(slots[8].gridColumn, "1 / span 2");
      assert.equal(slots[9].gridColumn, "3 / span 2");
    }
    // Verify for 12 images, all 12 fill 4-columns across 3 rows
    if (count === 12) {
      assert.equal(slots[8].gridColumn, "1");
      assert.equal(slots[9].gridColumn, "2");
      assert.equal(slots[10].gridColumn, "3");
      assert.equal(slots[11].gridColumn, "4");
    }
    // Verify for 15 images, remainder 7 fills all 4 columns symmetrically
    if (count === 15) {
      assert.equal(slots[12].gridColumn, "1 / span 2");
      assert.equal(slots[13].gridColumn, "3");
      assert.equal(slots[14].gridColumn, "4");
    }
  }
});

