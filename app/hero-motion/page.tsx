"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FRAMES, Stage, mono, ink, faint, muted, sub, BLUE } from "../hero-storyboard/frames";

/* /hero-motion — timing animatic for the 15-frame hero. The story is LOCKED; this
   only adds motion. Premium-software-film grammar: animate the CAMERA over the static
   stills (push, pan, crop, hold, cut) rather than the UI. This is a ROUGH CUT to judge
   pacing end-to-end — momentum → drop → low point → relief → calm — before any
   micro-polish. Reduced-motion AND mobile (≤760px) → the F15 poster, static. Screen-recordable
   (press H for a clean frame). */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const outQuint = (t: number) => 1 - Math.pow(1 - clamp01(t), 5);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Cam = { s0: number; x0: number; y0: number; s1: number; x1: number; y1: number; hold: number };
type Shot = { dur: number; cam: Cam; trans: "cut" | "fade"; tIn: number; jitter?: boolean };

// One shot per frame, in FRAMES order. dur in seconds. cam = camera move start→end,
// `hold` = fraction of the shot after which the camera is parked (the rest is a hold).
// trans/tIn = how this shot enters (hard cut, or a soft dissolve over tIn seconds).
const SHOTS: Shot[] = [
  // — Group A: power. confident, fast, satisfying —
  { dur: 2.0, trans: "fade", tIn: 0.15, cam: { s0: 1.02, x0: 1, y0: 0, s1: 1.06, x1: -1, y1: 1.5, hold: 1 } }, // 01 open on visible work — near-instant fade, no dead air
  { dur: 1.7, trans: "cut", tIn: 0, cam: { s0: 1.05, x0: 7, y0: -2, s1: 1.05, x1: -8, y1: 3, hold: 1 } }, // 02 pan across the day
  { dur: 2.3, trans: "cut", tIn: 0, cam: { s0: 1.01, x0: 0, y0: 3, s1: 1.16, x1: 0, y1: -4, hold: 0.6 } }, // 03 THESIS — bigger push DOWN onto the now-weighted (lg) resolved line; longer HOLD so it lands as a discovery (poster callback)
  // — Group B: the drop —
  { dur: 2.1, trans: "cut", tIn: 0, cam: { s0: 1.05, x0: 8, y0: 0, s1: 1.05, x1: -5, y1: -2, hold: 0.8 } }, // 04 pan leaves the chat → empty Cursor; softer crop + parks on "context didn't come along" (y up so the bottom-right line is no longer clipped)
  { dur: 1.6, trans: "cut", tIn: 0, cam: { s0: 1.03, x0: -2, y0: 0, s1: 1.07, x1: -5, y1: 2, hold: 0.7 } }, // 05 hold on the hesitation
  // — Group C: markdown —
  { dur: 1.6, trans: "cut", tIn: 0, cam: { s0: 1.04, x0: 0, y0: 1, s1: 1.12, x1: 1, y1: 4, hold: 0.8 } }, // 06 zoom into the note line
  { dur: 1.5, trans: "cut", tIn: 0, cam: { s0: 1.03, x0: 0, y0: 2, s1: 1.09, x1: 0, y1: 6, hold: 0.85 } }, // 07 push to the ✓ / done
  { dur: 1.5, trans: "cut", tIn: 0, cam: { s0: 1.04, x0: 1, y0: 2, s1: 1.12, x1: 3, y1: 5, hold: 0.8 } }, // 08 zoom on the dead-end pointer
  // — Group D: in the conversation → the low point —
  { dur: 1.6, trans: "cut", tIn: 0, cam: { s0: 1.03, x0: 0, y0: 1, s1: 1.08, x1: 1, y1: 3, hold: 0.7 } }, // 09 hard cut, reason highlights
  { dur: 2.4, trans: "cut", tIn: 0, jitter: true, cam: { s0: 1.06, x0: 0, y0: 0, s1: 1.06, x1: 0, y1: 0, hold: 1 } }, // 10 LOW POINT — sharp irritated cuts
  // — Group E: Rift. calmer, fewer moving parts, more trust —
  { dur: 1.5, trans: "fade", tIn: 0.4, cam: { s0: 1.02, x0: 0, y0: 0, s1: 1.05, x1: 0, y1: 1, hold: 1 } }, // 11 calm inline call — SHORT, just hands off to the payoff
  { dur: 2.4, trans: "fade", tIn: 0.5, cam: { s0: 1.05, x0: -3, y0: 0, s1: 1.11, x1: -6, y1: 0, hold: 0.7 } }, // 12 RELIEF — push INTO the decision·why·source result, harder crop + longer hold (the emotional beat)
  { dur: 1.5, trans: "fade", tIn: 0.45, cam: { s0: 1.03, x0: 0, y0: -1, s1: 1.04, x1: -1, y1: -2, hold: 0.7 } }, // 13 beat on capture confirm — gentle near-center crop keeps the bottom-left "stored on your Mac" (was clipped by the right pan)
  { dur: 2.0, trans: "fade", tIn: 0.45, cam: { s0: 1.12, x0: 9, y0: 6, s1: 1.07, x1: -3, y1: 1, hold: 0.9 } }, // 14 camera TRACES source→reuse: opens on "captured May 3" ghost, travels down the arrow to Codex "already has / reused ✓"
  // — Group F: outro. hold longer than comfortable —
  { dur: 3.0, trans: "fade", tIn: 0.7, cam: { s0: 1.02, x0: 0, y0: 0, s1: 1.04, x1: 0, y1: 0, hold: 0.5 } }, // 15 settle — let the line breathe
];

