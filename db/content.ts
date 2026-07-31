import { env } from "cloudflare:workers";
import {
  defaultContent,
  defaultItems,
  defaultSettings,
  filmsInstagramUrl,
  mainInstagramUrl,
  type ContentItem,
  type SiteContent,
  type SiteSettings,
} from "@/lib/content";

const CREATE_CONTENT_ITEMS = `
  CREATE TABLE IF NOT EXISTS content_items (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    title TEXT NOT NULL,
    eyebrow TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    media_url TEXT NOT NULL DEFAULT '',
    media_alt TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    year TEXT NOT NULL DEFAULT '',
    href TEXT NOT NULL DEFAULT '',
    accent TEXT NOT NULL DEFAULT 'forest',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

const CREATE_SITE_SETTINGS = `
  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

const CREATE_SORT_INDEX =
  "CREATE INDEX IF NOT EXISTS content_items_sort_idx ON content_items(sort_order)";

const CREATE_ENQUIRIES = `
  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    query TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`;

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  query: string;
  createdAt: string;
};

function database(): D1Database {
  const db = env.DB as D1Database | undefined;
  if (!db) throw new Error("The Mindrythm content database is unavailable.");
  return db;
}

async function ensureDatabase() {
  const db = database();
  await db.batch([
    db.prepare(CREATE_CONTENT_ITEMS),
    db.prepare(CREATE_SITE_SETTINGS),
    db.prepare(CREATE_SORT_INDEX),
    db.prepare(CREATE_ENQUIRIES),
  ]);

  const itemCount = await db
    .prepare("SELECT COUNT(*) AS count FROM content_items")
    .first<{ count: number }>();

  if (!itemCount?.count) {
    const now = new Date().toISOString();
    await db.batch(
      defaultItems.map((item) =>
        db
          .prepare(
            `INSERT INTO content_items
              (id, kind, sort_order, title, eyebrow, body, media_url, media_alt, category, year, href, accent, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .bind(
            item.id,
            item.kind,
            item.sortOrder,
            item.title,
            item.eyebrow,
            item.body,
            item.mediaUrl,
            item.mediaAlt,
            item.category,
            item.year,
            item.href,
            item.accent,
            now,
            now,
          ),
      ),
    );
  }

  await db
    .prepare(
      `UPDATE content_items
       SET media_url = ?, media_alt = ?, updated_at = ?
       WHERE id = ? AND media_url = ?`,
    )
    .bind(
      "/images/wedding-palace-hero.png",
      "Indian newlyweds walking through an elegant candlelit palace courtyard",
      new Date().toISOString(),
      "wedding-celebration",
      "/images/wedding-celebration.jpg",
    )
    .run();

  const settings = await db
    .prepare("SELECT key FROM site_settings WHERE key = ?")
    .bind("site")
    .first();

  if (!settings) {
    await db
      .prepare(
        "INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)",
      )
      .bind("site", JSON.stringify(defaultSettings), new Date().toISOString())
      .run();
  }
}

function rowToItem(row: Record<string, unknown>): ContentItem {
  return {
    id: String(row.id),
    kind: row.kind as ContentItem["kind"],
    sortOrder: Number(row.sort_order),
    title: String(row.title),
    eyebrow: String(row.eyebrow ?? ""),
    body: String(row.body ?? ""),
    mediaUrl: String(row.media_url ?? ""),
    mediaAlt: String(row.media_alt ?? ""),
    category: String(row.category ?? ""),
    year: String(row.year ?? ""),
    href: String(row.href ?? ""),
    accent: String(row.accent ?? "forest"),
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    await ensureDatabase();
    const db = database();
    const [itemsResult, settingsRow] = await Promise.all([
      db.prepare("SELECT * FROM content_items ORDER BY sort_order, created_at").all(),
      db
        .prepare("SELECT value FROM site_settings WHERE key = ?")
        .bind("site")
        .first<{ value: string }>(),
    ]);

    const mergedSettings = settingsRow?.value
      ? ({ ...defaultSettings, ...JSON.parse(settingsRow.value) } as SiteSettings)
      : defaultSettings;
    if (mergedSettings.contactEmail === "hello@mindrythm.studio") {
      mergedSettings.contactEmail = defaultSettings.contactEmail;
    }
    const savedInstagram = mergedSettings.instagram.trim().replace(/\/+$/, "").toLowerCase();
    const legacyInstagramLinks = new Set([
      "https://instagram.com",
      "https://www.instagram.com",
      filmsInstagramUrl.replace(/\/+$/, "").toLowerCase(),
      "https://instagram.com/mindrythm.films",
    ]);
    if (!savedInstagram || legacyInstagramLinks.has(savedInstagram)) {
      mergedSettings.instagram = mainInstagramUrl;
    }
    if (["MINDRYTHM", "MIND RHYTHM", "Mind Rhythm", "Mindrythm studio", "Mindrythm Studio", "Mind Rythm Studio", "MindRythm", "MindRythm Studio"].includes(mergedSettings.siteName)) {
      mergedSettings.siteName = defaultSettings.siteName;
    }

    const normalizeBrandName = (value: string) => value
      .replace(/\bMind\s*Rythm(?:\s+Studio)?\b/gi, "Mindrythm")
      .replace(/\bMind\s*Rhythm(?:\s+Studio)?\b/gi, "Mindrythm")
      .replace(/\bMindrythm\s+Studio\b/gi, "Mindrythm")
      .replace(/\bMindrythm\b/gi, "Mindrythm");
    mergedSettings.siteName = normalizeBrandName(mergedSettings.siteName);
    mergedSettings.tagline = normalizeBrandName(mergedSettings.tagline);
    mergedSettings.description = normalizeBrandName(mergedSettings.description);
    mergedSettings.vision = normalizeBrandName(mergedSettings.vision);
    mergedSettings.idea = normalizeBrandName(mergedSettings.idea);

    const savedItems = (itemsResult.results as Record<string, unknown>[]).map((row) => {
      const item = rowToItem(row);
      return {
        ...item,
        title: normalizeBrandName(item.title),
        eyebrow: normalizeBrandName(item.eyebrow),
        body: normalizeBrandName(item.body),
        mediaAlt: normalizeBrandName(item.mediaAlt),
        category: normalizeBrandName(item.category),
      };
    });
    const legacySeedIds = new Set(["quiet-frequency", "in-passing", "field-notes", "object-ritual"]);
    const hasLegacySeed = savedItems.some((item) => legacySeedIds.has(item.id) && ["Quiet Frequency", "In Passing", "Field Notes", "Object / Ritual"].includes(item.title));
    const defaultIds = new Set(defaultItems.map((item) => item.id));
    const items = hasLegacySeed
      ? [...defaultItems, ...savedItems.filter((item) => !legacySeedIds.has(item.id) && !defaultIds.has(item.id))]
      : savedItems;

    return {
      settings: mergedSettings,
      items,
    };
  } catch {
    return defaultContent;
  }
}

export async function saveSettings(settings: SiteSettings) {
  await ensureDatabase();
  await database()
    .prepare(
      `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .bind("site", JSON.stringify(settings), new Date().toISOString())
    .run();
}

export async function saveItem(item: ContentItem) {
  await ensureDatabase();
  const now = new Date().toISOString();
  await database()
    .prepare(
      `INSERT INTO content_items
        (id, kind, sort_order, title, eyebrow, body, media_url, media_alt, category, year, href, accent, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
        kind = excluded.kind,
        sort_order = excluded.sort_order,
        title = excluded.title,
        eyebrow = excluded.eyebrow,
        body = excluded.body,
        media_url = excluded.media_url,
        media_alt = excluded.media_alt,
        category = excluded.category,
        year = excluded.year,
        href = excluded.href,
        accent = excluded.accent,
        updated_at = excluded.updated_at`,
    )
    .bind(
      item.id,
      item.kind,
      item.sortOrder,
      item.title,
      item.eyebrow,
      item.body,
      item.mediaUrl,
      item.mediaAlt,
      item.category,
      item.year,
      item.href,
      item.accent,
      now,
      now,
    )
    .run();
}

export async function removeItem(id: string) {
  await ensureDatabase();
  await database().prepare("DELETE FROM content_items WHERE id = ?").bind(id).run();
}

export async function saveEnquiry(enquiry: Enquiry) {
  try {
    await ensureDatabase();
    await database()
      .prepare("INSERT INTO enquiries (id, name, phone, email, query, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(enquiry.id, enquiry.name, enquiry.phone, enquiry.email, enquiry.query, enquiry.createdAt)
      .run();
  } catch (error) {
    if (process.env.VERCEL !== "1") throw error;

    // The Vercel presentation deployment has no Cloudflare D1 binding.
    // Enquiry notification can still be delivered through Resend when its
    // environment variables are configured.
  }
}

export async function getEnquiries(): Promise<Enquiry[]> {
  try {
    await ensureDatabase();
    const result = await database().prepare("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 100").all();
    return (result.results as Record<string, unknown>[]).map((row) => ({
      id: String(row.id),
      name: String(row.name),
      phone: String(row.phone),
      email: String(row.email ?? ""),
      query: String(row.query),
      createdAt: String(row.created_at),
    }));
  } catch {
    return [];
  }
}
