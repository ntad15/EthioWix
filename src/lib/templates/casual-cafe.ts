import { SiteConfig } from "@/types/site-config";

export const casualCafeTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  templateId: "casual-cafe",
  published: false,
  theme: {
    primaryColor: "#2d5016",
    secondaryColor: "#f4a261",
    backgroundColor: "#fefae0",
    textColor: "#2b2b2b",
    accentColor: "#e76f51",
    fontHeading: "'Poppins', sans-serif",
    fontBody: "'Inter', sans-serif",
    borderRadius: "1rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "The Green Bean",
        tagline: "Fresh brews & good vibes, every single day",
        ctaText: "See Our Menu",
        ctaLink: "#menu",
        backgroundImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "About Us",
        description:
          "The Green Bean is your neighborhood café where quality coffee meets a cozy atmosphere. We source our beans directly from small farms and roast them in-house for the freshest cup possible.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "Our Space",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", alt: "Latte art" },
          { id: "g2", src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80", alt: "Café interior" },
          { id: "g3", src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80", alt: "Coffee and pastry" },
          { id: "g4", src: "https://images.unsplash.com/photo-1493925410384-84f842e616fb?w=600&q=80", alt: "Fresh pastries" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Popular Picks",
        items: [
          { id: "m1", name: "House Blend Pour Over", description: "Single-origin, smooth & balanced", price: "$4.50", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&q=80" },
          { id: "m2", name: "Avocado Toast", description: "Sourdough, smashed avo, chili flakes, poached egg", price: "$11", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&q=80" },
          { id: "m3", name: "Açaí Bowl", description: "Topped with granola, banana, and local honey", price: "$13", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "Find Us",
        address: "456 Maple Street, Arts District",
        mapEmbedUrl: "",
        schedule: [
          { day: "Monday - Friday", hours: "7:00 AM - 6:00 PM" },
          { day: "Saturday", hours: "8:00 AM - 7:00 PM" },
          { day: "Sunday", hours: "8:00 AM - 4:00 PM" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Get in Touch",
        phone: "(555) 987-6543",
        email: "hello@thegreenbean.com",
        bookingUrl: "#",
        bookingLabel: "Order Online",
      },
    },
  ],
};
