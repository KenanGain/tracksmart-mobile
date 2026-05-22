import type { Metadata } from "next";
import { getNotifications } from "@/lib/api/notifications";
import { NotificationsList } from "@/components/notifications/NotificationsList";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const notifications = await getNotifications();
  return <NotificationsList notifications={notifications} />;
}
