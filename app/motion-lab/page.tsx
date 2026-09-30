"use client";

import { useEffect, useRef, useState } from "react";
import MotionLabField, { Variant, TIMELINE } from "./motion-lab-field";

const FIELD_SEED = 0x9e3779b9; // shared across every panel → identical particle field

const VARIANTS: { id: Variant; name: string; desc: string; risk: string }[] = [
  {
    id: 1,
    name: "Triage stream — HERO",
    desc: "Memory cards flow past on a conveyor — everything the agents log. A scan reads across and lifts the relevant few out of the stream, one at a time, into a context pack that holds, then disperses. Recall as triage: many in, the right few assembled.",
    risk: "Shipped as the hero direction. Says the product truth fastest: source-backed retrieval → agent context.",
  },
  {
    id: 2,
    name: "Relevance sort",
    desc: "A column of candidate memories. The query scores each, and the rows reorder — the most relevant rise above a cutoff line, settle, and hold. Ranking made literal.",
    risk: "Legible baseline / contrast. Not in the running for hero.",
  },
  {
    id: 3,
    name: "Compounding recall (proof section, later)",
    desc: "A map of memories with faint links. Each query fires a pulse from a seed to what's related — and the routes it uses stay brighter, compounding over cycles. Better as a 'memory that pays off over time' proof section deeper in the page, not the hero.",
    risk: "Not the hero: 'network learns routes' is the wrong first impression / overclaim risk. Keep as a later compounding-proof beat.",
  },
];

