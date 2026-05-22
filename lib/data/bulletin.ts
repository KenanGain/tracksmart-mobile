/**
 * Mock backend — bulletin items (load tenders from dispatch).
 *
 * Backend side of the mockup; the frontend reaches these through
 * `lib/api/bulletin.ts`.
 */
export type LoadTender = {
  id: string;
  /** Who sent it (dispatcher). */
  sender: string;
  /** Display time the message arrived, e.g. "06:53 PM". */
  time: string;
  unread: boolean;
  origin: string;
  destination: string;
  /** Haul date — ISO (YYYY-MM-DD). */
  date: string;
  pickupTime: string;
  deliveryTime: string;
};

/** Newest message first. */
export const loadTenders: LoadTender[] = [
  {
    id: "lt-0653",
    sender: "Terry",
    time: "06:53 PM",
    unread: true,
    origin: "Toronto",
    destination: "Guelph",
    date: "2026-11-02",
    pickupTime: "7:00 AM",
    deliveryTime: "5:00 PM",
  },
  {
    id: "lt-0652",
    sender: "Terry",
    time: "06:52 PM",
    unread: true,
    origin: "Kitchener",
    destination: "Mildmay",
    date: "2026-10-31",
    pickupTime: "9:00 AM",
    deliveryTime: "2:00 PM",
  },
  {
    id: "lt-0531",
    sender: "Terry",
    time: "05:31 PM",
    unread: true,
    origin: "London",
    destination: "Sarnia",
    date: "2026-10-30",
    pickupTime: "6:00 AM",
    deliveryTime: "1:00 PM",
  },
];
