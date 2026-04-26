import { SiteConfig } from "@/types/site-config";

type ShowcaseConfig = Omit<
  SiteConfig,
  "id" | "userId" | "name" | "slug" | "createdAt" | "updatedAt"
>;

// Showcase templates render via a bespoke React component (see
// src/components/showcases). The published page ignores these sections — they
// exist only so the SiteConfig schema validates and the builder doesn't crash.
function showcaseSections(businessName: string): ShowcaseConfig["sections"] {
  return [
    {
      type: "hero",
      id: "hero-1",
      data: {
        businessName,
        tagline: "This template is preview-only — edits won't appear on the published site.",
        ctaText: "Reserve",
        ctaLink: "#",
        backgroundImage: "",
        overlay: true,
      },
    },
  ];
}

export const fdCinematicTemplate: ShowcaseConfig = {
  animation: "none",
  templateId: "fd-cinematic",
  published: false,
  theme: {
    primaryColor: "#0f0f1a",
    secondaryColor: "#c9a96e",
    backgroundColor: "#0f0f1a",
    textColor: "#f5f5f5",
    accentColor: "#c9a96e",
    fontHeading: "'Playfair Display', serif",
    fontBody: "'Lato', sans-serif",
    borderRadius: "0.25rem",
  },
  sections: showcaseSections("La Maison Dorée"),
};

export const hsRitualTemplate: ShowcaseConfig = {
  animation: "none",
  templateId: "hs-ritual",
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
  sections: showcaseSections("Buna Spa"),
};

export const esCuratedTemplate: ShowcaseConfig = {
  animation: "none",
  templateId: "es-curated",
  published: false,
  theme: {
    primaryColor: "#0f0f0f",
    secondaryColor: "#b8865a",
    backgroundColor: "#fafafa",
    textColor: "#0f0f0f",
    accentColor: "#b8865a",
    fontHeading: "'DM Serif Display', serif",
    fontBody: "'Geist', sans-serif",
    borderRadius: "0rem",
  },
  sections: showcaseSections("Enat Studio"),
};
