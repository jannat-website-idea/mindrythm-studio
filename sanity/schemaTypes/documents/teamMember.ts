import {defineField, defineType} from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member / discipline",
  type: "document",
  fields: [
    defineField({name: "cmsId", title: "Member ID", type: "slug", options: {source: "title", maxLength: 80}, validation: (Rule) => Rule.required()}),
    defineField({name: "sortOrder", title: "Display order", type: "number", validation: (Rule) => Rule.required().integer().min(0)}),
    defineField({name: "title", title: "Name or discipline", type: "string", validation: (Rule) => Rule.required().max(100)}),
    defineField({name: "role", title: "Role", type: "string", validation: (Rule) => Rule.required().max(80)}),
    defineField({name: "bio", title: "Biography", type: "text", rows: 5, validation: (Rule) => Rule.required().min(30)}),
    defineField({name: "media", title: "Portrait", type: "mediaAsset", validation: (Rule) => Rule.required()}),
    defineField({
      name: "profileUrl",
      title: "Instagram / Social link",
      description: "Direct link to Instagram profile (e.g. https://www.instagram.com/username) or handle (@username)",
      type: "string",
    }),
  ],
  preview: {select: {title: "title", subtitle: "role", media: "media.image"}},
});
