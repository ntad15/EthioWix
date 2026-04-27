"use client";

import { useBuilder } from "./BuilderContext";
import { templates, TemplateId } from "@/lib/templates";
import { Save, Globe, GlobeLock, Palette, Plus, Trash2, Sparkles, Type, Upload, GripVertical } from "lucide-react";
import { useState, useRef } from "react";
import { validateSlug } from "@/lib/utils/validation";
import { Toast } from "@/components/ui/Toast";
import { SectionType, Animation } from "@/types/site-config";
import { createClient } from "@/lib/supabase/client";
import { isShowcaseTemplate } from "@/components/showcases";
import { ShowcaseEditor } from "@/components/showcases/editor";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// === Sidebar draggable section item ===
import { Section } from "@/types/site-config";

function SidebarSortableItem({ section, isSelected, isEditing, onSelect, onRename, onDelete, setEditingLabel }: {
  section: Section;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onRename: (label: string) => void;
  onDelete: () => void;
  setEditingLabel: (id: string | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const displayLabel = section.label || section.type.charAt(0).toUpperCase() + section.type.slice(1);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors ${
        isSelected ? "bg-brand-tint text-brand" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <button className="cursor-grab touch-none text-gray-400 active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical size={14} />
      </button>
      {isEditing ? (
        <input
          autoFocus
          className="flex-1 rounded border border-brand/40 bg-white px-2 py-0.5 text-sm outline-none"
          defaultValue={displayLabel}
          onBlur={(e) => { const val = e.target.value.trim(); if (val && val !== displayLabel) onRename(val); setEditingLabel(null); }}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") setEditingLabel(null); }}
        />
      ) : (
        <button
          className="flex-1 text-left truncate"
          onClick={onSelect}
          onDoubleClick={() => setEditingLabel(section.id)}
        >
          {displayLabel}
          <span className="ml-1 text-[10px] text-gray-400">{section.type}</span>
        </button>
      )}
      <button
        onClick={onDelete}
        className="rounded p-1 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

function SidebarSortableSections({ sections, selectedId, editingLabel, onSelect, onRename, onDelete, onReorder, setEditingLabel }: {
  sections: Section[];
  selectedId: string | null;
  editingLabel: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onReorder: (sections: Section[]) => void;
  setEditingLabel: (id: string | null) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      onReorder(arrayMove(sections, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {sections.map((section) => (
            <SidebarSortableItem
              key={section.id}
              section={section}
              isSelected={selectedId === section.id}
              isEditing={editingLabel === section.id}
              onSelect={() => onSelect(section.id)}
              onRename={(label) => onRename(section.id, label)}
              onDelete={() => onDelete(section.id)}
              setEditingLabel={setEditingLabel}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

const SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: "nav", label: "Navigation Menu" },
  { type: "hero", label: "Hero Banner" },
  { type: "about", label: "About" },
  { type: "gallery", label: "Gallery" },
  { type: "menu", label: "Menu / Services" },
  { type: "hours", label: "Hours & Location" },
  { type: "contact", label: "Contact / CTA" },
  { type: "linkButton", label: "Link Button" },
];

const ANIMATIONS: { value: Animation; label: string; description: string }[] = [
  { value: "none", label: "None", description: "No animation" },
  { value: "scroll-reveal", label: "Scroll Reveal", description: "Sections fade & slide up as you scroll" },
  { value: "fade-in", label: "Fade In", description: "Sections gently fade in on load" },
];

export function BuilderSidebar() {
  const { state, dispatch } = useBuilder();
  const { siteConfig, isDirty } = state;
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [activeTab, setActiveTab] = useState<"sections" | "style" | "settings">("sections");
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [styleTarget, setStyleTarget] = useState<"overall" | string>("overall");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const saveConfig = async (configOverride?: typeof siteConfig) => {
    const configToSave = configOverride ?? siteConfig;
    const slugErr = validateSlug(configToSave.slug);
    if (slugErr) {
      setSlugError(slugErr);
      setToast({ message: slugErr, type: "error" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });
      if (res.ok) {
        dispatch({ type: "MARK_SAVED" });
        setToast({ message: "Site saved successfully", type: "success" });
      } else {
        const data = await res.json().catch(() => ({}));
        setToast({ message: data.error || "Failed to save", type: "error" });
      }
    } catch {
      setToast({ message: "Network error — could not save", type: "error" });
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${siteConfig.id}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("site-images")
        .upload(fileName, file, { upsert: true });

      if (error) {
        setToast({ message: "Upload failed: " + error.message, type: "error" });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("site-images")
        .getPublicUrl(fileName);

      // Copy URL to clipboard for easy pasting into sections
      await navigator.clipboard.writeText(publicUrl);
      setToast({ message: "Image uploaded! URL copied to clipboard.", type: "success" });
    } catch {
      setToast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="font-serif text-lg font-semibold tracking-[-0.01em] text-gray-900">Site Builder</h2>
        <div className="mt-2 flex gap-1">
          {(["sections", "style", "settings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-brand-tint text-brand"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "sections" && isShowcaseTemplate(siteConfig.templateId) && (
          <div className="p-4">
            <div className="mb-3 rounded-md bg-brand-tint/40 p-2 text-[11px] text-brand">
              This template has a fixed layout. Edit the content below — changes apply directly to the published site.
            </div>
            <ShowcaseEditor
              templateId={siteConfig.templateId}
              raw={siteConfig.showcaseData}
              onChange={(patch) =>
                dispatch({ type: "UPDATE_SHOWCASE_DATA", data: patch })
              }
            />
          </div>
        )}
        {activeTab === "sections" && !isShowcaseTemplate(siteConfig.templateId) && (
          <div className="p-4">
            {/* Section List */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-600">Sections</span>
              <button
                onClick={() => setShowAddSection(!showAddSection)}
                className="flex items-center gap-1 rounded-md bg-brand-tint px-2 py-1 text-xs font-medium text-brand hover:bg-brand-tint/70"
              >
                <Plus size={12} /> Add
              </button>
            </div>

            {/* Add Section Dropdown */}
            {showAddSection && (
              <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-2">
                <p className="mb-2 text-xs text-gray-500">Choose a section type:</p>
                <div className="space-y-1">
                  {SECTION_TYPES.map(({ type, label }) => (
                    <button
                      key={type}
                      onClick={() => {
                        dispatch({ type: "ADD_SECTION", sectionType: type });
                        setShowAddSection(false);
                      }}
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-white hover:shadow-sm"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Sections — Draggable */}
            <SidebarSortableSections
              sections={siteConfig.sections}
              selectedId={state.selectedSectionId}
              editingLabel={editingLabel}
              onSelect={(id) => dispatch({ type: "SELECT_SECTION", sectionId: id })}
              onRename={(id, label) => dispatch({ type: "RENAME_SECTION", sectionId: id, label })}
              onDelete={(id) => dispatch({ type: "DELETE_SECTION", sectionId: id })}
              onReorder={(sections) => dispatch({ type: "REORDER_SECTIONS", sections })}
              setEditingLabel={setEditingLabel}
            />
            <p className="mt-2 text-[10px] text-gray-400">Drag to reorder. Double-click to rename.</p>

            {/* Image Upload */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600">
                <Upload size={12} /> Upload Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-500 hover:border-brand hover:text-brand disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Click to upload — URL copied to clipboard"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-4 p-4">
            {/* Style Target Picker */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Apply style to</label>
              <select
                value={styleTarget}
                onChange={(e) => {
                  const target = e.target.value;
                  setStyleTarget(target);
                  if (target !== "overall") {
                    // Scroll to the section on the canvas
                    dispatch({ type: "SELECT_SECTION", sectionId: target });
                    setTimeout(() => {
                      const el = document.querySelector(`[data-section-id="${target}"]`);
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                    }, 50);
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="overall">Overall Site</option>
                {siteConfig.sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label || s.type.charAt(0).toUpperCase() + s.type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {styleTarget === "overall" ? (
              <>
                {/* Template Switcher */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600">
                    <Palette size={12} /> Template
                  </div>
                  <select
                    value={siteConfig.templateId}
                    onChange={(e) =>
                      dispatch({ type: "SWITCH_TEMPLATE", templateId: e.target.value as TemplateId })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    {Object.entries(templates).map(([id, template]) => (
                      <option key={id} value={id}>{template.name}</option>
                    ))}
                  </select>
                </div>

                {/* Animation */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600">
                    <Sparkles size={12} /> Animation
                  </div>
                  <div className="space-y-1">
                    {ANIMATIONS.map(({ value, label, description }) => (
                      <button
                        key={value}
                        onClick={() => dispatch({ type: "UPDATE_ANIMATION", animation: value })}
                        className={`w-full rounded-lg border p-2 text-left text-sm transition-colors ${
                          siteConfig.animation === value
                            ? "border-brand bg-brand-tint"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-medium">{label}</span>
                        <span className="block text-xs text-gray-500">{description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Controls */}
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-600">
                    <Type size={12} /> Typography
                  </div>
                  <label className="mb-1 block text-xs text-gray-500">Heading Font Size</label>
                  <select
                    value={siteConfig.theme.fontSizeHeading ?? "2.5rem"}
                    onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { fontSizeHeading: e.target.value } })}
                    className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="2rem">Small (2rem)</option>
                    <option value="2.5rem">Medium (2.5rem)</option>
                    <option value="3rem">Large (3rem)</option>
                    <option value="3.5rem">Extra Large (3.5rem)</option>
                  </select>
                  <label className="mb-1 block text-xs text-gray-500">Body Font Size</label>
                  <select
                    value={siteConfig.theme.fontSizeBase ?? "16px"}
                    onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { fontSizeBase: e.target.value } })}
                    className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="14px">Small (14px)</option>
                    <option value="16px">Medium (16px)</option>
                    <option value="18px">Large (18px)</option>
                    <option value="20px">Extra Large (20px)</option>
                  </select>
                  <label className="mb-1 block text-xs text-gray-500">Heading Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={siteConfig.theme.headingColor ?? siteConfig.theme.textColor} onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { headingColor: e.target.value } })} className="h-9 w-9 cursor-pointer rounded border border-gray-300" />
                    <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" value={siteConfig.theme.headingColor ?? siteConfig.theme.textColor} onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { headingColor: e.target.value } })} />
                  </div>
                </div>

                {/* Color Controls */}
                <div>
                  <label className="mb-1 block text-xs text-gray-500">Background Color</label>
                  <div className="mb-3 flex gap-2">
                    <input type="color" value={siteConfig.theme.backgroundColor} onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { backgroundColor: e.target.value } })} className="h-9 w-9 cursor-pointer rounded border border-gray-300" />
                    <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" value={siteConfig.theme.backgroundColor} onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { backgroundColor: e.target.value } })} />
                  </div>
                  <label className="mb-1 block text-xs text-gray-500">Text Color</label>
                  <div className="mb-3 flex gap-2">
                    <input type="color" value={siteConfig.theme.textColor} onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { textColor: e.target.value } })} className="h-9 w-9 cursor-pointer rounded border border-gray-300" />
                    <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" value={siteConfig.theme.textColor} onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { textColor: e.target.value } })} />
                  </div>
                  <label className="mb-1 block text-xs text-gray-500">Accent Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={siteConfig.theme.accentColor} onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { accentColor: e.target.value } })} className="h-9 w-9 cursor-pointer rounded border border-gray-300" />
                    <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" value={siteConfig.theme.accentColor} onChange={(e) => dispatch({ type: "UPDATE_THEME", theme: { accentColor: e.target.value } })} />
                  </div>
                </div>
              </>
            ) : (
              /* Section-specific style controls */
              (() => {
                const targetSection = siteConfig.sections.find((s) => s.id === styleTarget);
                if (!targetSection) return null;
                const override = targetSection.styleOverride ?? {};
                const updateSectionStyle = (style: Record<string, string>) =>
                  dispatch({ type: "UPDATE_SECTION_STYLE", sectionId: styleTarget, style });

                return (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">
                      Override styles for <strong>{targetSection.label || targetSection.type}</strong> section only. Leave blank to inherit from overall theme.
                    </p>

                    <label className="mb-1 block text-xs text-gray-500">Background Color</label>
                    <div className="mb-3 flex gap-2">
                      <input type="color" value={override.backgroundColor ?? siteConfig.theme.backgroundColor} onChange={(e) => updateSectionStyle({ backgroundColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded border border-gray-300" />
                      <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Inherit from theme" value={override.backgroundColor ?? ""} onChange={(e) => updateSectionStyle({ backgroundColor: e.target.value })} />
                    </div>

                    <label className="mb-1 block text-xs text-gray-500">Text Color</label>
                    <div className="mb-3 flex gap-2">
                      <input type="color" value={override.textColor ?? siteConfig.theme.textColor} onChange={(e) => updateSectionStyle({ textColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded border border-gray-300" />
                      <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Inherit from theme" value={override.textColor ?? ""} onChange={(e) => updateSectionStyle({ textColor: e.target.value })} />
                    </div>

                    <label className="mb-1 block text-xs text-gray-500">Heading Color</label>
                    <div className="mb-3 flex gap-2">
                      <input type="color" value={override.headingColor ?? siteConfig.theme.headingColor ?? siteConfig.theme.textColor} onChange={(e) => updateSectionStyle({ headingColor: e.target.value })} className="h-9 w-9 cursor-pointer rounded border border-gray-300" />
                      <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Inherit from theme" value={override.headingColor ?? ""} onChange={(e) => updateSectionStyle({ headingColor: e.target.value })} />
                    </div>

                    <label className="mb-1 block text-xs text-gray-500">Heading Font Size</label>
                    <select
                      value={override.fontSizeHeading ?? ""}
                      onChange={(e) => updateSectionStyle({ fontSizeHeading: e.target.value })}
                      className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="">Inherit from theme</option>
                      <option value="2rem">Small (2rem)</option>
                      <option value="2.5rem">Medium (2.5rem)</option>
                      <option value="3rem">Large (3rem)</option>
                      <option value="3.5rem">Extra Large (3.5rem)</option>
                    </select>

                    <label className="mb-1 block text-xs text-gray-500">Body Font Size</label>
                    <select
                      value={override.fontSizeBase ?? ""}
                      onChange={(e) => updateSectionStyle({ fontSizeBase: e.target.value })}
                      className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="">Inherit from theme</option>
                      <option value="14px">Small (14px)</option>
                      <option value="16px">Medium (16px)</option>
                      <option value="18px">Large (18px)</option>
                      <option value="20px">Extra Large (20px)</option>
                    </select>

                  </div>
                );
              })()
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-4 p-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Site Name</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
                value={siteConfig.name}
                onChange={(e) =>
                  dispatch({ type: "UPDATE_SITE_META", name: e.target.value, slug: siteConfig.slug })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">URL Slug</label>
              <div className={`flex items-center rounded-lg border px-3 py-2 text-sm ${slugError ? "border-red-400" : "border-gray-300"}`}>
                <span className="text-gray-400 text-xs">yourplatform.com/</span>
                <input
                  className="flex-1 outline-none"
                  value={siteConfig.slug}
                  onChange={(e) => {
                    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
                    setSlugError(validateSlug(newSlug));
                    dispatch({ type: "UPDATE_SITE_META", name: siteConfig.name, slug: newSlug });
                  }}
                />
              </div>
              {slugError && <p className="mt-1 text-xs text-red-500">{slugError}</p>}
            </div>
          </div>
        )}
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
            <><GlobeLock size={16} /> Unpublish</>
          ) : (
            <><Globe size={16} /> Publish Site</>
          )}
        </button>
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : isDirty ? "Save Changes" : "Saved"}
        </button>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
