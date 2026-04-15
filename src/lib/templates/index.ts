import { fineDiningTemplate } from "./fine-dining";
import { casualCafeTemplate } from "./casual-cafe";
import { hotelStayTemplate } from "./hotel-stay";

export const templates = {
  "fine-dining": {
    id: "fine-dining",
    name: "Fine Dining",
    description: "Elegant and sophisticated — perfect for upscale restaurants",
    preview: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    config: fineDiningTemplate,
  },
  "casual-cafe": {
    id: "casual-cafe",
    name: "Casual Café",
    description: "Warm and inviting — ideal for cafés and brunch spots",
    preview: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
    config: casualCafeTemplate,
  },
  "hotel-stay": {
    id: "hotel-stay",
    name: "Hotel & Stay",
    description: "Luxurious and refined — built for hotels and resorts",
    preview: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    config: hotelStayTemplate,
  },
} as const;

export type TemplateId = keyof typeof templates;
