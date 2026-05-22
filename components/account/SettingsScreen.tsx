"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** Notification channels the driver can switch on/off. */
const NOTIFICATIONS: { key: string; label: string }[] = [
  { key: "trip", label: "Trip" },
  { key: "message", label: "Message" },
  { key: "bulletin", label: "Bulletin" },
  { key: "calendar", label: "Calendar" },
];

const FONT_SIZES = ["Default", "Small", "Large"];
const THEMES = ["Use system setting", "Light", "Dark"];

/** A small on/off switch. */
function Switch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? "bg-brand" : "bg-backdrop"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-all ${
          on ? "left-[1.375rem]" : "left-0.5"
        }`}
      />
    </button>
  );
}

/**
 * SettingsScreen — the Settings detail screen (`/account/settings`).
 * Notification channel toggles and appearance preferences. State is local
 * to the prototype.
 */
export function SettingsScreen() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    trip: false,
    message: true,
    bulletin: true,
    calendar: true,
  });
  const [fontSize, setFontSize] = useState(0);
  const [theme, setTheme] = useState(0);

  return (
    <section className="space-y-7">
      {/* Notifications */}
      <div>
        <h2 className="text-xs font-semibold text-ink-muted">Notifications</h2>
        <div className="mt-2 divide-y divide-ink/5 rounded-card bg-surface shadow-card">
          {NOTIFICATIONS.map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-3 px-4 py-3.5"
            >
              <p className="text-base font-semibold text-ink">{row.label}</p>
              <Switch
                on={enabled[row.key]}
                onToggle={() =>
                  setEnabled((prev) => ({
                    ...prev,
                    [row.key]: !prev[row.key],
                  }))
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div>
        <h2 className="text-xs font-semibold text-ink-muted">Appearance</h2>
        <div className="mt-2 divide-y divide-ink/5 rounded-card bg-surface shadow-card">
          <button
            type="button"
            onClick={() => setFontSize((i) => (i + 1) % FONT_SIZES.length)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
          >
            <p className="text-base font-semibold text-ink">Font Size</p>
            <span className="flex items-center gap-1 text-sm text-ink-muted">
              {FONT_SIZES[fontSize]}
              <Icon name="chevron-right" className="h-4 w-4" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTheme((i) => (i + 1) % THEMES.length)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
          >
            <p className="text-base font-semibold text-ink">Theme</p>
            <span className="flex items-center gap-1 text-sm text-ink-muted">
              {THEMES[theme]}
              <Icon name="chevron-right" className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>

      <p className="rounded-card border border-dashed border-brand/40 bg-brand-light/40 p-3 text-xs text-ink-muted">
        Preferences are stored locally in this prototype. Connecting a
        backend will persist them across devices.
      </p>
    </section>
  );
}
