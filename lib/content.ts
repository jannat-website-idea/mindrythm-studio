export type ContentKind =
  | "hero"
  | "project"
  | "gallery"
  | "team"
  | "testimonial"
  | "social"
  | "note";

export type LayoutType = "large" | "medium" | "tall" | "small" | "wide";
export type MediaType = "image" | "video";

export type ContentItem = {
  id: string;
  kind: ContentKind;
  sortOrder: number;
  title: string;
  eyebrow: string;
  body: string;
  mediaUrl: string;
  mediaAlt: string;
  category: string;
  mediaType: MediaType;
  layoutType: LayoutType;
  year: string;
  href: string;
  accent: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  vision: string;
  idea: string;
  contactEmail: string;
  phonePrimary: string;
  phoneSecondary: string;
  address: string;
  instagram: string;
  vimeo: string;
  linkedin: string;
  facebook: string;
  youtube: string;
  x: string;
};

export type HeroContent = {
  titleLineOne: string;
  titleLineTwo: string;
  featuredProjectIds: string[];
  visionHighlights: string[];
};

export type SiteCopy = {
  visionParagraphs: string[];
  missionParagraphs: string[];
  brandTaglines: string[];
  enquiryTaglines: string[];
  teamIntroduction: string;
};

export type ServiceContent = {
  key: string;
  title: string;
  copy: string;
  projectIds: string[];
};

export type FooterContent = {
  callout: string;
  actionLabel: string;
  locationLabel: string;
  studioUrl: string;
};

export type SeoSettings = {
  title: string;
  description: string;
  shareImageUrl: string;
};

export type LegalSection = {
  heading: string;
  body: string;
};

export type LegalPageContent = {
  eyebrow: string;
  title: string;
  sections: LegalSection[];
};

export type SiteContent = {
  settings: SiteSettings;
  items: ContentItem[];
  hero: HeroContent;
  copy: SiteCopy;
  services: ServiceContent[];
  footer: FooterContent;
  seo: SeoSettings;
  privacyPolicy: LegalPageContent;
  termsConditions: LegalPageContent;
};

export const mainInstagramUrl = "https://www.instagram.com/mindrythm_studios/";
export const filmsInstagramUrl = "https://www.instagram.com/mindrythm.films/";

export const defaultSettings: SiteSettings = {
  siteName: "Mindrythm",
  tagline: "Every story has a rhythm.",
  description:
    "Mindrythm is an independent film and photography studio translating the unseen character of people, places and brands into honest, cinematic visual stories.",
  vision:
    "Our vision is to create a place where ideas find their visual language, where artists find one another, and where every project contributes to a body of work that is as intentional as it is beautiful.",
  idea:
    "Every commission begins with listening. We shape the right visual language around the people, place and intention behind the story.",
  contactEmail: "Admin@mindrythm.com",
  phonePrimary: "+91 90735 73878",
  phoneSecondary: "+91 62923 33492",
  address: "250, Bansdroni, Rifle Club Playground, Kolkata - 700070",
  instagram: mainInstagramUrl,
  vimeo: "https://vimeo.com/",
  linkedin: "https://linkedin.com/",
  facebook: "https://facebook.com/",
  youtube: "https://youtube.com/",
  x: "https://x.com/",
};

export const visionParagraphs = [
  "At Mindrythm, we believe every person, every space, and every brand carries a rhythm of its own, a story that often exists beyond words. Our work begins long before the camera rolls. It begins by understanding the ideas, emotions, and intentions that are difficult to describe, yet deeply felt.",
  "We exist to translate those unseen narratives into cinematic films and imagery that feel honest, timeless, and deeply human. Whether we are creating for luxury real estate, wellness, hospitality, retreats, fashion, or documentary storytelling, our goal remains the same: to reveal the essence that already exists, rather than simply document what is seen.",
  "Mindrythm is built on the belief that meaningful work is never created in isolation. We aspire to cultivate a community of filmmakers, photographers, designers, musicians, writers, and artists who believe that the most compelling visual narratives emerge through shared perspectives, thoughtful collaboration, and a genuine respect for the creative process.",
  "Our vision is to create a place where ideas find their visual language, where artists find one another, and where every project contributes to a body of work that is as intentional as it is beautiful.",
] as const;

