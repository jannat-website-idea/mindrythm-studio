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
  tagline: "A studio for images that stay with you.",
  description:
    "Mindrythm is an independent creative studio working across moving image, photography and visual identity. We turn ideas into atmospheric worlds with feeling, clarity and a pulse of their own.",
  vision:
    "To make thoughtful visual work that slows people down, draws them closer and keeps resonating after the screen goes dark.",
  idea:
    "A fluid collective of directors, image-makers and designers, assembled around the needs of every story.",
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
    title: "Quiet Frequency",
    eyebrow: "Film / Tokyo",
    body: "A nocturnal study of architecture, weather and the small rituals that make a city feel intimate.",
    mediaUrl: "/images/tokyo-rain.jpg",
    mediaAlt: "Rainy Tokyo street framed by contemporary architecture",
    category: "Film",
    year: "2026",
    href: "#quiet-frequency",
    accent: "forest",
  },
  {
    id: "in-passing",
    kind: "project",
    sortOrder: 20,
    title: "In Passing",
    eyebrow: "Movement / Art film",
    body: "Two bodies, one room and the space between intention and instinct.",
    mediaUrl: "/images/dance-study.jpg",
    mediaAlt: "Two contemporary dancers moving through a minimal studio",
    category: "Motion",
    year: "2026",
    href: "#in-passing",
    accent: "sage",
  },
  {
    id: "field-notes",
    kind: "project",
    sortOrder: 30,
    title: "Field Notes",
    eyebrow: "Portrait / Documentary",
    body: "Portraits of people who build culture quietly, one frame and one decision at a time.",
    mediaUrl: "/images/filmmaker.jpg",
    mediaAlt: "Portrait of a filmmaker beneath concrete architecture",
    category: "Image",
    year: "2026",
    href: "#field-notes",
    accent: "ink",
  },
  {
    id: "object-ritual",
    kind: "project",
    sortOrder: 40,
    title: "Object / Ritual",
    eyebrow: "Still life / Identity",
    body: "A visual language built from botanical form, crafted surfaces and purposeful restraint.",
    mediaUrl: "/images/green-object.jpg",
    mediaAlt: "Sculptural green botanical arrangement in a dark studio",
    category: "Identity",
    year: "2026",
    href: "#object-ritual",
    accent: "lime",
  },
  {
    id: "collective",
    kind: "team",
    sortOrder: 50,
    title: "A small, shape-shifting collective",
    eyebrow: "People",
    body: "Direction, cinematography, photography, design and post-production — brought together for every brief.",
    mediaUrl: "/images/filmmaker.jpg",
    mediaAlt: "Mindrythm creative collaborator",
    category: "Team",
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
