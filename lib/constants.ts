/**
 * App-wide constants. Keep this list in sync with:
 *  - docs/screens.md  (route catalogue)
 *  - prompts/flutter.md (Flutter route mirror)
 */

export const APP_NAME = "TrackSmart";

/** Tagline shown under the logo (e.g. on the sign-in screen). */
export const APP_TAGLINE = "Fleet operations platform";

export type NavItem = {
  /** Route segment, matches the app/ folder. */
  href: string;
  /** Label shown under the bottom-nav icon. */
  label: string;
  /** Lucide-style icon name — kept as a string so the Flutter mirror can map it. */
  icon: string;
};

/** Bottom navigation tabs. Order is the display order. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/trips", label: "Trips", icon: "route" },
  { href: "/bulletin", label: "Bulletin", icon: "megaphone" },
  { href: "/calendar", label: "Schedule", icon: "calendar" },
  { href: "/chats", label: "Chats", icon: "message-circle" },
];

/**
 * Titles for detail routes that are NOT bottom-nav tabs. The TopBar shows
 * these with a back button instead of the section/app-name layout.
 *
 * The account itself is a side drawer (no `/account` page) — only its
 * sub-screens are routes.
 */
export const DETAIL_TITLES: Record<string, string> = {
  "/compliance": "My Compliance",
  "/account/settings": "Settings",
  "/account/trip-history": "Trip History",
  "/account/about": "About",
};

/** Audiences the Trip Planner serves. Drives role-aware UI later. */
export const ROLES = ["business", "driver", "carrier"] as const;
export type Role = (typeof ROLES)[number];