export const missionParagraphs = [
  "At Mindrythm, we believe every meaningful project begins with a conversation, not a perfect brief.",
  "Our mission is to create a space where ideas can be explored openly, without the pressure of having every detail figured out from the start. We understand that the strongest creative visions often begin as instincts, emotions, or scattered thoughts that are difficult to explain. Our role is to listen with care, ask thoughtful questions, and help those ideas find the visual language they deserve.",
  "Whether we are creating for luxury real estate, wellness, hospitality, retreats, architecture, fashion, or documentary storytelling, we approach every project with curiosity, clarity, and respect for its individuality. Rather than imposing a signature style, we allow each story to shape its own visual identity, creating films and imagery that feel honest, intentional, and true to the people behind them.",
  "We also believe that meaningful creative work is built through collaboration. Mindrythm is more than a production house; it is a growing community of filmmakers, photographers, designers, musicians, writers, artists, and visionaries who share a passion for thoughtful storytelling and purposeful craftsmanship. By bringing together diverse creative perspectives, we continue to learn, evolve, and create work that carries depth, authenticity, and lasting value.",
  "Our mission is simple: to help people find the visual language their ideas deserve, and to create work that remains meaningful long after the final frame.",
] as const;

export const brandTaglines = [
  "Some stories are easier to feel than to explain. That's where we begin.",
  "You know the feeling. We help you see it.",
  "Sometimes the hardest ideas to explain become the easiest stories to see.",
  "We listen to ideas that haven't found the right words yet.",
  "Your vision already exists. We simply help the world see it.",
  "The best stories usually begin with, I don't know how to explain this…",
] as const;

export const enquiryTaglines = [
  "You don't have to know the right creative words. Just tell us what you're imagining.",
  "There's no perfect brief. Only honest conversations.",
  "Whether your idea is crystal clear or wonderfully chaotic, we'd love to hear it.",
] as const;

export const footerTaglines = [
  "Let's begin with a conversation.",
  "Some stories simply need the right people to tell them.",
] as const;

export const teamIntroduction = "Mindrythm has never been about one person—it has always been about the people who choose to build it together. Every member of our team brings their own way of seeing the world, their own craft, and their own quiet dedication to creating work that feels honest and intentional. We learn from one another, challenge one another, and grow together with every project we take on. When you work with us, you're not simply working with individuals behind the camera or the screen; you're working with a team that genuinely cares about the people, places, and stories we are trusted to represent.";

export const defaultHero: HeroContent = {
  titleLineOne: "Every story",
  titleLineTwo: "has a rhythm.",
  featuredProjectIds: ["event-photography", "quiet-frequency", "wedding-celebration"],
  visionHighlights: [
    "Our vision is to create a place where ideas find their visual language.",
    "Where artists find one another.",
    "Where every project contributes to a body of work that is intentional and beautiful.",
  ],
};

export const defaultCopy: SiteCopy = {
  visionParagraphs: [...visionParagraphs],
  missionParagraphs: [...missionParagraphs],
  brandTaglines: [...brandTaglines],
  enquiryTaglines: [...enquiryTaglines],
  teamIntroduction,
};

