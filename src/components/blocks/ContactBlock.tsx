"use client";

import { ContactSection, Theme } from "@/types/site-config";
import { Phone, Mail, ExternalLink, Link2 } from "lucide-react";

interface ContactBlockProps {
  section: ContactSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: ContactSection["data"]) => void;
}

export function ContactBlock({ section, theme, mode, onUpdate }: ContactBlockProps) {
  const { data } = section;

  const handleChange = (field: keyof ContactSection["data"], value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, [field]: value });
    }
  };

  const sectionBg = theme.backgroundColor;
  const sectionText = theme.textColor;
  const headingColor = theme.headingColor ?? sectionText;

  return (
    <section
      id="contact"
      className="px-4 py-20"
      style={{ backgroundColor: sectionBg, color: sectionText }}
    >
      <div className="mx-auto max-w-2xl text-center">
        {mode === "edit" ? (
          <input
            className="mb-8 w-full bg-transparent text-center font-bold outline-none"
            style={{ fontFamily: theme.fontHeading, color: headingColor, fontSize: theme.fontSizeHeading ?? "2.5rem" }}
            value={data.heading}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        ) : (
          <h2
            className="mb-8 text-center font-bold"
            style={{ fontFamily: theme.fontHeading, color: headingColor, fontSize: theme.fontSizeHeading ?? "2.5rem" }}
          >
            {data.heading}
          </h2>
        )}

        <div className="mb-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="flex items-center gap-2">
            <Phone size={18} />
            {mode === "edit" ? (
              <input
                className="bg-transparent outline-none"
                style={{ color: sectionText }}
                value={data.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            ) : (
              <a href={`tel:${data.phone}`} className="hover:underline">
                {data.phone}
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} />
            {mode === "edit" ? (
              <input
                className="bg-transparent outline-none"
                style={{ color: sectionText }}
                value={data.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            ) : (
              <a href={`mailto:${data.email}`} className="hover:underline">
                {data.email}
              </a>
            )}
          </div>
        </div>

        <div className="inline-flex flex-col items-center gap-2">
          <a
            href={mode === "view" ? data.bookingUrl : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold transition-transform hover:scale-105"
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
                value={data.bookingLabel}
                onChange={(e) => handleChange("bookingLabel", e.target.value)}
              />
            ) : (
              <>
                {data.bookingLabel}
                <ExternalLink size={18} />
              </>
            )}
          </a>
          {mode === "edit" && (
            <div className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white/80">
              <Link2 size={10} />
              <input
                className="bg-transparent outline-none"
                placeholder="Button link URL"
                value={data.bookingUrl}
                onChange={(e) => handleChange("bookingUrl", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
