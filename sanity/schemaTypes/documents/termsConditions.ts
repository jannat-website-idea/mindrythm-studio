import {defineField, defineType} from "sanity";

export const termsConditions = defineType({
  name: "termsConditions",
  title: "Terms & conditions",
  type: "document",
  fields: [
    defineField({name: "eyebrow", title: "Page label", type: "string", validation: (Rule) => Rule.required().max(60)}),
    defineField({name: "title", title: "Page title", type: "string", validation: (Rule) => Rule.required().max(80)}),
    defineField({name: "sections", title: "Terms sections", type: "array", of: [{type: "legalSection"}], validation: (Rule) => Rule.required().min(1)}),
  ],
  preview: {prepare: () => ({title: "Terms & conditions", subtitle: "Legal content"})},
});
