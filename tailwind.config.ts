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
      // Tokens are CSS variables (RGB channels) defined in globals.css —
      // `:root` for light, `.dark` for dark mode. The `<alpha-value>`
      // placeholder lets opacity utilities (bg-brand/10, …) keep working.
      colors: {
        // Brand
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          dark: "rgb(var(--brand-dark) / <alpha-value>)",
          light: "rgb(var(--brand-light) / <alpha-value>)",
        },
        // Semantic
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        // Surfaces
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-muted) / <alpha-value>)",
        backdrop: "rgb(var(--backdrop) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--ink-muted) / <alpha-value>)",
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
