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

/** Screens to capture. */
const screens = [
  { name: "01-sign-in", path: "/auth/sign-in" },
  { name: "02-dashboard", path: "/dashboard" },
  { name: "03-trips", path: "/trips" },
  { name: "04-loads", path: "/loads" },
  { name: "05-account", path: "/account" },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 440, height: 956 }, // iPhone 16 Pro Max (logical px)
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();

for (const screen of screens) {
  await page.goto(`${BASE}${screen.path}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/${screen.name}.png` });
  console.log(`  ✓ ${screen.path}  →  ${OUT}/${screen.name}.png`);
}

// Extra: sign-in with a demo user picked (form autofilled).
await page.goto(`${BASE}/auth/sign-in`, { waitUntil: "networkidle" });
await page.selectOption("#demo-user", { index: 1 });
await page.screenshot({ path: `${OUT}/06-sign-in-demo-selected.png` });
console.log(`  ✓ /auth/sign-in (demo selected)  →  ${OUT}/06-sign-in-demo-selected.png`);

// Extra: editing a field manually must reset the demo-user dropdown.
await page.goto(`${BASE}/auth/sign-in`, { waitUntil: "networkidle" });
await page.selectOption("#demo-user", { index: 1 });
await page.fill("#email", "root@");
const pickerValue = await page.$eval("#demo-user", (el) => el.value);
await page.screenshot({ path: `${OUT}/07-manual-edit-resets-picker.png` });
console.log(
  `  ✓ /auth/sign-in (manual edit) → picker reset: ${
    pickerValue === "" ? "OK" : `FAIL (value="${pickerValue}")`
  }`,
);

// Desktop preview — shows the centered phone frame on the backdrop.
const desktop = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const desktopPage = await desktop.newPage();
for (const screen of [
  { name: "08-desktop-sign-in", path: "/auth/sign-in" },
  { name: "09-desktop-dashboard", path: "/dashboard" },
]) {
  await desktopPage.goto(`${BASE}${screen.path}`, { waitUntil: "networkidle" });
  await desktopPage.screenshot({ path: `${OUT}/${screen.name}.png` });
  console.log(`  ✓ desktop ${screen.path}  →  ${OUT}/${screen.name}.png`);
}

await browser.close();
console.log("\nDone.");
