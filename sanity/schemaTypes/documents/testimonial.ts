import {defineField, defineType} from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({name: "sortOrder", title: "Display order", type: "number", validation: (Rule) => Rule.required().integer().min(0)}),
    defineField({name: "title", title: "Supporting line", type: "string", validation: (Rule) => Rule.required().max(140)}),
    defineField({name: "quote", title: "Review", type: "text", rows: 6, validation: (Rule) => Rule.required().min(30)}),
    defineField({name: "clientType", title: "Client label", type: "string", validation: (Rule) => Rule.required().max(70)}),
    defineField({name: "rating", title: "Rating", type: "number", validation: (Rule) => Rule.min(1).max(5).precision(1)}),
    defineField({name: "reviewUrl", title: "Review link", type: "url", validation: (Rule) => Rule.uri({scheme: ["http", "https"]})}),
    defineField({name: "theme", title: "Card theme", type: "string", options: {list: [{title: "Light", value: "light"}, {title: "Dark", value: "dark"}]}, initialValue: "light"}),
  ],
  preview: {select: {title: "title", subtitle: "clientType"}},
});
