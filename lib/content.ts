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
  tagline: "Architecture, hospitality and places—photographed with feeling.",
  description:
    "Mind Rhythm is a professional photography and film studio specialising in resorts, real estate, architecture and interiors. We create polished visual stories that help exceptional places feel desirable, memorable and ready to be discovered.",
  vision:
    "To reveal the character of every property through considered light, precise composition and imagery that invites people to imagine themselves there.",
  idea:
    "Photography, aerial film, interiors and hospitality storytelling—planned as one coherent visual system for every property.",
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
    title: "A specialist property image team",
    eyebrow: "Photography team",
    body: "Architecture photography, hospitality film, aerial capture, styling and post-production—assembled for each property.",
    mediaUrl: "/images/filmmaker.jpg",
    mediaAlt: "Professional property photographer",
    category: "Photography Team",
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
