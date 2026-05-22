/**
 * Notifications layout — a full-screen phone-width frame with NO app
 * shell. The Notifications screen renders its own header.
 */
export default function NotificationsLayout({
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
