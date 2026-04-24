"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Section, Theme } from "@/types/site-config";
import { SectionRenderer } from "../blocks/SectionRenderer";

interface SortableSectionProps {
  section: Section;
  theme: Theme;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (data: Section["data"]) => void;
}

export function SortableSection({
  section,
  theme,
  isSelected,
  onSelect,
  onUpdate,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionLabel =
    section.type.charAt(0).toUpperCase() + section.type.slice(1);

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-section-id={section.id}
      className={`group relative ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onSelect}
    >
      {/* Drag Handle + Label — full bar is grabbable */}
      <div
        className="absolute left-3 top-3 z-20 flex cursor-grab items-center gap-2 rounded-lg bg-black/80 px-3 py-2 text-sm text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
        <span className="font-medium">{sectionLabel}</span>
      </div>

      <SectionRenderer
        section={section}
        theme={theme}
        mode="edit"
        onUpdate={onUpdate}
      />
    </div>
  );
}
