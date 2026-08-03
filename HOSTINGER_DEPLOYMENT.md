# Mindrythm Hostinger production deployment

The website is a standard Next.js application with a Node.js enquiry endpoint. It must be deployed as a **Hostinger Node.js Web App**, not as static files in `public_html`.

No additional paid service is required. The site uses the existing Hostinger hosting account, Hostinger Email SMTP, and the Sanity Free plan.

## Required Hostinger capability

The client's existing Hostinger plan must show **Websites → Add Website → Deploy Web App**. Hostinger currently provides managed Node.js Web Apps on Business Web Hosting and Cloud plans. Do not purchase or upgrade anything automatically. If the option is missing, confirm the client's existing plan with Hostinger before deployment.

## Build settings

| Setting | Value |
| --- | --- |
| Framework | Next.js |
| Node.js | 22.x |
| Package manager | pnpm |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Start command | `pnpm start` |
| Build output | `.next` |

Hostinger normally detects Next.js and these settings automatically. Do not use the old Vercel, Cloudflare, Sites, Vite, or Wrangler configuration.

## Required environment variables

Add these in the Node.js application's **Environment Variables** section. Secrets must never be committed to Git or included in the uploaded ZIP.

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=n9nyugiq
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-08-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://mindrythm-cms.sanity.studio
SANITY_API_READ_TOKEN=<Sanity Viewer token; server-side only>

SITE_URL=https://your-domain.com
CONTACT_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=admin@mindrythm.com
SMTP_PASSWORD=<dedicated mailbox app password>
SMTP_FROM_EMAIL=admin@mindrythm.com
SMTP_FROM_NAME=Mindrythm Website

CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_MS=900000
CONTACT_MIN_SUBMIT_MS=800
```

`SANITY_STUDIO_PREVIEW_URL` is a Studio build variable rather than a website runtime variable. Set it locally to the final domain before redeploying the Sanity Studio:

```dotenv
SANITY_STUDIO_PREVIEW_URL=https://your-domain.com
```

The Sanity token is used only on the server for draft preview. It is never sent to the visitor's browser. Create it with the minimum **Viewer** permission and keep it out of `NEXT_PUBLIC_*` variables.

## Hostinger mailbox and SMTP

1. In hPanel, open **Emails** and confirm that `admin@mindrythm.com` exists.
2. Under that mailbox's options, create a dedicated **App password** named `Mindrythm website` if the email plan supports app passwords. Otherwise use the mailbox password—never the main hPanel account password.
3. Put the generated value in `SMTP_PASSWORD` in the Node.js app's environment variables.
4. Keep port `465` with `SMTP_SECURE=true`. If Hostinger support requires STARTTLS, use port `587` with `SMTP_SECURE=false`.
5. In **Emails → Manage → Connect Domain → Increase email deliverability**, confirm Hostinger's SPF and DKIM records are active. Add a DMARC record if the domain does not already have one.

All website enquiries are sent to `admin@mindrythm.com`. The destination is fixed in server code so it cannot accidentally be redirected by an environment-variable typo.

## Deployment steps

1. Back up any current Hostinger website before replacing it.
2. Open **Websites → Add Website → Deploy Web App**.
3. Choose GitHub integration or upload a ZIP containing the repository, excluding `.env*`, `.git`, `.next`, `node_modules`, `opencode work`, and local build caches.
4. Select Next.js, Node.js 22, and pnpm; confirm the build settings above.
5. Add every required environment variable before the first build.
6. Deploy and review the complete build log. Do not retry a failed deployment until the exact error is understood.
7. Connect the final custom domain. Hostinger installs SSL automatically after DNS propagation.
8. Update `SITE_URL` and `CONTACT_ALLOWED_ORIGINS` to the final HTTPS origin and redeploy once so the enquiry endpoint accepts the production domain.
9. Add the final Hostinger origin to Sanity CORS with credentials:

   ```bash
   pnpm exec sanity cors add https://your-domain.com --credentials
   ```

10. Set `SANITY_STUDIO_PREVIEW_URL` to the same HTTPS origin and run `pnpm studio:deploy` once to move Presentation preview away from the old temporary domain.

## Post-deployment acceptance test

- Open `/`, `/services`, `/work`, `/gallery`, `/team`, `/story`, `/contact`, `/privacy`, and `/terms` directly.
- Confirm `/studio` redirects to the hosted Sanity Studio.
- Test navigation and media on desktop and mobile.
- Submit one real enquiry and confirm it arrives in `admin@mindrythm.com`, including spam/junk folders.
- Reply to the message and confirm it addresses the visitor when an email was supplied.
- Submit invalid data and confirm the form does not send.
- Confirm HTTPS is active and no browser console or network errors appear.
- Open Sanity Presentation and confirm it previews the Hostinger domain.
- Publish and revert one harmless Sanity test edit to confirm live content updates.

## Troubleshooting

- **SMTP authentication error:** recreate the mailbox app password and update `SMTP_PASSWORD`.
- **SMTP connection timeout:** confirm `smtp.hostinger.com`, port 465, and SSL; then try Hostinger's documented port 587/STARTTLS fallback.
- **403 from the enquiry API:** correct `SITE_URL` and `CONTACT_ALLOWED_ORIGINS`, then redeploy.
- **Hostinger 403 after deployment:** use the Node.js Web App redeploy action so Hostinger regenerates its routing `.htaccess`.
- **Sanity preview still opens the old site:** update `SANITY_STUDIO_PREVIEW_URL` and redeploy the Studio once.
