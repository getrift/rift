import { C, mono, DECISIONS, HOT, Src, Pack, Composer, Bubble, Map } from "./parts";

/* Throwaway storyboard route — three hero-film concepts as static frames, to pick
   ONE to animate. Product-cinematic, not abstract. Delivery target for the winner:
   silent 8–12s loop, <2MB desktop, strong poster frame, reduced-motion = poster.
   Shared frame primitives live in ./parts (also used by /hero-film). */

// ---- storyboard-only layout ----
function Stage({ tc, cap, mo, children }: { tc: string; cap: string; mo: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          background: "radial-gradient(120% 120% at 50% 28%, #101113, #08090a 76%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset",
        }}
      >
        {children}
        <span style={{ position: "absolute", top: 8, left: 9, fontFamily: mono, fontSize: 10, color: C.faint, letterSpacing: "0.04em" }}>{tc}</span>
      </div>
      <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.45 }}>{cap}</div>
      <div style={{ fontFamily: mono, fontSize: 10.5, color: C.faint }}>▸ {mo}</div>
    </div>
  );
}

function Section({ n, name, premise, vo, children }: { n: string; name: string; premise: string; vo: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 44 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: mono, fontSize: 12, color: C.faint }}>{n}</span>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>{name}</h2>
        <span style={{ fontSize: 13, color: C.subtle }}>{premise}</span>
      </div>
      <div style={{ fontSize: 12.5, color: "#9bb0a8", margin: "8px 0 16px", fontStyle: "italic" }}>VO: {vo}</div>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(4, 1fr)" }}>{children}</div>
    </section>
  );
}

