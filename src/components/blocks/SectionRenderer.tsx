"use client";

import { Section, Theme } from "@/types/site-config";
import { HeroBlock } from "./HeroBlock";
import { AboutBlock } from "./AboutBlock";
import { GalleryBlock } from "./GalleryBlock";
import { MenuBlock } from "./MenuBlock";
import { HoursBlock } from "./HoursBlock";
import { ContactBlock } from "./ContactBlock";
import { NavBlock } from "./NavBlock";

interface SectionRendererProps {
  section: Section;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: Section["data"]) => void;
}

function mergeThemeWithOverride(theme: Theme, section: Section): Theme {
  const override = section.styleOverride;
  if (!override) return theme;

  return {
    ...theme,
    backgroundColor: override.backgroundColor || theme.backgroundColor,
    textColor: override.textColor || theme.textColor,
    fontSizeHeading: override.fontSizeHeading || theme.fontSizeHeading,
    fontSizeBase: override.fontSizeBase || theme.fontSizeBase,
    headingColor: override.headingColor || theme.headingColor,
  };
}

export function SectionRenderer({ section, theme, mode, onUpdate }: SectionRendererProps) {
  const mergedTheme = mergeThemeWithOverride(theme, section);
  const block = (() => {
    switch (section.type) {
      case "nav":
        return <NavBlock section={section} theme={mergedTheme} mode={mode} onUpdate={onUpdate as never} />;
      case "hero":
        return <HeroBlock section={section} theme={mergedTheme} mode={mode} onUpdate={onUpdate as never} />;
      case "about":
        return <AboutBlock section={section} theme={mergedTheme} mode={mode} onUpdate={onUpdate as never} />;
      case "gallery":
        return <GalleryBlock section={section} theme={mergedTheme} mode={mode} onUpdate={onUpdate as never} />;
      case "menu":
        return <MenuBlock section={section} theme={mergedTheme} mode={mode} onUpdate={onUpdate as never} />;
      case "hours":
        return <HoursBlock section={section} theme={mergedTheme} mode={mode} onUpdate={onUpdate as never} />;
      case "contact":
        return <ContactBlock section={section} theme={mergedTheme} mode={mode} onUpdate={onUpdate as never} />;
      default:
        return null;
    }
  })();

  return block;
}
