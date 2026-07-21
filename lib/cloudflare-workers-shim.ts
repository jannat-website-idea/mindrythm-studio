/**
 * Node/Vercel compatibility for modules that normally receive bindings from
 * Cloudflare Workers. Empty bindings intentionally activate the site's
 * bundled-content fallback on Vercel.
 */
export const env: {
  DB?: D1Database;
  MEDIA?: R2Bucket;
  [key: string]: unknown;
} = {};
