"use client";

import { HoursSection, Theme } from "@/types/site-config";

interface HoursBlockProps {
  section: HoursSection;
  theme: Theme;
  mode: "edit" | "view";
  onUpdate?: (data: HoursSection["data"]) => void;
}

export function HoursBlock({ section, theme, mode, onUpdate }: HoursBlockProps) {
  const { data } = section;

  const handleChange = (field: keyof HoursSection["data"], value: string) => {
    if (mode === "edit" && onUpdate) {
      onUpdate({ ...data, [field]: value });
    }
  };

  const handleScheduleChange = (index: number, field: "day" | "hours", value: string) => {
    if (mode === "edit" && onUpdate) {
      const newSchedule = [...data.schedule];
      newSchedule[index] = { ...newSchedule[index], [field]: value };
      onUpdate({ ...data, schedule: newSchedule });
    }
  };

  return (
    <section
      id="hours"
      className="px-4 py-20"
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <div className="mx-auto max-w-4xl">
        {mode === "edit" ? (
          <input
            className="mb-12 w-full bg-transparent text-center text-3xl font-bold outline-none md:text-4xl"
            style={{ fontFamily: theme.fontHeading, color: theme.textColor }}
            value={data.heading}
            onChange={(e) => handleChange("heading", e.target.value)}
          />
        ) : (
          <h2
            className="mb-12 text-center text-3xl font-bold md:text-4xl"
            style={{ fontFamily: theme.fontHeading }}
          >
            {data.heading}
          </h2>
        )}

        <div className="grid gap-12 md:grid-cols-2">
          {/* Map / Address */}
          <div>
            {data.mapEmbedUrl ? (
              <iframe
                src={data.mapEmbedUrl}
                className="mb-4 h-64 w-full border-0"
                style={{ borderRadius: theme.borderRadius }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div
                className="mb-4 flex h-64 items-center justify-center"
                style={{
                  backgroundColor: theme.primaryColor + "15",
                  borderRadius: theme.borderRadius,
                }}
              >
                <span className="text-sm opacity-60">Map preview</span>
              </div>
            )}
            {mode === "edit" ? (
              <input
                className="w-full bg-transparent text-center font-medium outline-none"
                value={data.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            ) : (
              <p className="text-center font-medium">{data.address}</p>
            )}
          </div>

          {/* Schedule Table */}
          <div>
            <table className="w-full">
              <tbody>
                {data.schedule.map((entry, index) => (
                  <tr key={index} className="border-b border-current/10">
                    <td className="py-3">
                      {mode === "edit" ? (
                        <input
                          className="bg-transparent font-medium outline-none"
                          value={entry.day}
                          onChange={(e) =>
                            handleScheduleChange(index, "day", e.target.value)
                          }
                        />
                      ) : (
                        <span className="font-medium">{entry.day}</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {mode === "edit" ? (
                        <input
                          className="bg-transparent text-right outline-none"
                          style={{ color: theme.accentColor }}
                          value={entry.hours}
                          onChange={(e) =>
                            handleScheduleChange(index, "hours", e.target.value)
                          }
                        />
                      ) : (
                        <span style={{ color: theme.accentColor }}>
                          {entry.hours}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
