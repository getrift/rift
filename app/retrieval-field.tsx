"use client";

import { useEffect, useRef } from "react";

/* Production hero field — the cursor is a LIVE query and the field answers it,
   instantly. Most of the dense archive ignores you. While you point (cursor) or
   hover the CTA, a fixed slice of the field responds:

     • CANDIDATES — a wider sparse set wake in place with a faint luminance lift
       (the search surfacing maybes — no movement).
     • SELECTED — a small curated set (~90) converge into ONE asymmetric multi-lobe
       pack at the query. They don't make a beeline: each rides a slow curl flow
       with only a mild, distance-growing bias toward its slot, so the path curves
       in (pollen in water, not filings to a magnet) and arrives in rank-staggered
       waves. The pack follows the query, breathes, then releases back into the
       ambient drift the moment you leave.

   Individuality is the point: each selected particle has its own lobe slot, rank
   and flow-curved path, so the pack never reads as a ring or a dot. Normal alpha,
   short trails — settling memories, not comet streaks. The heavy per-particle work
   runs only for the ~90 active fragments. ponytail: CPU sim + GL points, ~50k @ 60fps. */
export default function RetrievalField({ active = false }: { active?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: true });
    if (!gl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ptr = { x: -9999, y: -9999, inside: false };
    const sstep = (a: number, b: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    // --- program ---
    const vsrc = `
      attribute vec2 a_pos; attribute float a_size; attribute float a_alpha;
      uniform vec2 u_res; varying float v_alpha;
      void main() {
        vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
        gl_PointSize = a_size;
        v_alpha = a_alpha;
      }`;
    const fsrc = `
      precision mediump float; varying float v_alpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float a = smoothstep(0.25, 0.0, dot(c, c)) * v_alpha;
        gl_FragColor = vec4(0.82, 0.85, 0.91, a); // cool near-white, not pure white
      }`;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const aPos = gl.getAttribLocation(prog, "a_pos");
    const aSize = gl.getAttribLocation(prog, "a_size");
    const aAlpha = gl.getAttribLocation(prog, "a_alpha");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);

    // subtle dark background gradient — a fullscreen quad drawn behind the particles,
    // so the wave sits on a gentle dark gradient instead of flat black (very subtle)
    const bgVs = `attribute vec2 p; varying vec2 vuv; void main(){ vuv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;
    const bgFs = `precision mediump float; varying vec2 vuv;
      void main(){
        vec3 bottom = vec3(0.016, 0.018, 0.022);          // a touch deeper than canvas
        vec3 top    = vec3(0.043, 0.048, 0.058);          // subtly lifted, cool
        vec3 col = mix(bottom, top, vuv.y);
        float r = distance(vuv, vec2(0.6, 0.66));          // faint glow behind the wave
        col += vec3(0.014, 0.016, 0.024) * (1.0 - smoothstep(0.0, 0.75, r));
        gl_FragColor = vec4(col, 1.0);
      }`;
    const bgProg = gl.createProgram()!;
    gl.attachShader(bgProg, compile(gl.VERTEX_SHADER, bgVs));
    gl.attachShader(bgProg, compile(gl.FRAGMENT_SHADER, bgFs));
    gl.linkProgram(bgProg);
    const bgP = gl.getAttribLocation(bgProg, "p");
    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(8 / 255, 9 / 255, 10 / 255, 1);

    // --- sim state ---
    let w = 0, h = 0, n = 0, raf = 0, last = 0;
    let F = new Float32Array(0);                 // interleaved x,y,size,alpha
    let zArr = new Float32Array(0);
    let relArr = new Float32Array(0);            // static relevance seed
    let lumArr = new Float32Array(0);            // static per-particle luminance (resting opacity variety)
    let szArr = new Float32Array(0);             // static per-particle size factor (organic size variety)
    let bxArr = new Float32Array(0);             // fixed base x — each mote's anchor on the wave sheet
    let offX = new Float32Array(0), offY = new Float32Array(0); // cluster-local lobe slot
    let rankArr = new Float32Array(0);           // hierarchy + arrival order
    let SEL = 0, CAND = 0;            // relevance-window widths: selected pack / wider candidate ring
    let eng = 0, engT = 0;            // engagement envelope (0..1) + seconds engaged (staggered departure)
    let qx = 0, qy = 0;               // live query point (cursor, or the CTA showcase point)
    let pxr = 0, pyr = 0;             // smoothed cursor parallax (depth — near and far layers slide apart)

    // an asymmetric pack shape: one dense core + three uneven satellite lobes
    const LOBES = [
      { x: 0, y: 4, r: 30, w: 3.0 },
      { x: 58, y: -34, r: 22, w: 1.5 },
      { x: -48, y: 30, r: 20, w: 1.3 },
      { x: 34, y: 54, r: 17, w: 1.0 },
    ];

    // smoothed cursor + CTA-activation level
    let mx = 0, my = 0, ci = 0;

    const build = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, w, h);

      // grid sized for a readable dotted wave mesh — columns across, depth rows back→front
      const COLS = Math.max(160, Math.round(w / 2.6));   // dense columns → threads read as lines, not dots
      const ROWS = Math.max(16, Math.round(h / 40));     // ~22 distinct depth threads (gaps between them)
      n = COLS * ROWS;
      F = new Float32Array(n * 4);
      zArr = new Float32Array(n);
      relArr = new Float32Array(n); rankArr = new Float32Array(n); lumArr = new Float32Array(n);
      szArr = new Float32Array(n);
      bxArr = new Float32Array(n);
      offX = new Float32Array(n); offY = new Float32Array(n);
      const totW = LOBES.reduce((s, l) => s + l.w, 0);
      for (let i = 0; i < n; i++) {
        const col = i % COLS, row = (i - col) / COLS;
        const bx = ((col + 0.5) / COLS) * w + (Math.random() - 0.5) * (w / COLS) * 0.25; // column + light jitter
        bxArr[i] = bx;                                    // fixed anchor x — keeps the mesh columns visible
        F[i * 4] = bx;
        F[i * 4 + 1] = Math.random() * h;                 // settles onto the wave within the first frames
        zArr[i] = (row + 0.5) / ROWS;                     // depth row: back (0) … front (1)
        relArr[i] = Math.random();
        rankArr[i] = Math.random();
        lumArr[i] = 0.45 + Math.pow(Math.random(), 2) * 1.7; // mostly faint, a scattered few bright
        szArr[i] = 0.8 + Math.random() * 0.7;             // 0.8–1.5× size — organic, uneven motes
        // pick a lobe (weighted) + soft jitter → a personal target in the pack
        let r = Math.random() * totW, lobe = LOBES[0];
        for (const l of LOBES) { r -= l.w; if (r <= 0) { lobe = l; break; } }
        const ang = Math.random() * 6.283, rad = (Math.random() * 0.6 + Math.random() * 0.6) * lobe.r;
        offX[i] = lobe.x + Math.cos(ang) * rad;
        offY[i] = lobe.y + Math.sin(ang) * rad;
      }
      SEL = 0.05; CAND = 0.18;             // relevance fractions; proximity to the query further gates what lifts
      qx = w * 0.62; qy = h * 0.42;
      gl.clearColor(8 / 255, 9 / 255, 10 / 255, 1); // seed the persistent buffer
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (reduce) frame(0, 0);
    };

    const frame = (t: number, dt: number) => {
      const step = reduce ? 0 : Math.min(dt, 0.033);

      if (ptr.inside) {
        mx += (ptr.x - mx) * Math.min(1, step * 9);
        my += (ptr.y - my) * Math.min(1, step * 9);
      }
      ci += ((activeRef.current ? 1 : 0) - ci) * Math.min(1, step * 3.5);

      const cs = Math.min(w, h) / 900;
      const hw = w / 2, hh = h / 2;
      const horizon = h * 0.30, depthSpread = h * 0.40, waveAmp = h * 0.085; // wave-sheet perspective + height
      const R = Math.min(w, h) * 0.6; // query reach — how much of the wave around the cursor lifts into the pack

      // CTA hover/focus is a showcase query (fixed, centre-right, clear of the copy)
      // and takes priority; otherwise the cursor itself is the live query point.
      const atCTA = ci > 0.05;
      const atCursor = ptr.inside && !atCTA;
      const gathering = (atCursor || atCTA) && !reduce;
      if (atCTA) { qx += (w * 0.62 - qx) * Math.min(1, step * 2.4); qy += (h * 0.42 - qy) * Math.min(1, step * 2.4); }
      else if (atCursor) { qx += (mx - qx) * Math.min(1, step * 3.2); qy += (my - qy) * Math.min(1, step * 3.2); } // glide, don't snap to the cursor

      // engagement envelope — wake gently, release gently (no jolt)
      eng += ((gathering ? 1 : 0) - eng) * Math.min(1, step * (gathering ? 2.2 : 1.5));
      if (gathering) engT += step; else engT = 0;
      // a slow rigid rotation of the whole pack so the asymmetric shape stays alive
      const prc = Math.cos(t * 0.05), prs = Math.sin(t * 0.05);

      // depth parallax: ease a small view-shift from the cursor's offset to centre;
      // near and far layers shift by opposite amounts so the field parts like volume
      const tpx = atCursor ? mx / w - 0.5 : 0;
      const tpy = atCursor ? my / h - 0.5 : 0;
      pxr += (tpx - pxr) * Math.min(1, step * 1.4);
      pyr += (tpy - pyr) * Math.min(1, step * 1.4);

      for (let i = 0; i < n; i++) {
        const i4 = i * 4, z = zArr[i];

        // relevance: which motes can answer a query. The wider CANDIDATE ring wakes
        // in place; the SELECTED subset lifts into the pack — but only those sitting
        // on the wave NEAR the query, so the pack visibly rises out of the wave.
        const rel = relArr[i];
        const sel = rel < SEL;
        const cand = rel < CAND;

        let x = F[i4], y = F[i4 + 1];

        // ambient HOME = a point on the slow traveling wave sheet (rows stacked by
        // depth z, lifted by layered dispersed sines). The wave is the resting state;
        // everything eases toward home, so released fragments flow back into it.
        const bx = bxArr[i];
        const H = Math.sin(bx * (0.007 + z * 0.006) + t * 0.4)        // wavelength disperses with depth → threads cross (non-parallel)
                + 0.5 * Math.sin(bx * 0.018 - z * 0.7 + t * 0.55)
                + 0.3 * Math.sin(bx * 0.003 + z * 1.3 - t * 0.3);
        const homeX = bx;
        const homeY = horizon + Math.pow(z, 1.4) * depthSpread - H * waveAmp * (0.6 + z * 0.7);

        let infl = 0, selSize = 0, candSurf = 0;

        // pull into the pack = relevant AND on the wave near the query. nearF falls off
        // with the query→wave-position distance, so the gather draws from the local wave.
        const dq = Math.hypot(homeX - qx, homeY - qy);
        const nearF = sstep(R, R * 0.4, dq);
        const m = sel ? eng * nearF : 0;

        let tgX = homeX, tgY = homeY;
        let ek = Math.min(1, 4 * step);
        if (m > 0.004) {
          const rank = rankArr[i];
          const tier = rank < 0.08 ? 1.0 : rank < 0.6 ? 0.62 : 0.34; // anchor / medium / dust
          const ss = sstep(rank * 0.22, 1, m);            // rank stagger → motes lift in waves, not all at once
          // its slot in the rotating, breathing pack at the query
          const ph = rank * 40, wob = 4.5 * cs;
          const ox = offX[i] * cs * 0.8, oy = offY[i] * cs * 0.8;
          const slotX = qx + (ox * prc - oy * prs) + Math.cos(t * 0.6 + ph) * wob;
          const slotY = qy + (ox * prs + oy * prc) + Math.sin(t * 0.7 + ph) * wob;
          // blend wave-home → pack-slot, with an upward arc so the mote LIFTS off the
          // wave and rises into the pack — and reverses back down on release
          tgX = homeX + (slotX - homeX) * ss;
          tgY = homeY + (slotY - homeY) * ss - Math.sin(ss * Math.PI) * (40 + 50 * (1 - z));
          ek = Math.min(1, 4.5 * step);
          const baseSize = 1.0 + z * 1.7;
          selSize = ss * (4.2 - baseSize) + (rank < 0.08 ? ss * 1.4 : 0); // rise to foreground
          infl = ss * (0.4 + 0.6 * tier);                 // brightness of a pack member
        } else if (cand && nearF > 0.04) {
          candSurf = eng * nearF;                          // candidates near the query wake in place (no lift)
        }
        x += (tgX - x) * ek; y += (tgY - y) * ek;

        const nx = (x - hw) / hw, ny = (y - hh) / hh;
        const vig = 1 - Math.min(1, nx * nx + ny * ny) * 0.32;
        const tw = 0.88 + 0.12 * Math.sin(t * 1.2 + z * 22.0);
        const axl = Math.max(0, Math.min(1, (0.62 - x / w) / 0.62));
        const ayb = Math.max(0, Math.min(1, (y / h - 0.46) / 0.54));
        const textDim = 1 - 0.65 * axl * ayb; // field recedes behind the copy

        const par = (z - 0.4) * 26;                   // depth parallax: far layer shifts opposite the near
        F[i4] = x - pxr * par; F[i4 + 1] = y - pyr * par;
        F[i4 + 2] = ((1.0 + z * 1.7) * szArr[i] + selSize) * dpr;
        const amb = (0.13 + z * 0.26) * lumArr[i];    // normal alpha — motes must read individually
        F[i4 + 3] = Math.min(1, (amb * vig * tw * textDim) + candSurf * 0.10 + infl * 0.7);
      }

      // paint the subtle dark gradient first (fills the frame), then particles on top
      gl.useProgram(bgProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.disable(gl.BLEND);
      gl.enableVertexAttribArray(bgP);
      gl.vertexAttribPointer(bgP, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.enable(gl.BLEND);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, F, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(aSize);
      gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 16, 8);
      gl.enableVertexAttribArray(aAlpha);
      gl.vertexAttribPointer(aAlpha, 1, gl.FLOAT, false, 16, 12);
      gl.drawArrays(gl.POINTS, 0, n);
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.inside = true;
    };
    const onLeave = () => { ptr.inside = false; ptr.x = ptr.y = -9999; };

    if (reduce) return () => ro.disconnect();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    const loop = (now: number) => {
      const t = now / 1000;
      const d = last ? Math.min(t - last, 0.05) : 0.016;
      last = t;
      frame(t, d);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = 0; raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 z-0 block h-full w-full" />;
}
