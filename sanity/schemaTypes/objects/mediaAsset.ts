import {defineField, defineType} from "sanity";

export const mediaAsset = defineType({
  name: "mediaAsset",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image upload",
      type: "image",
      options: {hotspot: true},
      description: "Upload and crop a photograph. This takes priority over the fallback URL.",
    }),
    defineField({
      name: "video",
      title: "Video upload",
      type: "file",
      options: {accept: "video/mp4,video/webm,video/quicktime"},
      description: "Optional MP4, WebM or MOV upload.",
    }),
    defineField({
      name: "externalUrl",
      title: "Existing media URL",
      type: "string",
      description: "Keep the existing website path or paste a hosted image/video URL.",
    }),
    defineField({
      name: "alt",
      title: "Accessible description",
      type: "string",
      validation: (Rule) => Rule.required().min(8).max(180),
    }),
  ],
  validation: (Rule) => Rule.custom((value) => value?.image || value?.video || value?.externalUrl ? true : "Add an image, video or existing media URL."),
});
