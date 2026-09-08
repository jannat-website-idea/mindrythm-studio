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
          {title: "Visual production (photography + videography)", value: "visual-production"},
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
    defineField({
      name: "galleryItems",
      title: "Mini-gallery items (5-6 pictures/videos from Gallery)",
      description: "Select 5-6 items from your Gallery to display in the Read More pop-up window for this service. These are directly linked to your Gallery.",
      type: "array",
      of: [{type: "reference", to: [{type: "galleryItem"}]}],
      validation: (Rule) => Rule.max(10).unique(),
    }),
    defineField({
      name: "websiteLinks",
      title: "Website links / buttons (for Website Development)",
      description: "Add links to live websites (e.g. Www.khelatbhawan.com). These will render as square/rounded-square clickable buttons inside the Read More window. You can add as many as needed.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({name: "title", title: "Button label / Title", type: "string", validation: (Rule) => Rule.required()}),
            defineField({name: "url", title: "Website URL", type: "string", validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: "title", subtitle: "url"}},
        },
      ],
    }),
    defineField({
      name: "logoImages",
      title: "Logo showcase images (for Logo Generation)",
      description: "Upload logo images in PNG or JPG format to show inside the Read More window for Logo Generation.",
      type: "array",
      of: [
        {
          type: "image",
          options: {hotspot: true},
          fields: [
            defineField({name: "alt", title: "Alternative text", type: "string"}),
            defineField({name: "caption", title: "Brand name / caption", type: "string"}),
          ],
        },
      ],
    }),
    defineField({name: "projects", title: "Relevant projects", description: "Optional. The service falls back to other projects if none are selected.", type: "array", of: [{type: "reference", to: [{type: "project"}]}], validation: (Rule) => Rule.max(6).unique()}),
  ],
  orderings: [{title: "Display order", name: "sortOrderAsc", by: [{field: "sortOrder", direction: "asc"}]}],
  preview: {select: {title: "title", subtitle: "copy"}},
});
