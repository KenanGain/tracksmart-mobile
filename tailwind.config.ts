import type { Config } from "tailwindcss";

/**
 * Trip Planner Mobile — Tailwind config.
 *
 * Design tokens live here so every agent (and the Flutter mirror) reads
 * the same source of truth. See docs/design-system.md.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: {
          DEFAULT: "#1d4ed8", // primary actions, active nav
          dark: "#1e3a8a",
          light: "#dbeafe",
        },
        // Semantic
        success: "#15803d",
        warning: "#b45309",
        danger: "#b91c1c",
        // Surfaces
        surface: "#ffffff",
        "surface-muted": "#f4f5f7",
        backdrop: "#cbd5e1", // desktop canvas behind the phone frame
        ink: "#0f172a", // primary text
        "ink-muted": "#64748b", // secondary text
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        // The mobile shell never exceeds a phone width.
        shell: "27.5rem", // 440px — iPhone 16 Pro Max logical width
      },
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        // Bottom inset for the floating pill nav: a 16px gap PLUS the
        // device safe area. One value avoids conflicting pb-* utilities.
        "nav-bottom": "calc(1rem + env(safe-area-inset-bottom))",
        topbar: "3.5rem", // 56px
        bottomnav: "4rem", // 64px
      },
      borderRadius: {
        card: "0.875rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08)",
        nav: "0 6px 24px rgba(15, 23, 42, 0.14)", // floating pill nav
      },
    },
  },
  plugins: [],
};

export default config;
