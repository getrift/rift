"use client";

import { useEffect, useRef, useState } from "react";
import { ProviderMark, type MarkId } from "../provider-icons";

/* Hero = premium CLAIM film, not a UI demo. Open on the AI being confidently
   wrong → the human correction (held, zoomed) → the markdown scramble → Rift's
   claims with small precise motion → Open Beta. Distinct tool chrome (Claude
   Code TUI / Cursor editor / Codex CLI), asymmetric, slower. Three variants.
   Ship: screen-record the stage → mp4/webm (<2MB); poster = the Open Beta frame;
   reduced-motion freezes there. */

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const ink = "var(--ink)";
const sub = "var(--ink-subtle)";
const faint = "var(--ink-faint)";
const muted = "var(--ink-muted)";
const border = "var(--border)";
const ORANGE = "#d97757";
const BLUE = "#8aa0ff";
const RED = "#f08a82";
const GREEN = "#7fd1c0";

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ss = (x: number) => {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
};
const env = (t: number, a: number, b: number, f = 0.4) => ss(Math.min((t - a) / f, (b - t) / f));
const lp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const typed = (full: string, p: number) => full.slice(0, Math.round(full.length * clamp01(p)));

const MD_FILES = ["AGENTS.md", "DECISIONS.md", "stripe-notes.md", "handoff.md", "context.md", "meeting-notes.md", "scratchpad.md", "rate-limits.md", "auth-notes.md", "checkout.md"];
const PACK = [
  { dec: "Rate limit = token bucket · 100/min", tool: "cursor" as const, date: "May 3", n: "4×" },
  { dec: "Baptiste is CEO", tool: "claude" as const, date: "Apr 28", n: "7×" },
  { dec: "Webhooks over polling for Stripe", tool: "codex" as const, date: "Apr 12", n: "6×" },
];
const TOOLS: Record<string, { name: string; accent: string; mark: MarkId }> = {
  claude: { name: "Claude Code", accent: ORANGE, mark: "claude" },
  cursor: { name: "Cursor", accent: "#cfd3da", mark: "cursor" },
  codex: { name: "Codex CLI", accent: BLUE, mark: "chatgpt" },
};

// ---- shared atoms ----
function Caret({ blink, c = BLUE }: { blink: number; c?: string }) {
  return <span style={{ display: "inline-block", width: 7, height: 14, background: c, opacity: blink, marginLeft: 1, verticalAlign: "-2px" }} />;
}
function Block({ blink, c = "#cfd3da" }: { blink: number; c?: string }) {
  return <span style={{ display: "inline-block", width: 8, height: 15, background: c, opacity: blink, verticalAlign: "-2px" }} />;
}
function Layer({ a, z, children }: { a: number; z?: number; children: React.ReactNode }) {
  if (a < 0.004) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: a, pointerEvents: "none", zIndex: z }}>{children}</div>;
}
const box = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...s });

