import type {StructureResolver} from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], title: string, schemaType: string, documentId: string) =>
  S.listItem().title(title).schemaType(schemaType).child(S.document().schemaType(schemaType).documentId(documentId));

export const mindrythmStructure: StructureResolver = (S) =>
  S.list()
    .title("Mindrythm CMS")
    .items([
      singleton(S, "Hero section", "heroSection", "heroSection"),
      singleton(S, "Visual portfolio (Scrollable Stories / Media)", "visualPortfolio", "visualPortfolio"),
      singleton(S, "Process banner ('Final frame' Media)", "processBanner", "processBanner"),
      singleton(S, "About & studio story", "aboutContent", "aboutContent"),
      S.divider(),
      S.documentTypeListItem("service").title("Services (Titles, Details, Websites, Logos, Media)"),
      S.documentTypeListItem("project").title("Portfolio / Projects"),
      S.documentTypeListItem("galleryItem").title("Gallery Items"),
      S.documentTypeListItem("testimonial").title("Google Reviews / Testimonials"),
      S.documentTypeListItem("teamMember").title("Team Members"),
      S.divider(),
      singleton(S, "Brand & studio settings", "siteSettings", "siteSettings"),
      singleton(S, "Contact information", "contactInfo", "contactInfo"),
      singleton(S, "Social media links", "socialLinks", "socialLinks"),
      singleton(S, "Footer settings", "footerSettings", "footerSettings"),
      S.divider(),
      singleton(S, "SEO settings", "seoSettings", "seoSettings"),
      singleton(S, "Privacy policy", "privacyPolicy", "privacyPolicy"),
      singleton(S, "Terms & conditions", "termsConditions", "termsConditions"),
    ]);
