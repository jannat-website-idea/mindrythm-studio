import {defineField, defineType} from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery item",
  type: "document",
  fields: [
    defineField({name: "cmsId", title: "Item ID", type: "slug", options: {source: "title", maxLength: 80}, validation: (Rule) => Rule.required()}),
    defineField({name: "sortOrder", title: "Display order", description: "Lower numbers appear first.", type: "number", initialValue: 100, validation: (Rule) => Rule.required().integer().min(0)}),
    defineField({name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required().max(90)}),
    defineField({name: "body", title: "Description", type: "text", rows: 4}),
    defineField({name: "media", title: "Media", type: "mediaAsset", validation: (Rule) => Rule.required()}),
    defineField({name: "category", title: "Gallery section", type: "string", options: {list: ["Spaces", "Celebrations"]}, validation: (Rule) => Rule.required()}),
    defineField({
      name: "mediaType",
      title: "Media type",
      type: "string",
      options: {list: ["Image", "Video"], layout: "dropdown"},
      initialValue: "Image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "layoutType",
      title: "Layout type",
      description: "Defines the Bento slot size. The uploaded media dimensions never affect the grid.",
      type: "string",
      options: {list: [
        {title: "Large", value: "large"},
        {title: "Small", value: "small"},
      ], layout: "radio", direction: "horizontal"},
      initialValue: "large",
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: "href", title: "Optional link", type: "string"}),
  ],
  preview: {select: {title: "title", subtitle: "category", media: "media.image"}},
});
