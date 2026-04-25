"use client";

import { GallerySection, Theme } from "@/types/site-config";
import { Plus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ImagePicker } from "@/components/ui/ImagePicker";

interface GalleryBlockProps {
  section: GallerySection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: GallerySection["data"]) => void;
}

export function GalleryBlock({ section, theme, mode, onUpdate }: GalleryBlockProps) {
  const { data } = section;
  const headingColor = theme.headingColor ?? theme.textColor;
  const headingSize = theme.fontSizeHeading ?? "2.5rem";

  const handleHeadingChange = (value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, heading: value });
    }
  };

  const handleAddImage = () => {
    if (onUpdate) {
      onUpdate({
        ...data,
        images: [
          ...data.images,
          { id: uuidv4(), src: "", alt: "New image" },
        ],
      });
    }
  };

  const handleDeleteImage = (imageId: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        images: data.images.filter((img) => img.id !== imageId),
      });
    }
  };

  const handleImageChange = (imageId: string, field: "src" | "alt", value: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        images: data.images.map((img) =>
          img.id === imageId ? { ...img, [field]: value } : img
        ),
      });
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
            className="mb-12 w-full bg-transparent text-center font-bold outline-none"
            style={{ fontFamily: theme.fontHeading, color: headingColor, fontSize: headingSize }}
            value={data.heading}
            onChange={(e) => handleHeadingChange(e.target.value)}
          />
        ) : (
          <h2
            className="mb-12 text-center font-bold"
            style={{ fontFamily: theme.fontHeading, color: headingColor, fontSize: headingSize }}
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
              {image.src ? (
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">
                  No image
                </div>
              )}
              {mode === "edit" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <ImagePicker
                    value={image.src}
                    onChange={(url) => handleImageChange(image.id, "src", url)}
                    label="image"
                    variant="overlay"
                  />
                  <input
                    className="w-4/5 rounded bg-white/90 px-2 py-1 text-xs text-gray-800 outline-none"
                    placeholder="Alt text"
                    value={image.alt}
                    onChange={(e) => handleImageChange(image.id, "alt", e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteImage(image.id); }}
                    className="mt-1 flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                  >
                    <X size={10} /> Delete tile
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add Image Button (edit mode only) */}
          {mode === "edit" && (
            <button
              onClick={handleAddImage}
              className="flex aspect-square items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500"
              style={{ borderRadius: theme.borderRadius }}
            >
              <div className="flex flex-col items-center gap-1">
                <Plus size={24} />
                <span className="text-xs">Add Image</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
