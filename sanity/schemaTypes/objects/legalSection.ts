import {defineField, defineType} from "sanity";

export const legalSection = defineType({
  name: "legalSection",
  title: "Legal section",
  type: "object",
  fields: [
    defineField({name: "heading", title: "Heading", type: "string", validation: (Rule) => Rule.required().max(90)}),
    defineField({name: "body", title: "Text", type: "text", rows: 5, validation: (Rule) => Rule.required().min(20)}),
  ],
  preview: {select: {title: "heading", subtitle: "body"}},
});
