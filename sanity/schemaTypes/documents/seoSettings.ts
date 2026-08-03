import {defineField, defineType} from "sanity";

export const seoSettings = defineType({
  name: "seoSettings",
  title: "SEO settings",
  type: "document",
  fields: [
    defineField({name: "title", title: "Search title", type: "string", validation: (Rule) => Rule.required().min(30).max(65)}),
    defineField({name: "description", title: "Search description", type: "text", rows: 3, validation: (Rule) => Rule.required().min(80).max(165)}),
    defineField({name: "shareImage", title: "Social sharing image", type: "image", options: {hotspot: true}, description: "Recommended: 1200 × 630 pixels."}),
    defineField({name: "shareImageFallback", title: "Existing social image path", type: "string"}),
  ],
  preview: {select: {title: "title", subtitle: "description", media: "shareImage"}},
});
