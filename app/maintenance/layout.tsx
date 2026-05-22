/**
 * Maintenance layout — a full-screen phone-width frame with NO app shell
 * (no TopBar / BottomNav). The work-order screen renders its own header.
 */
export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex h-dvh w-full max-w-shell flex-col bg-surface-muted shadow-lg">
      {children}
    </div>
  );
}
