# Mindrythm Sanity CMS

## Project

- Sanity project: **Mindrythm CMS**
- Project ID: `n9nyugiq`
- Dataset: `production`
- Studio: <https://mindrythm-cms.sanity.studio>
- Website preview origin: set through `SANITY_STUDIO_PREVIEW_URL` to the final Hostinger domain

The existing website markup and styling remain the presentation layer. Sanity supplies the editable content, and the checked-in defaults remain as a safe fallback if Sanity is temporarily unavailable.

## CMS folder structure

```text
.
├── sanity.cli.ts                 # Sanity CLI project, dataset, and Studio host
├── sanity.config.ts              # Studio plugins, structure, and Presentation
├── sanity/
│   ├── structure.ts              # Client-friendly Studio navigation
│   ├── presentation.ts           # Visual editing document locations
│   ├── seed/
│   │   └── seed.ts               # Idempotent approved-content seed
│   └── schemaTypes/
│       ├── index.ts
│       ├── objects/
│       │   ├── legalSection.ts
│       │   └── mediaAsset.ts
│       └── documents/
│           ├── aboutContent.ts
│           ├── contactInfo.ts
│           ├── footerSettings.ts
│           ├── galleryItem.ts
│           ├── heroSection.ts
│           ├── privacyPolicy.ts
│           ├── project.ts
│           ├── seoSettings.ts
│           ├── service.ts
│           ├── siteSettings.ts
│           ├── socialLinks.ts
│           ├── teamMember.ts
│           ├── termsConditions.ts
│           └── testimonial.ts
├── lib/sanity/
│   ├── client.ts                 # Typed Sanity client configuration
│   ├── content.ts                # CMS-to-existing-UI content mapper
│   ├── live.ts                   # Live Content API and draft token setup
│   └── query.ts                  # Central GROQ content query
├── app/api/draft-mode/
│   ├── enable/route.ts
│   └── disable/route.ts
└── app/studio/page.tsx           # Redirect to the hosted Sanity Studio
```

## Environment variables

Copy `.env.example` to `.env.local` for local development. Never commit `.env.local` or a token.

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=n9nyugiq
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-08-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://mindrythm-cms.sanity.studio
SANITY_API_READ_TOKEN=<viewer-token-secret>
SANITY_STUDIO_PREVIEW_URL=https://your-domain.com
```

- The `NEXT_PUBLIC_...` values are safe public configuration.
- `SANITY_API_READ_TOKEN` must be a Sanity **Viewer** token and must stay secret. It enables draft/live preview; published content remains available without it.
- `SANITY_STUDIO_PREVIEW_URL` is used when building the standalone Studio. Redeploy the Studio once after the final Hostinger domain is known.

## Client login and editing

1. Open <https://mindrythm-cms.sanity.studio>.
2. Sign in with the Google account that belongs to the Sanity project, or an invited project member account.
3. Choose the required content area from the organized left navigation.
4. Edit text, upload/select images, and use each field's validation guidance.
5. Click **Publish**. The website receives published updates through Sanity's Live Content API.
6. Use **Presentation** inside Studio to preview drafts against the live website before publishing.

To add another editor, open <https://www.sanity.io/manage>, select **Mindrythm CMS**, open the project's member management, and invite their email with the minimum editing role they need.

## Developer commands

```bash
pnpm studio:dev       # Local Studio
pnpm studio:validate  # Validate schemas
pnpm studio:build     # Production Studio build
pnpm studio:deploy    # Deploy Studio
pnpm studio:seed      # Recreate/update approved seed documents
pnpm dev              # Local website
pnpm build            # Production website build
```

The seed script uses stable document IDs and `createOrReplace`, so it is repeatable. Do not run it after a client has begun editing unless replacing their CMS content is intentional.

## Final testing checklist

- [ ] Schema validation reports zero errors and zero warnings.
- [ ] TypeScript compilation succeeds.
- [ ] Production website build succeeds.
- [ ] Studio loads and requires a Sanity member login.
- [ ] Hero, About, Services, Projects, Gallery, Testimonials, Team, Contact, Footer, Social Links, SEO, Privacy, and Terms are editable.
- [ ] Required fields, URLs, ratings, and image alternative text are validated.
- [ ] Image uploads work from project and team documents.
- [ ] Presentation opens the matching website route and shows draft changes.
- [ ] Publishing a harmless test edit updates the website, then reverting it restores the approved copy.
- [ ] Desktop and mobile pages retain the approved visual design.
- [ ] `/privacy`, `/terms`, `/work`, `/gallery`, `/team`, `/enquire`, and service routes load directly.
- [ ] Production SEO title and description come from Sanity.
- [ ] Hostinger environment variables contain the Viewer token; the token is absent from source control.
