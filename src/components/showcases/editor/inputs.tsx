"use client";

import { ImagePicker } from "@/components/ui/ImagePicker";
import { Plus, Trash2 } from "lucide-react";
import { ReactNode } from "react";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10px] text-gray-400">{hint}</span>}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-brand"
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-brand"
      />
    </Field>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Image URL"
          className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-brand"
        />
        <ImagePicker value={value} onChange={onChange} variant="button" />
      </div>
      {value && (
        <div
          className="mt-2 h-20 w-full rounded-md border border-gray-200 bg-gray-50 bg-cover bg-center"
          style={{ backgroundImage: `url(${value})` }}
        />
      )}
    </Field>
  );
}

export function StringList({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <div className="space-y-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              type="text"
              value={v}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={placeholder}
              className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-brand"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="flex items-center gap-1 text-xs text-brand hover:underline"
        >
          <Plus size={12} /> Add
        </button>
      </div>
    </Field>
  );
}

export function ObjectList<T>({
  label,
  items,
  onChange,
  newItem,
  renderItem,
}: {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
}) {
  return (
    <Field label={label}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-md border border-gray-200 bg-gray-50 p-2"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                #{i + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {renderItem(item, (patch) => {
                const next = [...items];
                next[i] = { ...item, ...patch };
                onChange(next);
              })}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, newItem()])}
          className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-gray-300 py-1.5 text-xs text-brand hover:bg-brand-tint"
        >
          <Plus size={12} /> Add item
        </button>
      </div>
    </Field>
  );
}

export function HoursList({
  label,
  items,
  onChange,
}: {
  label: string;
  items: { day: string; hours: string }[];
  onChange: (next: { day: string; hours: string }[]) => void;
}) {
  return (
    <ObjectList
      label={label}
      items={items}
      onChange={onChange}
      newItem={() => ({ day: "Day", hours: "Hours" })}
      renderItem={(item, update) => (
        <>
          <input
            type="text"
            value={item.day}
            onChange={(e) => update({ day: e.target.value })}
            placeholder="Day"
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-brand"
          />
          <input
            type="text"
            value={item.hours}
            onChange={(e) => update({ hours: e.target.value })}
            placeholder="Hours"
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-brand"
          />
        </>
      )}
    />
  );
}
