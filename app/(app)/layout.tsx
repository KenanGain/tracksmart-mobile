import { AppShell } from "@/components/shell/AppShell";

/**
 * Layout for the main app — every screen here renders inside the phone
 * shell (TopBar + BottomNav). Routes that should NOT have the shell
 * (e.g. /auth/*) live outside this route group.
 */
export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
