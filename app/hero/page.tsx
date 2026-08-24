"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, mono, ink, faint, sub, BLUE, GREEN, RED } from "../hero-storyboard/frames";
import { ProviderMark } from "../provider-icons";

/* /hero — NEW public hero (rebuild). Element-motion grammar, NOT camera-over-screenshots.
   The product is told by big objects MOVING, legible at a glance, no readable UI text:
     a Decision lives in Claude → a new agent (Cursor) arrives Empty → the handoff link
     SNAPS (context didn't come along) → Rift appears and LIFTS the Decision into memory.
   This is the BEATS 1–2 PROTOTYPE (~7s loop) — a proof of the motion grammar, not polish.
   Acceptance (must read with NO captions):
     @2s  Claude has useful context
     @4s  it did NOT come along to Cursor
     @5s  Rift is on screen
     @6s  Rift captured it
   Beats 3–5 (context card travels → agent resolves "Already has it" → poster) come next
   ONLY if this reads. Reduced-motion → the captured end-state, static. */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const pulse = (t: number, a: number, b: number) => Math.sin(clamp01((t - a) / (b - a)) * Math.PI); // 0→1→0

const LOOP = 7.6; // seconds; lock lands ~6.5, holds, then a soft seam-fade back to 0

const CLAUDE = "#d97757";
const CURSOR = "#cfd3da";

function set(el: HTMLElement | null, css: Partial<CSSStyleDeclaration>) {
  if (el) Object.assign(el.style, css);
}

// The whole scene as a pure function of loop-time t (seconds) — replays cleanly every loop.
function paint(root: HTMLElement, t: number) {
  const q = (s: string) => root.querySelector<HTMLElement>(`[data-el="${s}"]`);
  const claude = q("claude"), cursor = q("cursor"), chip = q("chip"),
    rift = q("rift"), riftLabel = q("riftLabel"), riftMark = q("riftMark"),
    empty = q("empty"), tether = q("tether"), flash = q("flash");

  // soft loop seam so the reset (captured → empty) isn't a hard cut
  set(root, { opacity: String(clamp01(seg(t, 0, 0.3)) * (1 - smooth(seg(t, LOOP - 0.45, LOOP)))) });

  // CLAUDE — rises in holding the Decision; dims + sinks once the handoff fails (stranded)
  const cin = smooth(seg(t, 0.0, 1.0));
  const dim = smooth(seg(t, 3.1, 4.0));
  set(claude, {
    opacity: String(cin * lerp(1, 0.5, dim)),
    transform: `translateY(${lerp(20, 0, cin) + 6 * dim}px) scale(${lerp(0.96, 1, cin) * lerp(1, 0.985, dim)})`,
  });

  // CURSOR — slides in from the right, EMPTY; jitters on the snap
  const sin = smooth(seg(t, 1.1, 2.3));
  const shake = pulse(t, 2.9, 3.25);
  set(cursor, {
    opacity: String(sin),
    transform: `translateX(${lerp(70, 0, sin) + Math.sin(t * 70) * shake * 3}px)`,
  });
  // "Empty agent" — settles in, flares red on the snap, then holds (still empty)
  const ein = smooth(seg(t, 2.2, 3.0));
  set(empty, { opacity: String(ein), color: `rgba(240,138,130,${(0.5 + 0.45 * shake).toFixed(3)})`, transform: `scale(${1 + 0.06 * shake})` });

  // TETHER — Cursor reaches for the Decision, goes taut, then SNAPS back toward Claude
  const taut = smooth(seg(t, 2.0, 2.75));
  const snap = smooth(seg(t, 2.9, 3.25));
  set(tether, {
    transform: `scaleX(${(taut * (1 - snap)).toFixed(4)})`,
    opacity: String(taut * (1 - snap)),
    background: snap > 0 ? RED : BLUE,
    boxShadow: snap > 0 ? `0 0 ${(10 * pulse(t, 2.9, 3.25)).toFixed(1)}px ${RED}` : "none",
  });
  const fl = pulse(t, 2.88, 3.32); // break spark at the Cursor end
  set(flash, { opacity: String(fl), transform: `translate(-50%,-50%) scale(${(0.3 + fl * 1.8).toFixed(2)})` });

  // CHIP (the Decision) — rises with Claude, recoils on the snap, then LIFTS into Rift + locks.
  // Position travels home(11.5%,47%) → Rift well(41%,9%). glow = STATE only.
  const chipIn = smooth(seg(t, 0.3, 1.1));
  const lift = smooth(seg(t, 5.2, 6.4));
  const recoil = pulse(t, 2.9, 3.5);
  set(chip, {
    left: `${lerp(11.5, 41, lift).toFixed(2)}%`,
    top: `${lerp(47, 9, lift).toFixed(2)}%`,
    opacity: String(chipIn),
    transform: `translateX(${(-11 * recoil).toFixed(1)}px) scale(${lerp(1, 0.82, lift).toFixed(3)})`,
  });
  const valuable = smooth(seg(t, 0.6, 1.4)) * (1 - smooth(seg(t, 3.0, 3.6))); // has-context glow, killed by the snap
  const secured = smooth(seg(t, 5.2, 6.2)); // captured by Rift
  const lock = pulse(t, 6.1, 6.8);
  const glow = Math.max(valuable * 0.5, secured * 0.7, lock);
  const glowColor = secured > 0.4 ? GREEN : BLUE;
  set(chip, {
    boxShadow: `0 18px 48px rgba(0,0,0,0.5), 0 0 ${(glow * 30).toFixed(1)}px ${glowColor}`,
    borderColor: secured > 0.5 ? GREEN : valuable > 0.2 ? GREEN + "88" : "var(--border-strong)",
  });

  // RIFT memory — appears ~4.4s (visible by 5s); pulses green as the chip locks in
  const rin = smooth(seg(t, 4.3, 5.1));
  set(rift, {
    opacity: String(rin),
    transform: `translateY(${lerp(-16, 0, rin).toFixed(1)}px)`,
    borderColor: lock > 0.3 ? GREEN + "cc" : BLUE + "66",
    boxShadow: `0 22px 60px rgba(0,0,0,0.55), 0 0 ${(Math.max(rin * 0.2, lock) * 34).toFixed(1)}px ${lock > 0.2 ? GREEN : BLUE}`,
  });
  set(riftMark, { color: lock > 0.4 ? GREEN : BLUE, transform: `scale(${(1 + 0.18 * lock).toFixed(3)})` });
  set(riftLabel, { color: lock > 0.4 ? GREEN : "#cfd6ff" });
}

