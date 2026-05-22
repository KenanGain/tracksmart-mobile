import type { Metadata, Viewport } from "next";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — Mobile`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    "Mobile view of the TrackSmart fleet operations platform for businesses, drivers and carriers.",
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "default" },
};

// Mobile-only: lock the viewport to device width and cover the notch.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
  viewportFit: "cover",
};

/**
 * Root layout — only the document shell. The mobile chrome (TopBar /
 * BottomNav) is applied per route group:
 *   app/(app)/layout.tsx  → wraps screens in AppShell
 *   app/auth/layout.tsx   → plain layout, no shell (sign-in, etc.)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
