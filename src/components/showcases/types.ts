// Editable data shapes for each showcase template.
// These are intentionally bespoke (not block-based) so each design can expose
// the fields that make sense for its layout.

export interface FdCinematicData {
  brand: string;
  heroEyebrow: string;
  heroTagline: string;
  heroImage: string;
  marquee: string[];
  storyEyebrow: string;
  storyHeading: string;
  storyBody: string;
  storyImage: string;
  menuEyebrow: string;
  menuHeading: string;
  menuItems: { name: string; desc: string; price: string; img: string }[];
  galleryHeading: string;
  galleryImages: string[];
  visitHeading: string;
  visitArea: string;
  hours: { day: string; hours: string }[];
  reservationsHeading: string;
  phone: string;
  email: string;
  bookingUrl: string;
  bookingLabel: string;
}

export interface HsRitualData {
  brand: string;
  location: string;
  heroLine1: string;
  heroLine2Italic: string;
  heroLine3: string;
  heroBody: string;
  heroImage: string;
  heroBadge: string;
  marquee: string[];
  ritualEyebrow: string;
  ritualHeading: string;
  ritualSteps: { n: string; t: string; d: string; img: string }[];
  treatmentsHeading: string;
  treatmentsNote: string;
  treatments: { n: string; d: string; p: string; img: string }[];
  visitAddress: string;
  hours: { day: string; hours: string }[];
  reserveHeading: string;
  phone: string;
  email: string;
  bookingLabel: string;
}

export interface EsCuratedData {
  brand: string;
  heroEyebrow: string;
  heroLine1: string;
  heroLine2: string;
  heroLine3: string;
  heroBody: string;
  heroImage: string;
  worksHeading: string;
  worksNote: string;
  works: { src: string; caption: string; area: string; h: number }[];
  packagesHeading: string;
  packagesNote: string;
  packages: { n: string; d: string; p: string }[];
  studioAddress: string;
  studioMeta: { k: string; v: string }[];
  inquireBody: string;
  phone: string;
  email: string;
  inquireLabel: string;
}

export const FD_CINEMATIC_DEFAULTS: FdCinematicData = {
  brand: "La Maison Dorée",
  heroEyebrow: "Est. 1998 · French · Tasting Menu",
  heroTagline: "An exquisite culinary journey awaits.",
  heroImage:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
  marquee: [
    "Now serving Spring tasting",
    "Reservations open through August",
    "Vegetarian menu available",
    "Private dining for 12",
  ],
  storyEyebrow: "Our Story",
  storyHeading: "Classical technique, sourced within an hour.",
  storyBody:
    "Nestled in the heart of the city, our chef combines classical French techniques with locally sourced ingredients to create unforgettable dining experiences.",
  storyImage:
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80",
  menuEyebrow: "Chef's Selection",
  menuHeading: "The tasting",
  menuItems: [
    {
      name: "Pan-Seared Foie Gras",
      desc: "With fig compote and brioche toast",
      price: "$32",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    },
    {
      name: "Lobster Thermidor",
      desc: "Classic preparation with gruyère gratin",
      price: "$58",
      img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80",
    },
    {
      name: "Wagyu Beef Tenderloin",
      desc: "With truffle jus and seasonal vegetables",
      price: "$65",
      img: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
    },
  ],
  galleryHeading: "Inside the room",
  galleryImages: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80",
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  ],
  visitHeading: "123 Gourmet Avenue",
  visitArea: "Downtown",
  hours: [
    { day: "Tuesday – Thursday", hours: "6:00 PM – 10:00 PM" },
    { day: "Friday – Saturday", hours: "5:30 PM – 11:00 PM" },
    { day: "Sunday", hours: "5:30 PM – 9:30 PM" },
    { day: "Monday", hours: "Closed" },
  ],
  reservationsHeading: "Book a table",
  phone: "(555) 123-4567",
  email: "reservations@example.com",
  bookingUrl: "#",
  bookingLabel: "Book on OpenTable",
};

