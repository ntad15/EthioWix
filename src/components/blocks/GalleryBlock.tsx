"use client";

import { GallerySection, Theme } from "@/types/site-config";

interface GalleryBlockProps {
  section: GallerySection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: GallerySection["data"]) => void;
}

export function GalleryBlock({ section, theme, mode, onUpdate }: GalleryBlockProps) {
  const { data } = section;

  const handleHeadingChange = (value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, heading: value });
    }
  };

  return (
    <section
      id="gallery"
      className="px-4 py-20"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="mx-auto max-w-6xl">
        {mode === "edit" ? (
          <input
            className="mb-12 w-full bg-transparent text-center text-3xl font-bold outline-none md:text-4xl"
            style={{ fontFamily: theme.fontHeading, color: theme.textColor }}
            value={data.heading}
            onChange={(e) => handleHeadingChange(e.target.value)}
          />
        ) : (
          <h2
            className="mb-12 text-center text-3xl font-bold md:text-4xl"
            style={{ fontFamily: theme.fontHeading }}
          >
            {data.heading}
          </h2>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data.images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden"
              style={{ borderRadius: theme.borderRadius }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              {mode === "edit" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">Click to replace</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
