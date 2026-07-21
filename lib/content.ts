export type ContentKind =
  | "hero"
  | "project"
  | "gallery"
  | "team"
  | "testimonial"
  | "social"
  | "note";

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
};

export type SiteContent = {
  settings: SiteSettings;
  items: ContentItem[];
};

export const defaultSettings: SiteSettings = {
  siteName: "MINDRYTHM",
  tagline: "Properties, events and weddings—photographed with feeling.",
  description:
    "Mind Rhythm is a professional photography and film studio for properties, resorts, events, weddings and brands. We create polished visual stories that make spaces desirable, celebrations unforgettable and every important moment worth returning to.",
  vision:
    "To give every space, celebration and milestone its own visual memory through considered light, honest emotion and precise composition.",
  idea:
    "Property photography, resort films, event coverage, wedding photography and cinematic films—planned as one coherent visual story for every brief.",
  contactEmail: "Admin@mindrythm.com",
  phonePrimary: "+91 90735 73878",
  phoneSecondary: "+91 62923 33492",
  address: "250, Bansdroni, Rifle Club Playground, Kolkata - 700070",
  instagram: "https://instagram.com/",
  vimeo: "https://vimeo.com/",
  linkedin: "https://linkedin.com/",
  facebook: "https://facebook.com/",
  youtube: "https://youtube.com/",
};

export const defaultItems: ContentItem[] = [
  {
    id: "quiet-frequency",
    kind: "project",
    sortOrder: 10,
    title: "Azure Retreat",
    eyebrow: "Resort film / Poolside",
    body: "A sunlit hospitality story designed to communicate calm, scale and the effortless rhythm of a destination stay.",
    mediaUrl: "/videos/resort-pool.mp4",
    mediaAlt: "Luxury resort swimming pool in warm daylight",
    category: "Resort Film",
    year: "2026",
    href: "#azure-retreat",
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
    mediaAlt: "Newlywed Indian couple smiling in traditional wedding attire",
    category: "Wedding Photography",
    year: "2026",
    href: "#vows-in-bloom",
    accent: "rust",
  },
  {
    id: "event-film",
    kind: "project",
    sortOrder: 17,
    title: "The Evening Opens",
    eyebrow: "Event / Film",
    body: "A concise event film built from atmosphere, stage details and the energy of guests arriving for a memorable evening.",
    mediaUrl: "/videos/event-film.mp4",
    mediaAlt: "Microphone and blue lights inside an event venue",
    category: "Event Film",
    year: "2026",
    href: "#evening-opens",
    accent: "ink",
  },
  {
    id: "in-passing",
    kind: "project",
    sortOrder: 20,
    title: "The Courtyard Suite",
    eyebrow: "Hospitality / Interior film",
    body: "A measured walkthrough that turns material, light and room flow into a quiet invitation to stay.",
    mediaUrl: "/videos/hotel-room.mp4",
    mediaAlt: "Camera moving through a refined hotel room interior",
    category: "Hospitality",
    year: "2026",
    href: "#courtyard-suite",
    accent: "sage",
  },
  {
    id: "event-photography",
    kind: "project",
    sortOrder: 25,
    title: "Ideas Live",
    eyebrow: "Corporate event / Photography",
    body: "Professional event coverage shaped around speakers, audiences, branded details and the human energy that makes the room matter.",
    mediaUrl: "/images/event-stage.jpg",
    mediaAlt: "Speaker addressing a large audience at a professional event",
    category: "Event Photography",
    year: "2026",
    href: "#ideas-live",
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
    title: "Casa Verde",
    eyebrow: "Real estate / Exterior",
    body: "Clean architectural photography balancing strong geometry, tropical light and the openness of modern living.",
    mediaUrl: "/images/villa-pool.jpg",
    mediaAlt: "Modern white villa with a private swimming pool",
    category: "Real Estate",
    year: "2026",
    href: "#casa-verde",
    accent: "ink",
  },
  {
    id: "object-ritual",
    kind: "project",
    sortOrder: 40,
    title: "Stillness Suite",
    eyebrow: "Boutique resort / Room film",
    body: "A concise moving portrait of a private suite, created for booking platforms, social campaigns and property launches.",
    mediaUrl: "/videos/boutique-room.mp4",
    mediaAlt: "Bright boutique hotel suite opening toward a pool",
    category: "Resort",
    year: "2026",
    href: "#stillness-suite",
    accent: "lime",
  },
  {
    id: "cliff-house",
    kind: "project",
    sortOrder: 45,
    title: "Woodland House",
    eyebrow: "Architecture / Twilight",
    body: "An exterior series built around warm interior light, natural context and the clarity of contemporary architecture.",
    mediaUrl: "/images/modern-house.jpg",
    mediaAlt: "Contemporary residence photographed at blue hour",
    category: "Architecture",
    year: "2026",
    href: "#woodland-house",
    accent: "forest",
  },
  {
    id: "resort-at-dusk",
    kind: "project",
    sortOrder: 46,
    title: "Horizon Resort",
    eyebrow: "Hospitality / Blue hour",
    body: "A twilight hospitality series balancing illuminated architecture, reflective water and the calm transition into evening.",
    mediaUrl: "/images/resort-exterior.jpg",
    mediaAlt: "Resort pool and hotel exterior photographed at blue hour",
    category: "Hospitality",
    year: "2026",
    href: "#horizon-resort",
    accent: "ink",
  },
  {
    id: "tropical-pavilion",
    kind: "project",
    sortOrder: 47,
    title: "Tropical Pavilion",
    eyebrow: "Real estate / Lifestyle",
    body: "A lifestyle-led property story connecting contemporary architecture with the relaxed way the home is meant to be lived in.",
    mediaUrl: "/images/tropical-interior.jpg",
    mediaAlt: "Contemporary tropical residence with a warm timber facade",
    category: "Real Estate",
    year: "2026",
    href: "#tropical-pavilion",
    accent: "forest",
  },
  {
    id: "sanctuary-interiors",
    kind: "project",
    sortOrder: 48,
    title: "Sanctuary Interiors",
    eyebrow: "Interiors / Editorial",
    body: "Natural, spacious interior photography that communicates finish, proportion and an immediate sense of home.",
    mediaUrl: "/images/luxury-interior.jpg",
    mediaAlt: "Contemporary living room with warm timber details",
    category: "Interiors",
    year: "2026",
    href: "#sanctuary-interiors",
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
    href: "https://instagram.com/",
    accent: "lime",
  },
];

export const defaultContent: SiteContent = {
  settings: defaultSettings,
  items: defaultItems,
};
