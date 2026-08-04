# Mindrythm Studio — Deployment Handover

Last reviewed: 4 August 2026

This document is the operational handover for the Mindrythm production website. It covers the initial Hostinger deployment, GitHub connection, environment variables, custom domain, SSL, Google Workspace SMTP, Sanity Studio, acceptance testing, rollback, and future maintenance.

The approved website must be deployed without changing its UI, layout, typography, colors, animations, media, content, responsive behavior, or interactions.

## 1. Production architecture

| Component | Production service | Notes |
| --- | --- | --- |
| Website | Hostinger Managed Node.js Web App | Standard Next.js server application; do not upload it as a static `public_html` site. |
| Source control | GitHub | Repository: `https://github.com/jannat-website-idea/mindrythm-studio` |
| Production branch | `main` | Hostinger should deploy this branch. |
| Node.js | `22.x` | Enforced by `package.json` and `.nvmrc`. |
| Package manager | `pnpm` | Lockfile: `pnpm-lock.yaml`. |
| CMS | Sanity Free plan | Project ID `n9nyugiq`; dataset `production`. |
| CMS login | Sanity-hosted Studio | `https://mindrythm-cms.sanity.studio` |
| Enquiry delivery | Google Workspace SMTP | Recipient is fixed in server code as `admin@mindrythm.com`; the website itself runs on Hostinger. |
| Spam protection | Application-owned, free | Honeypot, minimum-submit timing, URL/repetition checks, origin checks, size limits, validation, and in-process rate limiting. |

