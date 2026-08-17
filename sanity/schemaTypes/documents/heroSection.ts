import {defineField, defineType} from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero section",
  type: "document",
  fields: [
    defineField({name: "titleLineOne", title: "Headline — first line", type: "string", validation: (Rule) => Rule.required().max(40)}),
    defineField({name: "titleLineTwo", title: "Headline — second line", type: "string", validation: (Rule) => Rule.required().max(40)}),
    defineField({
      name: "featuredProjects",
      title: "Hero media — featured projects",
      description: "Pick up to three projects to feature. Deleting a project removes it from the hero automatically; the website fills from remaining projects.",
      type: "array",
      of: [{type: "reference", to: [{type: "project"}]}],
      validation: (Rule) => Rule.max(3).unique(),
    }),
    defineField({
      name: "visionHighlights",
      title: "Vision statements",
      type: "array",
      of: [{type: "string"}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {prepare: () => ({title: "Hero section", subtitle: "Homepage headline and featured visuals"})},
});
