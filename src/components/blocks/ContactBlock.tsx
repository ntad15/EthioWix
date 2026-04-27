"use client";

import { ContactSection, SocialLink, SocialPlatform, Theme, SOCIAL_PLATFORMS } from "@/types/site-config";
import { Phone, Mail, ExternalLink, Link2, Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { SocialIcon, PLATFORM_LABELS } from "./SocialIcon";

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

  const socials = data.socials ?? [];

  const updateSocials = (next: SocialLink[]) => {
    if (onUpdate) onUpdate({ ...data, socials: next });
  };
  const handleSocialChange = (id: string, field: "platform" | "url", value: string) => {
    updateSocials(socials.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };
  const handleAddSocial = () => {
    updateSocials([...socials, { id: uuidv4(), platform: "instagram", url: "" }]);
  };
  const handleDeleteSocial = (id: string) => {
    updateSocials(socials.filter((s) => s.id !== id));
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

        {mode === "view" && socials.length > 0 && (
          <div className="mb-10 flex items-center justify-center gap-4">
            {socials
              .filter((s) => s.url.trim())
              .map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={PLATFORM_LABELS[s.platform]}
                  className="transition-transform hover:scale-110"
                  style={{ color: theme.accentColor ?? sectionText }}
                >
                  <SocialIcon platform={s.platform} size={22} />
                </a>
              ))}
          </div>
        )}

        {mode === "edit" && (
          <div className="mb-10">
            <div className="mb-2 text-xs uppercase tracking-wide opacity-60">Social links</div>
            <div className="flex flex-col gap-2">
              {socials.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2 rounded-md border border-current/20 bg-black/5 px-2 py-1"
                >
                  <SocialIcon platform={s.platform} size={16} />
                  <select
                    className="rounded bg-transparent px-1 text-sm outline-none"
                    style={{ color: sectionText }}
                    value={s.platform}
                    onChange={(e) =>
                      handleSocialChange(s.id, "platform", e.target.value as SocialPlatform)
                    }
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {PLATFORM_LABELS[p]}
                      </option>
                    ))}
                  </select>
                  <input
                    className="flex-1 bg-transparent text-sm outline-none"
                    placeholder="https://..."
                    value={s.url}
                    onChange={(e) => handleSocialChange(s.id, "url", e.target.value)}
                  />
                  <button
                    type="button"
                    className="opacity-60 hover:opacity-100"
                    onClick={() => handleDeleteSocial(s.id)}
                    aria-label="Remove social"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSocial}
                className="inline-flex items-center justify-center gap-1 rounded-md border border-dashed border-current/30 px-3 py-1.5 text-xs opacity-70 hover:opacity-100"
              >
                <Plus size={14} /> Add social
              </button>
            </div>
          </div>
        )}

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
