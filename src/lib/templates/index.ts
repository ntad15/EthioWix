import { fineDiningTemplate } from "./fine-dining";
import { casualCafeTemplate } from "./casual-cafe";
import { hotelStayTemplate } from "./hotel-stay";
import { habeshaSpaTemplate } from "./habesha-spa";
import { roseClaySpaTemplate } from "./rose-clay-spa";
import { enatStudioTemplate } from "./enat-studio";
import { lensAndLightTemplate } from "./lens-and-light";
import { addisStayTemplate } from "./addis-stay";
import { saffronStayTemplate } from "./saffron-stay";
import { lulitSalonTemplate } from "./lulit-salon";
import { vintageBarberTemplate } from "./vintage-barber";
import {
  fdCinematicTemplate,
  hsRitualTemplate,
  esCuratedTemplate,
} from "./showcase-templates";
export const CATEGORIES = [
  { id: "food", label: "Restaurants & Cafés", emoji: "🍽️" },
  { id: "stay", label: "Hotels & Stays", emoji: "🏨" },
  { id: "wellness", label: "Spa & Wellness", emoji: "🌿" },
  { id: "photography", label: "Photography", emoji: "📸" },
  { id: "beauty", label: "Salons & Barbers", emoji: "💈" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const templates = {
  "fine-dining": {
    id: "fine-dining",
    name: "Fine Dining",
    category: "food",
    description: "Elegant and sophisticated — perfect for upscale restaurants",
    preview: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    config: fineDiningTemplate,
  },
  "casual-cafe": {
    id: "casual-cafe",
    name: "Casual Café",
    category: "food",
    description: "Warm and inviting — ideal for cafés and brunch spots",
    preview: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
    config: casualCafeTemplate,
  },
  "hotel-stay": {
    id: "hotel-stay",
    name: "Hotel & Stay",
    category: "stay",
    description: "Luxurious and refined — built for hotels and resorts",
    preview: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
    config: hotelStayTemplate,
  },
  "habesha-spa": {
    id: "habesha-spa",
    name: "Habesha Spa",
    category: "wellness",
    description: "Earthy and grounding — a coffee-ceremony spa aesthetic",
    preview: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
    config: habeshaSpaTemplate,
  },
  "rose-clay-spa": {
    id: "rose-clay-spa",
    name: "Rose Clay Wellness",
    category: "wellness",
    description: "Soft and feminine — for boutique spas and wellness studios",
    preview: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&q=80",
    config: roseClaySpaTemplate,
  },
  "enat-studio": {
    id: "enat-studio",
    name: "Enat Studio",
    category: "photography",
    description: "Minimal and editorial — a quiet photographer portfolio",
    preview: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    config: enatStudioTemplate,
  },
  "lens-and-light": {
    id: "lens-and-light",
    name: "Lens & Light",
    category: "photography",
    description: "Warm and vintage — for film photographers and storytellers",
    preview: "https://images.unsplash.com/photo-1452827073306-6e6e661baf57?w=400&q=80",
    config: lensAndLightTemplate,
  },
  "addis-stay": {
    id: "addis-stay",
    name: "Addis Stay",
    category: "stay",
    description: "Natural and calm — a boutique guesthouse feel",
    preview: "https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=400&q=80",
    config: addisStayTemplate,
  },
  "saffron-stay": {
    id: "saffron-stay",
    name: "Saffron & Stone",
    category: "stay",
    description: "Playful and colorful — for characterful B&Bs and hosts",
    preview: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80",
    config: saffronStayTemplate,
  },
  "lulit-salon": {
    id: "lulit-salon",
    name: "Lulit Salon",
    category: "beauty",
    description: "Soft and modern — for salons and beauty studios",
    preview: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80",
    config: lulitSalonTemplate,
  },
  "vintage-barber": {
    id: "vintage-barber",
    name: "Vintage Barber",
    category: "beauty",
    description: "Classic and masculine — traditional barbershop style",
    preview: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&q=80",
    config: vintageBarberTemplate,
  },
  "fd-cinematic": {
    id: "fd-cinematic",
    name: "Cinematic Dining",
    category: "food",
    description: "Cinematic parallax hero, alternating menu rows, mosaic gallery — preview-only",
    preview: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    config: fdCinematicTemplate,
  },
  "hs-ritual": {
    id: "hs-ritual",
    name: "Ritual Spa",
    category: "wellness",
    description: "Warm earthy tones, numbered ritual steps, hover-lift treatments — preview-only",
    preview: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
    config: hsRitualTemplate,
  },
  "es-curated": {
    id: "es-curated",
    name: "Curated Portfolio",
    category: "photography",
    description: "Curated mosaic grid with hover captions, restrained packages — preview-only",
    preview: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    config: esCuratedTemplate,
  },
} as const satisfies Record<string, {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  preview: string;
  config: unknown;
}>;

export type TemplateId = keyof typeof templates;
