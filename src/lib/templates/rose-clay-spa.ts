import { SiteConfig } from "@/types/site-config";

export const roseClaySpaTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "rose-clay-spa",
  published: false,
  theme: {
    primaryColor: "#6b3547",
    secondaryColor: "#f2d5d0",
    backgroundColor: "#fbf3ef",
    textColor: "#3a2128",
    accentColor: "#c97b6a",
    fontHeading: "'Fraunces', serif",
    fontBody: "'DM Sans', sans-serif",
    borderRadius: "1.5rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "Adey Wellness",
        tagline: "Soft rituals, slow mornings, and highland rose",
        ctaText: "Book a Session",
        ctaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "A gentle place",
        description:
          "Named for the Adey Abeba — the golden Meskel daisy — our studio is built for rest. Massage, facials, and sound baths woven with Ethiopian botanicals: rose geranium, tena adam, and warm shea.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "Inside",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80", alt: "Massage table" },
          { id: "g2", src: "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=600&q=80", alt: "Dried flowers" },
          { id: "g3", src: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80", alt: "Facial treatment" },
          { id: "g4", src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", alt: "Candlelit room" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Rituals",
        items: [
          { id: "m1", name: "Rose Clay Facial", description: "Highland rose clay, honey mask, and lymphatic massage", price: "$95", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80" },
          { id: "m2", name: "Tena Adam Body Wrap", description: "Warm herbal wrap with Ethiopian rue and shea butter", price: "$110", image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&q=80" },
          { id: "m3", name: "Sound Bath + Tea", description: "45-minute sound healing with fresh hibiscus tea service", price: "$55", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "Find Us",
        address: "27 Kazanchis Lane, Addis Ababa",
        schedule: [
          { day: "Wednesday - Friday", hours: "11:00 AM - 7:00 PM" },
          { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
          { day: "Sunday", hours: "12:00 PM - 5:00 PM" },
          { day: "Monday - Tuesday", hours: "By appointment" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Say Hello",
        phone: "+251 91 234 5678",
        email: "hello@adeywellness.com",
        bookingUrl: "#",
        bookingLabel: "Reserve a Time",
        socials: [],
      },
    },
  ],
};
