import {defineField, defineType} from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({name: "key", title: "Service key", type: "string", options: {list: [
      {title: "Real-estate", value: "real-estate"},
      {title: "Hospitality", value: "hospitality"},
      {title: "Wellness", value: "wellness"},
      {title: "Wedding / Moments", value: "wedding"},
    ]}, validation: (Rule) => Rule.required()}),
    defineField({name: "sortOrder", title: "Display order", type: "number", validation: (Rule) => Rule.required().integer().min(0)}),
    defineField({name: "title", title: "Service name", type: "string", validation: (Rule) => Rule.required().max(60)}),
    defineField({name: "copy", title: "Service description", type: "text", rows: 4, validation: (Rule) => Rule.required().min(30).max(260)}),
    defineField({name: "projects", title: "Relevant projects", type: "array", of: [{type: "reference", to: [{type: "project"}]}], validation: (Rule) => Rule.required().min(1).max(6).unique()}),
  ],
  orderings: [{title: "Display order", name: "sortOrderAsc", by: [{field: "sortOrder", direction: "asc"}]}],
  preview: {select: {title: "title", subtitle: "copy"}},
});