export const defaultServices: ServiceContent[] = [
  {
    key: "real-estate",
    title: "Real estate photography",
    copy: "Architecture, interiors and property campaigns shaped around light, proportion and a true sense of place.",
    projectIds: ["room-to-breathe", "tropical-pavilion", "sanctuary-interiors"],
  },
  {
    key: "wellness-hospitality",
    title: "Wellness & Hospitality photography",
    copy: "Atmospheric imagery for retreats, hotels and hospitality spaces designed to communicate how a place feels.",
    projectIds: ["quiet-frequency", "resort-at-dusk", "event-photography"],
  },
  {
    key: "fb-photography",
    title: "F&B photography",
    copy: "Food, interiors and dining experiences captured with an editorial eye that makes people want to be there.",
    projectIds: ["in-passing", "hands-of-stillness"],
  },
  {
    key: "luxury-villa",
    title: "Luxury Villa Photography",
    copy: "Refined visual stories for villas and private properties, highlighting architecture, atmosphere and detail.",
    projectIds: ["room-to-breathe", "sanctuary-interiors"],
  },
  {
    key: "event-photography",
    title: "Event photography",
    copy: "Corporate events, music, celebrations and meaningful moments captured with an editorial and cinematic approach.",
    projectIds: ["event-film", "wedding-film"],
  },
  {
    key: "web-development",
    title: "Website development",
    copy: "Immersive digital experiences combining thoughtful design, storytelling, performance and modern technology.",
    projectIds: ["field-notes", "object-ritual"],
  },
  {
    key: "logo-generation",
    title: "Logo generation",
    copy: "Distinctive visual identities created to give brands a clear, memorable and recognisable presence.",
    projectIds: ["sanctuary-interiors", "room-to-breathe"],
  },
  {
    key: "meta-ads",
    title: "Running Meta Ads",
    copy: "Creative-led Meta campaigns designed to connect brands with the right audience and turn attention into action.",
    projectIds: ["quiet-frequency", "event-film"],
  },
  {
    key: "social-creatives",
    title: "Social media creatives",
    copy: "Premium visual content for social platforms, campaigns, launches and ongoing brand storytelling.",
    projectIds: ["tropical-pavilion", "hands-of-stillness"],
  },
  {
    key: "social-handling",
    title: "Social Media Handling",
    copy: "Strategic social media management covering content planning, publishing, consistency and day-to-day brand presence.",
    projectIds: ["vows-in-bloom", "wedding-celebration"],
  },
];

export const defaultFooter: FooterContent = {
  callout: footerTaglines[1],
  actionLabel: footerTaglines[0],
  locationLabel: "Everywhere",
  studioUrl: "/studio",
};

export const defaultSeo: SeoSettings = {
  title: "Mindrythm — Property, Event & Wedding Photography",
  description: "Professional photography and films for properties, resorts, events, weddings and brands.",
  shareImageUrl: "/og-final.png",
};

export const defaultPrivacyPolicy: LegalPageContent = {
  eyebrow: "Legal / Privacy",
  title: "Privacy policy",
  sections: [
    { heading: "Information we receive", body: "When you contact Mindrythm, we receive the details you choose to provide, including your name, phone number, email address and enquiry." },
    { heading: "How we use it", body: "We use this information only to respond to your enquiry, discuss potential work and maintain relevant business records. We do not sell personal information." },
    { heading: "Storage and requests", body: "Enquiries may be stored securely for follow-up. You may request access, correction or deletion by emailing Admin@mindrythm.com." },
    { heading: "External services", body: "The website may link to social platforms and display Google Maps. Those services apply their own privacy practices." },
  ],
};

export const defaultTermsConditions: LegalPageContent = {
  eyebrow: "Legal / Terms & Conditions",
  title: "Terms & Conditions",
  sections: [
    { heading: "Website content", body: "This website presents the work, services and creative perspective of Mindrythm. Project information is provided for general reference and may change." },
    { heading: "Creative ownership", body: "Unless stated otherwise, visual work, text and brand materials on this website belong to Mindrythm or the credited collaborators and may not be reused without permission." },
    { heading: "Project enquiries", body: "Sending an enquiry does not create a service agreement. Scope, timing, fees and usage rights are confirmed separately in writing." },
    { heading: "Contact", body: "Questions about these terms can be sent to Admin@mindrythm.com." },
  ],
};

