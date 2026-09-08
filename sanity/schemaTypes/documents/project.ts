import {defineField, defineType} from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({name: "cmsId", title: "Project ID", type: "slug", options: {source: "title", maxLength: 80}, validation: (Rule) => Rule.required()}),
    defineField({name: "sortOrder", title: "Display order", type: "number", initialValue: 100, validation: (Rule) => Rule.required().integer().min(0)}),
    defineField({name: "title", title: "Project title", type: "string", validation: (Rule) => Rule.required().max(90)}),
    defineField({name: "eyebrow", title: "Project type", type: "string", validation: (Rule) => Rule.required().max(90)}),
    defineField({name: "body", title: "Project description", type: "text", rows: 5, validation: (Rule) => Rule.required()}),
    defineField({name: "media", title: "Primary media", type: "mediaAsset", validation: (Rule) => Rule.required()}),
    defineField({
      name: "mediaType",
      title: "Media type",
      type: "string",
      options: {list: [{title: "Image", value: "image"}, {title: "Video", value: "video"}], layout: "dropdown"},
      initialValue: "image",
    }),
    defineField({name: "category", title: "Category label", type: "string", validation: (Rule) => Rule.required().max(70)}),
    defineField({name: "year", title: "Year", type: "string", validation: (Rule) => Rule.max(12)}),
    defineField({
      name: "services",
      title: "Services provided for this project",
      description: "Select all services that apply to this project (e.g. Visual Production, Website Development, Drone Imagery). This powers the filters in the Our Work menu.",
      type: "array",
      of: [{type: "reference", to: [{type: "service"}]}],
    }),
    defineField({name: "href", title: "Project link or anchor", type: "string"}),
    defineField({name: "accent", title: "Editorial accent", type: "string", options: {list: ["forest", "rust", "ink", "sage", "lime"]}, initialValue: "forest", validation: (Rule) => Rule.required()}),
  ],
  orderings: [{title: "Display order", name: "sortOrderAsc", by: [{field: "sortOrder", direction: "asc"}]}],
  preview: {select: {title: "title", subtitle: "category", media: "media.image"}},
});
