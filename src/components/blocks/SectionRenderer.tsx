"use client";

import { Section, Theme } from "@/types/site-config";
import { HeroBlock } from "./HeroBlock";
import { AboutBlock } from "./AboutBlock";
import { GalleryBlock } from "./GalleryBlock";
import { MenuBlock } from "./MenuBlock";
import { HoursBlock } from "./HoursBlock";
import { ContactBlock } from "./ContactBlock";

interface SectionRendererProps {
  section: Section;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: Section["data"]) => void;
}

export function SectionRenderer({ section, theme, mode, onUpdate }: SectionRendererProps) {
  switch (section.type) {
    case "hero":
      return <HeroBlock section={section} theme={theme} mode={mode} onUpdate={onUpdate as never} />;
    case "about":
      return <AboutBlock section={section} theme={theme} mode={mode} onUpdate={onUpdate as never} />;
    case "gallery":
      return <GalleryBlock section={section} theme={theme} mode={mode} onUpdate={onUpdate as never} />;
    case "menu":
      return <MenuBlock section={section} theme={theme} mode={mode} onUpdate={onUpdate as never} />;
    case "hours":
      return <HoursBlock section={section} theme={theme} mode={mode} onUpdate={onUpdate as never} />;
    case "contact":
      return <ContactBlock section={section} theme={theme} mode={mode} onUpdate={onUpdate as never} />;
    default:
      return null;
  }
}
