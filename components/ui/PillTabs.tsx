"use client";

import { Icon } from "./Icon";

export type PillTab = { key: string; label: string; icon?: string };

/**
 * PillTabs — a rounded-pill / bubble tab bar. The active tab is a filled
 * brand bubble with a floating shadow. Shared by the Trips and Expense
 * Status screens.
 */
export function PillTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: PillTab[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full bg-surface-muted p-1 shadow-inner">
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-[13px] font-semibold transition-colors ${
              isActive ? "bg-brand text-white shadow-nav" : "text-ink-muted"
            }`}
          >
            {tab.icon && <Icon name={tab.icon} className="h-4 w-4" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