export const HS_RITUAL_DEFAULTS: HsRitualData = {
  brand: "Buna Spa",
  location: "Addis Ababa",
  heroLine1: "A coffee-",
  heroLine2Italic: "ceremony",
  heroLine3: "sanctuary.",
  heroBody:
    "Every session begins with fresh roasted beans, frankincense, and a warm welcome — grounding you before the oils, stones, and steam take over.",
  heroImage:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80",
  heroBadge: "Open today · 10am – 8pm",
  marquee: [
    "Coffee ceremony at every visit",
    "Locally-sourced Highland herbs",
    "Walk-ins welcome on Saturdays",
    "Couples rooms available",
  ],
  ritualEyebrow: "The Ritual",
  ritualHeading: "Three steps, slowly.",
  ritualSteps: [
    {
      n: "01",
      t: "Welcome with buna",
      d: "We greet you with fresh-roasted beans, frankincense, and a small cup of strong coffee — the way it has been done for centuries.",
      img: "https://images.unsplash.com/photo-1620733723572-11c53f73a416?w=900&q=80",
    },
    {
      n: "02",
      t: "The treatment",
      d: "Choose a coffee-ceremony massage, a teff & honey scrub, or a highland herbal steam. Each is paced to the breath, never the clock.",
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&q=80",
    },
    {
      n: "03",
      t: "Stillness",
      d: "End in the relaxation lounge with mountain tea and silence. Stay as long as you like.",
      img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&q=80",
    },
  ],
  treatmentsHeading: "Treatments",
  treatmentsNote: "All include the welcome buna",
  treatments: [
    {
      n: "Coffee Ceremony Massage",
      d: "75-minute full-body massage opened with fresh buna and frankincense",
      p: "$120",
      img: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&q=80",
    },
    {
      n: "Teff & Honey Scrub",
      d: "Gentle exfoliation with Ethiopian teff flour and wild honey",
      p: "$85",
      img: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&q=80",
    },
    {
      n: "Highland Herbal Steam",
      d: "Eucalyptus, rosemary and korarima steam infusion",
      p: "$65",
      img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    },
  ],
  visitAddress: "14 Bole Road, Addis Ababa",
  hours: [
    { day: "Tuesday – Thursday", hours: "10:00 AM – 8:00 PM" },
    { day: "Friday – Saturday", hours: "9:00 AM – 9:00 PM" },
    { day: "Sunday", hours: "11:00 AM – 6:00 PM" },
    { day: "Monday", hours: "Closed" },
  ],
  reserveHeading: "Reserve your ritual",
  phone: "+251 11 555 0142",
  email: "hello@bunaspa.et",
  bookingLabel: "Book a session",
};

export const ES_CURATED_DEFAULTS: EsCuratedData = {
  brand: "Enat Studio",
  heroEyebrow: "Photographer · Addis Ababa & Lalibela",
  heroLine1: "Portraits, weddings,",
  heroLine2: "and quiet",
  heroLine3: "documentary work.",
  heroBody:
    "A working photography practice. Natural light, unhurried portraits of people, places, and the in-between moments that hold them together.",
  heroImage:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80",
  worksHeading: "Selected Work",
  worksNote: "2023 – 2026 · Index",
  works: [
    {
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80",
      caption: "Selam, near Lalibela — 2025",
      area: "1 / 1 / 3 / 3",
      h: 540,
    },
    {
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
      caption: "The garden",
      area: "1 / 3 / 2 / 4",
      h: 260,
    },
    {
      src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
      caption: "Mehret",
      area: "2 / 3 / 3 / 4",
      h: 260,
    },
    {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
      caption: "Wedding day",
      area: "3 / 1 / 4 / 2",
      h: 320,
    },
    {
      src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80",
      caption: "Studio portrait",
      area: "3 / 2 / 4 / 4",
      h: 320,
    },
  ],
  packagesHeading: "Packages",
  packagesNote: "Custom commissions and editorial work also welcome.",
  packages: [
    {
      n: "Portrait Session",
      d: "90 minutes, one location, 25 edited images",
      p: "$450",
    },
    {
      n: "Wedding Day",
      d: "Full-day coverage, two photographers, online gallery",
      p: "$3,800",
    },
    {
      n: "Editorial / Brand",
      d: "Half-day commercial shoot with styled direction",
      p: "From $1,200",
    },
  ],
  studioAddress: "Studio 4, Piassa District, Addis Ababa",
  studioMeta: [
    { k: "Consultations", v: "By appointment" },
    { k: "Shoot days", v: "Mon – Sat" },
    { k: "Response time", v: "Within 48 hours" },
    { k: "Booking window", v: "2 – 6 months out" },
  ],
  inquireBody:
    "Send a few words about the project, the date, and the place. The studio replies within 48 hours.",
  phone: "+251 92 100 3344",
  email: "hello@enatstudio.co",
  inquireLabel: "Inquire →",
};

export type ShowcaseData = FdCinematicData | HsRitualData | EsCuratedData;