export default function MotionLab() {
  const [speed, setSpeed] = useState(0.6);
  const [loop, setLoop] = useState(true);
  const [heroVar, setHeroVar] = useState<Variant>(1); // triage stream reads best in wide hero geometry
  const speedRef = useRef(0.6);
  const loopRef = useRef(true);

  // one shared clock + one shared retrieval schedule for ALL panels
  const clockRef = useRef(0);
  const qStartRef = useRef(-1);
  const runSeedRef = useRef(0);
  const replayRef = useRef(false);
  const runCounterRef = useRef(0);
  const nextRunAtRef = useRef(0.5); // first run shortly after mount

  useEffect(() => {
    let raf = 0, last = performance.now();
    const { END, GAP } = TIMELINE;
    const startRun = (clock: number) => {
      runCounterRef.current += 1;
      runSeedRef.current = (Math.imul(runCounterRef.current, 2654435761) ^ FIELD_SEED) >>> 0 || 1;
      qStartRef.current = clock;
      nextRunAtRef.current = clock + END + GAP;
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      let dt = (now - last) / 1000; last = now;
      dt = Math.min(0.05, dt) * speedRef.current;
      clockRef.current += dt;
      const clock = clockRef.current;
      if (replayRef.current) { replayRef.current = false; startRun(clock); return; }
      const active = qStartRef.current >= 0 && clock - qStartRef.current < END;
      if (!active) {
        const firstEver = qStartRef.current < 0;
        if ((firstEver || loopRef.current) && clock >= nextRunAtRef.current) startRun(clock);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fieldProps = { fieldSeed: FIELD_SEED, clockRef, qStartRef, runSeedRef };

  return (
    <main style={{ minHeight: "100vh", background: "var(--canvas)", color: "var(--ink)", padding: "32px clamp(16px,4vw,56px) 96px" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", margin: 0 }}>
          Motion lab — recall metaphors (no sphere)
        </h1>
        <p style={{ color: "var(--ink-subtle)", fontSize: 14, margin: "6px 0 0", maxWidth: 760 }}>
          Three non-particle ways to show &ldquo;recall the right things&rdquo;: triage a stream, sort by
          relevance, or strengthen recall paths with use. All panels share one clock and one query schedule.
          Replay fires a new (shared) run; drag Speed left for slow-motion. The Hero Preview shows the
          candidate in production geometry.
        </p>
      </header>

      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20,
        padding: "12px 16px", marginBottom: 24,
        background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 12,
      }}>
        <button
          onClick={() => { replayRef.current = true; }}
          style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "var(--accent)", color: "var(--accent-ink)", border: "none" }}
        >
          Replay all
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--ink-muted)" }}>
          <span style={{ minWidth: 64 }}>Speed {speed.toFixed(2)}×</span>
          <input type="range" min={0.15} max={1} step={0.05} value={speed}
            onChange={(e) => { const v = +e.target.value; setSpeed(v); speedRef.current = v; }}
            style={{ width: 180, accentColor: "var(--ink)" }} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-muted)", cursor: "pointer" }}>
          <input type="checkbox" checked={loop}
            onChange={(e) => { setLoop(e.target.checked); loopRef.current = e.target.checked; }}
            style={{ accentColor: "var(--ink)" }} />
          Loop
        </label>
        <span style={{ fontSize: 12, color: "var(--ink-faint)" }}>
          {loop ? "Auto-repeats while you watch" : "Single-shot — press Replay"}
        </span>
      </div>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {VARIANTS.map((v) => (
          <section key={v.id} style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: "radial-gradient(120% 120% at 50% 42%, var(--surface-1), var(--canvas) 70%)" }}>
              <MotionLabField variant={v.id} {...fieldProps} />
            </div>
            <div style={{ padding: "14px 16px 18px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--ink-faint)", fontVariantNumeric: "tabular-nums" }}>0{v.id}</span>
                <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{v.name}</h2>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "8px 0 0", lineHeight: 1.5 }}>{v.desc}</p>
              <p style={{ fontSize: 12, color: "var(--ink-subtle)", margin: "8px 0 0" }}>{v.risk}</p>
            </div>
          </section>
        ))}
      </div>

      {/* Hero Preview — the candidate (Field-Bound) in production geometry: offset
          sphere, copy on the left, scrim. Judge the motion in context before porting. */}
      <section style={{ marginTop: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Hero Preview</h2>
          <span style={{ fontSize: 12, color: "var(--ink-subtle)" }}>in production layout — offset sphere + copy</span>
          <div style={{ display: "inline-flex", gap: 4, marginLeft: "auto" }}>
            {VARIANTS.map((v) => (
              <button key={v.id} onClick={() => setHeroVar(v.id)}
                style={{
                  padding: "5px 10px", borderRadius: 7, fontSize: 12, cursor: "pointer",
                  border: "1px solid var(--border)",
                  background: heroVar === v.id ? "var(--accent)" : "transparent",
                  color: heroVar === v.id ? "var(--accent-ink)" : "var(--ink-muted)",
                }}>
                {v.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 7", minHeight: 360, borderRadius: 16, overflow: "hidden", background: "var(--canvas)", border: "1px solid var(--border)" }}>
          <MotionLabField key={heroVar} variant={heroVar} layout="hero" {...fieldProps} />
          {/* left scrim so copy stays legible over the field, like production */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, var(--canvas) 18%, rgba(8,9,10,0.6) 42%, transparent 62%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: "clamp(24px,5vw,64px)", top: "50%", transform: "translateY(-50%)", maxWidth: 440, pointerEvents: "none" }}>
            <h3 style={{ fontSize: "clamp(28px,3.4vw,44px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.05, margin: 0, color: "var(--ink)" }}>
              Memory your agents can actually retrieve.
            </h3>
            <p style={{ fontSize: 16, color: "var(--ink-muted)", margin: "16px 0 0", lineHeight: 1.5 }}>
              Rift remembers what you and your agents do across tools, and serves the right context back — to any MCP agent that asks.
            </p>
            <div style={{ marginTop: 24, display: "inline-flex", padding: "10px 18px", borderRadius: 9, background: "var(--accent)", color: "var(--accent-ink)", fontSize: 14, fontWeight: 600 }}>
              Get the beta
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
