import {defineField, defineType} from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Service identifier / key",
      description: "Select an existing service category or type a custom slug.",
      type: "string",
      options: {
        list: [
          {title: "Premium visual production (photography + videography)", value: "visual-production"},
          {title: "Drone imagery", value: "drone-imagery"},
          {title: "Website development", value: "web-development"},
          {title: "Logo generation", value: "logo-generation"},
          {title: "Meta Ads", value: "meta-ads"},
          {title: "Social media management", value: "social-management"},
          {title: "Commercial Branding", value: "commercial-branding"},
          {title: "Social media creatives", value: "social-creatives"},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: "sortOrder", title: "Display order", type: "number", initialValue: 10, validation: (Rule) => Rule.required().integer().min(0)}),
    defineField({name: "title", title: "Service name", type: "string", validation: (Rule) => Rule.required().max(100)}),
    defineField({name: "copy", title: "Service description", type: "text", rows: 4, validation: (Rule) => Rule.required().max(500)}),
    defineField({name: "projects", title: "Relevant projects", description: "Optional. The service falls back to other projects if none are selected.", type: "array", of: [{type: "reference", to: [{type: "project"}]}], validation: (Rule) => Rule.max(6).unique()}),
  ],
  orderings: [{title: "Display order", name: "sortOrderAsc", by: [{field: "sortOrder", direction: "asc"}]}],
  preview: {select: {title: "title", subtitle: "copy"}},
});
