"use client";

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
  arrayMove,
} from "@dnd-kit/sortable";
import { useBuilder } from "./BuilderContext";
import { SortableSection } from "./SortableSection";
import { Section } from "@/types/site-config";

export function BuilderCanvas() {
  const { state, dispatch } = useBuilder();
  const { siteConfig, selectedSectionId } = state;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = siteConfig.sections.findIndex((s) => s.id === active.id);
      const newIndex = siteConfig.sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(siteConfig.sections, oldIndex, newIndex);
      dispatch({ type: "REORDER_SECTIONS", sections: newSections });
    }
  };

  const handleSectionUpdate = (sectionId: string, data: Section["data"]) => {
    dispatch({ type: "UPDATE_SECTION_DATA", sectionId, data });
  };

  return (
    <div className="min-h-screen">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={siteConfig.sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {siteConfig.sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              theme={siteConfig.theme}
              isSelected={selectedSectionId === section.id}
              onSelect={() =>
                dispatch({ type: "SELECT_SECTION", sectionId: section.id })
              }
              onUpdate={(data) => handleSectionUpdate(section.id, data)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
