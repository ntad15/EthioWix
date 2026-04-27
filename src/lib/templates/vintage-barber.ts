import { SiteConfig } from "@/types/site-config";

export const vintageBarberTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "vintage-barber",
  published: false,
  theme: {
    primaryColor: "#2a1818",
    secondaryColor: "#c9a24a",
    backgroundColor: "#f1e6d0",
    textColor: "#1f1410",
    accentColor: "#8a2a24",
    fontHeading: "'Libre Caslon Text', serif",
    fontBody: "'Work Sans', sans-serif",
    borderRadius: "0.125rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "Kebede & Sons",
        tagline: "Traditional barbering since 1968",
        ctaText: "Book a Chair",
        ctaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "Three Generations",
        description:
          "Kebede & Sons has been cutting hair on Churchill Avenue since 1968. Grandfather Kebede opened the shop with one chair and a straight razor; today his grandchildren keep the same traditions — hot towels, sharp lines, and a conversation worth the wait.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "The Shop",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", alt: "Barber chair" },
          { id: "g2", src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80", alt: "Straight razor" },
          { id: "g3", src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80", alt: "Cut in progress" },
          { id: "g4", src: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=600&q=80", alt: "Hot towel" },
          { id: "g5", src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80", alt: "Shop front" },
          { id: "g6", src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", alt: "Tools" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "The Menu",
        items: [
          { id: "m1", name: "The Classic Cut", description: "Scissor cut, clipper work, and a straight-razor neckline", price: "$28", image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80" },
          { id: "m2", name: "Hot Towel Shave", description: "Full straight-razor shave with three hot towels", price: "$35", image: "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&q=80" },
          { id: "m3", name: "Father & Son", description: "Cut for one adult and one child, together in the next chair", price: "$40", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "The Shop",
        address: "112 Churchill Avenue, Addis Ababa",
        schedule: [
          { day: "Tuesday - Friday", hours: "9:00 AM - 7:00 PM" },
          { day: "Saturday", hours: "8:00 AM - 8:00 PM" },
          { day: "Sunday", hours: "10:00 AM - 3:00 PM" },
          { day: "Monday", hours: "Closed" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Pull Up a Chair",
        phone: "+251 11 551 9922",
        email: "shop@kebedeandsons.com",
        bookingUrl: "#",
        bookingLabel: "Reserve a Time",
      },
    },
  ],
};
