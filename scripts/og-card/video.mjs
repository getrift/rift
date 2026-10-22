// Renders onadit.com's og:video from card.html?play in a throwaway headless Chrome (needs Google Chrome, node, ffmpeg and
// the network, for Inter). Every CSS animation on the page is paused and set to each frame's time, so the clip is the same
// on every run. Frames are taken at twice the pixels and scaled down to 1200 x 630 by ffmpeg. CRF sets the quality.
//   node scripts/og-card/video.mjs public/og.mp4
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import path from "node:path";

const LOOP = 8.4, FPS = 30, START = 4;                       // the loop of card.html?play, and where the clip starts in it:
                                                             // on the finished card, the frame an app may show before it plays
const here = path.dirname(new URL(import.meta.url).pathname), out = path.resolve(process.argv[2]);
const port = 9300 + Math.floor(Math.random() * 600), profile = mkdtempSync(path.join(here, "chrome-"));
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", ["--headless=new", "--no-first-run",
  "--no-default-browser-check", `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ws;
for (let i = 0; i < 50 && !ws; i++) {
  await sleep(200);
  try {
    const page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
    if (page) ws = new WebSocket(page.webSocketDebuggerUrl);
  } catch {}
}
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const waiting = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (waiting.has(m.id)) { waiting.get(m.id)(m.result); waiting.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const n = ++id; waiting.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const run = (expression) => send("Runtime.evaluate", { expression, awaitPromise: true });

await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 2, mobile: false });
await send("Page.enable");
await send("Page.navigate", { url: `file://${here}/card.html?play` });
await sleep(500);
await run("document.fonts.ready.then(() => new Promise(r => setTimeout(r, 300)))");
await run("window.clip = document.getAnimations(); clip.forEach(a => a.pause()); clip.length");

const ffmpeg = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
  "-vf", "scale=1200:630:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", process.env.CRF ?? "22",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
const frames = Math.round(LOOP * FPS);
for (let f = 0; f < frames; f++) {
  // the frame's time on every animation, then 2 animation frames so the page has painted it
  await run(`clip.forEach(a => a.currentTime = ${(((f / FPS + START) % LOOP) * 1000).toFixed(3)}); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  if (!ffmpeg.stdin.write(Buffer.from(data, "base64"))) await new Promise((r) => ffmpeg.stdin.once("drain", r));
}
ffmpeg.stdin.end();
const code = await new Promise((r) => ffmpeg.on("close", r));
console.log(`frames ${frames}, ffmpeg ${code}`);
ws.close(); chrome.kill(); await sleep(300); rmSync(profile, { recursive: true, force: true });
process.exit(code ?? 0);
