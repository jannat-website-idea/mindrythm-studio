# Mindrythm Studio

Production Next.js website for Mindrythm, with content managed in Sanity and enquiry delivery through Hostinger Email SMTP.

## Local development

1. Copy `.env.example` to `.env.local` and supply the required local values.
2. Install dependencies with `pnpm install`.
3. Run `pnpm dev`.
4. Run `pnpm build` for the production build.

## Production hosting

The public website is prepared for Hostinger's managed **Node.js Web App** hosting using Node.js 22, `pnpm`, the standard Next.js build, and `next start`.

See [HOSTINGER_DEPLOYMENT.md](./HOSTINGER_DEPLOYMENT.md) for the full environment-variable list, SMTP configuration, deployment steps, and post-deployment checks. See [SANITY_CMS.md](./SANITY_CMS.md) for CMS administration.
