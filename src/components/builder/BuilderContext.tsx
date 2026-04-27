"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { SiteConfig, Section, SectionType, Theme, Animation, SectionStyleOverride } from "@/types/site-config";
import { templates, TemplateId } from "@/lib/templates";
import { v4 as uuidv4 } from "uuid";

interface BuilderState {
  siteConfig: SiteConfig;
  selectedSectionId: string | null;
  isDirty: boolean;
}

type BuilderAction =
  | { type: "UPDATE_SECTION_DATA"; sectionId: string; data: Section["data"] }
  | { type: "REORDER_SECTIONS"; sections: Section[] }
  | { type: "ADD_SECTION"; sectionType: SectionType }
  | { type: "DELETE_SECTION"; sectionId: string }
  | { type: "RENAME_SECTION"; sectionId: string; label: string }
  | { type: "UPDATE_SECTION_STYLE"; sectionId: string; style: SectionStyleOverride }
  | { type: "SELECT_SECTION"; sectionId: string | null }
  | { type: "UPDATE_SITE_META"; name: string; slug: string }
  | { type: "UPDATE_THEME"; theme: Partial<Theme> }
  | { type: "UPDATE_ANIMATION"; animation: Animation }
  | { type: "SWITCH_TEMPLATE"; templateId: TemplateId }
  | { type: "UPDATE_SHOWCASE_DATA"; data: Record<string, unknown> }
  | { type: "TOGGLE_PUBLISH" }
  | { type: "MARK_SAVED" }
  | { type: "LOAD_CONFIG"; config: SiteConfig };

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case "UPDATE_SECTION_DATA":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          updatedAt: new Date().toISOString(),
          sections: state.siteConfig.sections.map((s) =>
            s.id === action.sectionId ? { ...s, data: action.data } as Section : s
          ),
        },
      };
    case "REORDER_SECTIONS":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          updatedAt: new Date().toISOString(),
          sections: action.sections,
        },
      };
    case "ADD_SECTION": {
      const newSection = createEmptySection(action.sectionType);
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          updatedAt: new Date().toISOString(),
          sections: [...state.siteConfig.sections, newSection],
        },
        selectedSectionId: newSection.id,
      };
    }
    case "DELETE_SECTION":
      return {
        ...state,
        isDirty: true,
        selectedSectionId:
          state.selectedSectionId === action.sectionId ? null : state.selectedSectionId,
        siteConfig: {
          ...state.siteConfig,
          updatedAt: new Date().toISOString(),
          sections: state.siteConfig.sections.filter((s) => s.id !== action.sectionId),
        },
      };
    case "RENAME_SECTION":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          updatedAt: new Date().toISOString(),
          sections: state.siteConfig.sections.map((s) =>
            s.id === action.sectionId ? { ...s, label: action.label } : s
          ) as Section[],
        },
      };
    case "UPDATE_SECTION_STYLE":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          updatedAt: new Date().toISOString(),
          sections: state.siteConfig.sections.map((s) =>
            s.id === action.sectionId
              ? { ...s, styleOverride: { ...(s.styleOverride ?? {}), ...action.style } }
              : s
          ) as Section[],
        },
      };
    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.sectionId };
    case "UPDATE_THEME":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          theme: { ...state.siteConfig.theme, ...action.theme },
          updatedAt: new Date().toISOString(),
        },
      };
    case "UPDATE_ANIMATION":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          animation: action.animation,
          updatedAt: new Date().toISOString(),
        },
      };
    case "UPDATE_SITE_META":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          name: action.name,
          slug: action.slug,
          updatedAt: new Date().toISOString(),
        },
      };
    case "SWITCH_TEMPLATE": {
      const template = templates[action.templateId];
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          templateId: template.config.templateId,
          theme: template.config.theme,
          // Keep existing content, just update theme
          updatedAt: new Date().toISOString(),
        },
      };
    }
    case "UPDATE_SHOWCASE_DATA":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          showcaseData: {
            ...(state.siteConfig.showcaseData ?? {}),
            ...action.data,
          },
          updatedAt: new Date().toISOString(),
        },
      };
    case "TOGGLE_PUBLISH":
      return {
        ...state,
        isDirty: true,
        siteConfig: {
          ...state.siteConfig,
          published: !state.siteConfig.published,
          updatedAt: new Date().toISOString(),
        },
      };
    case "MARK_SAVED":
      return { ...state, isDirty: false };
    case "LOAD_CONFIG":
      return { ...state, siteConfig: action.config, isDirty: false };
    default:
      return state;
  }
}

