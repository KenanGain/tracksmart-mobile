/**
 * Auth layout — the phone-width frame WITHOUT the app shell
 * (no TopBar, no BottomNav). Used by sign-in and other pre-login screens.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-shell flex-col bg-surface-muted px-6 shadow-lg">
      {children}
    </div>
  );
}
