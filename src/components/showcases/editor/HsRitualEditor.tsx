"use client";

import { HsRitualData } from "../types";
import {
  HoursList,
  ImageField,
  ObjectList,
  StringList,
  TextArea,
  TextField,
} from "./inputs";

export function HsRitualEditor({
  data,
  onChange,
}: {
  data: HsRitualData;
  onChange: (patch: Partial<HsRitualData>) => void;
}) {
  return (
    <div className="space-y-4">
      <Section title="Brand">
        <TextField label="Brand name" value={data.brand} onChange={(v) => onChange({ brand: v })} />
        <TextField label="Location" value={data.location} onChange={(v) => onChange({ location: v })} />
      </Section>

      <Section title="Hero">
        <TextField
          label="Headline line 1"
          value={data.heroLine1}
          onChange={(v) => onChange({ heroLine1: v })}
        />
        <TextField
          label="Headline line 2 (italic accent)"
          value={data.heroLine2Italic}
          onChange={(v) => onChange({ heroLine2Italic: v })}
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
        <TextField
          label="Hero badge"
          value={data.heroBadge}
          onChange={(v) => onChange({ heroBadge: v })}
          hint="e.g. Open today · 10am – 8pm"
        />
      </Section>

      <Section title="Marquee">
        <StringList
          label="Rotating messages"
          values={data.marquee}
          onChange={(v) => onChange({ marquee: v })}
        />
      </Section>

      <Section title="The Ritual">
        <TextField
          label="Eyebrow"
          value={data.ritualEyebrow}
          onChange={(v) => onChange({ ritualEyebrow: v })}
        />
        <TextField
          label="Heading"
          value={data.ritualHeading}
          onChange={(v) => onChange({ ritualHeading: v })}
        />
        <ObjectList
          label="Steps"
          items={data.ritualSteps}
          onChange={(v) => onChange({ ritualSteps: v })}
          newItem={() => ({ n: "0X", t: "Step", d: "", img: "" })}
          renderItem={(item, update) => (
            <>
              <TextField label="Number label" value={item.n} onChange={(v) => update({ n: v })} />
              <TextField label="Title" value={item.t} onChange={(v) => update({ t: v })} />
              <TextArea label="Description" value={item.d} onChange={(v) => update({ d: v })} rows={3} />
              <ImageField label="Image" value={item.img} onChange={(v) => update({ img: v })} />
            </>
          )}
        />
      </Section>

      <Section title="Treatments">
        <TextField
          label="Heading"
          value={data.treatmentsHeading}
          onChange={(v) => onChange({ treatmentsHeading: v })}
        />
        <TextField
          label="Note"
          value={data.treatmentsNote}
          onChange={(v) => onChange({ treatmentsNote: v })}
        />
        <ObjectList
          label="Treatments"
          items={data.treatments}
          onChange={(v) => onChange({ treatments: v })}
          newItem={() => ({ n: "Treatment", d: "", p: "$0", img: "" })}
          renderItem={(item, update) => (
            <>
              <TextField label="Name" value={item.n} onChange={(v) => update({ n: v })} />
              <TextArea label="Description" value={item.d} onChange={(v) => update({ d: v })} rows={2} />
              <TextField label="Price" value={item.p} onChange={(v) => update({ p: v })} />
              <ImageField label="Image" value={item.img} onChange={(v) => update({ img: v })} />
            </>
          )}
        />
      </Section>

      <Section title="Visit">
        <TextField
          label="Address"
          value={data.visitAddress}
          onChange={(v) => onChange({ visitAddress: v })}
        />
        <HoursList
          label="Hours"
          items={data.hours}
          onChange={(v) => onChange({ hours: v })}
        />
      </Section>

      <Section title="Reservation card">
        <TextField
          label="Heading"
          value={data.reserveHeading}
          onChange={(v) => onChange({ reserveHeading: v })}
        />
        <TextField label="Phone" value={data.phone} onChange={(v) => onChange({ phone: v })} />
        <TextField label="Email" value={data.email} onChange={(v) => onChange({ email: v })} />
        <TextField
          label="Button label"
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
