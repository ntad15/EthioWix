import { FdCinematic } from "./FdCinematic";
import { HsRitual } from "./HsRitual";
import { EsCurated } from "./EsCurated";
import {
  FD_CINEMATIC_DEFAULTS,
  HS_RITUAL_DEFAULTS,
  ES_CURATED_DEFAULTS,
  type FdCinematicData,
  type HsRitualData,
  type EsCuratedData,
} from "./types";

export const SHOWCASE_TEMPLATE_IDS = [
  "fd-cinematic",
  "hs-ritual",
  "es-curated",
] as const;

export type ShowcaseTemplateId = (typeof SHOWCASE_TEMPLATE_IDS)[number];

export function isShowcaseTemplate(id: string): id is ShowcaseTemplateId {
  return (SHOWCASE_TEMPLATE_IDS as readonly string[]).includes(id);
}

export const SHOWCASE_DEFAULTS = {
  "fd-cinematic": FD_CINEMATIC_DEFAULTS,
  "hs-ritual": HS_RITUAL_DEFAULTS,
  "es-curated": ES_CURATED_DEFAULTS,
} as const;

export function getShowcaseData<T extends ShowcaseTemplateId>(
  templateId: T,
  raw: unknown,
): typeof SHOWCASE_DEFAULTS[T] {
  const defaults = SHOWCASE_DEFAULTS[templateId];
  if (!raw || typeof raw !== "object") return defaults;
  return { ...defaults, ...(raw as object) } as typeof SHOWCASE_DEFAULTS[T];
}

export function ShowcaseRenderer({
  templateId,
  raw,
}: {
  templateId: ShowcaseTemplateId;
  raw: unknown;
}) {
  switch (templateId) {
    case "fd-cinematic":
      return <FdCinematic data={getShowcaseData("fd-cinematic", raw) as FdCinematicData} />;
    case "hs-ritual":
      return <HsRitual data={getShowcaseData("hs-ritual", raw) as HsRitualData} />;
    case "es-curated":
      return <EsCurated data={getShowcaseData("es-curated", raw) as EsCuratedData} />;
  }
}

export const SHOWCASE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Lato:wght@300;400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Nunito+Sans:wght@300;400;600;700&family=DM+Serif+Display&display=swap";