// ---- distinct surface: Claude Code TUI (terminal-agent) ----
function ClaudeFrame({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ borderRadius: 10, border: `1px solid rgba(217,119,87,0.3)`, background: "#0c0a09", fontFamily: mono, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderBottom: `1px solid rgba(217,119,87,0.18)` }}>
        <span style={{ color: ORANGE }}>✻</span>
        <span style={{ fontSize: 11.5, color: "#e7c9bb", fontWeight: 600 }}>Claude Code</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: faint }}>opus-4.8 · ~/checkout-service</span>
      </div>
      <div style={{ padding: "12px 14px", fontSize: 12.5, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}
// ---- distinct surface: Codex CLI (plain terminal) ----
function CodexFrame({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ borderRadius: 9, border: `1px solid ${border}`, background: "#08090c", fontFamily: mono, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", ...style }}>
      <div style={{ padding: "7px 12px", borderBottom: `1px solid ${border}`, fontSize: 11, color: faint }}>
        <span style={{ color: BLUE }}>codex</span> · session #412
      </div>
      <div style={{ padding: "12px 14px", fontSize: 12.5, lineHeight: 1.7, color: muted }}>{children}</div>
    </div>
  );
}

// ---- distinct surface: Cursor editor (3-pane) ----
function CursorEditor({ tree, code, chat, tab = "checkout.ts", style }: { tree: React.ReactNode; code: React.ReactNode; chat: React.ReactNode; tab?: string; style?: React.CSSProperties }) {
  return (
    <div style={{ borderRadius: 9, border: `1px solid ${border}`, background: "#0b0c0e", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#101113", borderBottom: `1px solid ${border}`, fontSize: 11 }}>
        <span style={{ padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6, color: sub }}>
          <span style={{ color: "#cfd3da", display: "inline-flex" }}>
            <ProviderMark id="cursor" size={11} />
          </span>
          Cursor
        </span>
        <span style={{ padding: "7px 12px", background: "#0b0c0e", color: muted, borderLeft: `1px solid ${border}`, borderRight: `1px solid ${border}`, fontFamily: mono }}>{tab}</span>
        <span style={{ padding: "7px 10px", color: faint, fontFamily: mono }}>rate-limits.md</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 240px", minHeight: 150 }}>
        <div style={{ borderRight: `1px solid ${border}`, padding: "8px 6px", fontFamily: mono, fontSize: 10.5 }}>{tree}</div>
        <div style={{ padding: "9px 11px", fontFamily: mono, fontSize: 11.5, lineHeight: 1.7 }}>{code}</div>
        <div style={{ borderLeft: `1px solid ${border}`, padding: "9px 10px", background: "rgba(255,255,255,0.012)" }}>{chat}</div>
      </div>
    </div>
  );
}
function MdTree({ hi, pick, wrong }: { hi: number; pick: number; wrong: boolean }) {
  return (
    <>
      <div style={{ color: faint, marginBottom: 4 }}>▾ docs</div>
      {MD_FILES.map((f, i) => {
        const isHi = i === hi && pick < 0;
        const isPick = i === pick;
        const bg = isPick ? (wrong ? "rgba(240,138,130,0.16)" : "rgba(127,209,192,0.16)") : isHi ? "rgba(138,160,255,0.13)" : "transparent";
        const col = isPick ? (wrong ? RED : GREEN) : isHi ? "#cfd6ff" : sub;
        return (
          <div key={i} style={{ padding: "1px 5px", marginLeft: 6, borderRadius: 4, background: bg, color: col, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {f}
          </div>
        );
      })}
    </>
  );
}
function Chat({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{children}</div>;
}
function ChatMsg({ who, children, tone, accent }: { who: string; children: React.ReactNode; tone?: "no"; accent?: string }) {
  return (
    <div>
      <div style={{ fontFamily: mono, fontSize: 8.5, color: faint, marginBottom: 2 }}>{who}</div>
      <div style={{ fontSize: 11, lineHeight: 1.4, color: tone === "no" ? RED : muted, borderRadius: 7, padding: "6px 9px", background: tone === "no" ? "rgba(240,138,130,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${tone === "no" ? "rgba(240,138,130,0.3)" : border}`, borderLeft: accent ? `2px solid ${accent}` : undefined }}>
        {children}
      </div>
    </div>
  );
}
function AtChip({ children }: { children: React.ReactNode }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 6px", borderRadius: 5, background: "rgba(138,160,255,0.12)", border: `1px solid ${BLUE}44`, color: "#cfd6ff", fontFamily: mono, fontSize: 10 }}>@{children}</span>;
}

// ---- Rift pack (source-backed) ----
function RiftPack({ count, p }: { count: number; p?: number }) {
  return (
    <div style={{ borderRadius: 9, border: `1px solid ${BLUE}66`, background: "linear-gradient(180deg, rgba(138,160,255,0.06), rgba(13,15,18,0.4))", boxShadow: "0 0 28px rgba(138,160,255,0.16)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 11px", borderBottom: `1px solid ${border}` }}>
        <span style={{ width: 6, height: 6, borderRadius: 2, background: BLUE, boxShadow: `0 0 8px ${BLUE}` }} />
        <span style={{ fontSize: 11.5, fontWeight: 700, color: ink }}>Rift · context</span>
        <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 9.5, color: sub }}>{count} sources</span>
      </div>
      {PACK.slice(0, count).map((d, i) => {
        const T = TOOLS[d.tool];
        return (
          <div key={i} style={{ padding: "6px 11px", borderTop: i ? `1px solid ${border}` : undefined, opacity: p == null ? 1 : ss((p - i * 0.14) / 0.3) }}>
            <div style={{ fontSize: 11.5, color: ink, fontWeight: 600 }}>{d.dec}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, fontFamily: mono, fontSize: 9.5, color: sub }}>
              <span style={{ color: T.accent, display: "inline-flex" }}>
                <ProviderMark id={T.mark} size={10} />
              </span>
              {T.name} · {d.date}
              <span style={{ marginLeft: "auto", color: faint }}>used {d.n}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- claim typography + small detail viz ----
function DetailViz({ kind, p }: { kind: string; p: number }) {
  if (kind === "capture") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {(["claude", "cursor", "codex"] as const).map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, opacity: ss((p - i * 0.12) / 0.3) }}>
            <span style={{ color: TOOLS[k].accent, display: "inline-flex" }}>
              <ProviderMark id={TOOLS[k].mark} size={15} />
            </span>
            <span style={{ width: 22, height: 1, background: `linear-gradient(90deg, ${TOOLS[k].accent}, ${BLUE})` }} />
            <span style={{ width: 7, height: 7, borderRadius: 2, background: BLUE, boxShadow: `0 0 8px ${BLUE}` }} />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "local") {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: "rgba(255,255,255,0.02)" }}>
        <span style={{ fontSize: 22 }}>􀪬</span>
        <div>
          <div style={{ fontSize: 12, color: ink, fontWeight: 600 }}>Your Mac</div>
          <div style={{ fontFamily: mono, fontSize: 9.5, color: GREEN }}>● memory stored locally</div>
        </div>
      </div>
    );
  }
  if (kind === "privacy") {
    return (
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, border: `1px solid ${border}`, borderRadius: 10, overflow: "hidden", width: 360 }}>
        <div style={{ flex: 1, padding: "10px 12px", background: "rgba(127,209,192,0.05)" }}>
          <div style={{ fontFamily: mono, fontSize: 9.5, color: GREEN, marginBottom: 5 }}>YOUR MAC · stays</div>
          {["“we use token bucket…”", "“Baptiste is CEO”", "handoff.md"].map((c, i) => (
            <div key={i} style={{ fontSize: 10, color: muted, padding: "1.5px 0", opacity: ss(p / 0.5) }}>
              {c}
            </div>
          ))}
        </div>
        <div style={{ width: 0, borderLeft: `1px dashed ${BLUE}77` }} />
        <div style={{ flex: 1, padding: "10px 12px" }}>
          <div style={{ fontFamily: mono, fontSize: 9.5, color: BLUE, marginBottom: 5 }}>CLOUD · only fingerprints</div>
          {["0x9f3a…", "0xb217…", "0xe40c…"].map((c, i) => (
            <div key={i} style={{ fontFamily: mono, fontSize: 10, color: BLUE, padding: "1.5px 0", opacity: ss((p - 0.3 - i * 0.12) / 0.3), transform: `translateX(${(1 - ss((p - 0.3 - i * 0.12) / 0.3)) * -16}px)` }}>
              → {c}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "connect") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 9, border: `1px solid ${BLUE}66`, background: "rgba(138,160,255,0.06)", fontSize: 12, fontWeight: 700, color: ink }}>
          <span style={{ width: 6, height: 6, borderRadius: 2, background: BLUE, boxShadow: `0 0 8px ${BLUE}` }} />
          Rift
        </span>
        <span style={{ width: 26, height: 1, background: `linear-gradient(90deg, ${BLUE}, transparent)` }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(["claude", "cursor", "codex"] as const).map((k, i) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: muted, opacity: ss((p - i * 0.14) / 0.3) }}>
              <span style={{ color: TOOLS[k].accent, display: "inline-flex" }}>
                <ProviderMark id={TOOLS[k].mark} size={13} />
              </span>
              {TOOLS[k].name}
            </span>
          ))}
        </div>
      </div>
    );
  }
  // pack
  return <RiftPack count={3} p={p} />;
}
function Claim({ big, sub: subline, kind, p, left = "9%", top = "30%" }: { big: string; sub?: string; kind: string; p: number; left?: string; top?: string }) {
  return (
    <div style={box({ left, top, right: "8%" })}>
      <div style={{ fontSize: "clamp(26px,3.6vw,46px)", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.05, color: ink, maxWidth: 720 }}>{big}</div>
      {subline && <div style={{ fontSize: "clamp(13px,1.5vw,18px)", color: sub, marginTop: 10 }}>{subline}</div>}
      <div style={{ marginTop: 22, opacity: ss((p - 0.15) / 0.4) }}>
        <DetailViz kind={kind} p={clamp01((p - 0.2) / 0.6)} />
      </div>
    </div>
  );
}

