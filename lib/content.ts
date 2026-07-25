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
  x: string;
};

export type SiteContent = {
  settings: SiteSettings;
  items: ContentItem[];
};

export const defaultSettings: SiteSettings = {
  siteName: "MINDRYTHM",
  tagline: "Every story has a rhythm.",
  description:
    "Mind Rhythm is an independent film and photography studio translating the unseen character of people, places and brands into honest, cinematic visual stories.",
  vision:
    "Our vision is to create a place where ideas find their visual language, where artists find one another, and where every project contributes to a body of work that is as intentional as it is beautiful.",
  idea:
    "Every commission begins with listening. We shape the right visual language around the people, place and intention behind the story.",
  contactEmail: "Admin@mindrythm.com",
  phonePrimary: "+91 90735 73878",
  phoneSecondary: "+91 62923 33492",
  address: "250, Bansdroni, Rifle Club Playground, Kolkata - 700070",
  instagram: "https://instagram.com/",
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
  "The best stories usually begin with, “I don't know how to explain this…”",
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
    mediaUrl: "/images/wedding-palace-hero.png",
    mediaAlt: "Indian newlyweds walking through an elegant candlelit palace courtyard",
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
