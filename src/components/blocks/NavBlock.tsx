"use client";

import { NavSection, Theme } from "@/types/site-config";
import { Menu, X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImagePicker } from "@/components/ui/ImagePicker";

interface NavBlockProps {
  section: NavSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: NavSection["data"]) => void;
}

export function NavBlock({ section, theme, mode, onUpdate }: NavBlockProps) {
  const { data } = section;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleBrandChange = (value: string) => {
    if (onUpdate) onUpdate({ ...data, brandName: value });
  };

  const handleLogoChange = (value: string) => {
    if (onUpdate) onUpdate({ ...data, logoImage: value });
  };

  const handleLinkChange = (linkId: string, field: "label" | "href", value: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        links: data.links.map((l) => (l.id === linkId ? { ...l, [field]: value } : l)),
      });
    }
  };

  const handleAddLink = () => {
    if (onUpdate) {
      onUpdate({
        ...data,
        links: [...data.links, { id: uuidv4(), label: "New Link", href: "#" }],
      });
    }
  };

  const handleDeleteLink = (linkId: string) => {
    if (onUpdate) {
      onUpdate({
        ...data,
        links: data.links.filter((l) => l.id !== linkId),
      });
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 px-4 py-3"
      style={{
        backgroundColor: theme.primaryColor,
        color: theme.backgroundColor,
        fontFamily: theme.fontBody,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand */}
        {mode === "edit" ? (
          <div className="flex items-center gap-2">
            {data.logoImage && (
              <img
                src={data.logoImage}
                alt="Logo"
                className="h-8 w-8 rounded object-cover"
              />
            )}
            <ImagePicker
              value={data.logoImage ?? ""}
              onChange={handleLogoChange}
              label="logo"
            />
            <input
              className="bg-transparent text-lg font-bold outline-none"
              style={{ fontFamily: theme.fontHeading, color: theme.backgroundColor }}
              value={data.brandName}
              onChange={(e) => handleBrandChange(e.target.value)}
            />
          </div>
        ) : (
          <a
            href="#hero"
            className="flex items-center gap-2 text-lg font-bold"
            style={{ fontFamily: theme.fontHeading }}
          >
            {data.logoImage && (
              <img
                src={data.logoImage}
                alt="Logo"
                className="h-8 w-8 rounded object-cover"
              />
            )}
            {data.brandName}
          </a>
        )}

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 md:flex">
          {data.links.map((link) =>
            mode === "edit" ? (
              <div key={link.id} className="flex items-center gap-1">
                <input
                  className="w-20 bg-transparent text-sm outline-none"
                  style={{ color: theme.backgroundColor }}
                  value={link.label}
                  onChange={(e) => handleLinkChange(link.id, "label", e.target.value)}
                />
                <input
                  className="w-16 bg-transparent text-xs opacity-50 outline-none"
                  style={{ color: theme.backgroundColor }}
                  value={link.href}
                  onChange={(e) => handleLinkChange(link.id, "href", e.target.value)}
                  placeholder="#section"
                />
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="rounded p-0.5 opacity-50 hover:opacity-100"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ) : (
              <a
                key={link.id}
                href={link.href}
                className="text-sm transition-opacity hover:opacity-80"
              >
                {link.label}
              </a>
            )
          )}
          {mode === "edit" && (
            <button
              onClick={handleAddLink}
              className="flex items-center gap-1 rounded bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
            >
              <Plus size={10} /> Link
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mt-3 flex flex-col gap-3 border-t border-white/20 pt-3 md:hidden">
          {data.links.map((link) => (
            <a
              key={link.id}
              href={mode === "view" ? link.href : undefined}
              className="text-sm transition-opacity hover:opacity-80"
              onClick={() => mode === "view" && setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
