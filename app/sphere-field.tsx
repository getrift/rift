"use client";

import { useEffect, useRef } from "react";

/* Rift's value as motion: out of a whole sphere of scattered memories, a query
   selects the RIGHT few — a shared topic, wherever they live — lights them up,
   pulls them into an organized structure, holds it (the served context), then
   releases them back to calm. Retrieval stays a discrete event, so it reads as
   "the right particles, organized, at the right time""

   Under that, the whole field is magnetic: it leans into the pointer and bends
   around it, harder the faster you move, and relaxes home when you stop. The
   magnetism is ambient and organic; the retrieval is the event on top of it.

   Cursor-triggered: moving over the sphere (or hovering the CTA) gathers the
   relevant particles into a compact node next to the cursor — at the sphere's
   CENTRE depth, so they converge inward rather than popping forward — held for a
   few seconds, then released. No autoplay; it repeats while you stay engaged.
   Monochrome: the resting field is an additive glow cloud, the node is drawn
   normal-alpha far→near so near particles occlude far ones. Soft round sprites
   (not hard squares). Click-through. */

export default function SphereField({ active = false }: { active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const TAU = Math.PI * 2;
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    const TILT = -0.4;
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);

    // strong front/back contrast → depth: back particles are nearly dark, front
    // ones bright (DEPTH_A dominates BASE_A so depth beats per-particle jitter).
    const BASE_A = 0.1, DEPTH_A = 0.4, BUCKETS = 12;
    const AMAX = 1.0; // selected particles glow brighter, toward full alpha
    const DEPTH_BUCKETS = 6; // far→near passes for the assembled cluster (occlusion)

    // retrieval timeline (seconds): select → assemble → hold → release, then a gap
    const T_SELECT = 0.5, T_ASSEMBLE = 0.9, T_HOLD = 2.8, T_RELEASE = 1.1; // stays a few seconds
    const s1 = T_SELECT, s2 = s1 + T_ASSEMBLE, s3 = s2 + T_HOLD, s4 = s3 + T_RELEASE;
    const TRIGGER_DELAY = 0.45; // slight delay after the cursor engages before gathering
    const GAP = 1.4;            // pause between repeats while still engaged
    const T_WAKE = 1.0; // CTA-hover wake: one soft brightness front, CTA → sphere

    // soft round particle sprite (premium "stardust" vs hard squares), cached once
    const DOT = document.createElement("canvas");
    DOT.width = DOT.height = 24;
    const dctx = DOT.getContext("2d")!;
    const dg = dctx.createRadialGradient(12, 12, 0, 12, 12, 12);
    dg.addColorStop(0, "rgba(240,243,247,1)");
    dg.addColorStop(0.55, "rgba(240,243,247,0.9)"); // brighter body → each dot actually reads
    dg.addColorStop(1, "rgba(240,243,247,0)");
    dctx.fillStyle = dg;
    dctx.beginPath(); dctx.arc(12, 12, 12, 0, TAU); dctx.fill();

    let w = 0, h = 0, cx = 0, cy = 0, R = 0, n = 0, K = 1;
    let bx = new Float32Array(0), by = new Float32Array(0), bz = new Float32Array(0);
    let phase = new Float32Array(0), seed = new Float32Array(0);
    let topic = new Uint16Array(0);
    let ox = new Float32Array(0), oy = new Float32Array(0);
    let vx = new Float32Array(0), vy = new Float32Array(0);
    let sx = new Float32Array(0), sy = new Float32Array(0), dp = new Float32Array(0);
    let slot = new Int32Array(0); // slot index in the current retrieval, -1 if not selected
    let bk = new Int8Array(0);
    let mt = new Float32Array(0); // per-particle "materialize": how arrived it is (0 = traveling)
    let nodeList = new Int32Array(0); // indices of arrived node particles this frame (for connectors)

    function build() {
      w = canvas!.clientWidth;
      h = canvas!.clientHeight;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = w * 0.66;
      cy = h * 0.42;
      R = Math.min(w, h) * 0.46;

      n = Math.max(18000, Math.min(34000, Math.round(R * R * 0.62)));
      K = Math.max(36, Math.round(n / 420)); // ~420 "relevant" particles per topic
      bx = new Float32Array(n); by = new Float32Array(n); bz = new Float32Array(n);
      phase = new Float32Array(n); seed = new Float32Array(n); topic = new Uint16Array(n);
      ox = new Float32Array(n); oy = new Float32Array(n);
      vx = new Float32Array(n); vy = new Float32Array(n);
      sx = new Float32Array(n); sy = new Float32Array(n); dp = new Float32Array(n);
      slot = new Int32Array(n); bk = new Int8Array(n); mt = new Float32Array(n); nodeList = new Int32Array(n);
      for (let i = 0; i < n; i++) {
        const u = Math.random() * 2 - 1;
        const th = Math.random() * TAU;
        const rr = Math.sqrt(Math.max(0, 1 - u * u));
        // shell + uniform-volume interior (cbrt) → full everywhere, bright centre via
        // chord overlap, not a single dense pile with a sparse halo.
        const rad = Math.random() < 0.5 ? 0.76 + Math.random() * 0.32 : Math.cbrt(Math.random()) * 0.95;
        bx[i] = rr * Math.cos(th) * rad;
        by[i] = u * rad;
        bz[i] = rr * Math.sin(th) * rad;
        phase[i] = Math.random() * TAU;
        seed[i] = 0.5 + Math.random() * 1.0;
        topic[i] = Math.floor(Math.random() * K); // which memories are "related"
        slot[i] = -1;
      }
    }

    let mx = -1e9, my = -1e9, lastMove = -1e9;
    const onMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      lastMove = performance.now();
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    build();
    const onResize = () => build();
    window.addEventListener("resize", onResize);

    // retrieval state
    let qActive = false, qStart = 0, qx = 0, qy = 0, selCount = 1;
    let nextAt = 0; // seconds

    // electrical connector pool — sparse, short-lived sparks between near node
    // particles, spawned over time so they build up rather than appearing at once.
    const MAX_ARCS = 14;
    const arcA = new Int32Array(MAX_ARCS).fill(-1); // particle index, -1 = free slot
    const arcB = new Int32Array(MAX_ARCS);
    const arcBorn = new Float32Array(MAX_ARCS);
    const arcJit = new Float32Array(MAX_ARCS); // bend fixed at spawn (stable shape, not per-frame noise)
    let arcAcc = 0; // spawn accumulator

    function startRetrieval(now: number) {
      const tp = Math.floor(Math.random() * K);
      let count = 0;
      for (let i = 0; i < n; i++) slot[i] = topic[i] === tp ? count++ : -1;
      selCount = Math.max(1, count);
      // Form near the sphere centre, nudged toward the (delayed) pointer ONLY when it's
      // over the sphere, and clamped tight — so attention influences placement without
      // the cursor steering the object or pushing it into the copy on CTA hover.
      qx = cx; qy = cy;
      if (pmInit && Math.hypot(lmx - cx, lmy - cy) < R * 0.95) {
        let ddx = lmx - cx, ddy = lmy - cy;
        const dd = Math.hypot(ddx, ddy), maxOff = R * 0.42;
        if (dd > maxOff) { ddx = (ddx / dd) * maxOff; ddy = (ddy / dd) * maxOff; }
        qx = cx + ddx; qy = cy + ddy;
      }
      for (let k = 0; k < MAX_ARCS; k++) arcA[k] = -1; // clear sparks from the last retrieval
      arcAcc = 0;
      qStart = now;
      qActive = true;
    }

    function smooth(a: number, b: number, x: number) {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    }

    let raf = 0, ay = 0, last = performance.now();
    let pmx = 0, pmy = 0, lmx = 0, lmy = 0, pmInit = false; // lagged pointers: parallax (slow) + lens (light)
    let prevPtx = 0, prevPty = 0, speedS = 0; // smoothed pointer speed drives the magnet
    let wakeStart = -1e9, prevActive = false, wasEngaged = false; // CTA wake (rising edge) + cursor engagement

    function frame(now: number) {
      const step = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const hot = activeRef.current;
      if (hot && !prevActive) wakeStart = now; // CTA hover (rising edge) → one wake
      prevActive = hot;

      if (!reduce) ay += step * (hot ? 0.16 : 0.05);
      const cosY = Math.cos(ay), sinY = Math.sin(ay);

      // cursor-triggered: gather when engaged (cursor over the sphere, or CTA hover),
      // after a slight delay; repeat with a gap while still engaged. No autoplay.
      const overSphere = now - lastMove < 3500 && Math.hypot(mx - cx, my - cy) < R * 0.95;
      const engaged = hot || overSphere;
      if (engaged && !wasEngaged) nextAt = t + TRIGGER_DELAY; // arm with a slight delay
      wasEngaged = engaged;
      if (!qActive && engaged && t >= nextAt) startRetrieval(now);
      let assemble = 0, glow = 0;
      if (qActive) {
        const e = (now - qStart) / 1000;
        if (e < s1) { assemble = 0; glow = smooth(0, s1 * 0.85, e); }            // select
        else if (e < s2) { assemble = smooth(s1, s2, e); glow = 1; }             // assemble
        else if (e < s3) { assemble = 1; glow = 1; }                             // serve / hold
        else if (e < s4) { const r = smooth(s3, s4, e); assemble = 1 - r; glow = 1 - r; } // release
        else { qActive = false; nextAt = t + GAP; } // cooldown before the next repeat
      }

      // the node: the relevant particles collapse into a small 3D ball that sits at
      // the sphere's CENTRE depth (it does not pop forward or enlarge), turning slowly.
      const nodeSpin = t * 0.12;
      const cosSpin = Math.cos(nodeSpin), sinSpin = Math.sin(nodeSpin);
      const rN = R * 0.17;       // compact node radius
      const NODE_DEPTH = 0.24;   // depth spread around the centre (0.5) — gentle, no foreground
      const k = 18, damp = 0.8;
      const dimOthers = 0.3 * glow; // the rest of the sphere recedes during a retrieval

      // delayed camera parallax — the viewpoint leans toward the mouse with ~700ms
      // lag (a depth-weighted shear, NOT particles chasing the cursor), and a faint
      // "query lens" that wakes resting particles near the cursor in place.
      const mouseKnown = lastMove > 0;
      const ptx = mouseKnown ? mx : cx, pty = mouseKnown ? my : cy;
      if (!pmInit) { pmx = lmx = ptx; pmy = lmy = pty; pmInit = true; }
      const pl = reduce ? 1 : 1 - Math.exp(-step / 0.7); // ~700ms — the camera lean
      const ll = reduce ? 1 : 1 - Math.exp(-step / 0.3); // ~300ms — the lens follows a touch quicker
      pmx += (ptx - pmx) * pl; pmy += (pty - pmy) * pl;
      lmx += (ptx - lmx) * ll; lmy += (pty - lmy) * ll;
      const nx = Math.max(-1, Math.min(1, (pmx - cx) / R));
      const ny = Math.max(-1, Math.min(1, (pmy - cy) / R));
      const PARA = R * 0.06;                              // max lean of the near face
      const lensR2 = (R * 0.42) * (R * 0.42);
      const LENS = 0.18 * (1 - glow);                    // fade the lens out as a retrieval forms

      // magnetic drift — the field leans into the pointer and curls around it:
      // particles inside a soft radius slide toward the cursor with an f² falloff
      // plus a tangential swirl, so the cloud bends rather than snapping. Strength
      // rides on pointer SPEED (move fast and it reaches; hold still and it settles
      // back), and dies as a retrieval forms so the node stays the subject. This
      // only moves the home each particle springs toward — the existing spring
      // (k/damp) supplies the lag, overshoot and settle, which is what makes it
      // read as organic instead of a cursor-locked mask.
      const pSpd = Math.hypot(ptx - prevPtx, pty - prevPty) / Math.max(step, 1e-3);
      prevPtx = ptx; prevPty = pty;
      speedS += (pSpd - speedS) * (reduce ? 1 : 1 - Math.exp(-step / 0.22));
      // No idle floor: strength is purely the smoothed pointer speed, so a still
      // cursor decays to zero and the spring walks every particle back home. A
      // constant floor would leave the cloud permanently dented toward wherever
      // the pointer last was, which is not what "magnetic when you move" means.
      const MAG = reduce || !mouseKnown
        ? 0
        : R * 0.18 * Math.min(1, speedS / 700) * (1 - glow);
      const magR2 = (R * 0.62) * (R * 0.62);
      const SWIRL = 0.34;

      // CTA wake — one soft brightness front sweeping from the CTA toward the sphere
      // on hover. Opacity only (no displacement), source-depth weighted, no circular
      // shockwave, and it dies as a retrieval forms (× (1 − glow)).
      const wakeAge = (now - wakeStart) / 1000;
      const wakeOn = wakeAge >= 0 && wakeAge < T_WAKE && !reduce && glow < 0.98;
      const wf = (wakeAge / T_WAKE) * 1.15;              // front position along the axis
      const wox = w * 0.06, woy = h * 0.86;              // origin near the CTA
      const wax = cx - wox, way = cy - woy, wD = Math.hypot(wax, way) || 1;
      const wdx = wax / wD, wdy = way / wD;              // unit axis, CTA → sphere
      const wLmax = wD + R * 1.1, wFade = 1 - glow;
      const WAKE_BAND = 0.12, WAKE_STR = 0.22;

      ctx!.clearRect(0, 0, w, h);
      ctx!.globalCompositeOperation = "lighter";

      let nodeCount = 0; // arrived node particles, collected for the connectors
      for (let i = 0; i < n; i++) {
        const br = reduce ? 1 : 1 + 0.045 * Math.sin(t * 0.45 + phase[i]);
        const X = bx[i] * br, Y = by[i] * br, Z = bz[i] * br;
        const x1 = X * cosY - Z * sinY;
        const z1 = X * sinY + Z * cosY;
        const y2 = Y * cosT - z1 * sinT;
        const z2 = Y * sinT + z1 * cosT;
        const persp = 1 / (1 - z2 * 0.42);
        const sphereDepth = (z2 + 1) * 0.5; // SOURCE depth — where the particle is now
        // camera lean: near particles (z2≈+1) shift toward the mouse, far ones away
        let homeX = cx + x1 * R * persp + nx * z2 * PARA;
        let homeY = cy - y2 * R * persp + ny * z2 * PARA;

        if (MAG > 0.01) {
          const gdx = lmx - homeX, gdy = lmy - homeY;
          const g2 = gdx * gdx + gdy * gdy;
          if (g2 < magR2) {
            const gd = Math.sqrt(g2) || 1;
            const f = 1 - g2 / magR2;
            // Capped as a FRACTION of the particle's own distance, so the
            // near field barely moves. A flat cap (or a large fraction) maps
            // everything within the radius onto a small disc and the cloud
            // visibly clumps into a gravity well — verified on screen. This
            // keeps the reach and drops the pile-up.
            const amt = Math.min(gd * 0.22, MAG * f * f * (0.3 + 0.7 * sphereDepth) * seed[i]);
            const ux = gdx / gd, uy = gdy / gd;
            homeX += ux * amt - uy * amt * SWIRL;
            homeY += uy * amt + ux * amt * SWIRL;
          }
        }
        const isSel = slot[i] >= 0;
        let axf: number, ayf: number;
        let slotX = 0, slotY = 0, targetDepth = sphereDepth, hasSlot = false;
        if (isSel && assemble > 0) {
          // even point on a small sphere (fibonacci), spun slowly. The node sits at
          // the sphere's centre depth, so particles converge inward, not forward.
          const j = slot[i];
          const yy = 1 - ((j + 0.5) / selCount) * 2; // 1..-1
          const rr2 = Math.sqrt(Math.max(0, 1 - yy * yy));
          const aa = j * GOLDEN;
          const nX = rr2 * Math.cos(aa), nZ0 = rr2 * Math.sin(aa);
          const rx = nX * cosSpin - nZ0 * sinSpin;
          const rz = nX * sinSpin + nZ0 * cosSpin;
          const cpersp = 1 / (1 - rz * 0.18);          // mild — the node barely scales
          slotX = qx + rx * rN * cpersp;
          slotY = qy - yy * rN * cpersp;
          targetDepth = 0.5 + NODE_DEPTH * rz;          // centred at mid-depth, gentle front/back
          hasSlot = true;
          axf = ((slotX - homeX) * assemble - ox[i]) * k;
          ayf = ((slotY - homeY) * assemble - oy[i]) * k;
        } else {
          axf = -ox[i] * k; ayf = -oy[i] * k; // spring home
        }
        vx[i] = (vx[i] + axf * step) * damp;
        vy[i] = (vy[i] + ayf * step) * damp;
        ox[i] += vx[i] * step; oy[i] += vy[i] * step;
        const px = homeX + ox[i], py = homeY + oy[i];
        sx[i] = px;
        sy[i] = py;

        // materialize = how far THIS particle has actually arrived at its slot — a
        // per-particle quantity, NOT the global assemble timer. A back particle
        // keeps its (dim) source depth the whole way and only inherits the slot's
        // brightness once it has genuinely arrived. No premature promotion.
        let materialize = 0;
        if (hasSlot) {
          const travel = Math.hypot(slotX - homeX, slotY - homeY);
          const toSlot = Math.hypot(px - slotX, py - slotY);
          const arrived = travel > 1 ? Math.max(0, 1 - toSlot / travel) : 1;
          materialize = smooth(0.45, 0.92, arrived);
        }
        mt[i] = materialize;
        if (isSel && materialize > 0.5) nodeList[nodeCount++] = i; // arrived → can spark
        const shadeDepth = sphereDepth + (targetDepth - sphereDepth) * materialize;
        dp[i] = shadeDepth;

        // glow (additive) alpha. Selected particles light up in place during SELECT,
        // but the boost is weighted by SOURCE depth (a back traveller stays dim) and
        // fades out as the particle materializes into the solid object pass.
        let alpha = (BASE_A + shadeDepth * DEPTH_A) * seed[i];
        if (isSel) {
          alpha = (alpha + glow * (0.05 + 0.4 * sphereDepth)) * (1 - materialize);
        } else {
          alpha *= 1 - dimOthers; // others recede
          if (mouseKnown && LENS > 0.001) {
            // query lens — a faint, in-place wake near the (lightly-lagged) cursor,
            // weighted by source depth so background particles stay dim. No movement,
            // no attraction; fades out while a retrieval is forming (LENS folds in glow).
            const ldx = px - lmx, ldy = py - lmy;
            const ld2 = ldx * ldx + ldy * ldy;
            if (ld2 < lensR2) {
              const lf = 1 - ld2 / lensR2;
              alpha += lf * lf * LENS * sphereDepth;
            }
          }
        }
        if (wakeOn) {
          // distance of this particle along the CTA→sphere axis, vs the moving front
          const p = ((px - wox) * wdx + (py - woy) * wdy) / wLmax;
          const bf = 1 - Math.abs(p - wf) / WAKE_BAND;
          if (bf > 0) alpha += bf * bf * WAKE_STR * sphereDepth * wFade;
        }
        if (alpha > 0.97) alpha = 0.97;
        let q = (alpha / AMAX * BUCKETS) | 0;
        if (q > BUCKETS - 1) q = BUCKETS - 1;
        bk[i] = q;
      }

      // glow pass — additive, the diffuse memory cloud (resting sphere, plus the
      // selected particles while they're still scattered and lighting up). Bucketed
      // so 25k dots cost one globalAlpha change per bucket.
      for (let bkt = 0; bkt < BUCKETS; bkt++) {
        ctx!.globalAlpha = ((bkt + 0.5) / BUCKETS) * AMAX;
        for (let i = 0; i < n; i++) {
          if (bk[i] !== bkt) continue;
          const depth = dp[i];
          const s = depth > 0.66 ? 3.8 : depth > 0.33 ? 2.9 : 2.1;
          ctx!.drawImage(DOT, sx[i] - s / 2, sy[i] - s / 2, s, s);
        }
      }

      // object pass — the assembled cluster in NORMAL alpha, drawn far→near across
      // DEPTH_BUCKETS so near particles occlude far ones (real solidity). A particle
      // only joins this pass once it has materialized (arrived), and both its opacity
      // and size scale with that arrival — so nothing reads as "object" mid-flight.
      if (assemble > 0) {
        ctx!.globalCompositeOperation = "source-over";
        for (let db = 0; db < DEPTH_BUCKETS; db++) {
          for (let i = 0; i < n; i++) {
            if (slot[i] < 0) continue;
            const m = mt[i];
            if (m <= 0) continue; // not arrived yet — still a travelling dust mote
            const depth = dp[i];
            let d = (depth * DEPTH_BUCKETS) | 0;
            if (d > DEPTH_BUCKETS - 1) d = DEPTH_BUCKETS - 1;
            if (d !== db) continue; // db 0 = farthest, painted first
            let a = (0.3 + 0.62 * depth) * m; // opacity follows arrival, not the timer
            if (a > 0.97) a = 0.97;
            ctx!.globalAlpha = a;
            const s = depth > 0.66 ? 3.4 : depth > 0.33 ? 2.8 : 2.2; // no enlargement
            ctx!.drawImage(DOT, sx[i] - s / 2, sy[i] - s / 2, s, s);
          }
        }
      }

      // electrical connectors — sparse sparks between near node particles. Spawn rate
      // ramps with how formed the node is (nodeCount/selCount), so they BUILD up as it
      // gathers rather than all at once. Each spark is short-lived with a jittered
      // midpoint (the crackle), drawn additive so it reads bright.
      if (nodeCount > 1) {
        // binding glints — rare, short, dim, depth-coherent sparks between FRONT node
        // particles at a similar depth (no x-ray links across the object). Each glint's
        // shape is fixed at spawn with a tiny shimmer, so it reads as a quiet binding
        // moment inside the formed pack, not visible lightning.
        const ARC_LIFE = 0.18, CD2 = (R * 0.09) * (R * 0.09);
        arcAcc += step * glow * 9 * (nodeCount / selCount);
        while (arcAcc >= 1) {
          arcAcc -= 1;
          let slotK = -1;
          for (let k = 0; k < MAX_ARCS; k++) if (arcA[k] < 0) { slotK = k; break; }
          if (slotK < 0) break; // pool full — stays sparse
          const a = nodeList[(Math.random() * nodeCount) | 0];
          if (dp[a] < 0.5) continue; // front of the node only
          let b = -1;
          for (let tries = 0; tries < 8; tries++) {
            const cand = nodeList[(Math.random() * nodeCount) | 0];
            if (cand === a || dp[cand] < 0.5) continue;
            if (Math.abs(dp[a] - dp[cand]) > 0.14) continue; // same depth shell, not x-ray
            const ex = sx[a] - sx[cand], ey = sy[a] - sy[cand];
            if (ex * ex + ey * ey < CD2) { b = cand; break; }
          }
          if (b < 0) continue;
          arcA[slotK] = a; arcB[slotK] = b; arcBorn[slotK] = t;
          arcJit[slotK] = (Math.random() * 2 - 1) * 0.13; // gentle bend, set once
        }
        ctx!.globalCompositeOperation = "lighter";
        ctx!.strokeStyle = "#eef1f5"; // particle near-white, calm — no blue/sci-fi tint
        ctx!.lineWidth = 0.85;
        for (let k = 0; k < MAX_ARCS; k++) {
          if (arcA[k] < 0) continue;
          const age = t - arcBorn[k];
          if (age > ARC_LIFE) { arcA[k] = -1; continue; }
          const p = age / ARC_LIFE;
          const env = p < 0.25 ? p / 0.25 : 1 - (p - 0.25) / 0.75; // quick glint
          const a = arcA[k], b = arcB[k];
          const al = env * 0.5 * (0.35 + 0.85 * Math.min(dp[a], dp[b])); // dim, depth-weighted
          if (al <= 0.02) continue;
          const axp = sx[a], ayp = sy[a], bxp = sx[b], byp = sy[b];
          const ex = bxp - axp, ey = byp - ayp, len = Math.hypot(ex, ey) || 1;
          const off = len * arcJit[k] * (1 + 0.12 * Math.sin(t * 55 + k)); // stable + tiny shimmer
          const mx2 = (axp + bxp) / 2 - (ey / len) * off;
          const my2 = (ayp + byp) / 2 + (ex / len) * off;
          ctx!.globalAlpha = al;
          ctx!.beginPath();
          ctx!.moveTo(axp, ayp); ctx!.lineTo(mx2, my2); ctx!.lineTo(bxp, byp);
          ctx!.stroke();
        }
      }
      ctx!.globalAlpha = 1;

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    if (reduce) { ay = 0.6; frame(performance.now()); }
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
