"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * ThemeToggle — a sun / moon button that switches dark mode on or off.
 * Toggles the `dark` class on `<html>` and persists the choice in
 * `localStorage` (the no-flash script in the root layout reads it back).
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Sync with whatever the no-flash script already applied.
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // Ignore — storage may be unavailable (private mode, etc.).
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink"
    >
      <Icon name={dark ? "sun" : "moon"} className="h-5 w-5" />
    </button>
  );
}
