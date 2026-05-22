import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

/**
 * AppShell — the phone-width frame every screen renders inside.
 *
 * Layout:
 *   [ TopBar      ] fixed height, safe-area aware
 *   [ <main>      ] scrollable content area
 *   [ BottomNav   ] fixed height, safe-area aware
 *
 * Screens should NOT render their own TopBar/BottomNav — they only
 * provide the scrollable content.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <TopBar />
      {/* pt/pb leave room for the translucent bars that overlay this. */}
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
