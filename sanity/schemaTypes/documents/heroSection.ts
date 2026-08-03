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
      title: "Hero media — exactly three projects",
      type: "array",
      of: [{type: "reference", to: [{type: "project"}]}],
      validation: (Rule) => Rule.required().min(3).max(3).unique(),
    }),
    defineField({
      name: "visionHighlights",
      title: "Vision statements",
      type: "array",
      of: [{type: "string"}],
      validation: (Rule) => Rule.required().min(3).max(3),
    }),
  ],
  preview: {prepare: () => ({title: "Hero section", subtitle: "Homepage headline and three featured visuals"})},
});