// ---- frustration beat: confident-wrong (tool) → the human "No." lands BIG ----
function Frustration({ t, a, tool, action, correction, blink }: { t: number; a: number; tool: keyof typeof TOOLS; action: string; correction: string; blink: number }) {
  const wrongP = lp(t, a + 0.2, a + 1.0);
  const corrIn = lp(t, a + 1.3, a + 2.3); // correction lands after a beat, then holds
  const dim = 1 - ss(lp(t, a + 1.2, a + 2.2)) * 0.5; // tool recedes as the correction takes over
  const zoom = 1 + ss(lp(t, a + 1.1, a + 2.4)) * 0.06;
  const cix = correction.search(/[.—]/);
  const leadLen = cix >= 0 ? cix + 1 : 3;
  const rev = typed(correction, corrIn);

  const surface =
    tool === "claude" ? (
      <ClaudeFrame>
        <div>
          <span style={{ color: ORANGE }}>⏺</span> <span style={{ color: muted }}>{typed(action, wrongP)}</span>
          {wrongP >= 1 ? <span style={{ color: faint }}>{"   ✓ done"}</span> : <Caret blink={blink} c={ORANGE} />}
        </div>
        {wrongP >= 1 && <div style={{ color: faint, marginTop: 5 }}>⎿ Updated limiter.ts (+12 −3)</div>}
      </ClaudeFrame>
    ) : tool === "codex" ? (
      <CodexFrame>
        <div>
          <span style={{ color: BLUE }}>›</span> {typed(action, wrongP)}
          {wrongP >= 1 ? <span style={{ color: faint }}>{"   ✓"}</span> : <Caret blink={blink} />}
        </div>
        {wrongP >= 1 && <div style={{ color: faint, marginTop: 5 }}>patched webhooks.ts · 14 files changed</div>}
      </CodexFrame>
    ) : (
      <CursorEditor
        tab="baptiste-bio.md"
        tree={<MdTree hi={-1} pick={-1} wrong={false} />}
        code={
          <div style={{ color: muted }}>
            <div style={{ color: faint }}># About</div>
            <div>
              Baptiste — {wrongP > 0.5 ? <span style={{ color: RED }}>COO</span> : "…"}
            </div>
          </div>
        }
        chat={
          <Chat>
            <ChatMsg who="agent" accent={ORANGE}>
              {typed(action, wrongP)}
            </ChatMsg>
          </Chat>
        }
      />
    );

  return (
    <>
      <div style={box({ left: tool === "cursor" ? "11%" : "15%", right: tool === "cursor" ? "11%" : "15%", top: "11%", transform: `scale(${zoom})`, transformOrigin: "50% 0%", opacity: dim })}>{surface}</div>
      {corrIn > 0.01 && (
        <div style={box({ left: "9%", right: "9%", bottom: "16%" })}>
          <div style={{ fontSize: "clamp(23px,3.2vw,44px)", fontWeight: 600, letterSpacing: "-0.022em", lineHeight: 1.08, color: ink, textShadow: "0 2px 30px rgba(8,9,10,0.9)" }}>
            <span style={{ color: RED }}>{rev.slice(0, leadLen)}</span>
            {rev.slice(leadLen)}
            {corrIn < 1 && <Caret blink={blink} c={RED} />}
          </div>
          <div style={{ fontFamily: mono, fontSize: 11, color: faint, marginTop: 9 }}>— you, correcting the agent. again.</div>
        </div>
      )}
    </>
  );
}

