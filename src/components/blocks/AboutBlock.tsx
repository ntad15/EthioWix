"use client";

import { AboutSection, Theme } from "@/types/site-config";

interface AboutBlockProps {
  section: AboutSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: AboutSection["data"]) => void;
}

export function AboutBlock({ section, theme, mode, onUpdate }: AboutBlockProps) {
  const { data } = section;

  const handleChange = (field: keyof AboutSection["data"], value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, [field]: value });
    }
  };

  return (
    <section
      id="about"
      className="px-4 py-20"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
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

        {mode === "edit" ? (
          <input
            className="mb-6 w-full bg-transparent text-center text-3xl font-bold outline-none md:text-4xl"
            style={{ fontFamily: theme.fontHeading, color: theme.textColor }}
            value={data.heading}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        ) : (
          <h2
            className="mb-6 text-3xl font-bold md:text-4xl"
            style={{ fontFamily: theme.fontHeading }}
          >
            {data.heading}
          </h2>
        )}

        {mode === "edit" ? (
          <textarea
            className="w-full resize-none bg-transparent text-center text-lg leading-relaxed outline-none"
            style={{ fontFamily: theme.fontBody, color: theme.textColor }}
            value={data.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
          />
        ) : (
          <p
            className="text-lg leading-relaxed"
            style={{ fontFamily: theme.fontBody }}
          >
            {data.description}
          </p>
        )}
      </div>
    </section>
  );
}
