"use client";

import {
  ShowcaseTemplateId,
  getShowcaseData,
} from "..";
import {
  EsCuratedData,
  FdCinematicData,
  HsRitualData,
} from "../types";
import { EsCuratedEditor } from "./EsCuratedEditor";
import { FdCinematicEditor } from "./FdCinematicEditor";
import { HsRitualEditor } from "./HsRitualEditor";

export function ShowcaseEditor({
  templateId,
  raw,
  onChange,
}: {
  templateId: ShowcaseTemplateId;
  raw: unknown;
  onChange: (patch: Record<string, unknown>) => void;
}) {
  switch (templateId) {
    case "fd-cinematic":
      return (
        <FdCinematicEditor
          data={getShowcaseData("fd-cinematic", raw) as FdCinematicData}
          onChange={(patch) => onChange(patch as Record<string, unknown>)}
        />
      );
    case "hs-ritual":
      return (
        <HsRitualEditor
          data={getShowcaseData("hs-ritual", raw) as HsRitualData}
          onChange={(patch) => onChange(patch as Record<string, unknown>)}
        />
      );
    case "es-curated":
      return (
        <EsCuratedEditor
          data={getShowcaseData("es-curated", raw) as EsCuratedData}
          onChange={(patch) => onChange(patch as Record<string, unknown>)}
        />
      );
  }
}
