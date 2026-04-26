"use client";

import { FdCinematicData } from "../types";
import {
  HoursList,
  ImageField,
  ObjectList,
  StringList,
  TextArea,
  TextField,
} from "./inputs";

export function FdCinematicEditor({
  data,
  onChange,
}: {
  data: FdCinematicData;
  onChange: (patch: Partial<FdCinematicData>) => void;
}) {
  return (
    <div className="space-y-4">
      <Section title="Brand & Hero">
        <TextField label="Brand name" value={data.brand} onChange={(v) => onChange({ brand: v })} />
        <TextField
          label="Hero eyebrow"
          value={data.heroEyebrow}
          onChange={(v) => onChange({ heroEyebrow: v })}
          hint="Small uppercase line above the title"
        />
        <TextArea
          label="Hero tagline"
          value={data.heroTagline}
          onChange={(v) => onChange({ heroTagline: v })}
        />
        <ImageField
          label="Hero background"
          value={data.heroImage}
          onChange={(v) => onChange({ heroImage: v })}
        />
      </Section>

      <Section title="Marquee">
        <StringList
          label="Rotating messages"
          values={data.marquee}
          onChange={(v) => onChange({ marquee: v })}
          placeholder="Now serving..."
        />
      </Section>

      <Section title="Story">
        <TextField
          label="Eyebrow"
          value={data.storyEyebrow}
          onChange={(v) => onChange({ storyEyebrow: v })}
        />
        <TextField
          label="Heading"
          value={data.storyHeading}
          onChange={(v) => onChange({ storyHeading: v })}
        />
        <TextArea
          label="Body"
          value={data.storyBody}
          onChange={(v) => onChange({ storyBody: v })}
          rows={5}
        />
        <ImageField
          label="Story image"
          value={data.storyImage}
          onChange={(v) => onChange({ storyImage: v })}
        />
      </Section>

      <Section title="Menu">
        <TextField
          label="Menu eyebrow"
          value={data.menuEyebrow}
          onChange={(v) => onChange({ menuEyebrow: v })}
        />
        <TextField
          label="Menu heading"
          value={data.menuHeading}
          onChange={(v) => onChange({ menuHeading: v })}
        />
        <ObjectList
          label="Items"
          items={data.menuItems}
          onChange={(v) => onChange({ menuItems: v })}
          newItem={() => ({ name: "New dish", desc: "", price: "$0", img: "" })}
          renderItem={(item, update) => (
            <>
              <TextField label="Name" value={item.name} onChange={(v) => update({ name: v })} />
              <TextArea label="Description" value={item.desc} onChange={(v) => update({ desc: v })} rows={2} />
              <TextField label="Price" value={item.price} onChange={(v) => update({ price: v })} />
              <ImageField label="Image" value={item.img} onChange={(v) => update({ img: v })} />
            </>
          )}
        />
      </Section>

      <Section title="Gallery">
        <TextField
          label="Heading"
          value={data.galleryHeading}
          onChange={(v) => onChange({ galleryHeading: v })}
        />
        <ObjectList
          label="Images (5 used in mosaic)"
          items={data.galleryImages.map((src) => ({ src }))}
          onChange={(v) => onChange({ galleryImages: v.map((i) => i.src) })}
          newItem={() => ({ src: "" })}
          renderItem={(item, update) => (
            <ImageField
              label="Image"
              value={item.src}
              onChange={(v) => update({ src: v })}
            />
          )}
        />
      </Section>

      <Section title="Visit">
        <TextField
          label="Address heading"
          value={data.visitHeading}
          onChange={(v) => onChange({ visitHeading: v })}
        />
        <TextField
          label="Area / neighborhood"
          value={data.visitArea}
          onChange={(v) => onChange({ visitArea: v })}
        />
        <HoursList
          label="Hours"
          items={data.hours}
          onChange={(v) => onChange({ hours: v })}
        />
      </Section>

      <Section title="Reservations">
        <TextField
          label="Heading"
          value={data.reservationsHeading}
          onChange={(v) => onChange({ reservationsHeading: v })}
        />
        <TextField label="Phone" value={data.phone} onChange={(v) => onChange({ phone: v })} />
        <TextField label="Email" value={data.email} onChange={(v) => onChange({ email: v })} />
        <TextField
          label="Booking URL"
          value={data.bookingUrl}
          onChange={(v) => onChange({ bookingUrl: v })}
        />
        <TextField
          label="Booking button label"
          value={data.bookingLabel}
          onChange={(v) => onChange({ bookingLabel: v })}
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
