"use client";

import EvalShell from "../eval-shell";
import type { Init } from "../particle-canvas";

/* 01 · Retrieval (v2) — no logo, organic, cursor-driven.
   A field of captured context drifting on a slow curl field. Your cursor is a
   query: nearby fragments brighten and gather into a soft luminous swarm that
   orbits the pointer, then disperse as you move on. When idle, the field poses
   its own queries — blooms that rise and fade on their own clock. No traced
   shapes; the gather is a spring-to-orbit, so it always reads as organic. */

type P = { x: number; y: number; z: number };

const init: Init = (w, h, _dpr, reduce) => {
  const n = Math.min(2600, Math.max(700, Math.round((w * h) / 850)));
  const ps: P[] = [];
  for (let i = 0; i < n; i++) ps.push({ x: Math.random() * w, y: Math.random() * h, z: Math.random() });

  // slow, divergence-free curl drift so even the resting field wanders organically
  const S = 0.0012;
  const drift = (x: number, y: number, t: number, out: { vx: number; vy: number }) => {
    const X = x * S, Y = y * S;
    const dPdx = Math.cos(X + 0.12 * t) + 0.5 * Math.cos((X + Y) * 0.7 + 0.08 * t);
    const dPdy = -1.2 * Math.sin(Y * 1.2 - 0.1 * t) + 0.5 * Math.cos((X + Y) * 0.7 + 0.08 * t);
    out.vx = dPdy;
    out.vy = -dPdx;
  };
  const v = { vx: 0, vy: 0 };

  // query point: follows the smoothed cursor; when idle, auto-blooms wander the field
  let qx = w / 2, qy = h / 2, qi = 0; // query x/y, intensity 0..1
  let mx = w / 2, my = h / 2;         // smoothed pointer
  let autoX = w / 2, autoY = h / 2, autoT = 0, autoNext = 2;

  const R = Math.min(w, h) * 0.26;    // query reach
  const r0 = R * 0.32;                // radius the swarm settles around (an orbit, not a point)

  return (ctx, t, dt, ptr) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#08090a";
    ctx.fillRect(0, 0, w, h);

    const step = reduce ? 0 : Math.min(dt, 0.033);

    if (ptr.inside) {
      mx += (ptr.x - mx) * Math.min(1, step * 9);
      my += (ptr.y - my) * Math.min(1, step * 9);
      qx = mx; qy = my;
      qi += (1 - qi) * Math.min(1, step * 4);
    } else {
      autoT += step;
      if (autoT > autoNext) {
        autoT = 0; autoNext = 2 + Math.random() * 2.4;
        autoX = w * (0.2 + Math.random() * 0.6);
        autoY = h * (0.2 + Math.random() * 0.6);
      }
      qx = autoX; qy = autoY;
      qi = Math.max(0, Math.sin((autoT / autoNext) * Math.PI)) * 0.9; // rise-and-fade pulse
    }
    if (reduce) qi = 0.55;

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "#f7f8f8";

    for (const p of ps) {
      drift(p.x, p.y, t, v);
      const ds = 9 * (0.5 + p.z * 0.8);
      p.x += v.vx * ds * step;
      p.y += v.vy * ds * step;

      let alpha = 0.05 + p.z * 0.12;
      let size = 0.5 + p.z * 1.1;

      if (qi > 0.01) {
        const ox = p.x - qx, oy = p.y - qy;
        const d = Math.hypot(ox, oy) || 0.001;
        if (d < R) {
          const g = 1 - d / R;
          const infl = g * g * qi * (0.5 + p.z * 0.5);
          const rux = ox / d, ruy = oy / d;     // radial out
          const tux = -ruy, tuy = rux;          // tangential (swirl)
          const radial = (r0 - d) * 0.9;        // spring toward the orbit ring
          const tang = 40;                       // circulation speed
          p.x += (rux * radial + tux * tang) * infl * step;
          p.y += (ruy * radial + tuy * tang) * infl * step;
          alpha += infl * 0.95;
          size += infl * 1.7;
        }
      }

      if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

      ctx.globalAlpha = Math.min(1, alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
};

export default function Page() {
  return (
    <EvalShell
      init={init}
      title="01 · Retrieval"
      note="Captured context drifting on a slow curl. Your cursor is a query — nearby fragments brighten and gather into a luminous swarm that orbits the pointer, then disperse. Leave it be and the field poses its own."
    />
  );
}
