import { SiteConfig } from "@/types/site-config";

export const hotelStayTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "hotel-stay",
  published: false,
  theme: {
    primaryColor: "#1b3a4b",
    secondaryColor: "#a3c4bc",
    backgroundColor: "#f7f7f7",
    textColor: "#1b1b1b",
    accentColor: "#d4a574",
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'Nunito Sans', sans-serif",
    borderRadius: "0.5rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "The Azure Hotel",
        tagline: "Where comfort meets elegance",
        ctaText: "Book Your Stay",
        ctaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "Welcome",
        description:
          "The Azure Hotel offers a serene escape in the heart of the coast. With stunning ocean views, world-class amenities, and personalized service, every stay becomes a cherished memory.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "Experience",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", alt: "Luxury room" },
          { id: "g2", src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", alt: "Hotel pool" },
          { id: "g3", src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80", alt: "Spa suite" },
          { id: "g4", src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", alt: "Ocean view" },
          { id: "g5", src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", alt: "Restaurant" },
          { id: "g6", src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80", alt: "Lobby lounge" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Room Types",
        items: [
          { id: "m1", name: "Deluxe Room", description: "King bed, city view, complimentary breakfast", price: "$199/night", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
          { id: "m2", name: "Ocean Suite", description: "Panoramic ocean view, private balcony, minibar", price: "$349/night", image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&q=80" },
          { id: "m3", name: "Presidential Suite", description: "Two bedrooms, living room, butler service", price: "$599/night", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "Location",
        address: "789 Oceanfront Boulevard, Seaside",
        mapEmbedUrl: "",
        schedule: [
          { day: "Check-in", hours: "3:00 PM" },
          { day: "Check-out", hours: "11:00 AM" },
          { day: "Front Desk", hours: "24 Hours" },
          { day: "Restaurant", hours: "6:30 AM - 10:00 PM" },
          { day: "Spa", hours: "9:00 AM - 8:00 PM" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Book Your Stay",
        phone: "(555) 456-7890",
        email: "reservations@theazurehotel.com",
        bookingUrl: "#",
        bookingLabel: "Check Availability",
      },
    },
  ],
};
