"use client";

import { HeroSection, Theme } from "@/types/site-config";
import { Link2 } from "lucide-react";
import { ImagePicker } from "@/components/ui/ImagePicker";

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
        <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-2 rounded-md bg-black/60 p-2 text-xs text-white">
          <ImagePicker
            value={data.backgroundImage}
            onChange={(url) => handleChange("backgroundImage", url)}
            label="background"
          />
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
          <div className="mb-4 flex justify-center">
            <ImagePicker
              value={data.logoImage ?? ""}
              onChange={(url) => handleChange("logoImage", url)}
              label="logo"
            />
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
