/**
 * Notifications service.
 *
 * Frontend ⇄ this file ⇄ lib/data/notifications.ts (mock backend).
 */
import {
  notifications,
  type AppNotification,
} from "@/lib/data/notifications";

/** App notifications, newest first. */
export async function getNotifications(): Promise<AppNotification[]> {
  return notifications;
}
