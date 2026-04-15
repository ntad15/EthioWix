"use client";

import { HeroSection, Theme } from "@/types/site-config";

interface HeroBlockProps {
  section: HeroSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: HeroSection["data"]) => void;
}

export function HeroBlock({ section, theme, mode, onUpdate }: HeroBlockProps) {
  const { data } = section;

  const handleChange = (field: keyof HeroSection["data"], value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, [field]: value });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden"
      style={{ fontFamily: theme.fontBody }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.backgroundImage})` }}
      />
      {data.overlay && (
        <div className="absolute inset-0 bg-black/50" />
      )}

      {/* Content */}
      <div className="relative z-10 px-4 text-center text-white">
        {mode === "edit" ? (
          <input
            className="mb-4 w-full border-b border-dashed border-white/50 bg-transparent text-center text-5xl font-bold outline-none md:text-7xl"
            style={{ fontFamily: theme.fontHeading }}
            value={data.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
          />
        ) : (
          <h1
            className="mb-4 text-5xl font-bold md:text-7xl"
            style={{ fontFamily: theme.fontHeading }}
          >
            {data.businessName}
          </h1>
        )}

        {mode === "edit" ? (
          <input
            className="mb-8 w-full bg-transparent text-center text-xl outline-none md:text-2xl"
            value={data.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
          />
        ) : (
          <p className="mb-8 text-xl md:text-2xl">{data.tagline}</p>
        )}

        <a
          href={mode === "view" ? data.ctaLink : undefined}
          className="inline-block rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:scale-105"
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
      </div>
    </section>
  );
}
