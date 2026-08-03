import {defineField, defineType} from "sanity";

const socialField = (name: string, title: string) => defineField({name, title, type: "url", validation: (Rule) => Rule.uri({scheme: ["http", "https"]})});

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social media links",
  type: "document",
  fields: [
    socialField("instagram", "Instagram"),
    socialField("facebook", "Facebook"),
    socialField("youtube", "YouTube"),
    socialField("vimeo", "Vimeo"),
    socialField("linkedin", "LinkedIn"),
    socialField("x", "X / Twitter"),
  ],
  preview: {prepare: () => ({title: "Social media links", subtitle: "Public studio profiles"})},
});
