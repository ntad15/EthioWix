"use client";

import { EsCuratedData } from "../types";
import {
  ImageField,
  ObjectList,
  TextArea,
  TextField,
} from "./inputs";

export function EsCuratedEditor({
  data,
  onChange,
}: {
  data: EsCuratedData;
  onChange: (patch: Partial<EsCuratedData>) => void;
}) {
  return (
    <div className="space-y-4">
      <Section title="Brand & Hero">
        <TextField label="Brand name" value={data.brand} onChange={(v) => onChange({ brand: v })} />
        <TextField
          label="Hero eyebrow"
          value={data.heroEyebrow}
          onChange={(v) => onChange({ heroEyebrow: v })}
        />
        <TextField
          label="Headline line 1"
          value={data.heroLine1}
          onChange={(v) => onChange({ heroLine1: v })}
        />
        <TextField
          label="Headline line 2"
          value={data.heroLine2}
          onChange={(v) => onChange({ heroLine2: v })}
        />
        <TextField
          label="Headline line 3"
          value={data.heroLine3}
          onChange={(v) => onChange({ heroLine3: v })}
        />
        <TextArea
          label="Body"
          value={data.heroBody}
          onChange={(v) => onChange({ heroBody: v })}
          rows={4}
        />
        <ImageField
          label="Hero image"
          value={data.heroImage}
          onChange={(v) => onChange({ heroImage: v })}
        />
      </Section>

      <Section title="Selected Work">
        <TextField
          label="Heading"
          value={data.worksHeading}
          onChange={(v) => onChange({ worksHeading: v })}
        />
        <TextField
          label="Note (top-right)"
          value={data.worksNote}
          onChange={(v) => onChange({ worksNote: v })}
        />
        <ObjectList
          label="Works (5 used in mosaic)"
          items={data.works}
          onChange={(v) => onChange({ works: v })}
          newItem={() => ({ src: "", caption: "", area: "1 / 1 / 2 / 2", h: 260 })}
          renderItem={(item, update) => (
            <>
              <ImageField label="Image" value={item.src} onChange={(v) => update({ src: v })} />
              <TextField
                label="Caption"
                value={item.caption}
                onChange={(v) => update({ caption: v })}
              />
            </>
          )}
        />
      </Section>

      <Section title="Packages">
        <TextField
          label="Heading"
          value={data.packagesHeading}
          onChange={(v) => onChange({ packagesHeading: v })}
        />
        <TextArea
          label="Note"
          value={data.packagesNote}
          onChange={(v) => onChange({ packagesNote: v })}
          rows={2}
        />
        <ObjectList
          label="Packages"
          items={data.packages}
          onChange={(v) => onChange({ packages: v })}
          newItem={() => ({ n: "Package", d: "", p: "$0" })}
          renderItem={(item, update) => (
            <>
              <TextField label="Name" value={item.n} onChange={(v) => update({ n: v })} />
              <TextArea label="Description" value={item.d} onChange={(v) => update({ d: v })} rows={2} />
              <TextField label="Price" value={item.p} onChange={(v) => update({ p: v })} />
            </>
          )}
        />
      </Section>

      <Section title="Studio">
        <TextField
          label="Address"
          value={data.studioAddress}
          onChange={(v) => onChange({ studioAddress: v })}
        />
        <ObjectList
          label="Meta rows"
          items={data.studioMeta}
          onChange={(v) => onChange({ studioMeta: v })}
          newItem={() => ({ k: "Label", v: "Value" })}
          renderItem={(item, update) => (
            <>
              <TextField label="Label" value={item.k} onChange={(v) => update({ k: v })} />
              <TextField label="Value" value={item.v} onChange={(v) => update({ v: v })} />
            </>
          )}
        />
      </Section>

      <Section title="Inquire">
        <TextArea
          label="Body"
          value={data.inquireBody}
          onChange={(v) => onChange({ inquireBody: v })}
          rows={3}
        />
        <TextField label="Phone" value={data.phone} onChange={(v) => onChange({ phone: v })} />
        <TextField label="Email" value={data.email} onChange={(v) => onChange({ email: v })} />
        <TextField
          label="Button label"
          value={data.inquireLabel}
          onChange={(v) => onChange({ inquireLabel: v })}
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
