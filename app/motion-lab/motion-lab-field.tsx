"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, type MutableRefObject } from "react";

export type Variant = 1 | 2 | 3;

// one shared run length + gap for every mechanism, so the parent clock/replay/loop
// stays mechanism-agnostic. Each variant maps its own phases inside [0,RUN].
const RUN = 5.5,
  GAP = 1.2;
export const TIMELINE = { END: RUN, GAP };

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const frac = (x: number) => x - Math.floor(x);
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t: number) => {
  t = clamp01(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

const tints = ["#8aa0ff", "#7fd1c0", "#e2a26a", "#c58ae0"]; // muted source colors

// critically-ish damped spring step — slight underdamp so things settle with a little life.
const SK = 130,
  SD = 19;
function spring(o: any, px: string, vx: string, target: number, dt: number) {
  const a = -SK * (o[px] - target) - SD * o[vx];
  o[vx] += a * dt;
  o[px] += o[vx] * dt;
}

function pickK(rnd: () => number, n: number, k: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = (rnd() * (i + 1)) | 0;
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a.slice(0, Math.min(k, n));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type Props = {
  variant: Variant;
  layout?: "lab" | "hero";
  fieldSeed: number;
  clockRef: MutableRefObject<number>;
  qStartRef: MutableRefObject<number>;
  runSeedRef: MutableRefObject<number>;
};

export default function MotionLabField({ variant, layout = "lab", fieldSeed, clockRef, qStartRef, runSeedRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0,
      raf = 0,
      lastRunSeed = -1,
      lastClock = clockRef.current;
    // ponytail: one untyped state bag for a throwaway lab — typing 3 mechanisms isn't worth it
    const S: any = { built: false };

    function build() {
      const hero = layout === "hero";
      const bx0 = hero ? w * 0.36 : w * 0.07;
      const bx1 = w * 0.95;
      const by0 = h * 0.12,
        by1 = h * 0.88;
      const bw = bx1 - bx0,
        bh = by1 - by0;
      S.box = { bx0, bx1, by0, by1, bw, bh };
      const rnd = mulberry32(fieldSeed ^ (variant * 0x9e37));

      if (variant === 1) {
        const NC = 17; // fewer, bigger, more deliberate
        const cards: any[] = [];
        for (let i = 0; i < NC; i++) {
          const z = rnd(); // depth 0=far .. 1=near
          cards.push({
            phase: rnd(),
            tint: (rnd() * tints.length) | 0,
            z,
            spd: 0.04 * (0.6 + 0.85 * z),
            bob: rnd() * Math.PI * 2,
            rx: 0,
            ry: 0,
            vx: 0,
            vy: 0,
            mode: "flow",
            slot: -1,
            landT: -1,
            captureTime: Infinity,
            packDX: 0,
          });
        }
        const order = cards.map((_, i) => i).sort((a, b) => cards[a].z - cards[b].z); // draw far→near
        S.tri = { NC, cards, order, laneY: by0 + bh * 0.58, packX: bx1 - bw * 0.14, packY0: by0 + bh * 0.16, slotH: Math.min(28, bh * 0.1), selCount: 0, readyAt: Infinity };
      } else if (variant === 2) {
        const NR = 11;
        const rows: { tint: number }[] = [];
        for (let i = 0; i < NR; i++) rows.push({ tint: (rnd() * tints.length) | 0 });
        S.sort = {
          NR,
          rows,
          tx0: bx0 + bw * 0.1,
          tx1: bx1 - bw * 0.2,
          ry0: by0 + bh * 0.06,
          ry1: by1 - bh * 0.06,
          origSlot: rows.map((_, i) => i),
          target: rows.map((_, i) => i),
          prevScore: rows.map(() => 0.12),
          score: rows.map(() => 0.12),
        };
      } else {
        const NN = 40;
        const nodes: { x: number; y: number; bob: number }[] = [];
        const minD = Math.min(bw, bh) * 0.13;
        let tries = 0;
        while (nodes.length < NN && tries < NN * 40) {
          tries++;
          const x = bx0 + rnd() * bw,
            y = by0 + rnd() * bh;
          let ok = true;
          for (const n of nodes) {
            const dx = n.x - x,
              dy = n.y - y;
            if (dx * dx + dy * dy < minD * minD) {
              ok = false;
              break;
            }
          }
          if (ok) nodes.push({ x, y, bob: rnd() * Math.PI * 2 });
        }
        const N = nodes.length;
        const edges: any[] = [];
        const seen = new Set<number>();
        for (let i = 0; i < N; i++) {
          const d: [number, number][] = [];
          for (let j = 0; j < N; j++)
            if (j !== i) {
              const dx = nodes[i].x - nodes[j].x,
                dy = nodes[i].y - nodes[j].y;
              d.push([dx * dx + dy * dy, j]);
            }
          d.sort((p, q) => p[0] - q[0]);
          for (let k = 0; k < 3 && k < d.length; k++) {
            const j = d[k][1],
              a = Math.min(i, j),
              b = Math.max(i, j),
              key = a * 1000 + b;
            if (!seen.has(key)) {
              seen.add(key);
              const A = nodes[a],
                B = nodes[b];
              const mx = (A.x + B.x) / 2,
                my = (A.y + B.y) / 2,
                dx = B.x - A.x,
                dy = B.y - A.y,
                len = Math.hypot(dx, dy) || 1;
              const off = (rnd() * 2 - 1) * len * 0.14; // gentle organic curve
              edges.push({ a, b, len, ctrl: { x: mx + (-dy / len) * off, y: my + (dx / len) * off } });
            }
          }
        }
        const adj: [number, number][][] = nodes.map(() => []);
        edges.forEach((e, ei) => {
          adj[e.a].push([e.b, ei]);
          adj[e.b].push([e.a, ei]);
        });
        S.trail = {
          nodes,
          edges,
          adj,
          N,
          weight: new Float32Array(edges.length).fill(0.04), // target strength
          wdisp: new Float32Array(edges.length).fill(0.04), // displayed (eased toward target)
          flash: new Float32Array(edges.length), // transient deposit glow as a pulse crosses
          reachedAt: new Float32Array(N).fill(-1),
        };
      }
      S.built = true;
    }

    function startRun(seed: number) {
      if (!S.built) build();
      const rnd = mulberry32(seed);
      if (variant === 1) {
        const t = S.tri;
        const { bx0, bw } = S.box;
        const clock = clockRef.current;
        for (const c of t.cards) {
          c.mode = "flow";
          c.slot = -1;
          c.landT = -1;
          c.vx = 0;
          c.vy = 0;
          c.captureTime = Infinity;
        }
        const idx = pickK(rnd, t.NC, 5);
        // schedule captures spread across the scan window, in left→right order, so the
        // pack fills one card at a time — no synchronized clump, no end-of-run fallback.
        const withX = idx.map((ci) => ({ ci, x: bx0 + frac(t.cards[ci].phase + clock * t.cards[ci].spd) * bw }));
        withX.sort((a, b) => a.x - b.x);
        const K = withX.length;
        const T_SCAN = 0.7 * RUN;
        withX.forEach((o, k) => {
          const c = t.cards[o.ci];
          c.slot = k;
          c.packDX = (k - (K - 1) / 2) * 2.2; // subtle fanned stack
          c.captureTime = (0.1 + 0.8 * (K > 1 ? k / (K - 1) : 0)) * T_SCAN;
        });
        t.selSet = new Set(idx);
        t.selCount = K;
        t.readyAt = 0.9 * T_SCAN + 0.45; // last capture + settle → pack "ready"
      } else if (variant === 2) {
        const s = S.sort;
        s.origSlot = s.target.slice(); // sort from wherever the last run settled (continuity, no snap)
        s.prevScore = s.score.slice();
        const sc = s.rows.map(() => 0.12 + rnd() * 0.25);
        pickK(rnd, s.NR, 4).forEach((i, r) => (sc[i] = 0.72 + rnd() * 0.24 - r * 0.04));
        s.score = sc;
        const order = sc
          .map((v: number, i: number) => [v, i])
          .sort((a: number[], b: number[]) => b[0] - a[0])
          .map((p: number[]) => p[1]);
        const target = new Array(s.NR);
        order.forEach((i: number, rank: number) => (target[i] = rank));
        s.target = target;
      } else {
        const tr = S.trail;
        for (let i = 0; i < tr.weight.length; i++) tr.weight[i] *= 0.86; // compounding: decay, traversed edges re-bumped below
        tr.reachedAt.fill(-1);
        const seedNode = (rnd() * tr.N) | 0;
        const targets = pickK(rnd, tr.N, 5).filter((t) => t !== seedNode);
        const paths: any[] = [];
        for (const tg of targets) {
          const prev = new Int32Array(tr.N).fill(-2);
          const prevEdge = new Int32Array(tr.N).fill(-1);
          prev[seedNode] = -1;
          const q = [seedNode];
          let qi = 0;
          while (qi < q.length) {
            const u = q[qi++];
            if (u === tg) break;
            for (const [v, ei] of tr.adj[u])
              if (prev[v] === -2) {
                prev[v] = u;
                prevEdge[v] = ei;
                q.push(v);
              }
          }
          if (prev[tg] === -2) continue;
          const ns: number[] = [],
            es: number[] = [];
          let cur = tg;
          while (cur !== -1) {
            ns.push(cur);
            const pe = prevEdge[cur];
            if (pe >= 0) es.push(pe);
            cur = prev[cur];
          }
          ns.reverse();
          es.reverse();
          // arc-length tables (chord approximation — curve offset is small)
          const seglen: number[] = [],
            cum: number[] = [0];
          let total = 0;
          for (let k = 0; k < ns.length - 1; k++) {
            const A = tr.nodes[ns[k]],
              B = tr.nodes[ns[k + 1]];
            const L = Math.hypot(B.x - A.x, B.y - A.y);
            seglen.push(L);
            total += L;
            cum.push(total);
          }
          paths.push({ ns, es, seglen, cum, total, start: rnd() * 0.14, trail: [] });
        }
        for (const pth of paths) for (const ei of pth.es) tr.weight[ei] = Math.min(1, tr.weight[ei] + 0.34);
        tr.seedNode = seedNode;
        tr.paths = paths;
      }
    }

    // ---- 01 Triage stream ----
    function flowHome(c: any, clock: number) {
      const { bx0, bw, bh } = S.box;
      const fx = bx0 + frac(c.phase + clock * c.spd) * bw;
      const fy = S.tri.laneY + (c.z - 0.5) * bh * 0.2 + Math.sin(clock * 1.25 + c.bob) * bh * 0.014 * (0.4 + c.z);
      return [fx, fy];
    }
    function drawTriage(p: number, active: boolean, e: number, dt: number) {
      const t = S.tri,
        { bx0, bx1, bw, bh } = S.box;
      const clock = clockRef.current;
      const T_SCAN = 0.7 * RUN;
      const scanFrac = active ? e / T_SCAN : -1;
      const scanX = bx0 + clamp01(scanFrac) * bw;
      const scanVisible = active && scanFrac >= 0 && scanFrac < 1;
      const post = e > RUN ? e - RUN : 0;
      const backFade = post > 0 ? clamp01(1 - post / GAP) : 1; // pack object fades out as cards disperse

      // pack as an object: soft backing card + shadow + a quiet "ready" glow when assembled
      const px0 = t.packX - bw * 0.085,
        py0 = t.packY0 - t.slotH * 0.7,
        pw = bw * 0.17,
        ph = t.slotH * ((t.selCount || 5) + 0.6);
      let ready = 0;
      if ((active || post > 0) && e >= t.readyAt) ready = Math.exp(-(e - t.readyAt) / 0.6);
      ctx!.globalAlpha = 0.55 * backFade;
      ctx!.fillStyle = "rgba(10,12,16,0.65)";
      roundRect(ctx!, px0, py0, pw, ph, 11);
      ctx!.fill();
      if (ready > 0.01) {
        ctx!.globalCompositeOperation = "lighter";
        ctx!.globalAlpha = ready * 0.22 * backFade;
        ctx!.fillStyle = "#8aa0ff";
        roundRect(ctx!, px0 - 4, py0 - 4, pw + 8, ph + 8, 13);
        ctx!.fill();
        ctx!.globalCompositeOperation = "source-over";
      }
      ctx!.globalAlpha = (0.5 + ready * 0.4) * backFade;
      ctx!.strokeStyle = "rgba(255,255,255,0.12)";
      ctx!.lineWidth = 1;
      roundRect(ctx!, px0, py0, pw, ph, 11);
      ctx!.stroke();
      ctx!.globalAlpha = 1;

      // scan sweep (the "reading" pass — captures are scheduled to track it)
      if (scanVisible) {
        const g = ctx!.createLinearGradient(scanX - 30, 0, scanX + 16, 0);
        g.addColorStop(0, "rgba(138,160,255,0)");
        g.addColorStop(1, "rgba(170,190,255,0.16)");
        ctx!.fillStyle = g;
        ctx!.fillRect(scanX - 30, t.laneY - bh * 0.27, 46, bh * 0.54);
        ctx!.globalAlpha = 0.5;
        ctx!.strokeStyle = "rgba(190,205,255,0.4)";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(scanX, t.laneY - bh * 0.27);
        ctx!.lineTo(scanX, t.laneY + bh * 0.27);
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }

      for (const ci of t.order) {
        const c = t.cards[ci];
        const [fx, fy] = flowHome(c, clock);
        const selected = active && t.selSet && t.selSet.has(ci);
        if (c.mode === "flow") {
          if (selected && e >= c.captureTime) {
            c.mode = "capturing";
            c.landT = e;
          }
          c.rx = fx;
          c.ry = fy;
          c.vx = 0;
          c.vy = 0;
        }
        if (c.mode === "capturing" || c.mode === "returning") {
          let tx: number, ty: number;
          if (c.mode === "capturing" && active) {
            tx = t.packX + c.packDX;
            ty = t.packY0 + c.slot * t.slotH;
          } else {
            if (c.mode === "capturing") c.mode = "returning";
            tx = fx;
            ty = fy;
          }
          spring(c, "rx", "vx", tx, dt);
          spring(c, "ry", "vy", ty, dt);
          if (c.mode === "returning") {
            const dx = c.rx - fx,
              dy = c.ry - fy;
            if (dx * dx + dy * dy < (bw * 0.02) * (bw * 0.02)) c.mode = "flow";
          }
        }

        const captured = c.mode === "capturing" || c.mode === "returning";
        let a = 0.3 + 0.5 * c.z;
        if (active && c.mode === "flow" && !selected && scanX >= c.rx) a *= 0.5; // dimmed once the scan rejects it
        if (captured) a = Math.max(a, 0.88);
        const edge = clamp01(Math.min((c.rx - bx0) / (bw * 0.07), (bx1 - c.rx) / (bw * 0.07)));
        a *= 0.2 + 0.8 * edge;
        const sz = 0.78 + 0.55 * c.z;
        const glow = c.mode === "capturing" ? 0.7 : 0;
        drawCard(c.rx, c.ry, c.tint, sz, a, glow);

        // landing flash under the slot
        if (captured && c.landT >= 0) {
          const fl = Math.exp(-(e - c.landT) / 0.3);
          if (fl > 0.02) {
            ctx!.globalCompositeOperation = "lighter";
            ctx!.globalAlpha = fl * 0.5 * backFade;
            ctx!.fillStyle = tints[c.tint];
            ctx!.fillRect(t.packX + c.packDX - 11 * sz, t.packY0 + c.slot * t.slotH + 7 * sz, 22 * sz, 1.5);
            ctx!.globalCompositeOperation = "source-over";
            ctx!.globalAlpha = 1;
          }
        }
      }
    }
    function drawCard(x: number, y: number, tint: number, sz: number, a: number, glow: number) {
      const wd = 19 * sz,
        ht = 12 * sz;
      if (glow > 0) {
        ctx!.globalCompositeOperation = "lighter";
        ctx!.globalAlpha = a * glow * 0.55;
        ctx!.fillStyle = tints[tint];
        roundRect(ctx!, x - wd / 2 - 2, y - ht / 2 - 2, wd + 4, ht + 4, 4);
        ctx!.fill();
        ctx!.globalCompositeOperation = "source-over";
      }
      ctx!.globalAlpha = a;
      ctx!.fillStyle = "rgba(18,20,24,0.92)";
      roundRect(ctx!, x - wd / 2, y - ht / 2, wd, ht, 3);
      ctx!.fill();
      ctx!.globalAlpha = a * 0.9;
      ctx!.strokeStyle = tints[tint];
      ctx!.lineWidth = 1;
      ctx!.stroke();
      ctx!.globalAlpha = a;
      ctx!.fillStyle = tints[tint];
      ctx!.fillRect(x - wd / 2 + 2, y - ht / 2 + 2, 2.5, ht - 4);
      ctx!.globalAlpha = 1;
    }

    // ---- 02 Relevance sort (legible baseline, unchanged) ----
    function drawSort(p: number, active: boolean) {
      const s = S.sort,
        { bx0, bx1 } = S.box;
      const slotY = (slot: number) => s.ry0 + (s.ry1 - s.ry0) * (slot / (s.NR - 1));
      const trackW = s.tx1 - s.tx0;
      const moveP = easeInOut((p - 0.28) / 0.42);
      const scoreP = easeOut((p - 0.08) / 0.4);
      for (let i = 0; i < s.NR; i++) {
        const y = slotY(s.origSlot[i] + (s.target[i] - s.origSlot[i]) * (active ? moveP : 1));
        const sc = active ? s.prevScore[i] + (s.score[i] - s.prevScore[i]) * scoreP : s.score[i];
        const kept = s.target[i] < 4;
        const fl = trackW * sc;
        ctx!.globalAlpha = 1;
        ctx!.strokeStyle = "rgba(255,255,255,0.06)";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(s.tx0, y);
        ctx!.lineTo(s.tx1, y);
        ctx!.stroke();
        ctx!.globalCompositeOperation = "lighter";
        ctx!.globalAlpha = (kept ? 0.95 : 0.4) * 0.85;
        ctx!.strokeStyle = kept ? "rgba(180,200,255,0.9)" : "rgba(200,205,215,0.5)";
        ctx!.lineWidth = kept ? 2.4 : 1.6;
        ctx!.beginPath();
        ctx!.moveTo(s.tx0, y);
        ctx!.lineTo(s.tx0 + fl, y);
        ctx!.stroke();
        ctx!.globalCompositeOperation = "source-over";
        ctx!.globalAlpha = kept ? 0.95 : 0.4;
        ctx!.fillStyle = tints[s.rows[i].tint];
        ctx!.beginPath();
        ctx!.arc(s.tx0 - 10, y, kept ? 3.4 : 2.4, 0, 7);
        ctx!.fill();
        ctx!.fillStyle = kept ? "#dfe8ff" : "#aab0bd";
        ctx!.beginPath();
        ctx!.arc(s.tx0 + fl, y, kept ? 3 : 2, 0, 7);
        ctx!.fill();
      }
      const cy = (slotY(3) + slotY(4)) / 2;
      ctx!.globalAlpha = (active ? clamp01((p - 0.5) / 0.2) : 1) * 0.5;
      ctx!.strokeStyle = "rgba(255,255,255,0.22)";
      ctx!.setLineDash([4, 4]);
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(bx0, cy);
      ctx!.lineTo(bx1, cy);
      ctx!.stroke();
      ctx!.setLineDash([]);
      ctx!.globalAlpha = 1;
    }

    // ---- 03 Compounding recall ----
    function bezierPt(P0: any, C: any, P1: any, t: number) {
      const u = 1 - t;
      return [u * u * P0.x + 2 * u * t * C.x + t * t * P1.x, u * u * P0.y + 2 * u * t * C.y + t * t * P1.y];
    }
    function drawTrails(p: number, active: boolean, dt: number) {
      const tr = S.trail;
      const clock = clockRef.current;
      for (let i = 0; i < tr.wdisp.length; i++) {
        tr.wdisp[i] += (tr.weight[i] - tr.wdisp[i]) * Math.min(1, dt * 4); // ease strength toward target
        tr.flash[i] *= 0.9; // transient deposit glow decays
      }
      // curved edges
      for (let i = 0; i < tr.edges.length; i++) {
        const ed = tr.edges[i],
          A = tr.nodes[ed.a],
          B = tr.nodes[ed.b],
          w = tr.wdisp[i],
          fl = tr.flash[i];
        ctx!.strokeStyle = "#9fb4ff";
        ctx!.globalAlpha = 0.04 + Math.min(0.5, w) + fl * 0.45;
        ctx!.lineWidth = 0.5 + w * 1.7 + fl;
        ctx!.beginPath();
        ctx!.moveTo(A.x, A.y);
        ctx!.quadraticCurveTo(ed.ctrl.x, ed.ctrl.y, B.x, B.y);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;

      if (active && tr.paths) {
        ctx!.globalCompositeOperation = "lighter";
        for (const pth of tr.paths) {
          if (pth.total <= 0) continue;
          const ge = easeInOut(clamp01((p - pth.start) / 0.62));
          const distW = ge * pth.total;
          let seg = 0;
          while (seg < pth.seglen.length - 1 && pth.cum[seg + 1] <= distW) seg++;
          const segT = pth.seglen[seg] > 0 ? (distW - pth.cum[seg]) / pth.seglen[seg] : 0;
          const ed = tr.edges[pth.es[seg]];
          const [px, py] = bezierPt(tr.nodes[pth.ns[seg]], ed.ctrl, tr.nodes[pth.ns[seg + 1]], clamp01(segT));
          // mark reached nodes + flash the live edge
          for (let k = 0; k <= seg && k < pth.ns.length; k++) if (tr.reachedAt[pth.ns[k]] < 0) tr.reachedAt[pth.ns[k]] = p;
          if (ge >= 1) tr.reachedAt[pth.ns[pth.ns.length - 1]] = tr.reachedAt[pth.ns[pth.ns.length - 1]] < 0 ? p : tr.reachedAt[pth.ns[pth.ns.length - 1]];
          tr.flash[pth.es[seg]] = Math.max(tr.flash[pth.es[seg]], 0.9);
          // comet trail
          pth.trail.push([px, py]);
          if (pth.trail.length > 16) pth.trail.shift();
          for (let k = 1; k < pth.trail.length; k++) {
            ctx!.globalAlpha = (k / pth.trail.length) * 0.5;
            ctx!.strokeStyle = "#cfe0ff";
            ctx!.lineWidth = (k / pth.trail.length) * 2.4;
            ctx!.beginPath();
            ctx!.moveTo(pth.trail[k - 1][0], pth.trail[k - 1][1]);
            ctx!.lineTo(pth.trail[k][0], pth.trail[k][1]);
            ctx!.stroke();
          }
          // head + halo
          ctx!.fillStyle = "#eaf0ff";
          ctx!.globalAlpha = 0.95;
          ctx!.beginPath();
          ctx!.arc(px, py, 3, 0, 7);
          ctx!.fill();
          ctx!.globalAlpha = 0.28;
          ctx!.beginPath();
          ctx!.arc(px, py, 7.5, 0, 7);
          ctx!.fill();
        }
        ctx!.globalCompositeOperation = "source-over";
      }
      ctx!.globalAlpha = 1;

      // nodes + activation bloom
      for (let i = 0; i < tr.N; i++) {
        const n = tr.nodes[i],
          ra = tr.reachedAt[i];
        const shimmer = 0.04 * Math.sin(clock * 1.6 + n.bob);
        let g = 0;
        if (ra >= 0) {
          const tau = p - ra;
          g = clamp01(tau / 0.06) * Math.exp(-Math.max(0, tau - 0.06) / 1.0);
          if (tau >= 0 && tau < 0.5) {
            const rr = 3 + (tau / 0.5) * Math.min(S.box.bw, S.box.bh) * 0.06;
            ctx!.globalCompositeOperation = "lighter";
            ctx!.globalAlpha = (1 - tau / 0.5) * 0.45;
            ctx!.strokeStyle = "#cfe0ff";
            ctx!.lineWidth = 1.2;
            ctx!.beginPath();
            ctx!.arc(n.x, n.y, rr, 0, 7);
            ctx!.stroke();
            ctx!.globalCompositeOperation = "source-over";
          }
        }
        ctx!.globalAlpha = 0.2 + shimmer + g * 0.75;
        ctx!.fillStyle = g > 0.05 ? "#eaf0ff" : "#aab2c2";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 1.8 + g * 1.2, 0, 7);
        ctx!.fill();
      }
      // seed node breathing
      if (tr.seedNode != null) {
        const n = tr.nodes[tr.seedNode];
        ctx!.globalAlpha = 0.7;
        ctx!.strokeStyle = "#dfe8ff";
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, 4 + Math.sin(clock * 3) * 1.5, 0, 7);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      const cw = canvas!.clientWidth,
        ch = canvas!.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      if (cw !== w || ch !== h) {
        w = cw;
        h = ch;
        canvas!.width = Math.round(w * dpr);
        canvas!.height = Math.round(h * dpr);
        build();
        lastRunSeed = -1; // geometry changed → re-run startRun for the active runSeed below, instead of waiting for the next cycle
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);

      const clock = clockRef.current;
      const dt = Math.max(0, Math.min(0.05, clock - lastClock));
      lastClock = clock;
      if (runSeedRef.current !== lastRunSeed && qStartRef.current >= 0) {
        lastRunSeed = runSeedRef.current;
        startRun(runSeedRef.current);
        S.runStart = qStartRef.current;
      }
      const e = S.runStart != null ? clock - S.runStart : -1;
      const p = clamp01(e / RUN);
      const active = e >= 0 && e < RUN;

      if (variant === 1) drawTriage(p, active, e, dt);
      else if (variant === 2) drawSort(p, active);
      else drawTrails(p, active, dt);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [variant, layout, fieldSeed, clockRef, qStartRef, runSeedRef]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
}
