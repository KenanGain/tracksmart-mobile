/**
 * Chat layout — a full-screen phone-width frame with NO app shell. The
 * chat thread renders its own header and message input.
 */
export default function ChatLayout({
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
