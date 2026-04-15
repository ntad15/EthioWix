"use client";

import { useBuilder } from "./BuilderContext";
import { templates, TemplateId } from "@/lib/templates";
import { Save, Globe, GlobeLock, Palette } from "lucide-react";
import { useState } from "react";

export function BuilderSidebar() {
  const { state, dispatch } = useBuilder();
  const { siteConfig, isDirty } = state;
  const [saving, setSaving] = useState(false);

  const saveConfig = async (configOverride?: typeof siteConfig) => {
    const configToSave = configOverride ?? siteConfig;
    setSaving(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });
      if (res.ok) {
        dispatch({ type: "MARK_SAVED" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => saveConfig();

  const handlePublishToggle = async () => {
    const updatedConfig = {
      ...siteConfig,
      published: !siteConfig.published,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "TOGGLE_PUBLISH" });
    await saveConfig(updatedConfig);
  };

  return (
    <div className="flex h-full w-72 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900">Site Builder</h2>
        <p className="text-sm text-gray-500">Edit your site in real-time</p>
      </div>

      {/* Site Name & Slug */}
      <div className="border-b border-gray-200 p-4">
        <label className="mb-1 block text-xs font-medium text-gray-600">
          Site Name
        </label>
        <input
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          value={siteConfig.name}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_SITE_META",
              name: e.target.value,
              slug: siteConfig.slug,
            })
          }
        />
        <label className="mb-1 block text-xs font-medium text-gray-600">
          URL Slug
        </label>
        <div className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm">
          <span className="text-gray-400">yourplatform.com/</span>
          <input
            className="flex-1 outline-none"
            value={siteConfig.slug}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_SITE_META",
                name: siteConfig.name,
                slug: e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "-"),
              })
            }
          />
        </div>
      </div>

      {/* Template Switcher */}
      <div className="border-b border-gray-200 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600">
          <Palette size={14} />
          Template
        </div>
        <div className="space-y-2">
          {Object.entries(templates).map(([id, template]) => (
            <button
              key={id}
              className={`w-full rounded-lg border p-2 text-left text-sm transition-colors ${
                siteConfig.templateId === id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() =>
                dispatch({
                  type: "SWITCH_TEMPLATE",
                  templateId: id as TemplateId,
                })
              }
            >
              <span className="font-medium">{template.name}</span>
              <span className="block text-xs text-gray-500">
                {template.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-2 text-xs font-medium text-gray-600">Sections</div>
        <div className="space-y-1">
          {siteConfig.sections.map((section) => (
            <button
              key={section.id}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                state.selectedSectionId === section.id
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() =>
                dispatch({ type: "SELECT_SECTION", sectionId: section.id })
              }
            >
              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <button
          onClick={handlePublishToggle}
          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            siteConfig.published
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {siteConfig.published ? (
            <>
              <GlobeLock size={16} /> Unpublish
            </>
          ) : (
            <>
              <Globe size={16} /> Publish Site
            </>
          )}
        </button>
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : isDirty ? "Save Changes" : "Saved"}
        </button>
      </div>
    </div>
  );
}
