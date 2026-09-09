import {defineField, defineType} from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Google Review / Testimonial",
  type: "document",
  fields: [
    defineField({name: "title", title: "Reviewer Name", type: "string", validation: (Rule) => Rule.required().max(140)}),
    defineField({name: "quote", title: "Review Statement / Quote", type: "text", rows: 5, validation: (Rule) => Rule.required()}),
    defineField({
      name: "rating",
      title: "Star Rating (1 to 5 Stars)",
      description: "Reviews with 4 stars and above are automatically featured in the top 5 showcase on the homepage.",
      type: "number",
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5).precision(1),
    }),
    defineField({
      name: "clientType",
      title: "Review Source / Client Label",
      description: "e.g. Google Review, Verified Client, Hotel Partner",
      type: "string",
      initialValue: "Google Review",
      validation: (Rule) => Rule.required().max(70),
    }),
    defineField({
      name: "sortOrder",
      title: "Display Priority Order",
      description: "Lower numbers appear first. Highest rated reviews appear at the top.",
      type: "number",
      initialValue: 10,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "reviewUrl",
      title: "Direct Review Link (Google Review URL)",
      description: "Optional link to the original review on Google Maps or Google Business.",
      type: "url",
      validation: (Rule) => Rule.uri({scheme: ["http", "https"]}),
    }),
    defineField({
      name: "theme",
      title: "Card theme",
      type: "string",
      options: {list: [{title: "Light Ivory", value: "light"}, {title: "Dark Charcoal", value: "dark"}]},
      initialValue: "light",
    }),
  ],
  preview: {
    select: {
      title: "title",
      rating: "rating",
      subtitle: "clientType",
    },
    prepare({title, rating, subtitle}) {
      const stars = "★".repeat(Math.min(5, Math.max(1, Math.round(rating || 5))));
      return {
        title: `${title} (${stars})`,
        subtitle: subtitle || "Google Review",
      };
    },
  },
});
