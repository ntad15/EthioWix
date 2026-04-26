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
import {
  ShowcaseRenderer,
  SHOWCASE_FONTS_HREF,
  isShowcaseTemplate,
} from "@/components/showcases";

export function BuilderCanvas() {
  const { state, dispatch } = useBuilder();
  const { siteConfig, selectedSectionId } = state;

  if (isShowcaseTemplate(siteConfig.templateId)) {
    return (
      <div className="min-h-screen">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={SHOWCASE_FONTS_HREF} />
        <ShowcaseRenderer
          templateId={siteConfig.templateId}
          raw={siteConfig.showcaseData}
        />
      </div>
    );
  }

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