Hostinger currently supports managed Node.js Web Apps on eligible Business and Cloud plans, including Next.js and Node.js 22. See [Hostinger's Node.js Web App guide](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/).

## 2. Access required

Before deployment, confirm access to:

- The client's Hostinger hPanel account.
- The GitHub account or organization that can authorize Hostinger to read `jannat-website-idea/mindrythm-studio`.
- The Sanity project `Mindrythm CMS` (`n9nyugiq`) with Administrator or Developer access.
- The Google Workspace mailbox `admin@mindrythm.com` and permission to create a dedicated App Password.
- DNS management for the final domain.

Never place a Hostinger password, SMTP password, Sanity token, GitHub token, or other secret in GitHub, a support ticket, screenshots, or this document.

## 3. Pre-deployment checks

Run these commands from the repository root:

```bash
git switch main
git pull --ff-only origin main
corepack enable
pnpm install --frozen-lockfile
pnpm exec tsc --noEmit --incremental false
pnpm run lint
pnpm run studio:validate
pnpm run studio:build
pnpm audit --prod
pnpm run build
node --test tests/rendered-html.test.mjs
git status --short
```

Expected result:

- TypeScript succeeds.
- ESLint reports zero errors. The existing native `<img>` advisory warnings are intentional because the approved direct media delivery must not be converted to `next/image` during deployment.
- Sanity schema validation reports zero errors and zero warnings.
- The production dependency audit reports zero known vulnerabilities.
- The Next.js production build succeeds.
- All tests pass.
- The Git worktree is clean.

Do not deploy uncommitted files. Do not commit `.env.local`, tokens, passwords, `.next`, `node_modules`, or `.sanity` build output.

## 4. Environment variables

Add environment variables in Hostinger during the Node.js Web App setup. Hostinger supports pasting/importing an `.env` file or adding values individually. Variables stored in hPanel are not committed to the repository; changes made after deployment require a redeploy. See [Hostinger's environment variable guide](https://www.hostinger.com/support/how-to-add-environment-variables-during-node-js-application-deployment/).

### 4.1 Website runtime and build variables

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | `n9nyugiq` | Public Sanity project identifier used by the website client and server. |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | `production` | Sanity dataset containing the published website content. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Yes | `2026-08-01` | Pins Sanity query behavior to a known API date. |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | Yes | `https://mindrythm-cms.sanity.studio` | Destination for `/studio` and the Admin links. |
| `SANITY_API_READ_TOKEN` | Recommended | Secret Viewer token | Server-only token used for draft/live preview. Published content remains available without it. Never prefix it with `NEXT_PUBLIC_`. |
| `SITE_URL` | Yes | `https://mindrythm.com` | Canonical deployed origin used to protect the enquiry endpoint. Use the exact final HTTPS origin. |
| `CONTACT_ALLOWED_ORIGINS` | Yes | `https://mindrythm.com,https://www.mindrythm.com` | Comma-separated origins allowed to submit enquiries. Include only trusted production origins, without paths or trailing slashes. |

### 4.2 Google Workspace SMTP variables

| Variable | Required | Production value | Purpose |
| --- | --- | --- | --- |
| `SMTP_HOST` | Yes | `smtp.gmail.com` | Google Workspace outgoing mail server. |
| `SMTP_PORT` | Yes | `465` | SSL SMTP port. Fallback: `587` for STARTTLS only if required. |
| `SMTP_SECURE` | Yes | `true` | Enables implicit TLS for port 465. Use `false` only with port 587. |
| `SMTP_USER` | Yes | `admin@mindrythm.com` | Google Workspace mailbox username. |
| `SMTP_PASSWORD` | Yes | Secret Google App Password | Authentication secret. Never use the Gmail or hPanel account password. |
| `SMTP_FROM_EMAIL` | Yes | `admin@mindrythm.com` | Envelope/from address. Keep it on the authenticated Hostinger domain. |
| `SMTP_FROM_NAME` | Yes | `Mindrythm Website` | Friendly sender name shown in the mailbox. |

Google Workspace SMTP uses `smtp.gmail.com` with SSL port `465` (or STARTTLS port `587`). Create the App Password while signed in specifically as `admin@mindrythm.com`; do not paste it into GitHub or chat.

### 4.3 Free spam-protection controls

| Variable | Required | Default/production value | Purpose |
| --- | --- | --- | --- |
| `CONTACT_RATE_LIMIT_MAX` | Optional | `5` | Maximum accepted real submissions per client within the window. |
| `CONTACT_RATE_LIMIT_WINDOW_MS` | Optional | `900000` | Rate-limit window: 15 minutes. |
| `CONTACT_MIN_SUBMIT_MS` | Optional | `800` | Submissions faster than this are silently treated as automated. |

### 4.4 Sanity Studio build variable

| Variable | Where used | Example | Purpose |
| --- | --- | --- | --- |
| `SANITY_STUDIO_PREVIEW_URL` | Local/CI environment used to deploy Studio | `https://mindrythm.com` | Sets the Presentation preview origin. It is not a required Hostinger website runtime variable. |

### 4.5 Production environment template

Replace only the placeholder secrets/domain before importing this into Hostinger:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=n9nyugiq
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-08-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://mindrythm-cms.sanity.studio
SANITY_API_READ_TOKEN=<SANITY_VIEWER_TOKEN>

SITE_URL=https://mindrythm.com
CONTACT_ALLOWED_ORIGINS=https://mindrythm.com,https://www.mindrythm.com

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=admin@mindrythm.com
SMTP_PASSWORD=<GOOGLE_WORKSPACE_APP_PASSWORD>
SMTP_FROM_EMAIL=admin@mindrythm.com
SMTP_FROM_NAME=Mindrythm Website

CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_MS=900000
CONTACT_MIN_SUBMIT_MS=800
```

If the final domain is not `mindrythm.com`, replace both domain variables and the Studio preview URL with the actual HTTPS domain.

## 5. Connect GitHub and create the Hostinger application

GitHub deployment is preferred because it provides traceable versions and automatic builds from the selected branch.

1. Sign in to Hostinger hPanel.
2. Open **Websites**.
3. Click **Add Website**.
4. Select **Deploy Web App** or **Node.js Web App**.
5. Choose **Import Git Repository** / **Continue with GitHub**.
6. Authorize the Hostinger GitHub App.
7. Grant access to the repository `jannat-website-idea/mindrythm-studio`.
8. Select that repository and the `main` branch.
9. If the repository is not visible, update the Hostinger GitHub App's repository access in GitHub, then reconnect from the website dashboard's three-dot menu.
10. Confirm that automatic deployment is enabled only for `main`.

One Hostinger hosting plan can be connected to only one GitHub account at a time. Changing the connected repository later overwrites the deployed application files, so verify the repository name before confirming.

## 6. Configure the Node.js application

Use these settings:

| Hostinger setting | Value |
| --- | --- |
| Framework | Next.js |
| Node.js version | `22.x` |
| Package manager | `pnpm` |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Start command | `pnpm start` |
| Build output | `.next` |
| Branch | `main` |

Notes:

- Prefer Hostinger's detected **Next.js** framework. Do not select a static frontend framework.
- Do not set `out` as the output directory; this application contains `/api/enquiry` and must run as a Node.js server.
- If Hostinger detects the framework as **Other**, enter `.next` as the output directory and `pnpm start` as the start command. No custom entry file is required when Hostinger correctly detects the `start` script.
- Hostinger stores server-side Next.js build files outside `public_html` and creates routing rules in `public_html/.htaccess`. Do not manually move `.next` into `public_html`.
- Add all environment variables before the first production build.

Click **Deploy** once. Watch the full build log. If the build fails, stop, copy the exact error, identify the cause, and do not repeatedly retry an unchanged deployment.

## 7. Connect the custom domain

Keep the approved Vercel site available until the Hostinger temporary URL has passed acceptance testing.

1. In the Node.js app's **Website Dashboard**, click **Connect domain**. The same action is available from the Websites list.
2. Enter the exact client-owned domain.
3. If the domain is registered at Hostinger and already points to the account, follow hPanel's confirmation flow.
4. If DNS is managed elsewhere, use the precise nameservers or A/CNAME records shown by hPanel. Do not guess IP addresses.
5. Before changing DNS, record the existing nameservers and A/CNAME records. These are needed for rollback.
6. Preserve mail records. Changing nameservers can affect MX, SPF, DKIM, and DMARC; reproduce the current mail records when required.
7. Wait for hPanel's live DNS check to confirm the connection. DNS propagation can take up to 24 hours and occasionally longer.

Official references:

- [Connect a custom domain to a Hostinger Node.js application](https://www.hostinger.com/support/how-to-connect-a-custom-domain-to-a-node-js-application/)
- [Point a domain to Hostinger](https://www.hostinger.com/support/1863967-how-to-point-a-domain-to-hostinger/)
- [DNS propagation at Hostinger](https://www.hostinger.com/support/4146975-what-is-dns-propagation-at-hostinger/)

After the final domain is known:

1. Set `SITE_URL` to its HTTPS origin.
2. Set `CONTACT_ALLOWED_ORIGINS` to the non-`www` and `www` origins that genuinely serve the website.
3. Use **Settings & Redeploy** so the new environment values are built into the application.

## 8. Enable and verify SSL

Hostinger normally installs its included SSL automatically when the domain is connected.

1. Open the website dashboard.
2. Go to **Security → SSL**.
3. Confirm the production domain shows an active/installed certificate.
4. Open both `https://domain` and `https://www.domain` if both are configured.
5. Confirm HTTP redirects to HTTPS.
6. Confirm there are no certificate-name, mixed-content, or redirect-loop warnings.

Do not purchase a separate certificate unless the client explicitly requests it and Hostinger's included SSL is unavailable. See [Hostinger's free SSL guide](https://support.hostinger.com/en/articles/1575761-how-to-claim-a-free-ssl-that-comes-with-a-hostinger-hosting-plan).

## 9. Configure Google Workspace SMTP

1. Confirm the domain's MX records still point to Google Workspace and that `admin@mindrythm.com` can receive mail.
2. Sign in to Google Account as `admin@mindrythm.com` with 2-Step Verification enabled.
3. Create a dedicated App Password at `https://myaccount.google.com/apppasswords`.
4. In Hostinger hPanel, open the Node.js app's **Environment variables** and update `SMTP_PASSWORD` with the generated value. Never use the Gmail or hPanel account password.
5. Add/update the remaining SMTP variables listed in section 4 and redeploy after changing them.
6. Confirm the domain's MX, SPF, and DKIM records remain valid. Add DMARC according to the client's email policy.

The recipient is intentionally fixed in `lib/smtp.ts` as `admin@mindrythm.com`. Do not make it visitor-controlled or expose SMTP credentials to the browser.

## 10. Deploy Sanity Studio

The Studio is already configured for Sanity-hosted deployment at:

`https://mindrythm-cms.sanity.studio`

To rebuild and deploy it with the final Hostinger preview URL:

```bash
export SANITY_STUDIO_PREVIEW_URL=https://mindrythm.com
pnpm run studio:validate
pnpm run studio:build
pnpm run studio:deploy
```

The Sanity CLI may request a Sanity login. Complete it using a project member account. Never place a Viewer token directly in `sanity.config.ts`; Sanity-hosted Studio assets are publicly served even though content editing remains authenticated.

Add the final website origin to Sanity CORS:

```bash
pnpm exec sanity cors add https://mindrythm.com --credentials
pnpm exec sanity cors add https://www.mindrythm.com --credentials
pnpm exec sanity cors list
```

Alternatively:

1. Open `https://www.sanity.io/manage`.
2. Select **Mindrythm CMS**.
3. Open **Settings → API settings**.
4. Under **CORS Origins**, add the exact trusted production origin(s).
5. Enable credentials for Presentation/draft preview.

Sanity recommends `sanity deploy` for its hosted Studio and requires trusted frontend origins for authenticated preview. See [Sanity Studio deployment](https://www.sanity.io/docs/studio/deployment), [Sanity CORS](https://www.sanity.io/docs/content-lake/cors), and [Presentation configuration](https://www.sanity.io/docs/visual-editing/configuring-the-presentation-tool).

## 11. Verify the CMS

1. Open `https://mindrythm-cms.sanity.studio` in a private/incognito browser.
2. Confirm an unauthenticated visitor cannot edit content.
3. Sign in with an invited Sanity project member.
4. Confirm these areas are available:
   - Hero
   - About
   - Services
   - Portfolio / Projects
   - Gallery
   - Testimonials
   - Team
   - Contact Information
   - Footer
   - Social Media Links
   - SEO Settings
   - Privacy Policy
   - Terms & Conditions
5. Open **Presentation** and confirm the iframe uses the Hostinger HTTPS domain.
6. Make a harmless draft-only text edit and confirm it appears in preview.
7. Discard the draft without publishing, or publish and immediately restore the approved text.
8. Confirm the public website still loads published content in an incognito browser without a Sanity login.
9. Confirm `/studio` redirects to the Sanity-hosted Studio.

Do not run `pnpm studio:seed` after the client has started editing unless intentionally restoring/replacing approved CMS content. The seed operation can overwrite documents.

## 12. Test the enquiry form

### 12.1 Browser validation

1. Open `/contact` on the final HTTPS domain.
2. Submit the empty form.
3. Confirm browser validation focuses the first required field.
4. Enter an invalid email or phone and confirm submission is prevented or rejected.
5. Confirm the submit button shows its loading state while sending.

### 12.2 Real delivery test

Use a real reply-capable test address:

1. Full name: `Production acceptance test`.
2. Phone: a valid controlled test number.
3. Service: `Property photography`.
4. Query: clearly label it as a deployment acceptance test.
5. Submit once.
6. Confirm the success message is shown.
7. Sign in to `admin@mindrythm.com` and confirm the message arrived.
8. Check Spam/Junk if it is not in Inbox.
9. Confirm the email contains the name, phone, email, service, and enquiry text.
10. Click Reply and confirm the visitor's supplied email is the reply-to address.

### 12.3 Security/error test

- Confirm an invalid request receives a validation error.
- Confirm requests from an unlisted `Origin` receive `403`.
- Confirm malformed or non-JSON requests are rejected.
- Confirm a missing/incorrect SMTP configuration produces the controlled user-facing error and does not expose secrets.
- Do not repeatedly submit the real form; the free rate limiter intentionally blocks excessive attempts.

## 13. Full live-site acceptance test

Test desktop, mobile, incognito, and a second browser.

### Routes

- `/`
- `/services`
- `/work`
- `/gallery`
- `/team`
- `/story`
- `/contact`
- `/privacy`
- `/terms`
- `/studio` (expected redirect to Sanity Studio)

### Visual and interaction checks

- Loading screen starts on the approved off-white background.
- Percentage counter and text animation run.
- Loading screen fades smoothly into the hero.
- The three approved hero media items load and rotate correctly.
- Header and overlay menus open, close, and navigate correctly.
- Home links return to the hero without replaying the loader.
- Service selection changes only the relevant media group.
- Service links open `/work?service=...` with the correct active filter.
- Work project details expand and collapse.
- Gallery lightbox opens and closes.
- Team interactions work.
- Google testimonial link opens the correct Google Business page.
- Back-to-top control works.
- Contact map loads.
- Footer links, social links, Privacy, Terms, and Admin work.
- No layout overflow appears at mobile widths.
- No design, content, animation, spacing, font, color, or responsive change is visible compared with the approved version.

### Technical checks

- Every route returns `200`, except `/studio`, which redirects intentionally.
- Images return `200` with image MIME types.
- Videos support byte-range requests and return `206` with `video/mp4`.
- Favicon loads from `/favicon.svg`.
- Open Graph image loads from `/og-final.png`.
- Browser console has no errors.
- Network panel has no unexpected `404`, `403`, `500`, or CORS failures.
- HTTPS is valid with no mixed content.
- SEO title, description, Open Graph, and Twitter metadata are present.
- CMS published content loads while signed out.
- One real enquiry reaches `admin@mindrythm.com`.

## 14. Common deployment issues

| Symptom | Likely cause | Resolution |
| --- | --- | --- |
| Hostinger cannot find the repository | GitHub App lacks repository access or the hosting plan is connected to another GitHub account | Update the Hostinger GitHub App's repository permissions; reconnect from hPanel. Verify the selected account and repository before redeploying. |
| `package.json not found` | Wrong repository root or incorrect ZIP structure | Deploy the repository root containing `package.json`; do not nest the project inside another folder. |
| Install fails with lockfile error | Incorrect package manager or stale lockfile | Select pnpm and run `pnpm install --frozen-lockfile` locally. Commit an intentional lockfile update before redeploying. |
| Build fails on Node version | Hostinger selected an incompatible runtime | Select Node.js 22.x, matching `package.json` and `.nvmrc`. |
| Build runs but app will not start | Static deployment or wrong start command | Use a server-side Next.js Web App and `pnpm start`; do not deploy only `out` or `public_html`. |
| Hostinger returns `403` after deployment | Generated routing `.htaccess` is missing/stale | Use **Settings & Redeploy** so Hostinger regenerates the Node.js routing file. Do not hand-edit it first. |
| A route returns `404` on direct navigation | App was treated as a static site or routing is stale | Confirm Next.js server deployment and redeploy to regenerate routing. |
| Images/videos work locally but not live | Missing Git files, filename case mismatch, incorrect MIME/range handling, or stale build | Confirm assets are committed under `public`, use exact filename case, inspect deployment log, and check network responses. Do not replace/compress approved media as a deployment workaround. |
| Sanity content is missing for signed-out visitors | Documents are drafts/private IDs, dataset/project ID is wrong, or references are broken | Confirm published documents in dataset `production`, project `n9nyugiq`, and valid public references. Do not expose a secret token in client code. |
| Sanity preview opens the old Vercel site | Studio was built with an old preview URL | Set `SANITY_STUDIO_PREVIEW_URL` to the Hostinger HTTPS origin and run `pnpm studio:deploy`. |
| Sanity preview reports CORS errors | Production origin is absent or credentials are disabled | Add the exact origin under Sanity **Settings → API settings → CORS Origins**, allowing credentials only for trusted origins. |
| Enquiry returns `403` | `SITE_URL` or `CONTACT_ALLOWED_ORIGINS` does not match the browser origin | Correct the exact scheme/hostname values and redeploy. |
| Enquiry cannot be delivered | SMTP variables are incomplete/invalid or Google rejects the App Password | Verify `smtp.gmail.com`, port `465`, `SMTP_SECURE=true`, the full mailbox address, and a fresh App Password for `admin@mindrythm.com`; inspect Hostinger runtime logs. |
| SMTP authentication fails | Wrong mailbox/app password or username | Use the full mailbox address, reset/create the dedicated password, update `SMTP_PASSWORD`, and redeploy. |
| SMTP times out | Wrong port/secure pairing or provider/network issue | Use `465` + `SMTP_SECURE=true`; if Hostinger specifically requires STARTTLS, use `587` + `false`. |
| Email arrives in spam | SPF/DKIM/DMARC missing or sender mismatch | Verify Hostinger email DNS records and keep `SMTP_FROM_EMAIL` on the authenticated domain. |
| Environment variable change has no effect | The application has not been rebuilt | Use **Settings & Redeploy**; Hostinger applies changed environment values on rebuild. |
| SSL is pending | DNS is not fully propagated or records point elsewhere | Check hPanel DNS status, allow up to 24 hours, then recheck **Security → SSL**. Do not purchase another certificate during normal propagation. |
| High process usage | Older Hostinger Next.js deployment process model | Use **Settings & Redeploy**; current Hostinger deployments apply its Next.js process optimization automatically. |

Use Hostinger's **Deployments** build logs and **Runtime Logs** before changing code. Remove secrets before sharing logs. References: [build-error troubleshooting](https://www.hostinger.com/support/how-to-troubleshoot-a-failed-node-js-deployment-using-build-logs/) and [runtime logs](https://www.hostinger.com/support/how-to-use-node-js-runtime-logs-at-hostinger/).

## 15. Rollback procedure

### 15.1 Safest initial-launch strategy

Do not switch production DNS until the Hostinger temporary URL has passed the complete acceptance test. If the initial Hostinger build fails before DNS is changed, the approved Vercel site remains live and no public rollback is necessary.

### 15.2 Roll back application code

Use Git history; do not force-push or reset shared `main`.

```bash
git switch main
git pull --ff-only origin main
git log --oneline --decorate -10
git revert <bad-commit-sha>
pnpm install --frozen-lockfile
pnpm run build
node --test tests/rendered-html.test.mjs
git push origin main
```

Hostinger should automatically deploy the new revert commit. If automatic deployment is disabled, open **Deployments → Settings & Redeploy** and deploy the current `main` branch once.

### 15.3 Roll back environment configuration

1. Record current variable names and masked values before changing them.
2. Restore the last known-good values in **Settings & Redeploy**.
3. Redeploy once.
4. Verify the affected feature.

Never paste secrets into a Git commit as a rollback shortcut.

### 15.4 Roll back DNS/domain

If the Hostinger application fails after DNS is switched:

1. Restore the previously recorded nameservers/A/CNAME records that pointed to the last known-good site.
2. Preserve all MX/SPF/DKIM/DMARC records.
3. Allow DNS propagation.
4. Keep the Hostinger temporary URL for diagnosis.

DNS rollback is not instant. This is why Hostinger acceptance testing must happen before the first DNS cutover.

### 15.5 Roll back CMS content

Use Sanity Studio's document history to restore the previous published revision. Do not run the seed script as a general rollback after editors have begun working.

### 15.6 Failed deployment rule

If a deployment fails:

1. Stop.
2. Record the exact Hostinger build/runtime error and deployment ID/time.
3. Do not retry unchanged settings or code repeatedly.
4. Correct the identified cause locally.
5. Re-run the production checks.
6. Commit and push the fix.
7. Deploy once and verify.

## 16. Future maintenance

### Content-only changes

- Editors use `https://mindrythm-cms.sanity.studio`.
- Save drafts, use Presentation preview, then Publish.
- No GitHub or Hostinger deployment is normally required for published content changes.
- Always add descriptive alt text to uploaded images.
- Use appropriately licensed client media only.

### Code changes

```bash
git switch main
git pull --ff-only origin main
pnpm install --frozen-lockfile
pnpm run lint
pnpm exec tsc --noEmit --incremental false
pnpm run studio:validate
pnpm run build
node --test tests/rendered-html.test.mjs
git add <intentional-files>
git commit -m "Describe the production change"
git push origin main
```

After the push, inspect the Hostinger deployment log and run targeted acceptance tests. Do not change the approved design unless the client separately approves a redesign.

### Dependency maintenance

- Review dependency updates monthly or quarterly.
- Run `pnpm audit --prod` before deployment.
- Test upgrades locally before merging.
- Never approve an automated dependency PR without reviewing the build and visual behavior.
- Keep Node.js on an actively supported version compatible with Hostinger; this repository currently targets 22.x.

### Secret maintenance

- Rotate the SMTP password and Sanity Viewer token when access changes or exposure is suspected.
- Update secrets only in Hostinger/Sanity, not GitHub.
- Redeploy after Hostinger environment changes.
- Remove departing staff from Hostinger, GitHub, Sanity, DNS, and mailbox access.

### Monitoring

- Check Hostinger build and runtime logs after each deployment.
- Monitor Hostinger resource usage.
- Test one enquiry monthly.
- Check the domain and SSL renewal status.
- Verify the mailbox quota and spam folder.
- Periodically open the site in incognito on desktop and mobile.

## 17. Deployment command reference

```bash
# Repository
git clone https://github.com/jannat-website-idea/mindrythm-studio.git
cd mindrythm-studio
git switch main
git pull --ff-only origin main

# Install and verify
corepack enable
pnpm install --frozen-lockfile
pnpm run lint
pnpm exec tsc --noEmit --incremental false
pnpm audit --prod
pnpm run build
node --test tests/rendered-html.test.mjs

# Run the production build locally
pnpm start

# Sanity
pnpm run studio:dev
pnpm run studio:validate
pnpm run studio:build
SANITY_STUDIO_PREVIEW_URL=https://mindrythm.com pnpm run studio:deploy
pnpm exec sanity cors add https://mindrythm.com --credentials
pnpm exec sanity cors add https://www.mindrythm.com --credentials
pnpm exec sanity cors list

# Git-based rollback
git log --oneline --decorate -10
git revert <bad-commit-sha>
pnpm run build
node --test tests/rendered-html.test.mjs
git push origin main
```

## 18. Final live checklist

### Hosting and source

- [ ] Hostinger Managed Node.js Web App exists on an eligible existing plan.
- [ ] GitHub repository is `jannat-website-idea/mindrythm-studio`.
- [ ] Deployment branch is `main`.
- [ ] The deployed commit matches the approved GitHub commit.
- [ ] Framework is Next.js and Node.js is 22.x.
- [ ] Install, build, and start commands match section 6.
- [ ] Latest Hostinger build and runtime logs contain no unexpected errors.

### Configuration and security

- [ ] All required Hostinger environment variables are present.
- [ ] No secret is stored in GitHub or exposed as `NEXT_PUBLIC_*`.
- [ ] `SITE_URL` and `CONTACT_ALLOWED_ORIGINS` match the live HTTPS domain.
- [ ] Google Workspace SMTP variables use a dedicated App Password for `admin@mindrythm.com`, not the Gmail or hPanel password.
- [ ] Sanity CORS contains only trusted development/production origins.
- [ ] Production dependency audit is clean.

### Domain and SSL

- [ ] Custom domain is connected to the Node.js application.
- [ ] DNS has propagated.
- [ ] Existing email DNS records remain valid.
- [ ] Included Hostinger SSL is active.
- [ ] HTTP redirects to HTTPS.
- [ ] Both `www` and non-`www` behavior is intentional and consistent.

### Website

- [ ] Every public route passes direct-navigation testing.
- [ ] Loading animation and hero transition match the approved version.
- [ ] Desktop and mobile layouts match the approved version.
- [ ] Every image and video loads with the correct MIME/range response.
- [ ] All navigation, filters, lightboxes, links, and forms work.
- [ ] SEO metadata, favicon, and social preview image are correct.
- [ ] Browser console/network logs contain no unexpected errors or 404s.
- [ ] Privacy Policy and Terms & Conditions are accessible.

### CMS

- [ ] Sanity Studio opens and requires an authorized member login.
- [ ] Presentation previews the Hostinger domain.
- [ ] Draft preview works.
- [ ] Published content loads for signed-out visitors.
- [ ] All client-editable content types are available.
- [ ] `/studio` redirects to the hosted CMS.

### Enquiry/email

- [ ] Form validation works.
- [ ] Loading, success, and error states work.
- [ ] Spam and origin protection work.
- [ ] A single real enquiry arrives at `admin@mindrythm.com`.
- [ ] Reply-to targets the visitor's supplied email.
- [ ] SPF and DKIM pass for the received test message.

### Handover completion

- [ ] Final live URL is recorded below.
- [ ] Deployment date and commit are recorded below.
- [ ] Client has Hostinger, GitHub, Sanity, DNS, and mailbox access.
- [ ] Rollback records and previous DNS values are stored securely.
- [ ] No additional paid service has been introduced.

## 19. Final production record

Complete this after launch:

| Item | Final value |
| --- | --- |
| Live URL | `TBD` |
| Deployment date | `TBD` |
| Git commit | `TBD` |
| Hostinger deployment status | `TBD` |
| SSL status | `TBD` |
| Sanity Studio | `https://mindrythm-cms.sanity.studio` |
| Enquiry acceptance test | `TBD` |
| Approved by | `TBD` |
