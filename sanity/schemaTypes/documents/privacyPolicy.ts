import {defineField, defineType} from "sanity";

export const privacyPolicy = defineType({
  name: "privacyPolicy",
  title: "Privacy policy",
  type: "document",
  fields: [
    defineField({name: "eyebrow", title: "Page label", type: "string", validation: (Rule) => Rule.required().max(60)}),
    defineField({name: "title", title: "Page title", type: "string", validation: (Rule) => Rule.required().max(80)}),
    defineField({name: "sections", title: "Policy sections", type: "array", of: [{type: "legalSection"}], validation: (Rule) => Rule.required().min(1)}),
  ],
  preview: {prepare: () => ({title: "Privacy policy", subtitle: "Legal content"})},
});
