import {defineField, defineType} from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery item",
  type: "document",
  fields: [
    defineField({name: "cmsId", title: "Item ID", type: "slug", options: {source: "title", maxLength: 80}, validation: (Rule) => Rule.required()}),
    defineField({name: "sortOrder", title: "Display order", type: "number", validation: (Rule) => Rule.required().integer().min(0)}),
    defineField({name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required().max(90)}),
    defineField({name: "body", title: "Description", type: "text", rows: 4}),
    defineField({name: "media", title: "Media", type: "mediaAsset", validation: (Rule) => Rule.required()}),
    defineField({name: "category", title: "Gallery section", type: "string", options: {list: ["Spaces", "Celebrations"]}, validation: (Rule) => Rule.required()}),
    defineField({name: "href", title: "Optional link", type: "string"}),
  ],
  preview: {select: {title: "title", subtitle: "category", media: "media.image"}},
});
