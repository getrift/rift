import { chromium } from "playwright-core";
import fs from "node:fs";

const OUT = new URL("./shots-v3/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function shoot(label, { width, height = 900, full = false, selector = null, scroll = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  // trigger in-view animations
  await page.evaluate(async () => {
    await new Promise((r) => {
      let y = 0;
      const t = setInterval(() => {
        window.scrollTo(0, y);
        y += 600;
        if (y > document.body.scrollHeight) { clearInterval(t); r(); }
      }, 40);
    });
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  if (selector) {
    const el = await page.$(selector);
    if (el) { await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await el.screenshot({ path: `${OUT}${label}.png` }); }
    else { console.log("MISSING selector", selector); }
  } else if (scroll != null) {
    await page.evaluate((y) => window.scrollTo(0, y), scroll);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}${label}.png` });
  } else {
    await page.screenshot({ path: `${OUT}${label}.png`, fullPage: full });
  }
  await ctx.close();
  console.log("shot", label);
}

// Full page desktop + mobile
await shoot("desktop-full", { width: 1440, full: true });
await shoot("mobile-full", { width: 390, full: true });
// Above-the-fold desktop
await shoot("desktop-fold", { width: 1440, height: 860 });
await shoot("mobile-fold", { width: 390, height: 780 });
// Flagged sections
await shoot("hero", { width: 1440, selector: "section:has(h1)" });
await shoot("tool-call", { width: 1440, selector: "section:has(h2:text('asks Rift mid-task'))" });
await shoot("search-proof", { width: 1440, selector: "section:has(h2:text('Find the decision'))" });
await shoot("local-precise", { width: 1440, selector: "section:has(h2:text('Private by default'))" });
await shoot("how-it-works", { width: 1440, selector: "#how" });
await shoot("cta", { width: 1440, selector: "section:has(h2:text('Stop re-explaining'))" });

await browser.close();
console.log("done");
