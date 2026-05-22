/**
 * Trip Sheets layout — a full-screen phone-width frame with NO app shell
 * (no TopBar / BottomNav). The trip-sheet screens render their own header.
 */
export default function TripSheetsLayout({
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
