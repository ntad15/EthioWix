"use client";

import { MenuSection, Theme } from "@/types/site-config";

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
    field: "name" | "description" | "price",
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

  return (
    <section
      id="menu"
      className="px-4 py-20"
      style={{
        backgroundColor: theme.primaryColor,
        color: theme.backgroundColor,
      }}
    >
      <div className="mx-auto max-w-6xl">
        {mode === "edit" ? (
          <input
            className="mb-12 w-full bg-transparent text-center text-3xl font-bold outline-none md:text-4xl"
            style={{ fontFamily: theme.fontHeading, color: theme.backgroundColor }}
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
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
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
