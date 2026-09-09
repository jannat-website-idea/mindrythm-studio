import type {StructureResolver} from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], title: string, schemaType: string, documentId: string) =>
  S.listItem().title(title).schemaType(schemaType).child(S.document().schemaType(schemaType).documentId(documentId));

export const mindrythmStructure: StructureResolver = (S) =>
  S.list()
    .title("Mindrythm CMS")
    .items([
      S.listItem().title("Website content").child(
        S.list().title("Website content").items([
          singleton(S, "Hero section", "heroSection", "heroSection"),
          singleton(S, "Process banner ('Final frame')", "processBanner", "processBanner"),
          singleton(S, "About & studio story", "aboutContent", "aboutContent"),
          singleton(S, "Contact information", "contactInfo", "contactInfo"),
          singleton(S, "Footer", "footerSettings", "footerSettings"),
          singleton(S, "Social media links", "socialLinks", "socialLinks"),
        ]),
      ),
      singleton(S, "Process banner ('Final frame' Image/Video)", "processBanner", "processBanner"),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("project").title("Portfolio / Projects"),
      S.documentTypeListItem("galleryItem").title("Gallery"),
      S.documentTypeListItem("testimonial").title("Google Reviews / Testimonials"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.divider(),
      singleton(S, "SEO settings", "seoSettings", "seoSettings"),
      singleton(S, "Privacy policy", "privacyPolicy", "privacyPolicy"),
      singleton(S, "Terms & conditions", "termsConditions", "termsConditions"),
    ]);
