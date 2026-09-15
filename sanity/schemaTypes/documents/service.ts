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
    defineField({
      name: "discipline",
      title: "Discipline / Category Tag",
      description: "e.g. Cinema & Stills, Aerial Perspective, Digital Infrastructure, Brand Identity, Performance Growth, Community Cadence, Commercial Strategy, Content Creation",
      type: "string",
    }),
    defineField({name: "copy", title: "Service description / summary", type: "text", rows: 3, validation: (Rule) => Rule.required().max(500)}),
    defineField({
      name: "details",
      title: "Extended details / Overview narrative",
      description: "Long-form description shown inside the Read More pop-up window.",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "highlights",
      title: "Service highlight pills / Badges",
      description: "Badges shown on the service card (e.g. 'Bespoke Web Design', 'Next.js Architecture', 'CMS Integration').",
      type: "array",
      of: [{type: "string"}],
    }),
    defineField({
      name: "deliverables",
      title: "Key Deliverables & Scope Items",
      description: "Deliverables list shown inside the Read More pop-up window.",
      type: "array",
      of: [{type: "string"}],
    }),
    defineField({
      name: "coverMedia",
      title: "Featured Cover Media (Image or Video)",
      description: "Directly upload a high-res photo or video for Visual Production & Drone Imagery.",
      type: "mediaAsset",
    }),
    defineField({
      name: "galleryItems",
      title: "Mini-gallery items (Selected from Gallery)",
      description: "Select items from your Gallery to display in the Read More pop-up window for this service.",
      type: "array",
      of: [{type: "reference", to: [{type: "galleryItem"}]}],
      validation: (Rule) => Rule.max(12).unique(),
    }),
    defineField({
      name: "showcaseMedia",
      title: "Direct Media Showcase Uploads (Images / Videos)",
      description: "Upload any pictures or videos directly to display in the Read More pop-up window for this service.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({name: "title", title: "Media title / caption", type: "string"}),
            defineField({name: "image", title: "Image upload", type: "image", options: {hotspot: true}}),
            defineField({name: "video", title: "Video upload (MP4/WebM)", type: "file", options: {accept: "video/mp4,video/webm,video/quicktime"}}),
            defineField({name: "externalUrl", title: "External Video/Image URL", type: "string"}),
          ],
          preview: {
            select: {title: "title", media: "image"},
          },
        },
      ],
    }),
    defineField({
      name: "websiteLinks",
      title: "Website links / buttons",
      description: "Add links to live websites (e.g. www.khelatbhawan.com). These render as clickable buttons inside the Read More window.",
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
      title: "Logo showcase images",
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