// ============ variants ============
const VARIANTS = [
  { id: 1, name: "The Frustration Cut", dur: 19.5, beats: ["Confidently wrong", "The markdown tax", "Rift enters", "Open Beta"], hero: true },
  { id: 2, name: "The Claims Film", dur: 16.5, beats: ["The shift", "The tax", "The claims", "Open Beta"], hero: true },
  { id: 3, name: "The Founder ICP Cut", dur: 18.5, beats: ["Building everywhere", "Wrong facts", "Rift remembers", "Open Beta"], hero: false },
] as const;
function beatName(v: (typeof VARIANTS)[number], t: number) {
  const q = t / v.dur;
  const i = q < 0.42 ? 0 : q < 0.66 ? 1 : q < 0.92 ? 2 : 3;
  return `0${v.id} · ${v.beats[i]}`;
}

function OpenBeta({ t, a, dur }: { t: number; a: number; dur: number }) {
  const line = env(t, a, a + 2.6, 0.5);
  const cta = ss(lp(t, a + 1.8, a + 3.0));
  return (
    <Layer a={env(t, a, dur + 1, 0.5)} z={5}>
      <div style={box({ left: 0, right: 0, top: "34%", textAlign: "center" })}>
        <div style={{ fontSize: "clamp(20px,2.7vw,38px)", fontWeight: 600, letterSpacing: "-0.025em", color: ink, opacity: line, transform: `translateY(${(1 - line) * 10}px)` }}>
          Every agent gets the context you already created.
        </div>
        <div style={{ marginTop: 30, opacity: cta, transform: `translateY(${(1 - cta) * 10}px)` }}>
          <div style={{ fontSize: "clamp(26px,3.4vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", color: ink }}>Rift</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14 }}>
            <span style={{ padding: "9px 18px", borderRadius: 9, background: "var(--accent)", color: "var(--accent-ink)", fontSize: 14, fontWeight: 600 }}>Get the beta</span>
            <span style={{ fontFamily: mono, fontSize: 12, color: BLUE }}>· Open Beta</span>
          </div>
        </div>
      </div>
    </Layer>
  );
}

