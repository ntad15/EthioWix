"use client";

import { AboutSection, Theme } from "@/types/site-config";
import { ImagePlus, X } from "lucide-react";
import { useState } from "react";

interface AboutBlockProps {
  section: AboutSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: AboutSection["data"]) => void;
}

export function AboutBlock({ section, theme, mode, onUpdate }: AboutBlockProps) {
  const { data } = section;
  const headingColor = theme.headingColor ?? theme.textColor;
  const headingSize = theme.fontSizeHeading ?? "2.5rem";
  const bodySize = theme.fontSizeBase ?? "1.125rem";
  const [logoEditorOpen, setLogoEditorOpen] = useState(false);

  const handleChange = (field: keyof AboutSection["data"], value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, [field]: value });
    }
  };

  return (
    <section
      id="about"
      className="px-4 py-20"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontSize: bodySize }}
    >
      <div className="mx-auto max-w-3xl text-center">
        {data.logoImage && (
          <div className="mx-auto mb-8 h-24 w-24 overflow-hidden rounded-full">
            <img
              src={data.logoImage}
              alt="Logo"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        {mode === "edit" && (
          <div className="relative mb-8 flex justify-center">
            <button
              type="button"
              onClick={() => setLogoEditorOpen((v) => !v)}
              className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
            >
              <ImagePlus size={12} />
              {data.logoImage ? "Change logo" : "Add logo"}
            </button>
            {logoEditorOpen && (
              <div className="absolute top-full z-20 mt-2 flex w-72 flex-col gap-2 rounded-md bg-black/80 p-2 text-xs text-white shadow-lg">
                <input
                  autoFocus
                  className="w-full rounded bg-white/90 px-2 py-1 text-gray-800 outline-none"
                  placeholder="Paste logo image URL"
                  value={data.logoImage ?? ""}
                  onChange={(e) => handleChange("logoImage", e.target.value)}
                />
                <div className="flex justify-between">
                  {data.logoImage ? (
                    <button
                      type="button"
                      onClick={() => handleChange("logoImage", "")}
                      className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 hover:bg-red-700"
                    >
                      <X size={10} /> Remove
                    </button>
                  ) : <span />}
                  <button
                    type="button"
                    onClick={() => setLogoEditorOpen(false)}
                    className="rounded bg-white/20 px-2 py-1 hover:bg-white/30"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === "edit" ? (
          <input
            className="mb-6 w-full bg-transparent text-center font-bold outline-none"
            style={{ fontFamily: theme.fontHeading, color: headingColor, fontSize: headingSize }}
            value={data.heading}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        ) : (
          <h2
            className="mb-6 font-bold"
            style={{ fontFamily: theme.fontHeading, color: headingColor, fontSize: headingSize }}
          >
            {data.heading}
          </h2>
        )}

        {mode === "edit" ? (
          <textarea
            className="w-full resize-none bg-transparent text-center leading-relaxed outline-none"
            style={{ fontFamily: theme.fontBody, color: theme.textColor, fontSize: bodySize }}
            value={data.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
          />
        ) : (
          <p
            className="leading-relaxed"
            style={{ fontFamily: theme.fontBody, fontSize: bodySize }}
          >
            {data.description}
          </p>
        )}
      </div>
    </section>
  );
}
