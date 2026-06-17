"use client";

import EvalShell from "../eval-shell";
import type { Init } from "../particle-canvas";

/* 02 · Current (v2) — organic, less tracing, stirrable.
   Particles ride a two-octave curl field, so the flow has large currents plus
   fine organic turbulence. Trails are short, so it reads as drifting dust, not
   pen strokes. Drag the cursor to stir the field — your motion injects a swirl
   and a wake the currents carry away. */

type P = { x: number; y: number; z: number; life: number; max: number; tw: number };

const init: Init = (w, h, _dpr, reduce) => {
  const n = Math.min(3000, Math.max(900, Math.round((w * h) / 720)));
  const S = 0.0016, S2 = 0.0052;
  const SPEED = 42;

  const spawn = (p: P) => {
    p.x = Math.random() * w; p.y = Math.random() * h; p.z = Math.random();
    p.max = 4 + Math.random() * 7; p.life = Math.random() * p.max; p.tw = Math.random() * 6.283;
  };
  const ps: P[] = [];
  for (let i = 0; i < n; i++) { const p = { x: 0, y: 0, z: 0, life: 0, max: 0, tw: 0 }; spawn(p); ps.push(p); }

  // divergence-free base flow + a higher-frequency octave for organic detail
  const flow = (x: number, y: number, t: number, out: { vx: number; vy: number }) => {
    const X = x * S, Y = y * S;
    const dPdx = Math.cos(X + 0.15 * t) + 0.42 * Math.cos((X + Y) * 0.7 + 0.09 * t);
    const dPdy = -1.3 * Math.sin(Y * 1.3 - 0.12 * t) + 0.42 * Math.cos((X + Y) * 0.7 + 0.09 * t);
    const X2 = x * S2, Y2 = y * S2;
    const dQdx = 0.5 * Math.cos(X2 * 1.7 - 0.2 * t);
    const dQdy = -0.5 * Math.sin(Y2 * 1.9 + 0.22 * t);
    out.vx = dPdy + dQdy * 0.6;
    out.vy = -dPdx - dQdx * 0.6;
  };
  const v = { vx: 0, vy: 0 };

  // smoothed pointer + derived velocity → drag wake
  let mx = -9999, my = -9999, pvx = 0, pvy = 0;

  return (ctx, t, dt, ptr) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(8,9,10,0.14)"; // shorter trails → drifting dust, not strokes
    ctx.fillRect(0, 0, w, h);

    const step = reduce ? 0 : Math.min(dt, 0.033);
    const Rp = Math.min(w, h) * 0.22;

    if (ptr.inside) {
      if (mx < -9000) { mx = ptr.x; my = ptr.y; }
      const nx = mx + (ptr.x - mx) * Math.min(1, step * 14);
      const ny = my + (ptr.y - my) * Math.min(1, step * 14);
      pvx = (nx - mx) / Math.max(step, 0.001);
      pvy = (ny - my) / Math.max(step, 0.001);
      mx = nx; my = ny;
    } else { mx = -9999; my = -9999; pvx = pvy = 0; }

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "#f7f8f8";

    for (const p of ps) {
      flow(p.x, p.y, t, v);
      const sp = SPEED * (0.5 + p.z * 0.8);
      let vx = v.vx * sp, vy = v.vy * sp;

      let stir = 0;
      if (mx > -9000) {
        const ox = p.x - mx, oy = p.y - my;
        const d = Math.hypot(ox, oy);
        if (d < Rp && d > 0.001) {
          const g = 1 - d / Rp;
          stir = g * g;
          const tux = -oy / d, tuy = ox / d;          // tangential swirl
          vx += tux * 120 * stir + pvx * 0.4 * stir;  // swirl + drag wake
          vy += tuy * 120 * stir + pvy * 0.4 * stir;
        }
      }

      p.x += vx * step; p.y += vy * step;
      p.life += step;
      if (p.life > p.max || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) spawn(p);

      const mag = Math.hypot(v.vx, v.vy);
      const fade = Math.min(1, p.life / 0.6) * Math.min(1, (p.max - p.life) / 0.8);
      const twinkle = 0.85 + 0.15 * Math.sin(t * 1.6 + p.tw);
      ctx.globalAlpha = (0.04 + p.z * 0.1 + mag * 0.035 + stir * 0.28) * fade * twinkle;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.5 + p.z * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
};

export default function Page() {
  return (
    <EvalShell
      init={init}
      title="02 · Current"
      note="Memory as living flow — a two-octave curl field of drifting dust, trails kept short so it never looks traced. Drag the cursor to stir it: your motion injects a swirl and a wake the currents carry away."
    />
  );
}
