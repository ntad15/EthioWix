import { z } from "zod";

// === Section Schemas ===

export const sectionStyleOverrideSchema = z.object({
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
  headingColor: z.string().optional(),
  fontSizeHeading: z.string().optional(),
  fontSizeBase: z.string().optional(),
}).optional();

export const heroSectionSchema = z.object({
  type: z.literal("hero"),
  id: z.string(),
  label: z.string().optional(),
  styleOverride: sectionStyleOverrideSchema,
  data: z.object({
    businessName: z.string(),
    tagline: z.string(),
    ctaText: z.string(),
    ctaLink: z.string(),
    backgroundImage: z.string(),
    logoImage: z.string().optional(),
    overlay: z.boolean().default(true),
  }),
});

export const aboutSectionSchema = z.object({
  type: z.literal("about"),
  id: z.string(),
  label: z.string().optional(),
  styleOverride: sectionStyleOverrideSchema,
  data: z.object({
    heading: z.string(),
    description: z.string(),
    logoImage: z.string(),
  }),
});

export const galleryImageSchema = z.object({
  id: z.string(),
  src: z.string(),
  alt: z.string(),
});

export const gallerySectionSchema = z.object({
  type: z.literal("gallery"),
  id: z.string(),
  label: z.string().optional(),
  styleOverride: sectionStyleOverrideSchema,
  data: z.object({
    heading: z.string(),
    images: z.array(galleryImageSchema),
  }),
});

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.string(),
  image: z.string(),
});

export const menuSectionSchema = z.object({
  type: z.literal("menu"),
  id: z.string(),
  label: z.string().optional(),
  styleOverride: sectionStyleOverrideSchema,
  data: z.object({
    heading: z.string(),
    items: z.array(menuItemSchema).max(6),
  }),
});

export const hourEntrySchema = z.object({
  day: z.string(),
  hours: z.string(),
});

export const hoursSectionSchema = z.object({
  type: z.literal("hours"),
  id: z.string(),
  label: z.string().optional(),
  styleOverride: sectionStyleOverrideSchema,
  data: z.object({
    heading: z.string(),
    address: z.string(),
    mapEmbedUrl: z.string(),
    schedule: z.array(hourEntrySchema),
  }),
});

export const contactSectionSchema = z.object({
  type: z.literal("contact"),
  id: z.string(),
  label: z.string().optional(),
  styleOverride: sectionStyleOverrideSchema,
  data: z.object({
    heading: z.string(),
    phone: z.string(),
    email: z.string(),
    bookingUrl: z.string(),
    bookingLabel: z.string(),
  }),
});

export const navLinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
});

export const navSectionSchema = z.object({
  type: z.literal("nav"),
  id: z.string(),
  label: z.string().optional(),
  styleOverride: sectionStyleOverrideSchema,
  data: z.object({
    brandName: z.string(),
    logoImage: z.string().optional(),
    links: z.array(navLinkSchema),
  }),
});

export const sectionSchema = z.discriminatedUnion("type", [
  navSectionSchema,
  heroSectionSchema,
  aboutSectionSchema,
  gallerySectionSchema,
  menuSectionSchema,
  hoursSectionSchema,
  contactSectionSchema,
]);

// === Theme Schema ===

export const themeSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  backgroundColor: z.string(),
  textColor: z.string(),
  accentColor: z.string(),
  fontHeading: z.string(),
  fontBody: z.string(),
  fontSizeBase: z.string().optional(),
  fontSizeHeading: z.string().optional(),
  headingColor: z.string().optional(),
  borderRadius: z.string().default("0.5rem"),
});

// === Site Config Schema ===

export const animationSchema = z.enum(["none", "scroll-reveal", "fade-in"]).default("none");

export const siteConfigSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  slug: z.string(),
  templateId: z.string(),
  animation: animationSchema.optional(),
  theme: themeSchema,
  sections: z.array(sectionSchema),
  showcaseData: z.record(z.string(), z.unknown()).optional(),
  published: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// === Inferred Types ===

export type HeroSection = z.infer<typeof heroSectionSchema>;
export type AboutSection = z.infer<typeof aboutSectionSchema>;
export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type GallerySection = z.infer<typeof gallerySectionSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuSection = z.infer<typeof menuSectionSchema>;
export type HourEntry = z.infer<typeof hourEntrySchema>;
export type HoursSection = z.infer<typeof hoursSectionSchema>;
export type ContactSection = z.infer<typeof contactSectionSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type NavSection = z.infer<typeof navSectionSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
export type SectionType = Section["type"];
export type SectionStyleOverride = z.infer<typeof sectionStyleOverrideSchema>;
export type Animation = z.infer<typeof animationSchema>;
