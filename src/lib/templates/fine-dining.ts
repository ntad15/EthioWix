import { SiteConfig } from "@/types/site-config";

export const fineDiningTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "fine-dining",
  published: false,
  theme: {
    primaryColor: "#1a1a2e",
    secondaryColor: "#c9a96e",
    backgroundColor: "#0f0f1a",
    textColor: "#f5f5f5",
    accentColor: "#c9a96e",
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Lato', sans-serif",
    borderRadius: "0.25rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "La Maison Dorée",
        tagline: "An exquisite culinary journey awaits",
        ctaText: "Reserve a Table",
        ctaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "Our Story",
        description:
          "Nestled in the heart of the city, La Maison Dorée has been serving extraordinary cuisine since 1998. Our chef combines classical French techniques with locally sourced ingredients to create unforgettable dining experiences.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "Gallery",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80", alt: "Signature dish" },
          { id: "g2", src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", alt: "Restaurant interior" },
          { id: "g3", src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80", alt: "Fine dining ambience" },
          { id: "g4", src: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80", alt: "Dessert platter" },
          { id: "g5", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80", alt: "Dining room" },
          { id: "g6", src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80", alt: "Chef at work" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Chef's Selection",
        items: [
          { id: "m1", name: "Pan-Seared Foie Gras", description: "With fig compote and brioche toast", price: "$32", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
          { id: "m2", name: "Lobster Thermidor", description: "Classic preparation with gruyère gratin", price: "$58", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80" },
          { id: "m3", name: "Wagyu Beef Tenderloin", description: "With truffle jus and seasonal vegetables", price: "$65", image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "Visit Us",
        address: "123 Gourmet Avenue, Downtown",
        schedule: [
          { day: "Monday", hours: "Closed" },
          { day: "Tuesday - Thursday", hours: "6:00 PM - 10:00 PM" },
          { day: "Friday - Saturday", hours: "5:30 PM - 11:00 PM" },
          { day: "Sunday", hours: "5:30 PM - 9:30 PM" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Reservations",
        phone: "(555) 123-4567",
        email: "reservations@lamaisondoree.com",
        bookingUrl: "#",
        bookingLabel: "Book on OpenTable",
      },
    },
  ],
};
