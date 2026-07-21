import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contentItems = sqliteTable("content_items", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  title: text("title").notNull(),
  eyebrow: text("eyebrow").notNull().default(""),
  body: text("body").notNull().default(""),
  mediaUrl: text("media_url").notNull().default(""),
  mediaAlt: text("media_alt").notNull().default(""),
  category: text("category").notNull().default(""),
  year: text("year").notNull().default(""),
  href: text("href").notNull().default(""),
  accent: text("accent").notNull().default("forest"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  query: text("query").notNull(),
  createdAt: text("created_at").notNull(),
});
