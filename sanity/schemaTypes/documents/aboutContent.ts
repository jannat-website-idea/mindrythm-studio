import {defineField, defineType} from "sanity";

export const aboutContent = defineType({
  name: "aboutContent",
  title: "About & studio story",
  type: "document",
  groups: [
    {name: "homepage", title: "Homepage media & banners"},
    {name: "vision", title: "Vision"},
    {name: "mission", title: "Mission"},
    {name: "website", title: "Website copy"},
  ],
  fields: [
    defineField({
      name: "processBannerMedia",
      title: "Process banner image/video ('From first conversation to final frame')",
      description: "Upload the photo or video shown in the process section on the homepage.",
      type: "mediaAsset",
      group: "homepage",
    }),
    defineField({
      name: "visionBridgeImages",
      title: "Vision horizontal scroll images (replacing 'many ways of seeing')",
      description: "Upload images for the full-width left-to-right scrollable strip on the homepage.",
      type: "array",
      group: "homepage",
      of: [{type: "image", options: {hotspot: true}}],
    }),
    defineField({name: "visionParagraphs", title: "Vision paragraphs", type: "array", group: "vision", of: [{type: "text", rows: 6}], validation: (Rule) => Rule.required().min(1)}),
    defineField({name: "missionParagraphs", title: "Mission paragraphs", type: "array", group: "mission", of: [{type: "text", rows: 6}], validation: (Rule) => Rule.required().min(1)}),
    defineField({name: "teamIntroduction", title: "Team introduction", type: "text", rows: 8, group: "website", validation: (Rule) => Rule.required()}),
    defineField({name: "brandTaglines", title: "Editorial interlude lines", type: "array", group: "website", of: [{type: "string"}], validation: (Rule) => Rule.required().min(1)}),
    defineField({name: "enquiryTaglines", title: "Enquiry reassurance lines", type: "array", group: "website", of: [{type: "string"}], validation: (Rule) => Rule.required().min(1)}),
  ],
  preview: {prepare: () => ({title: "About & studio story", subtitle: "Vision, mission and editorial copy"})},
});
