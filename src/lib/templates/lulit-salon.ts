import { SiteConfig } from "@/types/site-config";

export const lulitSalonTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "lulit-salon",
  published: false,
  theme: {
    primaryColor: "#8a4a5c",
    secondaryColor: "#f4d9dc",
    backgroundColor: "#fcf4f2",
    textColor: "#3a1f27",
    accentColor: "#c88a6a",
    fontHeading: "'Fraunces', serif",
    fontBody: "'DM Sans', sans-serif",
    borderRadius: "2rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "Lulit",
        tagline: "A modern salon rooted in Ethiopian hair traditions",
        ctaText: "Book an Appointment",
        ctaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "We're Lulit",
        description:
          "Lulit — meaning 'diamond' in Amharic — is a salon for natural hair, braids, and color, led by stylist Hana Bekele. We blend traditional Ethiopian styling with contemporary cuts, using clean, plant-based products.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "Looks We Love",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", alt: "Braids" },
          { id: "g2", src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80", alt: "Natural hair" },
          { id: "g3", src: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80", alt: "Salon interior" },
          { id: "g4", src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80", alt: "Styling" },
          { id: "g5", src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80", alt: "Color work" },
          { id: "g6", src: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80", alt: "Twists" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Services",
        items: [
          { id: "m1", name: "Signature Braids", description: "Custom Ethiopian-inspired braids, 3 - 5 hours", price: "$180", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80" },
          { id: "m2", name: "Wash, Trim & Style", description: "Deep condition, shape-up, and blow-out", price: "$85", image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&q=80" },
          { id: "m3", name: "Color Transformation", description: "Consultation, color, and protective treatment", price: "From $220", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "The Salon",
        address: "Suite 4, Sar Bet, Addis Ababa",
        mapEmbedUrl: "",
        schedule: [
          { day: "Tuesday - Thursday", hours: "10:00 AM - 7:00 PM" },
          { day: "Friday", hours: "10:00 AM - 8:00 PM" },
          { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
          { day: "Sunday - Monday", hours: "Closed" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Book Your Chair",
        phone: "+251 91 888 7722",
        email: "hello@lulitsalon.com",
        bookingUrl: "#",
        bookingLabel: "Schedule Online",
      },
    },
  ],
};
