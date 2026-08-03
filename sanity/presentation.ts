import {defineLocations, type PresentationPluginOptions} from "sanity/presentation";

const homepage = [{title: "Homepage", href: "/"}];

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  locations: {
    siteSettings: defineLocations({select: {}, resolve: () => ({locations: homepage})}),
    heroSection: defineLocations({select: {}, resolve: () => ({locations: homepage})}),
    aboutContent: defineLocations({select: {}, resolve: () => ({locations: [{title: "Our story", href: "/story"}, ...homepage]})}),
    service: defineLocations({select: {key: "key", title: "title"}, resolve: (doc) => ({locations: [{title: doc?.title || "Service", href: `/work?service=${doc?.key || ""}`}, {title: "Services", href: "/services"}]})}),
    project: defineLocations({select: {title: "title"}, resolve: (doc) => ({locations: [{title: doc?.title || "Project", href: "/work"}, ...homepage]})}),
    galleryItem: defineLocations({select: {title: "title"}, resolve: (doc) => ({locations: [{title: doc?.title || "Gallery item", href: "/gallery"}]})}),
    testimonial: defineLocations({select: {}, resolve: () => ({locations: homepage})}),
    teamMember: defineLocations({select: {title: "title"}, resolve: (doc) => ({locations: [{title: doc?.title || "Team", href: "/team"}, ...homepage]})}),
    contactInfo: defineLocations({select: {}, resolve: () => ({locations: [{title: "Contact", href: "/contact"}, ...homepage]})}),
    footerSettings: defineLocations({select: {}, resolve: () => ({locations: homepage})}),
    socialLinks: defineLocations({select: {}, resolve: () => ({locations: homepage})}),
    seoSettings: defineLocations({select: {}, resolve: () => ({locations: homepage})}),
    privacyPolicy: defineLocations({select: {}, resolve: () => ({locations: [{title: "Privacy policy", href: "/privacy"}]})}),
    termsConditions: defineLocations({select: {}, resolve: () => ({locations: [{title: "Terms & conditions", href: "/terms"}]})}),
  },
};
