# Mindrythm Studio — Agent Instructions

This file contains the global instructions for AI coding agents (OpenCode, Claude Code, etc.) working on the **Mindrythm Studio** website project.

Read this file at the start of every session before making changes.

---

## 1. Project Overview

- **Project name**: Mindrythm Studio
- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Sanity CMS v6
- **Runtime**: Node.js 22, pnpm
- **Output mode**: `standalone` (Hostinger Node.js Web App)
- **CMS**: Sanity (project `n9nyugiq`, dataset `production`)
- **SMTP**: Hostinger Email via Nodemailer
- **Local dev**: `pnpm dev` on <http://localhost:3000>
- **Build**: `pnpm build` then `pnpm start`

Always prefer **minimal, purposeful changes** over large refactors.

---

## 2. Design Philosophy (from `frontend-design` skill)

Treat every request as if you are the design lead at a small studio known for giving each client a visual identity that could not be mistaken for anyone else's.

### Core principles

- **Ground every design in the subject**: identify the audience, the page's single job, and the brand's world before picking colors or type.
- **The hero is a thesis**: open with the most characteristic thing about the subject — not a generic big-number + gradient template.
- **Typography carries personality**: pair display and body faces deliberately; set a clear type scale with intentional weights, widths, and spacing.
- **Structure is information**: dividers, labels, and numbering should encode real meaning, not decorate.
- **Motion is deliberate**: use load sequences, scroll reveals, and hover micro-interactions only when they serve the subject. Less is often more.
- **Avoid AI-design clichés**:
  - Warm cream background (#F4F1EA) + high-contrast serif + terracotta
  - Near-black background + single acid-green or vermilion accent
  - Broadsheet layout with hairline rules and zero border-radius
  - Excessive centered layouts, purple gradients, uniform rounded corners, and Inter font
- **Take one justified aesthetic risk** and keep everything else quiet and disciplined.
- **Work in two passes**: plan (colors, type, layout ASCII wireframes, signature element), self-critique, then build.
- **Quality floor**: responsive down to mobile, visible keyboard focus, reduced motion respected, no overlapping elements, consistent spacing.

### Writing in design

- Words are design material, not decoration.
- Write from the user's side: "Manage notifications", not "Webhook config".
- Use active voice: "Save changes", not "Submit".
- Keep vocabulary consistent across buttons, toasts, and labels.
- Errors explain what happened and how to fix it; empty screens invite action.

---

## 3. Technical Stack Rules

### Next.js / React

- Use the **App Router** (`app/` directory). Do not add new pages under `pages/`.
- Server Components by default; only use `'use client'` when interactivity (hooks, browser APIs, events) is required.
- Use **React 19** patterns; avoid legacy class components.
- Keep components small, single-responsibility, and colocated in `app/` when page-specific.
- Use `next/image` for images with explicit `width`, `height`, and `alt` text.
- Use `next/link` for internal navigation.

### TypeScript

- Strict typing. Avoid `any`.
- Prefer interfaces for props; keep types in a `types/` folder when shared.
- Use absolute imports (configured via `tsconfig.json`).

### Tailwind CSS 4

- Use **Tailwind 4** utility classes only. Do not write arbitrary CSS files unless absolutely necessary.
- Keep class strings readable: group related utilities, use `clsx`/`cn` helpers for conditional classes.
- Avoid magic values; rely on the design system (spacing, colors, type scale) from `globals.css`.
- Ensure designs are responsive: mobile-first, then `md:` / `lg:` / `xl:`.

### Sanity CMS

- Content lives in Sanity. The checked-in code is the presentation layer.
- New editable sections need:
  1. A schema type in `sanity/schemaTypes/documents/` or `objects/`.
  2. Export added to `sanity/schemaTypes/index.ts`.
  3. A GROQ query update in `lib/sanity/query.ts`.
  4. Content mapping in `lib/sanity/content.ts`.
  5. A UI component in `app/` that consumes the mapped data.
- Always provide fallback defaults so the site works if Sanity is temporarily unavailable.
- Run `pnpm studio:validate` after schema changes.
- Use the Studio preview URL and draft-mode API for visual editing.
- Never commit Sanity API tokens.

### API / Email

- Contact forms use `app/api/contact/route.ts` and Nodemailer.
- Validate form input with **Zod**.
- Return clear JSON error messages matching the writing guidelines above.

---

## 4. Workflow for Website Changes

When asked to create or modify the website, follow this exact sequence:

1. **Understand the brief**
   - What is the page/section's single job?
   - Who is the audience?
   - What is the brand's world/subject?
   - Are there existing designs, images, or copy to reuse?

2. **Audit existing code**
   - Read the relevant `app/` files, `globals.css`, and Sanity schema if content is involved.
   - Check `lib/sanity/query.ts` and `lib/sanity/content.ts` for existing patterns.

3. **Create a design plan**
   - 4–6 named hex colors.
   - 2+ deliberate typefaces and a type scale.
   - One-sentence layout concept + ASCII wireframe.
   - One signature element.
   - Self-critique: does any part look like a generic default? Revise and note why.

4. **Build**
   - Follow the stack rules above.
   - Reuse existing components and patterns where possible.
   - Keep accessibility and responsive behavior in mind.

5. **Test**
   - Run `pnpm build` before declaring success.
   - Fix TypeScript and ESLint errors.
   - For visual changes, verify responsive behavior mentally or with the browser if tools are available.

6. **Summarize**
   - Briefly explain what changed, why, and any next steps (e.g., update Sanity content, add images, deploy).

---

## 5. Theme System (from `theme-factory` skill)

When a new visual direction is requested and no brand palette exists, choose or create a cohesive theme:

- **Ocean Depths** — calm, maritime, professional
- **Sunset Boulevard** — warm, vibrant
- **Forest Canopy** — natural, grounded
- **Modern Minimalist** — clean grayscale
- **Golden Hour** — rich autumnal
- **Arctic Frost** — crisp, cool
- **Desert Rose** — soft, dusty
- **Tech Innovation** — bold, modern
- **Botanical Garden** — fresh, organic
- **Midnight Galaxy** — dramatic, cosmic

For each theme:
- Provide named hex palette (4–6 colors).
- Pair a display and body typeface.
- Document font/role usage.
- Apply consistently across the page/section.
- Ensure contrast and readability.

---

## 6. Web Artifacts & Complex UI (from `web-artifacts-builder` skill)

For complex interactive artifacts inside the project (calculators, dashboards, rich demos):

- Prefer React + TypeScript + Tailwind CSS + shadcn/ui patterns already present in the project.
- Avoid excessive centered layouts, purple gradients, uniform rounded corners, and Inter font defaults.
- Bundle complex artifacts into self-contained components or pages.
- Test after building.

---

## 7. Visual Art / Static Assets (from `canvas-design` skill)

When creating posters, art pieces, or brand visuals:

- Start with a 4–6 paragraph design philosophy (named movement).
- Express ideas visually through form, space, color, and composition.
- Keep text minimal and design-forward.
- Use distinct fonts if text is needed.
- Produce museum-quality, meticulously crafted output.

---

## 8. Testing (from `webapp-testing` skill)

- Run `pnpm build` as the primary quality gate.
- For interactive features, use Playwright or manual browser verification.
- Wait for `networkidle` before inspecting dynamic pages.
- Close browsers and clean up temporary files after testing.

---

## 9. Deployment & Environment

- Do not commit `.env.local` or any API tokens.
- The production build is `standalone` and runs on Hostinger with `pnpm build && pnpm start`.
- After CMS schema changes, redeploy both the Studio (`pnpm studio:deploy`) and the website.
- Follow `HOSTINGER_DEPLOYMENT.md` and `SANITY_CMS.md` for detailed deployment steps.

---

## 10. Communication Style

- Be concise but complete.
- Always explain the **why** behind a design or code choice.
- If a request is ambiguous, ask clarifying questions before building.
- Proactively flag risks (breaking changes, missing assets, token exposure).
- End tasks with a short summary and any follow-ups needed.

---

## 11. Quick Reference

| Task | Entry point |
|------|-------------|
| Add a page | `app/<page>/page.tsx` |
| Add a CMS document type | `sanity/schemaTypes/documents/<name>.ts` → `index.ts` |
| Add a reusable object | `sanity/schemaTypes/objects/<name>.ts` → `index.ts` |
| Query content | `lib/sanity/query.ts` |
| Map content to UI | `lib/sanity/content.ts` |
| Global styles / design tokens | `app/globals.css` |
| Shared UI components | create or reuse under `app/` or `lib/components/` |
| Contact form API | `app/api/contact/route.ts` |
| Sanity Studio | `app/studio/page.tsx` redirects to hosted Studio |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Validate schema | `pnpm studio:validate` |

---

Last updated: 2026-08-15
