import { SiteConfig } from "@/types/site-config";

export const habeshaSpaTemplate: Omit<SiteConfig, "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"> = {
  animation: "none",
  templateId: "habesha-spa",
  published: false,
  theme: {
    primaryColor: "#5a3a2e",
    secondaryColor: "#e8c9a0",
    backgroundColor: "#f6efe4",
    textColor: "#2b1f18",
    accentColor: "#b5643c",
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'Nunito Sans', sans-serif",
    borderRadius: "0.75rem",
  },
  sections: [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName: "Buna Spa",
        tagline: "A coffee-ceremony sanctuary for body and mind",
        ctaText: "Book a Treatment",
        ctaLink: "#contact",
        backgroundImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1600&q=80",
        overlay: true,
      },
    },
    {
      type: "about",
      id: "about-1",
      data: {
        heading: "Our Ritual",
        description:
          "Buna Spa blends the Ethiopian coffee ceremony with time-honored bodywork. Every session begins with fresh roasted beans, frankincense, and a warm welcome — grounding you before the oils, stones, and steam take over.",
        logoImage: "",
      },
    },
    {
      type: "gallery",
      id: "gallery-1",
      data: {
        heading: "The Space",
        images: [
          { id: "g1", src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", alt: "Treatment room" },
          { id: "g2", src: "https://images.unsplash.com/photo-1620733723572-11c53f73a416?w=600&q=80", alt: "Coffee ceremony setup" },
          { id: "g3", src: "https://images.unsplash.com/photo-1532926381893-7542290edf1d?w=600&q=80", alt: "Herbal oils" },
          { id: "g4", src: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80", alt: "Steam room" },
          { id: "g5", src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&q=80", alt: "Massage stones" },
          { id: "g6", src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80", alt: "Relaxation lounge" },
        ],
      },
    },
    {
      type: "menu",
      id: "menu-1",
      data: {
        heading: "Treatments",
        items: [
          { id: "m1", name: "Coffee Ceremony Massage", description: "A 75-minute full-body massage opened with fresh buna and frankincense", price: "$120", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&q=80" },
          { id: "m2", name: "Teff & Honey Scrub", description: "Gentle exfoliation with Ethiopian teff flour and wild honey", price: "$85", image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&q=80" },
          { id: "m3", name: "Highland Herbal Steam", description: "Eucalyptus, rosemary and korarima steam infusion", price: "$65", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80" },
        ],
      },
    },
    {
      type: "hours",
      id: "hours-1",
      data: {
        heading: "Visit",
        address: "14 Bole Road, Addis Ababa",
        schedule: [
          { day: "Tuesday - Thursday", hours: "10:00 AM - 8:00 PM" },
          { day: "Friday - Saturday", hours: "9:00 AM - 9:00 PM" },
          { day: "Sunday", hours: "11:00 AM - 6:00 PM" },
          { day: "Monday", hours: "Closed" },
        ],
      },
    },
    {
      type: "contact",
      id: "contact-1",
      data: {
        heading: "Reserve Your Ritual",
        phone: "+251 11 555 0142",
        email: "hello@bunaspa.et",
        bookingUrl: "#",
        bookingLabel: "Book a Session",
      },
    },
  ],
};