function MarkdownTax({ t, a, blink }: { t: number; a: number; blink: number }) {
  const scan = Math.min(MD_FILES.length - 1, Math.floor(lp(t, a + 1.2, a + 3.0) * MD_FILES.length));
  const pickStale = t > a + 3.1;
  return (
    <Layer a={env(t, a, a + 4.4, 0.4)}>
      <div style={box({ left: "7%", right: "7%", top: "17%", transform: `scale(${1 + ss(lp(t, a + 2.8, a + 4)) * 0.05})`, transformOrigin: "40% 50%" })}>
        <CursorEditor
          tab="checkout.ts"
          tree={<MdTree hi={scan} pick={pickStale ? 2 : -1} wrong={pickStale} />}
          code={
            <div style={{ color: muted }}>
              <div style={{ color: faint }}>{"// fixing it by hand…"}</div>
              <div style={{ marginTop: 8 }}>
                drag <span style={{ color: BLUE }}>handoff.md</span> → chat
              </div>
            </div>
          }
          chat={
            <Chat>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center", fontSize: 11, color: muted }}>
                <AtChip>decisions.md</AtChip> <AtChip>stripe-notes.md</AtChip>
                {t < a + 2.2 && <Block blink={blink} />}
              </div>
              {t > a + 3.0 && (
                <ChatMsg who="agent" accent={RED}>
                  scanned 10 files · using <b style={{ color: RED }}>stripe-notes.md</b> (3 wks old)
                </ChatMsg>
              )}
            </Chat>
          }
        />
      </div>
      <div style={box({ left: "7%", bottom: "12%", fontFamily: mono, fontSize: 12, color: sub })}>still the stale one.</div>
    </Layer>
  );
}

