import {defineField, defineType} from "sanity";

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  fields: [
    defineField({name: "callout", title: "Footer callout", type: "string", validation: (Rule) => Rule.required().max(120)}),
    defineField({name: "actionLabel", title: "Contact link label", type: "string", validation: (Rule) => Rule.required().max(60)}),
    defineField({name: "locationLabel", title: "Location label", type: "string", validation: (Rule) => Rule.required().max(60)}),
    defineField({name: "studioUrl", title: "CMS login URL", type: "url", validation: (Rule) => Rule.uri({scheme: ["http", "https"]})}),
  ],
  preview: {prepare: () => ({title: "Footer", subtitle: "Callout, location and CMS link"})},
});
