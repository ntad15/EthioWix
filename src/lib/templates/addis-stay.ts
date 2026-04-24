import { SiteConfig } from "@/types/site-config";

export const addisStayTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "addis-stay",
  published: false,
  theme: {
    primaryColor: "#3d4a2a",
    secondaryColor: "#d9c89a",
    backgroundColor: "#f5efe0",
    textColor: "#2a2a1f",
    accentColor: "#a8722c",
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'Nunito Sans', sans-serif",
    borderRadius: "0.5rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "Meskel House",
        tagline: "A small guesthouse in the hills above Addis",
        ctaText: "Check Availability",
        ctaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "Welcome home",
        description:
          "Meskel House is a four-room guesthouse in Entoto, named for the yellow daisies that cover the hills each September. Home-cooked injera breakfasts, fresh buna, and long views of the city below.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "The House",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", alt: "Dining room" },
          { id: "g2", src: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=600&q=80", alt: "Garden" },
          { id: "g3", src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", alt: "Guest room" },
          { id: "g4", src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80", alt: "Breakfast" },
          { id: "g5", src: "https://images.unsplash.com/photo-1522444195799-478538b28823?w=600&q=80", alt: "Living area" },
          { id: "g6", src: "https://images.unsplash.com/photo-1505692794403-82646a351b64?w=600&q=80", alt: "View" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Rooms",
        items: [
          { id: "m1", name: "Entoto Room", description: "Queen bed, private bath, hillside view", price: "$95/night", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80" },
          { id: "m2", name: "Adey Suite", description: "King bed, sitting area, garden terrace", price: "$145/night", image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400&q=80" },
          { id: "m3", name: "The Attic", description: "Two twin beds, skylight, perfect for friends", price: "$120/night", image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "Stay With Us",
        address: "Entoto Hills, Addis Ababa",
        mapEmbedUrl: "",
        schedule: [
          { day: "Check-in", hours: "2:00 PM" },
          { day: "Check-out", hours: "11:00 AM" },
          { day: "Breakfast", hours: "7:30 - 10:00 AM" },
          { day: "Coffee ceremony", hours: "Daily at 4:00 PM" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Reserve a Room",
        phone: "+251 11 667 8800",
        email: "stay@meskelhouse.com",
        bookingUrl: "#",
        bookingLabel: "Check Availability",
      },
    },
  ],
};
