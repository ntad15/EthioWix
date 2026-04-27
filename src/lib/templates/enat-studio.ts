import { SiteConfig } from "@/types/site-config";

export const enatStudioTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "enat-studio",
  published: false,
  theme: {
    primaryColor: "#1a1a1a",
    secondaryColor: "#ededed",
    backgroundColor: "#fafafa",
    textColor: "#1a1a1a",
    accentColor: "#7a7a7a",
    fontHeading: "'DM Serif Display', serif",
    fontBody: "'Inter', sans-serif",
    borderRadius: "0rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "Enat Studio",
        tagline: "Portraits, weddings, and quiet documentary work",
        ctaText: "See Portfolio",
        ctaLink: "#gallery",
        backgroundImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1600&q=80",
        overlay: false,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "About",
        description:
          "Enat Studio is the practice of Selam Tesfaye, a photographer based between Addis Ababa and Lalibela. Working in natural light, she makes unhurried portraits of people, places, and the in-between moments that hold them together.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "Selected Work",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", alt: "Portrait" },
          { id: "g2", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80", alt: "Portrait" },
          { id: "g3", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80", alt: "Portrait" },
          { id: "g4", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80", alt: "Portrait" },
          { id: "g5", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", alt: "Portrait" },
          { id: "g6", src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", alt: "Portrait" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Packages",
        items: [
          { id: "m1", name: "Portrait Session", description: "90 minutes, one location, 25 edited images", price: "$450", image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80" },
          { id: "m2", name: "Wedding Day", description: "Full-day coverage, two photographers, online gallery", price: "$3,800", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" },
          { id: "m3", name: "Editorial / Brand", description: "Half-day commercial shoot with styled direction", price: "From $1,200", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "Studio",
        address: "Studio 4, Piassa District, Addis Ababa",
        schedule: [
          { day: "Consultations", hours: "By appointment" },
          { day: "Shoot days", hours: "Mon - Sat" },
          { day: "Response time", hours: "Within 48 hours" },
          { day: "Booking window", hours: "2 - 6 months out" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Get in Touch",
        phone: "+251 92 100 3344",
        email: "selam@enatstudio.co",
        bookingUrl: "#",
        bookingLabel: "Inquire",
      },
    },
  ],
};
