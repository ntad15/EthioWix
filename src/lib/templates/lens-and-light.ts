import { SiteConfig } from "@/types/site-config";

export const lensAndLightTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "lens-and-light",
  published: false,
  theme: {
    primaryColor: "#3b2a1e",
    secondaryColor: "#e8dcc4",
    backgroundColor: "#f4ecdc",
    textColor: "#2a1f16",
    accentColor: "#b8562a",
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Work Sans', sans-serif",
    borderRadius: "0.125rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "Lens & Light",
        tagline: "Film and digital stories, made slow",
        ctaText: "View Archive",
        ctaLink: "#gallery",
        backgroundImage: "https://images.unsplash.com/photo-1452827073306-6e6e661baf57?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "Hello, I'm Dawit",
        description:
          "I shoot mostly on 35mm film — portraits, travel, and the everyday. Born in Bahir Dar, trained in Cairo, now working out of a small studio in Addis. I like long conversations before the shutter clicks.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "The Archive",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80", alt: "Film portrait" },
          { id: "g2", src: "https://images.unsplash.com/photo-1551817958-20204d6ab212?w=600&q=80", alt: "Street photograph" },
          { id: "g3", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", alt: "Portrait" },
          { id: "g4", src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", alt: "Travel" },
          { id: "g5", src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80", alt: "Landscape" },
          { id: "g6", src: "https://images.unsplash.com/photo-1529255814253-5ab12d3aee70?w=600&q=80", alt: "Film still" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Services",
        items: [
          { id: "m1", name: "Film Portrait", description: "Two rolls of 35mm, hand-scanned & delivered on contact sheet", price: "$380", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80" },
          { id: "m2", name: "Travel Commission", description: "Multi-day editorial coverage, documentary style", price: "From $2,400", image: "https://images.unsplash.com/photo-1493305048069-3cc5a1b1fd3b?w=400&q=80" },
          { id: "m3", name: "Print Sale", description: "Signed archival prints from the ongoing archive", price: "From $180", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "The Studio",
        address: "Shop 2A, Arat Kilo, Addis Ababa",
        mapEmbedUrl: "",
        schedule: [
          { day: "Darkroom", hours: "Tue - Fri" },
          { day: "Meetings", hours: "By appointment" },
          { day: "Email reply", hours: "Within 3 days" },
          { day: "Print orders", hours: "2 - 3 weeks" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Work With Me",
        phone: "+251 93 445 2019",
        email: "dawit@lensandlight.studio",
        bookingUrl: "#",
        bookingLabel: "Start a Conversation",
      },
    },
  ],
};
