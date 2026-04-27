import { SiteConfig } from "@/types/site-config";

export const saffronStayTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "saffron-stay",
  published: false,
  theme: {
    primaryColor: "#1f5a5c",
    secondaryColor: "#f4c95d",
    backgroundColor: "#fdf6e7",
    textColor: "#1a2a2c",
    accentColor: "#e07a3c",
    fontHeading: "'Fraunces', serif",
    fontBody: "'DM Sans', sans-serif",
    borderRadius: "1.25rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "Saffron & Stone",
        tagline: "A cheerful guesthouse on the edge of the old town",
        ctaText: "Book a Stay",
        ctaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "Come stay a while",
        description:
          "We are Genet and Yonas — a mother-and-son team running four colorful rooms out of a 1940s stone house in Harar. Expect hand-painted walls, a courtyard full of basil and lemon trees, and breakfast that never ends.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "Around the House",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80", alt: "Courtyard" },
          { id: "g2", src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80", alt: "Colorful bedroom" },
          { id: "g3", src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", alt: "Painted wall" },
          { id: "g4", src: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80", alt: "Breakfast table" },
          { id: "g5", src: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=600&q=80", alt: "Bed detail" },
          { id: "g6", src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80", alt: "Old town" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Our Rooms",
        items: [
          { id: "m1", name: "The Saffron Room", description: "Double bed, yellow walls, courtyard doors", price: "$75/night", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80" },
          { id: "m2", name: "Teal Studio", description: "King bed, little kitchen, desk by the window", price: "$110/night", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80" },
          { id: "m3", name: "The Family Suite", description: "Two rooms connected, up to four guests, big bathroom", price: "$165/night", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "The Details",
        address: "Jugol Old Town, Harar",
        schedule: [
          { day: "Check-in", hours: "Anytime after 1 PM" },
          { day: "Check-out", hours: "By 11 AM" },
          { day: "Breakfast", hours: "8:00 - 11:00 AM" },
          { day: "Host hours", hours: "We're here all day" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Say Selam",
        phone: "+251 25 666 1201",
        email: "hello@saffronandstone.com",
        bookingUrl: "#",
        bookingLabel: "Message Us",
      },
    },
  ],
};