// F10 low-point: hard micro-cuts between three focal regions (wrong file, search, paste).
// No easing — the snap IS the irritation. Fixed table (no Math.random — SSR-safe).
const JIT = [
  { s: 1.13, x: 9, y: -6, rot: -1.6 }, // wrong file, top-left
  { s: 1.13, x: -9, y: -6, rot: 1.6 }, // search, top-right
  { s: 1.08, x: 0, y: 4, rot: 0 }, // paste, center
  { s: 1.08, x: 0, y: 4, rot: 0 }, // paste again — emphasis
];
const JIT_STEP = 0.3; // seconds per cut

const TOTAL = SHOTS.reduce((a, s) => a + s.dur, 0);
const EXPORT_END_EPS = 0.001;
// cumulative start time of each shot
const STARTS = SHOTS.reduce<number[]>((acc, s, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + SHOTS[i - 1].dur); return acc; }, []);

function camTransform(cam: Cam, p: number) {
  const e = smooth(clamp01(p / cam.hold));
  const s = lerp(cam.s0, cam.s1, e);
  const x = lerp(cam.x0, cam.x1, e);
  const y = lerp(cam.y0, cam.y1, e);
  return `scale(${s.toFixed(4)}) translate(${x.toFixed(3)}%, ${y.toFixed(3)}%)`;
}