// ---- 01 The Frustration Cut ----
function V1(t: number, blink: number) {
  return (
    <>
      <Layer a={env(t, 0, 3.0, 0.4)}>
        <Frustration t={t} a={0.2} tool="claude" action="Done — implemented fixed-window rate limiting." correction="No. We always use token bucket — decided in Cursor last week." blink={blink} />
      </Layer>
      <Layer a={env(t, 2.9, 5.7, 0.4)}>
        <Frustration t={t} a={3.1} tool="cursor" action="I used the COO bio for Baptiste." correction="No — Baptiste is CEO, not COO." blink={blink} />
      </Layer>
      <Layer a={env(t, 5.6, 8.4, 0.4)}>
        <Frustration t={t} a={5.8} tool="codex" action="Added polling for Stripe events." correction="No. We killed polling last month — use webhooks." blink={blink} />
      </Layer>
      <MarkdownTax t={t} a={8.4} blink={blink} />
      {/* Rift enters — claims */}
      <Layer a={env(t, 13.0, 14.9, 0.4)}>
        <Claim big="Rift auto-captures your agent work." kind="capture" p={lp(t, 13.1, 14.6)} top="32%" />
      </Layer>
      <Layer a={env(t, 14.8, 16.8, 0.4)}>
        <Claim big="Only meaning fingerprints leave your Mac." sub="Your conversations stay local." kind="privacy" p={lp(t, 14.9, 16.5)} top="22%" />
      </Layer>
      <Layer a={env(t, 16.7, 18.6, 0.4)}>
        <Claim big="The right context — in Claude Code, Cursor & Codex." kind="connect" p={lp(t, 16.8, 18.3)} top="26%" />
      </Layer>
      <OpenBeta t={t} a={18.5} dur={19.5} />
    </>
  );
}

// ---- 02 The Claims Film (typography-led) ----
function V2(t: number) {
  const claims: { big: string; sub?: string; kind: string; a: number }[] = [
    { big: "AI writes more of your work every week.", kind: "capture", a: 0.2 },
    { big: "But it forgets every decision you made.", kind: "pack", a: 2.4 },
    { big: "So you patch it with markdown.", sub: "@decisions.md · handoff.md · stripe-notes.md", kind: "connect", a: 4.6 },
    { big: "Rift makes that memory automatic.", kind: "capture", a: 7.2 },
    { big: "Local on your Mac. Only fingerprints leave.", sub: "Your conversations stay local.", kind: "privacy", a: 9.4 },
    { big: "Every answer keeps its sources and dates.", kind: "pack", a: 12.0 },
  ];
  return (
    <>
      {claims.map((c, i) => (
        <Layer key={i} a={env(t, c.a, c.a + 2.3, 0.45)}>
          <Claim big={c.big} sub={c.sub} kind={c.kind} p={lp(t, c.a + 0.1, c.a + 1.8)} top={i % 2 ? "24%" : "34%"} left={i % 2 ? "12%" : "9%"} />
        </Layer>
      ))}
      <OpenBeta t={t} a={14.0} dur={16.5} />
    </>
  );
}

// ---- 03 The Founder ICP Cut ----
function V3(t: number, blink: number) {
  return (
    <>
      <Layer a={env(t, 0, 2.7, 0.4)}>
        <div style={box({ left: "6%", right: "30%", top: "15%" })}>
          <ClaudeFrame>
            <div style={{ color: faint }}>building checkout-service across three tools this week…</div>
            <div style={{ marginTop: 6 }}>
              <span style={{ color: ORANGE }}>⏺</span> {typed("continuing the billing work", lp(t, 0.3, 1.4))}
              {t < 1.9 && <Caret blink={blink} c={ORANGE} />}
            </div>
          </ClaudeFrame>
        </div>
        <div style={box({ left: "40%", right: "5%", top: "44%" })}>
          <CodexFrame>
            <span style={{ color: BLUE }}>›</span> {typed("codex resume #412", lp(t, 0.9, 1.8))}
            {t < 1.9 && <Caret blink={blink} />}
          </CodexFrame>
        </div>
      </Layer>
      <Layer a={env(t, 2.5, 5.5, 0.4)}>
        <Frustration t={t} a={2.7} tool="cursor" action="Set Baptiste as COO in the bio." correction="No — Baptiste is CEO. We've said this twice." blink={blink} />
      </Layer>
      <Layer a={env(t, 5.4, 8.4, 0.4)}>
        <Frustration t={t} a={5.6} tool="claude" action="Re-added the polling worker." correction="No. We killed polling last month — webhooks." blink={blink} />
      </Layer>
      <MarkdownTax t={t} a={8.4} blink={blink} />
      <Layer a={env(t, 13.0, 16.0, 0.4)}>
        <div style={box({ left: "18%", right: "18%", top: "19%" })}>
          <CursorEditor
            tab="agent · Rift"
            tree={<MdTree hi={-1} pick={7} wrong={false} />}
            code={<div style={{ color: GREEN }}>✓ recovered the real decisions</div>}
            chat={<RiftPack count={3} p={lp(t, 13.4, 15.2)} />}
          />
        </div>
      </Layer>
      <OpenBeta t={t} a={15.9} dur={18.5} />
    </>
  );
}

