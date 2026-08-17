import {getCliClient} from "sanity/cli";

const client = getCliClient({apiVersion: "2026-08-01"});

const testimonials = [
  {
    _id: "testimonial-jannat-khatun",
    _type: "testimonial",
    sortOrder: 10,
    title: "Jannat Khatun",
    quote:
      "Mindrythm Studio is an excellent choice for professional photography and video services. Their creativity, attention to detail, and ability to capture the right mood and story really stand out. The quality of their work is impressive, and we couldn't be happier.",
    clientType: "Local Guide · Google review",
    rating: 5,
    reviewUrl:
      "https://www.google.com/search?kgmid=%2Fg%2F11njpxjhwk\u0026q=Mindrythm+Studios",
    theme: "light",
  },
  {
    _id: "testimonial-omkar-sonawane",
    _type: "testimonial",
    sortOrder: 20,
    title: "Omkar Sonawane",
    quote:
      "One stop solution for all my requirements. They're too good at what they do - zero compromise on quality. Extremely happy with the work and would very highly recommend!!!",
    clientType: "Local Guide · Google review",
    rating: 5,
    reviewUrl:
      "https://www.google.com/search?kgmid=%2Fg%2F11njpxjhwk\u0026q=Mindrythm+Studios",
    theme: "dark",
  },
];

let transaction = client.transaction();
for (const id of ["testimonial-google-profile", "testimonial-event-partner"]) {
  transaction = transaction.delete(id);
}
for (const doc of testimonials) {
  // If the document already exists, replace its fields; otherwise create it.
  transaction = transaction.createOrReplace(doc);
}
await transaction.commit();
console.log("Replaced testimonials with live Google reviews from Jannat Khatun and Omkar Sonawane.");
