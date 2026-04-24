"use client";

import { HeroSection, Theme } from "@/types/site-config";
import { ImagePlus, Link2, X } from "lucide-react";
import { useState } from "react";

interface HeroBlockProps {
  section: HeroSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: HeroSection["data"]) => void;
}

export function HeroBlock({ section, theme, mode, onUpdate }: HeroBlockProps) {
  const { data } = section;
  const headingColor = theme.headingColor ?? theme.textColor;
  const headingSize = theme.fontSizeHeading ?? "3.5rem";
  // Use theme text color when there's no overlay, white when there is
  const contentColor = data.overlay ? "#ffffff" : theme.textColor;
  const titleColor = data.overlay ? "#ffffff" : headingColor;
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [logoEditorOpen, setLogoEditorOpen] = useState(false);

  const handleChange = (field: keyof HeroSection["data"], value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, [field]: value });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden"
      style={{ fontFamily: theme.fontBody, backgroundColor: theme.backgroundColor }}
    >
      {/* Background Image */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
      {data.overlay && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Edit-mode image control */}
      {mode === "edit" && (
        <div className="absolute right-4 top-4 z-20">
          <button
            type="button"
            onClick={() => setImageEditorOpen((v) => !v)}
            className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
          >
            <ImagePlus size={12} />
            {data.backgroundImage ? "Change image" : "Add image"}
          </button>
          {imageEditorOpen && (
            <div className="mt-2 flex w-72 flex-col gap-2 rounded-md bg-black/80 p-2 text-xs text-white shadow-lg">
              <input
                autoFocus
                className="w-full rounded bg-white/90 px-2 py-1 text-gray-800 outline-none"
                placeholder="Paste background image URL"
                value={data.backgroundImage}
                onChange={(e) => handleChange("backgroundImage", e.target.value)}
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={data.overlay}
                    onChange={(e) =>
                      onUpdate && onUpdate({ ...data, overlay: e.target.checked })
                    }
                  />
                  Dark overlay
                </label>
                <div className="flex gap-1">
                  {data.backgroundImage && (
                    <button
                      type="button"
                      onClick={() => handleChange("backgroundImage", "")}
                      className="flex items-center gap-1 rounded bg-red-600 px-2 py-1 hover:bg-red-700"
                    >
                      <X size={10} /> Remove
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setImageEditorOpen(false)}
                    className="rounded bg-white/20 px-2 py-1 hover:bg-white/30"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 px-4 text-center" style={{ color: contentColor }}>
        {/* Logo */}
        {data.logoImage && (
          <div className="mb-6 flex justify-center">
            <img
              src={data.logoImage}
              alt="Logo"
              className="h-24 w-24 rounded-full object-cover shadow-lg"
            />
          </div>
        )}
        {mode === "edit" && (
          <div className="relative mb-4 flex justify-center">
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
            className="mb-4 w-full border-b border-dashed border-current/30 bg-transparent text-center font-bold outline-none"
            style={{ fontFamily: theme.fontHeading, color: titleColor, fontSize: headingSize }}
            value={data.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
          />
        ) : (
          <h1
            className="mb-4 font-bold"
            style={{ fontFamily: theme.fontHeading, color: titleColor, fontSize: headingSize }}
          >
            {data.businessName}
          </h1>
        )}

        {mode === "edit" ? (
          <input
            className="mb-8 w-full bg-transparent text-center outline-none"
            style={{ color: contentColor, fontSize: theme.fontSizeBase ?? "1.25rem" }}
            value={data.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
          />
        ) : (
          <p className="mb-8" style={{ fontSize: theme.fontSizeBase ?? "1.25rem" }}>{data.tagline}</p>
        )}

        <div className="inline-flex flex-col items-center gap-2">
          <a
            href={mode === "view" ? data.ctaLink : undefined}
            className="inline-block px-8 py-3 text-lg font-semibold transition-transform hover:scale-105"
            style={{
              backgroundColor: theme.secondaryColor,
              color: theme.primaryColor,
              borderRadius: theme.borderRadius,
            }}
            onClick={(e) => mode === "edit" && e.preventDefault()}
          >
            {mode === "edit" ? (
              <input
                className="bg-transparent text-center outline-none"
                style={{ color: theme.primaryColor }}
                value={data.ctaText}
                onChange={(e) => handleChange("ctaText", e.target.value)}
              />
            ) : (
              data.ctaText
            )}
          </a>
          {mode === "edit" && (
            <div className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white/80">
              <Link2 size={10} />
              <input
                className="bg-transparent outline-none"
                placeholder="Button link (e.g. #contact)"
                value={data.ctaLink}
                onChange={(e) => handleChange("ctaLink", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