export default function HeroFilm() {
  const [variant, setVariant] = useState<1 | 2 | 3>(1);
  const [t, setT] = useState(0);
  const [speed, setSpeed] = useState(1);
  const speedRef = useRef(1);
  const clockRef = useRef(0);
  const v = VARIANTS[variant - 1];
  const posterT = v.dur - 1.0;

  useEffect(() => {
    clockRef.current = 0;
    setT(0);
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setT(posterT);
      return;
    }
    let raf = 0,
      last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000) * speedRef.current;
      last = now;
      clockRef.current = (clockRef.current + dt) % v.dur;
      setT(clockRef.current);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant, v.dur, posterT]);

  const blink = Math.floor(t * 2) % 2 ? 0.25 : 1;

  return (
    <main style={{ minHeight: "100vh", background: "var(--canvas)", color: ink, padding: "26px clamp(16px,4vw,56px) 60px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", maxWidth: 1160, margin: "0 auto 14px" }}>
        <h1 style={{ fontSize: 19, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>Hero film — claim film (slower, real tools)</h1>
        <div style={{ display: "inline-flex", gap: 5, marginLeft: "auto" }}>
          {VARIANTS.map((vr) => (
            <button key={vr.id} onClick={() => setVariant(vr.id as 1 | 2 | 3)} style={{ padding: "6px 11px", borderRadius: 8, fontSize: 12, cursor: "pointer", border: `1px solid ${border}`, background: variant === vr.id ? "var(--accent)" : "transparent", color: variant === vr.id ? "var(--accent-ink)" : muted }}>
              0{vr.id} · {vr.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", maxWidth: 1160, margin: "0 auto", aspectRatio: "16 / 9", borderRadius: 16, overflow: "hidden", border: `1px solid ${border}`, background: "radial-gradient(130% 130% at 50% 0%, #0e0f12, #08090a 80%)" }}>
        {variant === 1 ? V1(t, blink) : variant === 2 ? V2(t) : V3(t, blink)}
        <div style={{ position: "absolute", top: 14, left: 16, fontFamily: mono, fontSize: 10.5, color: faint, letterSpacing: "0.03em" }}>{beatName(v, t)}</div>
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 2, width: `${(t / v.dur) * 100}%`, background: `linear-gradient(90deg, ${BLUE}33, ${BLUE}b3)` }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", maxWidth: 1160, margin: "14px auto 0" }}>
        <button onClick={() => { clockRef.current = 0; setT(0); }} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", background: "var(--accent)", color: "var(--accent-ink)", border: "none" }}>
          Replay
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: muted }}>
          <span style={{ minWidth: 64 }}>Speed {speed.toFixed(2)}×</span>
          <input type="range" min={0.2} max={1} step={0.05} value={speed} onChange={(e) => { const x = +e.target.value; setSpeed(x); speedRef.current = x; }} style={{ width: 180, accentColor: "var(--ink)" }} />
        </label>
        <span style={{ fontFamily: mono, fontSize: 11, color: faint }}>t = {t.toFixed(1)}s / {v.dur}s · reduced-motion → Open Beta poster</span>
      </div>
    </main>
  );
}
