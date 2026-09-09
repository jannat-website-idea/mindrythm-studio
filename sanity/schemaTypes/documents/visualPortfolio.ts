import {defineField, defineType} from "sanity";

export const visualPortfolio = defineType({
  name: "visualPortfolio",
  title: "Visual Portfolio (Selected stories)",
  type: "document",
  fields: [
    defineField({
      name: "sectionTitle",
      title: "Section title",
      type: "string",
      initialValue: "Scroll through the visual portfolio",
    }),
    defineField({
      name: "tagline",
      title: "Tagline / Year badge",
      type: "string",
      initialValue: "Selected stories / 2026",
    }),
    defineField({
      name: "items",
      title: "Scrollable items (Images & Videos)",
      description: "Manage the scrollable visual stories. Add 5 or more items with custom images/videos, or link to projects.",
      type: "array",
      of: [
        {
          type: "object",
          name: "portfolioCard",
          title: "Story Card",
          fields: [
            defineField({
              name: "title",
              title: "Title (e.g. Earth & Stillness)",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "category",
              title: "Category badge (e.g. WELLNESS PHOTOGRAPHY)",
              type: "string",
            }),
            defineField({
              name: "eyebrow",
              title: "Subtitle / Type (e.g. WELLNESS RITUAL)",
              type: "string",
            }),
            defineField({
              name: "mediaType",
              title: "Media type",
              type: "string",
              options: {
                list: [
                  {title: "Image", value: "image"},
                  {title: "Video", value: "video"},
                ],
                layout: "radio",
              },
              initialValue: "image",
            }),
            defineField({
              name: "media",
              title: "Primary media (Image or Video)",
              description: "Upload an image or video file, or specify an external media URL.",
              type: "mediaAsset",
            }),
            defineField({
              name: "project",
              title: "Link to existing Project (Optional)",
              description: "Optionally pick a project to inherit its media and details if custom media is omitted.",
              type: "reference",
              to: [{type: "project"}],
            }),
            defineField({
              name: "href",
              title: "Link URL (optional, defaults to /work)",
              type: "string",
            }),
            defineField({
              name: "body",
              title: "Description (optional, shown when clicked)",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "category",
              media: "media.image",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Visual Portfolio",
      subtitle: "5 scrollable images / videos ('Selected stories')",
    }),
  },
});