function createEmptySection(type: SectionType): Section {
  const id = uuidv4();
  switch (type) {
    case "nav":
      return { type: "nav", id, data: { brandName: "My Site", links: [{ id: uuidv4(), label: "About", href: "#about" }, { id: uuidv4(), label: "Gallery", href: "#gallery" }, { id: uuidv4(), label: "Contact", href: "#contact" }] } };
    case "hero":
      return { type: "hero", id, data: { businessName: "Your Business", tagline: "Your tagline here", ctaText: "Get Started", ctaLink: "#contact", backgroundImage: "", overlay: true } };
    case "about":
      return { type: "about", id, data: { heading: "About Us", description: "Tell your story here...", logoImage: "" } };
    case "gallery":
      return { type: "gallery", id, data: { heading: "Gallery", images: [] } };
    case "menu":
      return { type: "menu", id, data: { heading: "Our Offerings", items: [] } };
    case "hours":
      return { type: "hours", id, data: { heading: "Hours & Location", address: "Your address", schedule: [{ day: "Monday - Friday", hours: "9:00 AM - 5:00 PM" }] } };
    case "contact":
      return { type: "contact", id, data: { heading: "Contact", phone: "", email: "", bookingUrl: "", bookingLabel: "Get in Touch", socials: [] } };
    case "linkButton":
      return { type: "linkButton", id, data: { label: "Click here", url: "", openInNewTab: true, width: "md", height: "md", alignment: "center" } };
  }
}

function createDefaultNav(businessName: string): Section {
  return {
    type: "nav",
    id: uuidv4(),
    data: {
      brandName: businessName,
      links: [
        { id: uuidv4(), label: "About", href: "#about" },
        { id: uuidv4(), label: "Gallery", href: "#gallery" },
        { id: uuidv4(), label: "Menu", href: "#menu" },
        { id: uuidv4(), label: "Contact", href: "#contact" },
      ],
    },
  };
}

export function addDefaultNav(sections: Section[], businessName: string): Section[] {
  const hasNav = sections.some((s) => s.type === "nav");
  if (hasNav) return sections;
  return [createDefaultNav(businessName), ...sections];
}

function createDefaultConfig(templateId: TemplateId = "fine-dining"): SiteConfig {
  const template = templates[templateId];
  const now = new Date().toISOString();
  const heroSection = template.config.sections.find((s) => s.type === "hero");
  const businessName = heroSection?.data && "businessName" in heroSection.data
    ? (heroSection.data as { businessName: string }).businessName
    : "My Restaurant";

  return {
    id: uuidv4(),
    userId: "",
    name: "My Restaurant",
    slug: "my-restaurant",
    animation: "none",
    templateId: template.config.templateId,
    theme: template.config.theme,
    sections: addDefaultNav(template.config.sections as Section[], businessName),
    published: false,
    createdAt: now,
    updatedAt: now,
  };
}

interface BuilderContextType {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

export function BuilderProvider({
  children,
  initialConfig,
}: {
  children: ReactNode;
  initialConfig?: SiteConfig;
}) {
  const [state, dispatch] = useReducer(builderReducer, {
    siteConfig: initialConfig ?? createDefaultConfig(),
    selectedSectionId: null,
    isDirty: false,
  });

  return (
    <BuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within BuilderProvider");
  }
  return context;
}
