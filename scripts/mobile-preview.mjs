/**
 * Mobile preview — screenshots every screen at a phone viewport.
 *
 * Usage:
 *   1. npm run dev            (in another terminal — leave it running)
 *   2. npm run preview:mobile (this script auto-detects the dev port)
 *
 * Output: screenshots/*.png  (iPhone 16 Pro Max, 440x956 @3x)
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = "screenshots";

/**
 * Locate the running Next.js dev server.
 * Honours PREVIEW_URL, otherwise scans the ports Next.js falls back to.
 */
async function findBaseUrl() {
  if (process.env.PREVIEW_URL) return process.env.PREVIEW_URL;
  for (let port = 3000; port <= 3010; port++) {
    const url = `http://localhost:${port}`;
    try {
      await fetch(url, { signal: AbortSignal.timeout(800) });
      return url; // any response means a server is listening here
    } catch {
      // nothing on this port — keep scanning
    }
  }
  return null;
}

const BASE = await findBaseUrl();
if (!BASE) {
  console.error(
    "\n  ✗ No dev server found on ports 3000-3010.\n" +
      "    Start it first:  npm run dev\n" +
      "    Then re-run:     npm run preview:mobile\n" +
      "    (Or point at a specific one: PREVIEW_URL=http://localhost:PORT)\n",
  );
  process.exit(1);
}
console.log(`  Using dev server at ${BASE}\n`);

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 440, height: 956 }, // iPhone 16 Pro Max (logical px)
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

// Helper: navigate and wait for the page to settle, then screenshot.
async function shot(name, path, { waitFor, action } = {}) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  if (waitFor) await page.waitForSelector(waitFor, { timeout: 5000 }).catch(() => {});
  if (action) await action(page);
  await page.waitForTimeout(400); // let animations settle
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`  ✓ ${path}  →  ${OUT}/${name}.png`);
}

// ── Auth ───────────────────────────────────────────────────────────────────
await shot("01-sign-in", "/auth/sign-in");

// Sign-in with demo user selected
await page.goto(`${BASE}/auth/sign-in`, { waitUntil: "networkidle" });
const demoSelect = page.locator("#demo-user");
if (await demoSelect.count()) await demoSelect.selectOption({ index: 1 });
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/02-sign-in-demo-selected.png` });
console.log(`  ✓ /auth/sign-in (demo selected)  →  ${OUT}/02-sign-in-demo-selected.png`);

// ── Main app screens (sign in first so redirects work) ─────────────────────
// Quick sign-in via demo user
await page.goto(`${BASE}/auth/sign-in`, { waitUntil: "networkidle" });
const sel = page.locator("#demo-user");
if (await sel.count()) {
  await sel.selectOption({ index: 1 });
  await page.waitForTimeout(200);
}
const signInBtn = page.locator("button[type=submit], button:has-text('Sign In')").first();
if (await signInBtn.count()) {
  await signInBtn.click();
  await page.waitForURL(`${BASE}/home`, { timeout: 5000 }).catch(() => {});
}

await shot("03-home", "/home");
await shot("04-trips", "/trips");
await shot("05-bulletin", "/bulletin");
await shot("06-schedule", "/calendar");
await shot("07-chats", "/chats");

// Trip detail (use first trip id from mock)
await shot("08-trip-detail", "/trips/TRIP-001");

// Notifications (full-screen, no shell)
await shot("09-notifications", "/notifications");

// Expenses
await shot("10-expenses", "/expenses");
await shot("11-expense-new", "/expenses/new");

// Trip sheets
await shot("12-trip-sheets", "/trip-sheets");
await shot("13-trip-sheet-new", "/trip-sheets/new");

// Compliance (detail route)
await shot("14-compliance", "/compliance");

// Account sub-screens
await shot("15-settings", "/account/settings");
await shot("16-trip-history", "/account/trip-history");
await shot("17-about", "/account/about");

// ── Desktop framing ────────────────────────────────────────────────────────
const desktop = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const desktopPage = await desktop.newPage();
for (const screen of [
  { name: "18-desktop-sign-in", path: "/auth/sign-in" },
  { name: "19-desktop-home", path: "/home" },
]) {
  await desktopPage.goto(`${BASE}${screen.path}`, { waitUntil: "networkidle" });
  await desktopPage.waitForTimeout(400);
  await desktopPage.screenshot({ path: `${OUT}/${screen.name}.png` });
  console.log(`  ✓ desktop ${screen.path}  →  ${OUT}/${screen.name}.png`);
}

await browser.close();
console.log("\nDone — screenshots written to ./" + OUT + "/");