// ---- per-element life ----
// Subtle, beat-synced reveals driven off the SAME clock as the camera — a pure function
// of the active shot's local time (seconds), so it replays cleanly on every loop. The
// `.life` elements start hidden via CSS (motion route only); these reveal them. Kept
// disciplined: only the handful of elements that make the real work feel alive.
const q = (root: HTMLElement, sel: string) => root.querySelector<HTMLElement>(sel);
const qs = (root: HTMLElement, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
const step = (p: number, n: number) => Math.floor(clamp01(p) * n) / n;
function riseEl(el: HTMLElement | null, local: number, start: number, dur: number, dy: number) {
  if (!el) return;
  const a = smooth(clamp01((local - start) / dur));
  el.style.opacity = String(a);
  el.style.transform = `translateY(${((1 - a) * dy).toFixed(2)}px)`;
}
function typeEl(el: HTMLElement | null, local: number, start: number, dur: number, dy = 0, steps = 28) {
  if (!el) return;
  const raw = clamp01((local - start) / dur);
  const a = smooth(raw);
  const typed = step(a, steps);
  el.style.opacity = String(raw <= 0 ? 0 : 1);
  el.style.transform = `translateY(${((1 - a) * dy).toFixed(2)}px)`;
  el.style.clipPath = `inset(0 ${((1 - typed) * 100).toFixed(2)}% 0 0)`;
  el.style.overflow = "hidden";
}
function snapTypeEl(el: HTMLElement | null, local: number, start: number, dur: number, steps = 28) {
  if (!el) return;
  const raw = clamp01((local - start) / dur);
  const typed = step(raw, steps);
  el.style.opacity = String(raw <= 0 ? 0 : 1);
  el.style.transform = "none";
  el.style.clipPath = `inset(0 ${((1 - typed) * 100).toFixed(2)}% 0 0)`;
  el.style.overflow = "hidden";
}
function settleEl(el: HTMLElement | null, local: number, start: number, dur: number, dy: number, scale = 0.985) {
  if (!el) return;
  const a = outQuint((local - start) / dur);
  el.style.opacity = String(a);
  el.style.transform = `translateY(${((1 - a) * dy).toFixed(2)}px) scale(${lerp(scale, 1, a).toFixed(4)})`;
}
function flashEl(el: HTMLElement | null, local: number, start: number, dur: number, color: string) {
  if (!el) return;
  const p = clamp01((local - start) / dur);
  const a = Math.sin(p * Math.PI);
  el.style.boxShadow = `0 0 ${(a * 18).toFixed(1)}px ${color}`;
}
function setEl(el: HTMLElement | null, opacity: number, transform?: string) {
  if (!el) return;
  el.style.opacity = String(clamp01(opacity));
  if (transform) el.style.transform = transform;
}
const LIFE: Record<number, (r: HTMLElement, t: number) => void> = {
  0: (r, t) => { // F01 — work appears: chat, then the diff lands, then the test passes
    typeEl(q(r, ".l01-c1"), t, 0.05, 0.5, 4, 30);
    typeEl(q(r, ".l01-c2"), t, 0.55, 0.5, 4, 30);
    typeEl(q(r, ".l01-d1"), t, 0.42, 0.38, 8, 38);
    typeEl(q(r, ".l01-d2"), t, 0.72, 0.38, 8, 34);
    flashEl(q(r, ".l01-d1"), t, 0.72, 0.45, "rgba(127,209,192,0.22)");
    settleEl(q(r, ".l01-pass"), t, 1.3, 0.32, 5, 0.98);
  },
  2: (r, t) => { // F03 — corrections land, then the final line settles
    typeEl(q(r, ".l03-u1"), t, 0.15, 0.42, 5, 18);
    typeEl(q(r, ".l03-u2"), t, 0.55, 0.42, 5, 22);
    settleEl(q(r, ".l03-final"), t, 1.08, 0.62, 9, 0.975);
    flashEl(q(r, ".l03-final"), t, 1.45, 0.58, "rgba(127,209,192,0.18)");
  },
  9: (r, t) => { // F10 — sharp relay life: wrong file, search, paste, no smoothing
    const cut = Math.floor(t / JIT_STEP) % JIT.length;
    setEl(q(r, ".l10-wrong"), t > 0.02 ? (cut === 0 ? 0.62 : 0.32) : 0, `rotate(-2deg) translateY(${cut === 0 ? -2 : 0}px)`);
    setEl(q(r, ".l10-search"), t > 0.18 ? (cut === 1 ? 1 : 0.5) : 0, `rotate(2deg) translateY(${cut === 1 ? -2 : 0}px)`);
    setEl(q(r, ".l10-paste"), t > 0.35 ? (cut >= 2 ? 1 : 0.72) : 0, `translateY(${cut >= 2 ? -2 : 0}px)`);
    setEl(q(r, ".l10-status"), t > 0.75 ? 1 : 0);

    const search = q(r, ".l10-search-text");
    if (search) {
      const count = t < 0.55 ? "7" : t < 0.9 ? "19" : t < 1.25 ? "41" : "41";
      search.textContent = `“stripe burst rate limit” — ${count} results…`;
    }
    snapTypeEl(q(r, ".l10-paste-line"), t, 0.58, 0.42, 42);
  },
  10: (r, t) => { // F11 — the agent reaches for Rift
    riseEl(q(r, ".l11-asks"), t, 0.35, 0.42, 5);
    const chip = q(r, ".l11-chip");
    if (chip) {
      const p = clamp01((t - 0.62) / 0.42);
      const pulse = Math.sin(p * Math.PI);
      chip.style.transform = `scale(${(1 + pulse * 0.025).toFixed(4)})`;
      chip.style.boxShadow = `0 0 ${(pulse * 16).toFixed(1)}px rgba(138,160,255,0.24)`;
    }
  },
  11: (r, t) => { // F12 — the result settles in quietly
    settleEl(q(r, ".l12-card"), t, 0.2, 0.58, 6, 0.992);
    [".l12-chip", ".l12-decision", ".l12-why", ".l12-source"].forEach((sel, i) => {
      riseEl(q(r, sel), t, 0.48 + i * 0.14, 0.38, 2);
    });
  },
  13: (r, t) => { // F14 — the reuse surfaces as the camera arrives at Codex
    setEl(q(r, ".l14-source"), 0.66 - smooth(clamp01((t - 0.5) / 1.1)) * 0.18, "rotate(-2deg)");
    setEl(q(r, ".l14-arrow"), smooth(clamp01((t - 0.3) / 0.38)) * 0.38);
    settleEl(q(r, ".l14-has"), t, 0.82, 0.42, 4, 0.99);
    riseEl(q(r, ".l14-reused"), t, 1.28, 0.42, 4);
    qs(r, ".l14-target").forEach((el) => flashEl(el, t, 1.25, 0.55, "rgba(138,160,255,0.12)"));
  },
};

export default function HeroMotion() {
  const [reduced, setReduced] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [clean, setClean] = useState(false);
  const [exportMode, setExportMode] = useState(false);
  const [armedExport, setArmedExport] = useState(false);
  const [hud, setHud] = useState({ i: 0, t: 0 }); // light state for the caption strip only

  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const clock = useRef({ t: 0, last: 0, playing: true });
  const exportDone = useRef(false);

  // keep refs in sync with state without restarting the rAF loop
  useEffect(() => { clock.current.playing = playing; }, [playing]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextExportMode = params.has("export") || params.get("mode") === "export";
    const nextArmed = params.has("armed");
    setExportMode(nextExportMode);
    setArmedExport(nextArmed);
    if (nextExportMode || params.has("clean")) setClean(true);
    if (nextExportMode) {
      clock.current.t = 0;
      clock.current.last = 0;
      clock.current.playing = !nextArmed;
      exportDone.current = false;
      setPlaying(!nextArmed);
      document.documentElement.dataset.heroMotionExport = "true";
      document.documentElement.dataset.heroMotionDuration = TOTAL.toFixed(1);
      delete document.documentElement.dataset.heroMotionDone;
      if (nextArmed) document.documentElement.dataset.heroMotionArmed = "true";
    }
  }, []);

  useEffect(() => {
    if (!armedExport) return;
    const start = () => {
      clock.current.t = 0;
      clock.current.last = 0;
      clock.current.playing = true;
      exportDone.current = false;
      setPlaying(true);
      delete document.documentElement.dataset.heroMotionDone;
      document.documentElement.dataset.heroMotionStarted = "true";
      window.dispatchEvent(new CustomEvent("hero-motion:start", { detail: { duration: TOTAL } }));
    };
    (window as typeof window & { __heroMotionStart?: () => void }).__heroMotionStart = start;
    return () => {
      delete (window as typeof window & { __heroMotionStart?: () => void }).__heroMotionStart;
    };
  }, [armedExport]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Mobile: the camera crops + review HUD are built for a wide frame and become
  // unreadable on a phone. Fall back to the static F15 poster (same path as
  // reduced-motion), which is the shippable mobile hero — CTA and all.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    setNarrow(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || narrow) return;
    let raf = 0;
    let hudAccum = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const c = clock.current;
      if (!c.last) c.last = now;
      const dt = (now - c.last) / 1000;
      c.last = now;
      if (c.playing) {
        const next = c.t + dt;
        if (exportMode) {
          if (next >= TOTAL - EXPORT_END_EPS) {
            c.t = TOTAL - EXPORT_END_EPS;
            c.playing = false;
            if (!exportDone.current) {
              exportDone.current = true;
              setPlaying(false);
              document.documentElement.dataset.heroMotionDone = "true";
              window.dispatchEvent(new CustomEvent("hero-motion:done", { detail: { duration: TOTAL } }));
            }
          } else {
            c.t = next;
          }
        } else {
          c.t = next % TOTAL;
        }
      }

      const t = c.t;
      let i = SHOTS.length - 1;
      for (let k = 0; k < SHOTS.length; k++) { if (t < STARTS[k] + SHOTS[k].dur) { i = k; break; } }
      const shot = SHOTS[i];
      const local = t - STARTS[i];
      const p = clamp01(local / shot.dur);

      // camera for the active layer
      let tf: string;
      if (shot.jitter) {
        const j = JIT[Math.floor(local / JIT_STEP) % JIT.length];
        tf = `scale(${j.s}) translate(${j.x}%, ${j.y}%) rotate(${j.rot}deg)`;
      } else {
        tf = camTransform(shot.cam, p);
      }

      const fadeIn = shot.trans === "fade" ? clamp01(local / shot.tIn) : 1;
      const prev = i > 0 ? i - 1 : -1;
      const showPrev = shot.trans === "fade" && prev >= 0 && fadeIn < 1;

      for (let j = 0; j < layerRefs.current.length; j++) {
        const el = layerRefs.current[j];
        if (!el) continue;
        if (j === i) {
          el.style.opacity = String(fadeIn);
          el.style.transform = tf;
          el.style.zIndex = "2";
        } else if (showPrev && j === prev) {
          // outgoing shot, parked at its end camera, dissolving out
          el.style.opacity = String(1 - fadeIn);
          el.style.transform = camTransform(SHOTS[j].cam, 1);
          el.style.zIndex = "1";
        } else {
          el.style.opacity = "0";
          el.style.zIndex = "0";
        }
      }

      // per-element life for the active shot (synced to its local time)
      const act = layerRefs.current[i];
      if (act && LIFE[i]) LIFE[i](act, local);

      hudAccum += dt;
      if (hudAccum > 0.12) { hudAccum = 0; setHud({ i, t }); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, narrow, exportMode]);

  // controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
      else if (e.key.toLowerCase() === "r") { clock.current.t = 0; clock.current.last = 0; }
      else if (e.key.toLowerCase() === "h") { setClean((c) => !c); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    clock.current.t = clamp01((e.clientX - r.left) / r.width) * TOTAL;
  };

  const frame = FRAMES[hud.i];

  const page = useMemo<React.CSSProperties>(() => ({
    minHeight: "100vh", background: "#050506", color: ink,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 18, padding: "32px clamp(12px,3vw,48px)",
  }), []);

  if (reduced || narrow) {
    return (
      <main style={page}>
        <div style={{ width: "min(94vw, 1040px)" }}>
          <Stage>{FRAMES[14].visual}</Stage>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={{ width: "min(94vw, 1040px)", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* reveal + caret life — scoped to this route only (.film), so the static
            storyboard renders these same frames fully visible */}
        <style>{`.film .life{opacity:0}
          @keyframes lifeBlink{0%,48%{opacity:1}49%,100%{opacity:0}}
          .film .l10-caret{animation:lifeBlink 1.06s steps(1,end) infinite}
          ${exportMode ? "nextjs-portal{display:none!important}" : ""}`}</style>
        <Stage style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.6)" }}>
          <div className="film" style={{ position: "absolute", inset: 0 }}>
            {FRAMES.map((f, j) => (
              <div
                key={f.n}
                ref={(el) => { layerRefs.current[j] = el; }}
                style={{ position: "absolute", inset: 0, opacity: 0, transformOrigin: "center", willChange: "transform, opacity", backfaceVisibility: "hidden" }}
              >
                {f.visual}
              </div>
            ))}
          </div>
          {/* faint film vignette — lighter so the film fills the matte instead of sinking into it */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset 0 0 110px rgba(0,0,0,0.28)", zIndex: 5 }} />
        </Stage>

        {!clean && (
          <>
            {/* caption strip — pacing readout, not part of the final film */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontSize: 12, color: muted, minHeight: 20 }}>
              <span style={{ color: BLUE }}>F{frame.n}</span>
              <span style={{ color: ink, fontWeight: 600 }}>{frame.title}</span>
              <span style={{ color: faint }}>· {frame.camera}</span>
              <span style={{ marginLeft: "auto", color: faint }}>{hud.t.toFixed(1)}s / {TOTAL.toFixed(1)}s</span>
            </div>

            {/* scrub bar with per-shot ticks */}
            <div onClick={scrub} style={{ position: "relative", height: 22, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(hud.t / TOTAL) * 100}%`, background: BLUE, opacity: 0.7 }} />
              </div>
              {STARTS.map((s, j) => (
                <div key={j} title={`F${FRAMES[j].n}`} style={{ position: "absolute", left: `${(s / TOTAL) * 100}%`, width: 1, height: j === hud.i ? 14 : 9, background: j === hud.i ? BLUE : "rgba(255,255,255,0.22)" }} />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: mono, fontSize: 11.5, color: sub }}>
              <button onClick={() => setPlaying((p) => !p)} style={btn}>{playing ? "❚❚ pause" : "▶ play"}</button>
              <button onClick={() => { clock.current.t = 0; clock.current.last = 0; }} style={btn}>↺ restart</button>
              <button onClick={() => setClean(true)} style={btn}>clean (H)</button>
              <span style={{ marginLeft: "auto", color: faint }}>{exportMode ? `${TOTAL.toFixed(1)}s single run` : `space play/pause · R restart · H clean · ~${Math.round(TOTAL)}s loop`}</span>
            </div>
          </>
        )}

        {/* clean mode = pure film (controls/captions hidden); press H to restore */}
      </div>
    </main>
  );
}

const btn: React.CSSProperties = {
  appearance: "none", border: "1px solid var(--border-strong)", background: "rgba(255,255,255,0.03)",
  color: "var(--ink-muted)", borderRadius: 7, padding: "5px 11px", fontFamily: mono, fontSize: 11.5, cursor: "pointer",
};
