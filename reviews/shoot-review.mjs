import { chromium } from "playwright-core";
import fs from "node:fs";

const OUT = new URL("./review-shots/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000/";
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function shoot(label, { width, height = 900, full = false, scroll = null, path = "/", modal = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE.replace(/\/$/, "") + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  if (modal) {
    // open invite modal via the hero CTA
    await page.getByRole("button", { name: /Join the Mac beta/i }).first().click();
    await page.waitForTimeout(500);
  }
  if (scroll != null) {
    await page.evaluate((y) => window.scrollTo(0, y), scroll);
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: `${OUT}${label}.png`, fullPage: full });
  await ctx.close();
  console.log("shot", label);
}

await shoot("desktop-fold", { width: 1440, height: 880 });
await shoot("desktop-full", { width: 1440, full: true });
await shoot("desktop-activation", { width: 1440, height: 880, scroll: 1000 });
await shoot("mobile-fold", { width: 390, height: 800 });
await shoot("mobile-full", { width: 390, full: true });
await shoot("modal-form", { width: 1440, height: 880, modal: true });

await browser.close();
console.log("done");
