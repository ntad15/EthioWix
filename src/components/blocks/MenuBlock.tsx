"use client";

import { MenuSection, Theme } from "@/types/site-config";
import { ImagePicker } from "@/components/ui/ImagePicker";

interface MenuBlockProps {
  section: MenuSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: MenuSection["data"]) => void;
}

export function MenuBlock({ section, theme, mode, onUpdate }: MenuBlockProps) {
  const { data } = section;

  const handleHeadingChange = (value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, heading: value });
    }
  };

  const handleItemChange = (
    itemId: string,
    field: "name" | "description" | "price" | "image",
    value: string
  ) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({
        ...data,
        items: data.items.map((item) =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      });
    }
  };

  // Menu uses an inverted color scheme by default, but respects overrides
  const sectionBg = theme.backgroundColor;
  const sectionText = theme.textColor;
  const headingColor = theme.headingColor ?? sectionText;
  const headingSize = theme.fontSizeHeading ?? "2.5rem";

  return (
    <section
      id="menu"
      className="px-4 py-20"
      style={{
        backgroundColor: sectionBg,
        color: sectionText,
      }}
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

        <div className="grid gap-8 md:grid-cols-3">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
                borderRadius: theme.borderRadius,
              }}
            >
              <div className="group relative aspect-[4/3] overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-400">
                    No image
                  </div>
                )}
                {mode === "edit" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <ImagePicker
                      value={item.image}
                      onChange={(url) => handleItemChange(item.id, "image", url)}
                      label="image"
                      variant="overlay"
                    />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-2">
                  {mode === "edit" ? (
                    <input
                      className="flex-1 bg-transparent text-lg font-semibold outline-none"
                      style={{ fontFamily: theme.fontHeading }}
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(item.id, "name", e.target.value)
                      }
                    />
                  ) : (
                    <h3
                      className="text-lg font-semibold"
                      style={{ fontFamily: theme.fontHeading }}
                    >
                      {item.name}
                    </h3>
                  )}
                  {mode === "edit" ? (
                    <input
                      className="w-24 bg-transparent text-right font-bold outline-none"
                      style={{ color: theme.accentColor }}
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(item.id, "price", e.target.value)
                      }
                    />
                  ) : (
                    <span
                      className="font-bold"
                      style={{ color: theme.accentColor }}
                    >
                      {item.price}
                    </span>
                  )}
                </div>
                {mode === "edit" ? (
                  <input
                    className="w-full bg-transparent text-sm opacity-75 outline-none"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(item.id, "description", e.target.value)
                    }
                  />
                ) : (
                  <p className="text-sm opacity-75">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