function withItemDefaults(
  items: Array<Omit<ContentItem, "mediaType" | "layoutType"> & Partial<Pick<ContentItem, "mediaType" | "layoutType">>>
): ContentItem[] {
  return items.map((item) => ({
    ...item,
    mediaType: item.mediaType || "image",
    layoutType: item.layoutType || "large",
  }));
}

export const defaultItems: ContentItem[] = withItemDefaults([
  {
    id: "quiet-frequency",
    kind: "project",
    sortOrder: 10,
    title: "Svabodha Wellness",
    eyebrow: "Wellness retreat / Film",
    body: "A cinematic retreat story moving through shoreline, forest, ritual and the slower rhythm of a restorative stay.",
    mediaUrl: "/videos/resort-pool.mp4",
    mediaAlt: "Aerial view of a tropical shoreline featured in a wellness retreat film",
    category: "Wellness Film",
    mediaType: "video",
    year: "2026",
    href: "#svabodha-wellness",
    accent: "forest",
  },
  {
    id: "wedding-celebration",
    kind: "project",
    sortOrder: 15,
    title: "Vows in Bloom",
    eyebrow: "Wedding / Photography",
    body: "A warm, candid wedding story balancing traditional portraits, joyful details and the unscripted moments between them.",
    mediaUrl: "/images/wedding-celebration.jpg",
    mediaAlt: "Indian newlyweds sharing a joyful portrait",
    category: "Wedding Photography",
    year: "2026",
    href: "#vows-in-bloom",
    accent: "rust",
  },
  {
    id: "event-film",
    kind: "project",
    sortOrder: 17,
    title: "A Guided Pause",
    eyebrow: "Wellness practice / Film",
    body: "A quiet film study of guided movement, breath and the attentive human connection at the heart of a retreat.",
    mediaUrl: "/videos/event-film.mp4",
    mediaAlt: "Guided wellness practice inside a shaded retreat pavilion",
    category: "Wellness Film",
    year: "2026",
    href: "#guided-pause",
    accent: "ink",
  },
  {
    id: "in-passing",
    kind: "project",
    sortOrder: 20,
    title: "Hands of Stillness",
    eyebrow: "Therapeutic ritual / Film",
    body: "An intimate moving portrait of restorative touch, attentive care and the calm created through a considered wellness ritual.",
    mediaUrl: "/videos/hotel-room.mp4",
    mediaAlt: "Hands-on wellness treatment inside a tropical retreat",
    category: "Wellness Ritual",
    year: "2026",
    href: "#hands-of-stillness",
    accent: "sage",
  },
  {
    id: "event-photography",
    kind: "project",
    sortOrder: 25,
    title: "Earth & Stillness",
    eyebrow: "Wellness ritual / Photography",
    body: "A tactile portrait of an elemental mud ritual, photographed with natural light, quiet detail and a strong sense of place.",
    mediaUrl: "/images/wellness-mud-bath.jpg",
    mediaAlt: "Wellness guest immersed in a traditional mud bath at a forest retreat",
    category: "Wellness Photography",
    year: "2026",
    href: "#earth-and-stillness",
    accent: "forest",
  },
  {
    id: "wedding-film",
    kind: "project",
    sortOrder: 27,
    title: "A Garden Promise",
    eyebrow: "Wedding / Cinematic film",
    body: "A cinematic wedding film following the anticipation, emotion and quiet gestures that turn one day into a lasting memory.",
    mediaUrl: "/videos/wedding-film.mp4",
    mediaAlt: "Bride and groom meeting in a garden on their wedding day",
    category: "Wedding Film",
    year: "2026",
    href: "#garden-promise",
    accent: "sage",
  },
  {
    id: "field-notes",
    kind: "project",
    sortOrder: 30,
    title: "Room to Breathe",
    eyebrow: "Retreat space / Photography",
    body: "An open-air practice hall photographed through its natural textures, soft daylight and connection to the surrounding forest.",
    mediaUrl: "/images/villa-pool.jpg",
    mediaAlt: "Open-air yoga hall beneath a traditional thatched roof",
    category: "Retreat Spaces",
    year: "2026",
    href: "#room-to-breathe",
    accent: "ink",
  },
  {
    id: "object-ritual",
    kind: "project",
    sortOrder: 40,
    title: "Closing Ritual",
    eyebrow: "Wellness retreat / Film",
    body: "The final movement of a retreat story, shaped around gratitude, release and a return to the world with greater stillness.",
    mediaUrl: "/videos/boutique-room.mp4",
    mediaAlt: "Closing moments from a cinematic wellness retreat film",
    category: "Wellness Film",
    year: "2026",
    href: "#closing-ritual",
    accent: "lime",
  },
  {
    id: "cliff-house",
    kind: "project",
    sortOrder: 45,
    title: "Forest Passage",
    eyebrow: "Retreat landscape / Photography",
    body: "A shaded woodland path and hand-painted cottages photographed as part of the retreat's quiet, immersive arrival experience.",
    mediaUrl: "/images/modern-house.jpg",
    mediaAlt: "Woodland path winding through a tropical retreat",
    category: "Retreat Landscape",
    year: "2026",
    href: "#forest-passage",
    accent: "forest",
  },
  {
    id: "resort-at-dusk",
    kind: "project",
    sortOrder: 46,
    title: "Arrival Under Trees",
    eyebrow: "Retreat lifestyle / Photography",
    body: "A human-led view of the retreat grounds, balancing everyday hospitality with the warmth and texture of the forest setting.",
    mediaUrl: "/images/resort-exterior.jpg",
    mediaAlt: "Retreat host walking between cottages beneath the trees",
    category: "Hospitality",
    year: "2026",
    href: "#arrival-under-trees",
    accent: "ink",
  },
  {
    id: "tropical-pavilion",
    kind: "project",
    sortOrder: 47,
    title: "The Welcome House",
    eyebrow: "Retreat interior / Photography",
    body: "A natural reception space photographed through handcrafted furniture, lived-in detail and the character of a wellness destination.",
    mediaUrl: "/images/tropical-interior.jpg",
    mediaAlt: "Natural reception area at a tropical wellness retreat",
    category: "Retreat Interiors",
    year: "2026",
    href: "#welcome-house",
    accent: "forest",
  },
  {
    id: "sanctuary-interiors",
    kind: "project",
    sortOrder: 48,
    title: "Open Sanctuary",
    eyebrow: "Wellness space / Editorial",
    body: "An airy thatched pavilion photographed through filtered daylight, natural material and its seamless relationship with the landscape.",
    mediaUrl: "/images/luxury-interior.jpg",
    mediaAlt: "Open-air retreat pavilion framed by forest greenery",
    category: "Retreat Spaces",
    year: "2026",
    href: "#open-sanctuary",
    accent: "sage",
  },
  {
    id: "collective",
    kind: "team",
    sortOrder: 50,
    title: "A specialist photography and film team",
    eyebrow: "Photography team",
    body: "Property, event and wedding photographers, filmmakers, aerial operators and editors—assembled around every story.",
    mediaUrl: "/images/filmmaker.jpg",
    mediaAlt: "Professional photographer and filmmaker",
    category: "Creative Team",
    year: "",
    href: "#people",
    accent: "ink",
  },
  {
    id: "instagram",
    kind: "social",
    sortOrder: 60,
    title: "Instagram",
    eyebrow: "Follow the process",
    body: "Frames, fragments and work in progress.",
    mediaUrl: "",
    mediaAlt: "",
    category: "Social",
    year: "",
    href: mainInstagramUrl,
    accent: "lime",
  },
  // Default Curated Gallery Items: Spaces (from CMS + local fallbacks)
  {
    id: "gallery-minimal-elegance",
    kind: "gallery",
    sortOrder: 10,
    title: "Minimal Elegance",
    eyebrow: "Spaces",
    body: "Quiet material palette and soft daylight shaping a calm interior moment.",
    mediaUrl: "https://cdn.sanity.io/files/n9nyugiq/production/6c0448566c3deac611522696ded992368e1e5f18.mp4",
    mediaAlt: "Minimal interior with gentle natural light",
    category: "Spaces",
    mediaType: "video",
    layoutType: "large",
    year: "2026",
    href: "",
    accent: "ink",
  },
  {
    id: "gallery-thoughtful-interiors",
    kind: "gallery",
    sortOrder: 20,
    title: "Thoughtful Interiors",
    eyebrow: "Spaces",
    body: "Twin bedroom with handcrafted timber beds, white walls and soft diffused daylight.",
    mediaUrl: "https://cdn.sanity.io/images/n9nyugiq/production/d69baa36038b187634ebc2a229b5e8e07ec0bab0-5941x3344.jpg",
    mediaAlt: "Retreat interior with wooden beds and white walls",
    category: "Spaces",
    mediaType: "image",
    layoutType: "medium",
    year: "2026",
    href: "",
    accent: "forest",
  },
  {
    id: "gallery-hand-painted-murals",
    kind: "gallery",
    sortOrder: 30,
    title: "Hand-painted Murals",
    eyebrow: "Spaces",
    body: "A window framed by hand-painted botanical forms and warm earthen tones.",
    mediaUrl: "https://cdn.sanity.io/images/n9nyugiq/production/9a85ee10e94df919b93b95cb9e54504303ca49f1-5237x3496.jpg",
    mediaAlt: "Hand-painted mural around a retreat window",
    category: "Spaces",
    mediaType: "image",
    layoutType: "medium",
    year: "2026",
    href: "",
    accent: "rust",
  },
  {
    id: "gallery-wellness-redefined",
    kind: "gallery",
    sortOrder: 40,
    title: "Wellness Redefined",
    eyebrow: "Spaces",
    body: "Restorative space inviting stillness, natural texture and mindful repose.",
    mediaUrl: "https://cdn.sanity.io/images/n9nyugiq/production/4b7eb78c6918915319768128c6e59c5f6259eb57-5174x3454.jpg",
    mediaAlt: "Wellness space bathed in soft natural light",
    category: "Spaces",
    mediaType: "image",
    layoutType: "large",
    year: "2026",
    href: "",
    accent: "sage",
  },
  {
    id: "gallery-minimal-living",
    kind: "gallery",
    sortOrder: 50,
    title: "Minimal Living",
    eyebrow: "Spaces",
    body: "Vertical portrait of a quiet corner where objects and light meet simply.",
    mediaUrl: "https://cdn.sanity.io/images/n9nyugiq/production/2481b37355e8814537aee4e7bf91b3ad98ab0b79-3809x5714.jpg",
    mediaAlt: "Minimal living corner with gentle daylight",
    category: "Spaces",
    mediaType: "image",
    layoutType: "large",
    year: "2026",
    href: "",
    accent: "ink",
  },
  {
    id: "gallery-warm-natural-interiors",
    kind: "gallery",
    sortOrder: 60,
    title: "Warm Natural Interiors",
    eyebrow: "Spaces",
    body: "Evening interior atmosphere lit by warm tones and soft lantern glow.",
    mediaUrl: "https://cdn.sanity.io/files/n9nyugiq/production/60eb8bc26ffcd3324726af9560ee4a56705d8ea6.mp4",
    mediaAlt: "Warm natural interior with ambient evening light",
    category: "Spaces",
    mediaType: "video",
    layoutType: "medium",
    year: "2026",
    href: "",
    accent: "forest",
  },
  {
    id: "gallery-arambol",
    kind: "gallery",
    sortOrder: 70,
    title: "Arambol",
    eyebrow: "Spaces",
    body: "Dramatic coastline meeting emerald cliffs and coastal architectural enclaves.",
    mediaUrl: "https://cdn.sanity.io/images/n9nyugiq/production/5be16ef5a1af48bcc956a698be9db44eafc9f4e5-4032x2268.jpg",
    mediaAlt: "Aerial view of coastal headland and crashing waves",
    category: "Spaces",
    mediaType: "image",
    layoutType: "large",
    year: "2026",
    href: "",
    accent: "forest",
  },
  // Default Curated Gallery Items: Celebrations
  {
    id: "gallery-wellness-redefined-cel",
    kind: "gallery",
    sortOrder: 10,
    title: "Wellness Redefined",
    eyebrow: "Shared Ritual",
    body: "Elemental mud bathing experience shared among retreat guests surrounded by nature.",
    mediaUrl: "/images/wellness-mud-bath.jpg",
    mediaAlt: "Guests sharing natural wellness ritual",
    category: "Celebrations",
    year: "2026",
    href: "",
    accent: "forest",
  },
  {
    id: "gallery-minimal-living-cel",
    kind: "gallery",
    sortOrder: 20,
    title: "Minimal Living",
    eyebrow: "Guided Movement",
    body: "Unscripted morning practice inside the open-air retreat pavilion.",
    mediaUrl: "/videos/event-film.mp4",
    mediaAlt: "Guided movement and breathwork session",
    category: "Celebrations",
    year: "2026",
    href: "",
    accent: "ink",
  },
  {
    id: "gallery-warm-natural-cel",
    kind: "gallery",
    sortOrder: 30,
    title: "Warm Natural Interiors",
    eyebrow: "Evening Gathering",
    body: "Intimate celebration bathed in ambient lantern glow and live acoustic music.",
    mediaUrl: "/images/event-stage.jpg",
    mediaAlt: "Evening outdoor event gathering",
    category: "Celebrations",
    year: "2026",
    href: "",
    accent: "rust",
  },
  {
    id: "gallery-arambol-cel",
    kind: "gallery",
    sortOrder: 40,
    title: "Arambol",
    eyebrow: "Coastal Horizons",
    body: "Aerial coastal moments capturing the rhythmic energy of the ocean and guests.",
    mediaUrl: "/videos/resort-pool.mp4",
    mediaAlt: "Coastal shoreline gathering",
    category: "Celebrations",
    year: "2026",
    href: "",
    accent: "forest",
  },
  {
    id: "gallery-vows-in-bloom",
    kind: "gallery",
    sortOrder: 50,
    title: "Vows in Bloom",
    eyebrow: "Wedding Day",
    body: "Joyful wedding couple surrounded by floral garlands and genuine laughter.",
    mediaUrl: "/images/wedding-celebration.jpg",
    mediaAlt: "Indian newlyweds portrait",
    category: "Celebrations",
    year: "2026",
    href: "",
    accent: "sage",
  },
  {
    id: "gallery-garden-promise",
    kind: "gallery",
    sortOrder: 60,
    title: "A Garden Promise",
    eyebrow: "Wedding Story",
    body: "Cinematic wedding film capturing quiet stolen moments and heartfelt vows.",
    mediaUrl: "/videos/wedding-film.mp4",
    mediaAlt: "Bride and groom in wedding garden",
    category: "Celebrations",
    year: "2026",
    href: "",
    accent: "rust",
  },
  {
    id: "gallery-closing-ritual",
    kind: "gallery",
    sortOrder: 70,
    title: "Closing Ritual",
    eyebrow: "Evening Stillness",
    body: "The closing celebration honoring gratitude, connection, and mindful celebration.",
    mediaUrl: "/videos/hotel-room.mp4",
    mediaAlt: "Evening celebration ritual",
    category: "Celebrations",
    year: "2026",
    href: "",
    accent: "ink",
  },
]);

export const defaultContent: SiteContent = {
  settings: defaultSettings,
  items: defaultItems,
  hero: defaultHero,
  copy: defaultCopy,
  services: defaultServices,
  footer: defaultFooter,
  seo: defaultSeo,
  privacyPolicy: defaultPrivacyPolicy,
  termsConditions: defaultTermsConditions,
};
