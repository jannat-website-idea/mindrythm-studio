import {getCliClient} from "sanity/cli";
import {
  defaultContent,
  defaultItems,
  defaultSettings,
  mainInstagramUrl,
} from "../../lib/content";

const client = getCliClient({apiVersion: "2026-08-01"});
const key = (value: string) => value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
const projectId = (id: string) => `project-${key(id)}`;
const reference = (id: string, position: number) => ({_type: "reference", _ref: projectId(id), _key: `${key(id)}-${position}`});

const projects = defaultItems.filter((item) => item.kind === "project").map((item) => ({
  _id: projectId(item.id),
  _type: "project",
  cmsId: {_type: "slug", current: item.id},
  sortOrder: item.sortOrder,
  title: item.title,
  eyebrow: item.eyebrow,
  body: item.body,
  media: {_type: "mediaAsset", externalUrl: item.mediaUrl, alt: item.mediaAlt},
  category: item.category,
  year: item.year,
  href: item.href,
  accent: item.accent,
}));

const team = defaultItems.filter((item) => item.kind === "team").map((item) => ({
  _id: `team-member-${key(item.id)}`,
  _type: "teamMember",
  cmsId: {_type: "slug", current: item.id},
  sortOrder: item.sortOrder,
  title: item.title,
  role: item.category,
  bio: item.body,
  media: {_type: "mediaAsset", externalUrl: item.mediaUrl, alt: item.mediaAlt},
  profileUrl: item.href.startsWith("http") ? item.href : mainInstagramUrl,
}));

const singletons = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: defaultSettings.siteName,
    tagline: defaultSettings.tagline,
    description: defaultSettings.description,
    vision: defaultSettings.vision,
    idea: defaultSettings.idea,
  },
  {
    _id: "heroSection",
    _type: "heroSection",
    titleLineOne: defaultContent.hero.titleLineOne,
    titleLineTwo: defaultContent.hero.titleLineTwo,
    featuredProjects: defaultContent.hero.featuredProjectIds.map(reference),
    visionHighlights: defaultContent.hero.visionHighlights,
  },
  {
    _id: "aboutContent",
    _type: "aboutContent",
    ...defaultContent.copy,
  },
  {
    _id: "contactInfo",
    _type: "contactInfo",
    email: defaultSettings.contactEmail,
    phonePrimary: defaultSettings.phonePrimary,
    phoneSecondary: defaultSettings.phoneSecondary,
    address: defaultSettings.address,
  },
  {
    _id: "socialLinks",
    _type: "socialLinks",
    instagram: defaultSettings.instagram,
    facebook: defaultSettings.facebook,
    youtube: defaultSettings.youtube,
    vimeo: defaultSettings.vimeo,
    linkedin: defaultSettings.linkedin,
    x: defaultSettings.x,
  },
  {
    _id: "footerSettings",
    _type: "footerSettings",
    ...defaultContent.footer,
    studioUrl: "https://mindrythm-cms.sanity.studio",
  },
  {
    _id: "seoSettings",
    _type: "seoSettings",
    title: defaultContent.seo.title,
    description: defaultContent.seo.description,
    shareImageFallback: defaultContent.seo.shareImageUrl,
  },
  {
    _id: "privacyPolicy",
    _type: "privacyPolicy",
    eyebrow: defaultContent.privacyPolicy.eyebrow,
    title: defaultContent.privacyPolicy.title,
    sections: defaultContent.privacyPolicy.sections.map((section, index) => ({_type: "legalSection", _key: `privacy-${index}`, ...section})),
  },
  {
    _id: "termsConditions",
    _type: "termsConditions",
    eyebrow: defaultContent.termsConditions.eyebrow,
    title: defaultContent.termsConditions.title,
    sections: defaultContent.termsConditions.sections.map((section, index) => ({_type: "legalSection", _key: `terms-${index}`, ...section})),
  },
];

const services = defaultContent.services.map((service, index) => ({
  _id: `service-${key(service.key)}`,
  _type: "service",
  key: service.key,
  sortOrder: (index + 1) * 10,
  title: service.title,
  copy: service.copy,
  projects: service.projectIds.map(reference),
}));

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

const documents: Array<{_id: string; _type: string; [key: string]: unknown}> = [
  ...projects,
  ...team,
  ...singletons,
  ...services,
  ...testimonials,
];
let transaction = client.transaction();
for (const document of documents) transaction = transaction.createIfNotExists(document);
await transaction.commit();

console.log(`Ensured ${documents.length} Mindrythm CMS documents exist without overwriting existing content.`);
