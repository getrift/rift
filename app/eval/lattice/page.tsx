"use client";

import EvalShell from "../eval-shell";
import type { Init } from "../particle-canvas";

/* 03 · Lattice — semi-abstract.
   Drifting fragments; near pairs ignite hairline links that form and break.
   Hubs (high link degree) glow brighter. Cursor gently draws particles in so
   links bloom around the pointer. Uniform-grid neighbour lookup keeps it 60fps. */

type P = { x: number; y: number; vx: number; vy: number; deg: number };

const init: Init = (w, h) => {
  const n = Math.min(820, Math.max(260, Math.round((w * h) / 2400)));
  const D = 124;
  const D2 = D * D;
  const cs = D;

  const ps: P[] = [];
  for (let i = 0; i < n; i++)
    ps.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 22,
      vy: (Math.random() - 0.5) * 22,
      deg: 0,
    });

  return (ctx, _t, dt, ptr) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#08090a";
    ctx.fillRect(0, 0, w, h);

    const step = Math.min(dt, 0.033);

    for (const p of ps) {
      if (ptr.inside) {
        const dx = ptr.x - p.x, dy = ptr.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < 220 && d > 1) {
          const f = (1 - d / 220) * 30;
          p.vx += (dx / d) * f * step;
          p.vy += (dy / d) * f * step;
        }
      }
      p.x += p.vx * step;
      p.y += p.vy * step;
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); } else if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); } else if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy); }
      // keep a calm cruise speed
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > 46) { p.vx *= 46 / sp; p.vy *= 46 / sp; }
      else if (sp < 9 && sp > 0.01) { p.vx *= 9 / sp; p.vy *= 9 / sp; }
      p.deg = 0;
    }

    const cols = Math.max(1, Math.ceil(w / cs));
    const rows = Math.max(1, Math.ceil(h / cs));
    const buckets: number[][] = Array.from({ length: cols * rows }, () => []);
    for (let i = 0; i < n; i++) {
      const cx = Math.min(cols - 1, Math.max(0, (ps[i].x / cs) | 0));
      const cy = Math.min(rows - 1, Math.max(0, (ps[i].y / cs) | 0));
      buckets[cy * cols + cx].push(i);
    }

    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "#f7f8f8";
    ctx.lineWidth = 1;
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const here = buckets[cy * cols + cx];
        if (!here.length) continue;
        for (let oy = 0; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            if (oy === 0 && ox < 0) continue; // half-neighbourhood, no dup pairs
            const nx = cx + ox, ny = cy + oy;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            const there = buckets[ny * cols + nx];
            for (const i of here) {
              for (const j of there) {
                if (j <= i) continue;
                const a = ps[i], b = ps[j];
                const ddx = a.x - b.x, ddy = a.y - b.y;
                const d2 = ddx * ddx + ddy * ddy;
                if (d2 > D2) continue;
                const f = 1 - Math.sqrt(d2) / D;
                a.deg += f; b.deg += f;
                ctx.globalAlpha = f * f * 0.22;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }
      }
    }

    ctx.fillStyle = "#f7f8f8";
    for (const p of ps) {
      ctx.globalAlpha = Math.min(0.9, 0.16 + p.deg * 0.09);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 0.8 + Math.min(1.8, p.deg * 0.32), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
};

export default function Page() {
  return (
    <EvalShell
      init={init}
      title="03 · Lattice"
      note="Fragments that find each other. As particles drift, near pairs ignite hairline links and dissolve them again — transient constellations, hubs glowing where context clusters. Move the cursor to draw them in."
    />
  );
}
