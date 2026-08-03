import {defineField, defineType} from "sanity";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact information",
  type: "document",
  fields: [
    defineField({name: "email", title: "Contact email", type: "string", validation: (Rule) => Rule.required().email()}),
    defineField({name: "phonePrimary", title: "Primary phone", type: "string", validation: (Rule) => Rule.required().min(8).max(30)}),
    defineField({name: "phoneSecondary", title: "Secondary phone", type: "string", validation: (Rule) => Rule.max(30)}),
    defineField({name: "address", title: "Studio address", type: "text", rows: 3, validation: (Rule) => Rule.required().min(15)}),
  ],
  preview: {prepare: () => ({title: "Contact information", subtitle: "Phone, email and address"})},
});