export default function Storyboard() {
  return (
    <main style={{ minHeight: "100vh", background: C.canvas, color: C.ink, padding: "32px clamp(16px,4vw,56px) 120px" }}>
      <header style={{ maxWidth: 880 }}>
        <h1 style={{ fontSize: 23, fontWeight: 600, letterSpacing: "-0.015em", margin: 0 }}>Hero film — three concepts</h1>
        <p style={{ color: C.subtle, fontSize: 14, margin: "8px 0 0", lineHeight: 1.55 }}>
          Storyboards to pick <strong style={{ color: C.muted }}>one</strong> to animate. Product-cinematic, not abstract vibes. Target for the winner: silent
          8–12s loop, &lt;2MB desktop, strong poster frame, reduced-motion falls back to the poster.
        </p>
        <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.border}`, background: C.surf, maxWidth: 880 }}>
          <div style={{ fontFamily: mono, fontSize: 10.5, color: C.faint, marginBottom: 6 }}>VO SPINE (ElevenLabs) — threads through whichever concept wins</div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
            “So much work happens.” → “But so little is captured.” → “Rift does that.” → “And it gets better every day.” →{" "}
            <span style={{ color: C.ink }}>“So you never have to do it again.”</span>{" "}
            <span style={{ color: C.faint }}>(closes on real shots: pasting CONTEXT.md, “no, we decided…”, re-explaining)</span>
          </div>
        </div>
      </header>

      {/* ============ CONCEPT A ============ */}
      <Section n="A" name="Context Pack Film" premise="many in → the right few → compact pack → agent continues. (your lead)" vo="“So much work happens.” … “Rift does that.” … “never re-explain again.”">
        <Stage tc="00:00" cap="Months of AI work — scattered across every tool." mo="Cards drift in with depth/parallax, settle into a quiet field.">
          {DECISIONS.map((d, i) => (
            <Src
              key={i}
              d={d}
              style={{
                position: "absolute",
                left: `${[6, 40, 12, 52, 30][i]}%`,
                top: `${[16, 12, 56, 50, 33][i]}%`,
                transform: `scale(${[0.82, 0.92, 0.8, 0.88, 1][i]}) rotate(${[-4, 3, -2, 4, -1][i]}deg)`,
                opacity: [0.55, 0.7, 0.5, 0.65, 0.85][i],
              }}
            />
          ))}
        </Stage>

        <Stage tc="00:03" cap="A new request arrives — Rift recalls the prior decisions that matter." mo="Query types in; 3 relevant cards light + lift toward center.">
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 8%" }}>
            <Composer text="Add rate limiting to checkout." caret />
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 10, color: C.subtle }}>
              <span style={{ width: 5, height: 5, borderRadius: 2, background: "#8aa0ff", boxShadow: "0 0 8px #8aa0ff" }} />
              Rift · recalling prior decisions
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              {HOT.map((i) => (
                <Src key={i} d={DECISIONS[i]} hot style={{ width: 132 }} />
              ))}
            </div>
          </div>
        </Stage>

        <Stage tc="00:06" cap="The decisions compress into one clean context pack — sources and dates kept." mo="Cards fold/stack into the pack; count ticks 1→3; soft glow.">
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Pack n={3} />
          </div>
        </Stage>

        <Stage tc="00:09" cap="The pack docks into the agent — it continues with full context. (poster frame)" mo="Pack slides into the composer; agent emits a confident diff. Hold.">
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: "0 7%" }}>
            <Composer text="Add rate limiting to checkout." attach={<Pack n={3} style={{ width: 150 }} label="Context pack" />} />
            <Bubble role="agent">
              Using your token-bucket limit (100/min) with idempotency keys on checkout — here&apos;s the diff.
            </Bubble>
          </div>
        </Stage>
      </Section>

      {/* ============ CONCEPT B ============ */}
      <Section n="B" name="The Re-explaining Tax" premise="the pain, then the relief — leans into your VO close." vo="“But so little is captured.” … real shots of pasting context / “no, we decided…” … “never again.”">
        <Stage tc="00:00" cap="Today: you paste the context. Again." mo="An endless CONTEXT.md scrolls through the composer — never ends.">
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8%" }}>
            <div style={{ width: "82%", borderRadius: 10, border: `1px solid ${C.borderS}`, background: "rgba(255,255,255,0.02)", padding: "10px 12px", maxHeight: "78%", overflow: "hidden" }}>
              <div style={{ fontFamily: mono, fontSize: 9, color: C.faint, marginBottom: 5 }}>pasted · CONTEXT.md · 1,842 lines</div>
              <div style={{ fontFamily: mono, fontSize: 9.5, color: C.subtle, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                {`## Architecture
We use token-bucket rate limiting (100/min).
Checkout requires idempotency keys on every write.
Auth is short-lived JWT + refresh rotation.
Stripe via webhooks, not polling. Jobs use
Postgres advisory locks. Do NOT re-introduce
the polling worker we removed in March…`}
              </div>
            </div>
          </div>
        </Stage>

        <Stage tc="00:03" cap="Or the agent forgets — and you correct it, again." mo="Bubbles type in; the red “No” lands and holds a beat.">
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 9, padding: "0 9%" }}>
            <Bubble role="agent">I don&apos;t have context on your past decisions here.</Bubble>
            <Bubble role="user" tone="no">No — we decided token-bucket last month. And checkout needs idempotency keys.</Bubble>
          </div>
        </Stage>

        <Stage tc="00:06" cap="Rift quietly attaches the real decisions — no paste, no re-explaining." mo="The .md wall dissolves into a single Rift chip.">
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "0 8%" }}>
            <Composer
              text="Add rate limiting to checkout."
              attach={
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(247,248,248,0.3)", background: "rgba(247,248,248,0.05)", fontSize: 11, color: C.ink, boxShadow: "0 0 18px rgba(138,160,255,0.16)" }}>
                  <span style={{ width: 5, height: 5, borderRadius: 2, background: "#8aa0ff", boxShadow: "0 0 8px #8aa0ff" }} />
                  Rift attached 4 prior decisions
                  <span style={{ fontFamily: mono, fontSize: 9, color: C.subtle }}>· sources</span>
                </div>
              }
            />
          </div>
        </Stage>

        <Stage tc="00:09" cap="Never re-explain again. (poster frame)" mo="Everything clears to one line + a quiet pack chip.">
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ fontSize: "clamp(15px,2.4vw,26px)", fontWeight: 600, letterSpacing: "-0.02em", color: C.ink }}>Never re-explain again.</div>
            <Pack n={3} style={{ width: 150, transform: "scale(0.9)" }} />
          </div>
        </Stage>
      </Section>

      {/* ============ CONCEPT C ============ */}
      <Section n="C" name="Compounds Every Day" premise="memory that pays off over time — abstract map stays background only." vo="“And it gets better every day.”">
        <Stage tc="00:00" cap="Day 1 — Rift starts remembering, in the background." mo="A card peels off finished work and files itself into a sparse map.">
          <Map density={14} glow={0.12} />
          <div style={{ position: "absolute", left: "10%", top: "50%", transform: "translateY(-50%)" }}>
            <Src d={DECISIONS[1]} style={{ width: 150, opacity: 0.9 }} />
          </div>
          <div style={{ position: "absolute", right: "12%", top: "20%", fontFamily: mono, fontSize: 11, color: C.subtle }}>Day 1</div>
        </Stage>

        <Stage tc="00:03" cap="Day 7 — recall gets sharper; two sources, instantly." mo="Map densifies; a query pulls 2 cards as the web brightens.">
          <Map density={26} glow={0.4} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {[0, 1].map((k) => (
              <Src key={k} d={DECISIONS[HOT[k]]} hot style={{ width: 132 }} />
            ))}
          </div>
          <div style={{ position: "absolute", right: "12%", top: "16%", fontFamily: mono, fontSize: 11, color: C.subtle }}>Day 7</div>
        </Stage>

        <Stage tc="00:06" cap="Day 30 — instant, complete context on every ask." mo="Dense glowing map; a full pack resolves with no wait.">
          <Map density={40} glow={0.82} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Pack n={3} />
          </div>
          <div style={{ position: "absolute", right: "12%", top: "14%", fontFamily: mono, fontSize: 11, color: C.bright }}>Day 30</div>
        </Stage>

        <Stage tc="00:09" cap="Memory that compounds. (poster frame)" mo="Map glows to full; the line resolves and holds.">
          <Map density={44} glow={1} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: "clamp(15px,2.4vw,26px)", fontWeight: 600, letterSpacing: "-0.02em", color: C.ink, textShadow: "0 0 30px rgba(8,9,10,0.9)" }}>Memory that compounds.</div>
          </div>
        </Stage>
      </Section>
    </main>
  );
}
