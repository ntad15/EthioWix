"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { SiteConfig, Section } from "@/types/site-config";
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
  | { type: "SELECT_SECTION"; sectionId: string | null }
  | { type: "UPDATE_SITE_META"; name: string; slug: string }
  | { type: "SWITCH_TEMPLATE"; templateId: TemplateId }
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
    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.sectionId };
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

function createDefaultConfig(templateId: TemplateId = "fine-dining"): SiteConfig {
  const template = templates[templateId];
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    userId: "",
    name: "My Restaurant",
    slug: "my-restaurant",
    templateId: template.config.templateId,
    theme: template.config.theme,
    sections: template.config.sections,
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
