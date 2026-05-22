/**
 * Bulletin service — load tenders for the Bulletin and Calendar screens.
 *
 * Frontend ⇄ this file ⇄ lib/data/bulletin.ts (mock backend).
 */
import { loadTenders, type LoadTender } from "@/lib/data/bulletin";

/** Load tenders shown on the Bulletin feed (newest message first). */
export async function getLoadTenders(): Promise<LoadTender[]> {
  return loadTenders;
}

/** Number of unread load tenders — for the nav badge. */
export async function getUnreadTenderCount(): Promise<number> {
  return loadTenders.filter((tender) => tender.unread).length;
}

/** Load tenders as upcoming calendar events, sorted by haul date. */
export async function getUpcomingEvents(): Promise<LoadTender[]> {
  return [...loadTenders].sort((a, b) => a.date.localeCompare(b.date));
}
