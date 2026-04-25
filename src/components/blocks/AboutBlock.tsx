"use client";

import { AboutSection, Theme } from "@/types/site-config";
import { ImagePicker } from "@/components/ui/ImagePicker";

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
          <div className="mb-8 flex justify-center">
            <ImagePicker
              value={data.logoImage ?? ""}
              onChange={(url) => handleChange("logoImage", url)}
              label="logo"
            />
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
