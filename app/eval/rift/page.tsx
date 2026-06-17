"use client";

import EvalShell from "../eval-shell";
import type { Init } from "../particle-canvas";

/* 04 · The Rift — medium-literal.
   The capture→serve loop as light. Context particles drift inward and are
   absorbed into a luminous seam (capture). On a periodic burst the seam fires
   bright fragments back outward to the edges (served to your agents). One
   recycled pool; the seam itself is a thin column of jittering motes. */

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; kind: 0 | 1 };

const CYCLE = 4.4; // seconds between serve bursts

const init: Init = (w, h, _dpr, reduce) => {
  const seam = w * 0.5;
  const n = Math.min(1700, Math.max(500, Math.round((w * h) / 1250)));

  const spawnCapture = (p: P) => {
    p.kind = 0;
    const side = Math.random() < 0.5 ? -1 : 1;
    p.x = seam + side * (w * 0.16 + Math.random() * w * 0.36);
    p.y = Math.random() * h;
    p.vx = -side * (16 + Math.random() * 28);
    p.vy = (Math.random() - 0.5) * 9;
    p.max = 7 + Math.random() * 5;
    p.life = 0;
  };
  const spawnServed = (p: P) => {
    p.kind = 1;
    p.x = seam + (Math.random() - 0.5) * 5;
    p.y = Math.random() * h;
    const dir = Math.random() < 0.5 ? -1 : 1;
    p.vx = dir * (55 + Math.random() * 85);
    p.vy = (Math.random() - 0.5) * 22;
    p.max = 2.4 + Math.random() * 2.4;
    p.life = 0;
  };

  const ps: P[] = [];
  for (let i = 0; i < n; i++) { const p = {} as P; spawnCapture(p); p.life = Math.random() * p.max; ps.push(p); }

  const nSeam = Math.min(240, Math.max(90, Math.round(h / 3.5)));
  const seamPs = Array.from({ length: nSeam }, () => ({
    y: Math.random() * h, ph: Math.random() * 6.283, sp: 0.5 + Math.random() * 1.8,
  }));

  let lastCycle = -1;
  let quota = 0;

  return (ctx, t, dt) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(8,9,10,0.11)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "#f7f8f8";

    const step = reduce ? 0 : Math.min(dt, 0.033);
    const cyc = Math.floor(t / CYCLE);
    const phase = t - cyc * CYCLE;
    if (cyc !== lastCycle) { lastCycle = cyc; quota = Math.round(n * 0.12); }
    const inBurst = phase < 0.6 && !reduce;

    const seamHot = inBurst ? 0.12 : 0;
    for (const s of seamPs) {
      const x = seam + Math.sin(t * s.sp + s.ph) * 2.6;
      ctx.globalAlpha = 0.09 + seamHot + 0.05 * (0.5 + 0.5 * Math.sin(t * 1.4 + s.ph));
      ctx.beginPath();
      ctx.arc(x, s.y, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of ps) {
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.life += step;

      if (p.kind === 0) {
        if (Math.abs(p.x - seam) < 3 || p.life > p.max) {
          if (inBurst && quota > 0) { spawnServed(p); quota--; }
          else spawnCapture(p);
          continue;
        }
        const near = 1 - Math.min(1, Math.abs(p.x - seam) / (w * 0.45));
        ctx.globalAlpha = 0.045 + near * 0.11;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.65 + near * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        if (p.life > p.max || p.x < -12 || p.x > w + 12) { spawnCapture(p); continue; }
        const fade = Math.min(1, p.life / 0.25) * Math.min(1, (p.max - p.life) / 1.0);
        ctx.globalAlpha = Math.min(0.9, 0.12 + 0.5 * fade);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.0 + fade, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };
};

export default function Page() {
  return (
    <EvalShell
      init={init}
      title="04 · The Rift"
      note="The capture–serve loop, made of light. Context drifts inward and is absorbed into the seam; on a query the seam fires bright fragments back out to your agents. Two directions, one rift."
    />
  );
}