// ---- presentational bits ----
function ToolHead({ mark, name, accent }: { mark: "claude" | "cursor"; name: string; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
      <span style={{ color: accent, display: "inline-flex" }}>
        <ProviderMark id={mark} size={22} />
      </span>
      <span style={{ fontSize: 15, fontWeight: 600, color: sub, letterSpacing: "-0.01em" }}>{name}</span>
    </div>
  );
}

const card: React.CSSProperties = {
  position: "absolute", borderRadius: 16, border: "1px solid var(--border-strong)",
  background: "#0a0b0d", boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
  display: "flex", flexDirection: "column", overflow: "hidden",
};
const bigLabel: React.CSSProperties = {
  fontSize: "clamp(17px,2.3vw,30px)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.05, textAlign: "center",
};

export default function Hero() {
  const [reduced, setReduced] = useState(false);
  const [capture, setCapture] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [clean, setClean] = useState(false);
  const [tHud, setTHud] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const clock = useRef({ t: 0, last: 0, playing: true });

  useEffect(() => { clock.current.playing = playing; }, [playing]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // static end-state for reduced-motion (the captured beat)
  useEffect(() => { if (reduced && rootRef.current) paint(rootRef.current, 6.6); }, [reduced]);

  // capture mode (?capture=1): pause the rAF clock and expose a deterministic painter
  // so an offline renderer can drive exact scene-time and screenshot each frame.
  useEffect(() => {
    const cap = new URLSearchParams(window.location.search).has("capture");
    setCapture(cap);
    (window as unknown as { __paintHero?: (t: number) => void }).__paintHero = (t: number) => {
      if (rootRef.current) paint(rootRef.current, t);
    };
    return () => { delete (window as unknown as { __paintHero?: (t: number) => void }).__paintHero; };
  }, []);

  useEffect(() => {
    if (reduced || capture) return;
    let raf = 0, hud = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const c = clock.current;
      if (!c.last) c.last = now;
      const dt = (now - c.last) / 1000;
      c.last = now;
      if (c.playing) c.t = (c.t + dt) % LOOP;
      if (rootRef.current) paint(rootRef.current, c.t);
      hud += dt;
      if (hud > 0.1) { hud = 0; setTHud(c.t); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, capture]);

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
    clock.current.t = clamp01((e.clientX - r.left) / r.width) * LOOP;
  };

  const page: React.CSSProperties = {
    minHeight: "100vh", background: "#050506", color: ink,
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: 16, padding: "32px clamp(12px,3vw,48px)",
  };

  return (
    <main style={page}>
      <div style={{ width: "min(94vw, 1040px)", display: "flex", flexDirection: "column", gap: 14 }}>
        <Stage style={{ boxShadow: "0 40px 120px rgba(0,0,0,0.6)" }}>
          <div ref={rootRef} id="hero-root" style={{ position: "absolute", inset: 0 }}>
            {/* RIFT memory — top center, appears ~4.4s */}
            <div
              data-el="rift"
              style={{
                position: "absolute", left: "36%", top: "8%", width: "28%", height: "15%",
                borderRadius: 14, border: `1px solid ${BLUE}66`, background: "rgba(16,18,22,0.96)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: 0,
              }}
            >
              <span data-el="riftMark" style={{ fontSize: 26, color: BLUE, lineHeight: 1 }}>◆</span>
              <span data-el="riftLabel" style={{ ...bigLabel, fontSize: "clamp(15px,1.9vw,24px)", color: "#cfd6ff" }}>Rift memory</span>
            </div>

            {/* CLAUDE — holds the Decision */}
            <div data-el="claude" style={{ ...card, left: "7%", top: "29%", width: "27%", height: "42%", opacity: 0 }}>
              <ToolHead mark="claude" name="Claude" accent={CLAUDE} />
              <div style={{ flex: 1 }} />
            </div>

            {/* CURSOR — arrives empty */}
            <div data-el="cursor" style={{ ...card, left: "66%", top: "29%", width: "27%", height: "42%", opacity: 0 }}>
              <ToolHead mark="cursor" name="Cursor" accent={CURSOR} />
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8%" }}>
                <span data-el="empty" style={{ ...bigLabel, opacity: 0, color: RED }}>Empty&nbsp;agent</span>
              </div>
            </div>

            {/* DECISION chip — the through-line object; lives in Claude, then lifts into Rift */}
            <div
              data-el="chip"
              style={{
                position: "absolute", left: "11.5%", top: "47%", width: "18%", height: "14%",
                borderRadius: 13, border: "1px solid var(--border-strong)", background: "rgba(20,23,27,0.98)",
                display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, zIndex: 4,
                boxShadow: "0 18px 48px rgba(0,0,0,0.5)",
              }}
            >
              <span style={{ ...bigLabel, fontSize: "clamp(15px,2vw,26px)", color: ink }}>Decision</span>
            </div>

            {/* handoff tether + break spark */}
            <div data-el="tether" style={{ position: "absolute", left: "29%", top: "49%", width: "37%", height: 3, transformOrigin: "left center", background: BLUE, opacity: 0, borderRadius: 2, zIndex: 3 }} />
            <div data-el="flash" style={{ position: "absolute", left: "66%", top: "49%", width: 18, height: 18, borderRadius: "50%", background: RED, opacity: 0, transform: "translate(-50%,-50%)", zIndex: 4 }} />
          </div>
        </Stage>

        {!clean && !capture && (
          <>
            <div onClick={scrub} style={{ position: "relative", height: 20, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <div style={{ position: "absolute", left: 0, right: 0, height: 4, borderRadius: 3, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(tHud / LOOP) * 100}%`, background: BLUE, opacity: 0.7 }} />
              </div>
              {/* acceptance markers at 2s / 4s / 6s */}
              {[2, 4, 6].map((s) => (
                <div key={s} title={`${s}s`} style={{ position: "absolute", left: `${(s / LOOP) * 100}%`, width: 1, height: 11, background: "rgba(255,255,255,0.3)" }} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: mono, fontSize: 11.5, color: sub }}>
              <button onClick={() => setPlaying((p) => !p)} style={btn}>{playing ? "❚❚ pause" : "▶ play"}</button>
              <button onClick={() => { clock.current.t = 0; clock.current.last = 0; }} style={btn}>↺ restart</button>
              <button onClick={() => setClean(true)} style={btn}>clean (H)</button>
              <span style={{ marginLeft: "auto", color: faint }}>{tHud.toFixed(1)}s / {LOOP.toFixed(1)}s · beats 1–2 proto · space · R · H</span>
            </div>
          </>
        )}
        {clean && <button onClick={() => setClean(false)} style={{ ...btn, alignSelf: "center" }}>show controls (H)</button>}
      </div>
    </main>
  );
}

const btn: React.CSSProperties = {
  appearance: "none", border: "1px solid var(--border-strong)", background: "rgba(255,255,255,0.03)",
  color: "var(--ink-muted)", borderRadius: 7, padding: "5px 11px", fontFamily: mono, fontSize: 11.5, cursor: "pointer",
};
