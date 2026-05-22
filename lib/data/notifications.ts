/**
 * Mock backend — app notifications.
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/notifications.ts`.
 */
export type NotificationKind = "trip-changed" | "itinerary-changed";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  /** Display time. */
  time: string;
  unread: boolean;
};

/** Newest first. */
export const notifications: AppNotification[] = [
  {
    id: "n-1",
    kind: "trip-changed",
    title: "Trip Changed!",
    message: "Trip #T000508 has been changed a new destination.",
    time: "10:24 AM",
    unread: true,
  },
  {
    id: "n-2",
    kind: "itinerary-changed",
    title: "Itinerary Changed!",
    message: "Trip #T000508 itinerary has been changed.",
    time: "9:50 AM",
    unread: true,
  },
  {
    id: "n-3",
    kind: "trip-changed",
    title: "Trip Changed!",
    message: "Trip #T000508 has been changed a new destination.",
    time: "9:12 AM",
    unread: true,
  },
  {
    id: "n-4",
    kind: "itinerary-changed",
    title: "Itinerary Changed!",
    message: "Trip #T000508 itinerary has been changed.",
    time: "8:40 AM",
    unread: false,
  },
  {
    id: "n-5",
    kind: "trip-changed",
    title: "Trip Changed!",
    message: "Trip #T000508 has been changed a new destination.",
    time: "8:05 AM",
    unread: false,
  },
];
