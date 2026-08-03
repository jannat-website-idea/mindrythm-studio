import {defineField, defineType} from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Brand settings",
  type: "document",
  fields: [
    defineField({name: "siteName", title: "Studio name", type: "string", validation: (Rule) => Rule.required().max(60)}),
    defineField({name: "tagline", title: "Tagline", type: "string", validation: (Rule) => Rule.required().max(100)}),
    defineField({name: "description", title: "Short description", type: "text", rows: 4, validation: (Rule) => Rule.required().min(40).max(420)}),
    defineField({name: "vision", title: "Vision summary", type: "text", rows: 4, validation: (Rule) => Rule.required().min(40)}),
    defineField({name: "idea", title: "Approach summary", type: "text", rows: 4, validation: (Rule) => Rule.required().min(40)}),
  ],
  preview: {prepare: () => ({title: "Brand settings", subtitle: "Mindrythm global identity"})},
});
