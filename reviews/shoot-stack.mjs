import { chromium } from "playwright-core";
import fs from "node:fs";

const OUT = new URL("./shots-v3/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const hero = "section:has(h1)";
for (const name of ["claude code", "cursor", "codex"]) {
  await page.click(`button[aria-label="Show ${name}"]`);
  await page.waitForTimeout(1100); // let crossfade + stagger settle
  const el = await page.$(hero);
  const label = name.replace(/\s+/g, "-");
  await el.screenshot({ path: `${OUT}stack-${label}.png` });
  console.log("shot", label);
}
await browser.close();
console.log("done");
