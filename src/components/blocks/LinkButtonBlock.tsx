"use client";

import { LinkButtonSection, Theme } from "@/types/site-config";
import { Link2 } from "lucide-react";

interface LinkButtonBlockProps {
  section: LinkButtonSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: LinkButtonSection["data"]) => void;
}

const WIDTH_CLASS: Record<LinkButtonSection["data"]["width"], string> = {
  auto: "w-auto px-8",
  sm: "w-40",
  md: "w-60",
  lg: "w-[22rem]",
  full: "w-full",
};

const HEIGHT_CLASS: Record<LinkButtonSection["data"]["height"], string> = {
  sm: "h-10 text-sm",
  md: "h-[52px] text-base",
  lg: "h-16 text-lg",
};

const ALIGN_CLASS: Record<LinkButtonSection["data"]["alignment"], string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export function LinkButtonBlock({ section, theme, mode, onUpdate }: LinkButtonBlockProps) {
  const { data } = section;

  const update = <K extends keyof LinkButtonSection["data"]>(
    field: K,
    value: LinkButtonSection["data"][K],
  ) => {
    if (mode === "edit" && onUpdate) onUpdate({ ...data, [field]: value });
  };

  const buttonClasses =
    `inline-flex items-center justify-center font-semibold transition-transform hover:scale-105 ${WIDTH_CLASS[data.width]} ${HEIGHT_CLASS[data.height]}`;
  const buttonStyle = {
    backgroundColor: theme.secondaryColor,
    color: theme.primaryColor,
    borderRadius: theme.borderRadius,
  };

  return (
    <section
      className="px-4 py-12"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className={`mx-auto flex max-w-4xl ${ALIGN_CLASS[data.alignment]}`}>
        {mode === "edit" ? (
          <button type="button" className={buttonClasses} style={buttonStyle}>
            <input
              className="w-full bg-transparent text-center outline-none"
              style={{ color: theme.primaryColor }}
              value={data.label}
              onChange={(e) => update("label", e.target.value)}
            />
          </button>
        ) : (
          <a
            href={data.url || "#"}
            target={data.openInNewTab ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className={buttonClasses}
            style={buttonStyle}
          >
            {data.label}
          </a>
        )}
      </div>

      {mode === "edit" && (
        <div className="mx-auto mt-4 max-w-4xl space-y-2 rounded-lg border border-current/20 bg-black/5 p-3 text-sm">
          <div className="flex items-center gap-2">
            <Link2 size={14} className="opacity-60" />
            <input
              className="flex-1 bg-transparent outline-none"
              placeholder="https://..."
              value={data.url}
              onChange={(e) => update("url", e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1">
              <span className="opacity-60">Width</span>
              <select
                className="rounded bg-transparent px-1 outline-none"
                value={data.width}
                onChange={(e) => update("width", e.target.value as LinkButtonSection["data"]["width"])}
              >
                <option value="auto">Auto</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="full">Full</option>
              </select>
            </label>
            <label className="flex items-center gap-1">
              <span className="opacity-60">Height</span>
              <select
                className="rounded bg-transparent px-1 outline-none"
                value={data.height}
                onChange={(e) => update("height", e.target.value as LinkButtonSection["data"]["height"])}
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </label>
            <label className="flex items-center gap-1">
              <span className="opacity-60">Align</span>
              <select
                className="rounded bg-transparent px-1 outline-none"
                value={data.alignment}
                onChange={(e) =>
                  update("alignment", e.target.value as LinkButtonSection["data"]["alignment"])
                }
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={data.openInNewTab}
                onChange={(e) => update("openInNewTab", e.target.checked)}
              />
              <span className="opacity-70">Open in new tab</span>
            </label>
          </div>
        </div>
      )}
    </section>
  );
}
