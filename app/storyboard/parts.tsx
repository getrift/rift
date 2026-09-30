import type { ReactNode, CSSProperties } from "react";
import { ProviderMark, type MarkId } from "../provider-icons";

/* Shared film/storyboard primitives — one source of truth for both the static
   storyboard and the animated /hero-film. */

export const C = {
  canvas: "var(--canvas)",
  surf: "var(--surface-1)",
  ink: "var(--ink)",
  bright: "var(--ink-bright)",
  muted: "var(--ink-muted)",
  subtle: "var(--ink-subtle)",
  faint: "var(--ink-faint)",
  border: "var(--border)",
  borderS: "var(--border-strong)",
};

export const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

export type Dec = { id: MarkId; app: string; date: string; text: string };
export const DECISIONS: Dec[] = [
  { id: "claude", app: "Claude Code", date: "Apr 12", text: "Webhooks over polling for Stripe" },
  { id: "cursor", app: "Cursor", date: "May 3", text: "Rate limit = token bucket, 100/min" },
  { id: "chatgpt", app: "ChatGPT", date: "Mar 28", text: "Auth: short-lived JWT + refresh" },
  { id: "copilot", app: "Copilot", date: "May 19", text: "Checkout needs idempotency keys" },
  { id: "gemini", app: "Gemini", date: "Apr 30", text: "Jobs: Postgres advisory locks" },
];
export const HOT = [0, 1, 3]; // the decisions a "rate limiting to checkout" query pulls

export function Src({ d, hot, style }: { d: Dec; hot?: boolean; style?: CSSProperties }) {
  return (
    <div
      style={{
        width: 168,
        padding: "7px 9px",
        borderRadius: 8,
        background: hot ? "rgba(247,248,248,0.06)" : "rgba(255,255,255,0.018)",
        border: `1px solid ${hot ? "rgba(247,248,248,0.28)" : C.border}`,
        boxShadow: hot ? "0 0 18px rgba(138,160,255,0.18)" : "none",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: hot ? C.bright : C.subtle }}>
        <ProviderMark id={d.id} size={12} />
        <span style={{ fontSize: 10.5, fontWeight: 600 }}>{d.app}</span>
        <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 9.5, color: C.faint }}>{d.date}</span>
      </div>
      <div style={{ fontSize: 11, color: hot ? C.ink : C.faint, marginTop: 4, lineHeight: 1.35 }}>{d.text}</div>
    </div>
  );
}

export function Pack({ n, style, label = "Context pack", glow = 1 }: { n: number; style?: CSSProperties; label?: string; glow?: number }) {
  return (
    <div style={{ position: "relative", width: 178, ...style }}>
      <div style={{ position: "absolute", inset: "6px -5px -6px 5px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}` }} />
      <div style={{ position: "absolute", inset: "3px -2px -3px 2px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}` }} />
      <div
        style={{
          position: "relative",
          borderRadius: 10,
          padding: "9px 11px",
          background: "linear-gradient(180deg, #14161a, #0d0f12)",
          border: "1px solid rgba(247,248,248,0.32)",
          boxShadow: `0 0 ${26 * glow}px rgba(138,160,255,${0.2 * glow})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: 2, background: "#8aa0ff", boxShadow: "0 0 8px #8aa0ff" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>{label}</span>
          <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 9.5, color: C.subtle }}>{n} decisions</span>
        </div>
        <div style={{ marginTop: 7, display: "flex", flexDirection: "column", gap: 4 }}>
          {HOT.slice(0, n).map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: C.muted }}>
              <ProviderMark id={DECISIONS[i].id} size={10} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{DECISIONS[i].text}</span>
              <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 8.5, color: C.faint }}>{DECISIONS[i].date}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 7, fontFamily: mono, fontSize: 9, color: C.faint }}>sources + dates kept</div>
      </div>
    </div>
  );
}

export function Composer({ text, attach, caret, style }: { text: string; attach?: ReactNode; caret?: boolean; style?: CSSProperties }) {
  return (
    <div style={{ width: "76%", borderRadius: 10, border: `1px solid ${C.borderS}`, background: "rgba(255,255,255,0.025)", padding: "10px 12px", ...style }}>
      <div style={{ fontSize: 12.5, color: text ? C.ink : C.faint }}>
        {text}
        {caret && <span style={{ display: "inline-block", width: 1.5, height: 13, background: "#8aa0ff", marginLeft: 2, verticalAlign: "-2px" }} />}
      </div>
      {attach && <div style={{ marginTop: 8 }}>{attach}</div>}
    </div>
  );
}

export function Bubble({ role, children, tone }: { role: "user" | "agent"; children: ReactNode; tone?: "no" }) {
  const agent = role === "agent";
  return (
    <div style={{ alignSelf: agent ? "flex-start" : "flex-end", maxWidth: "82%" }}>
      <div style={{ fontFamily: mono, fontSize: 9, color: C.faint, marginBottom: 3, textAlign: agent ? "left" : "right" }}>{agent ? "agent" : "you"}</div>
      <div
        style={{
          borderRadius: 9,
          padding: "8px 11px",
          fontSize: 12,
          lineHeight: 1.4,
          color: tone === "no" ? "#f0a8a8" : agent ? C.muted : C.ink,
          background: agent ? "rgba(255,255,255,0.03)" : "rgba(247,248,248,0.07)",
          border: `1px solid ${tone === "no" ? "rgba(240,168,168,0.35)" : C.border}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// faint compounding map (background language only — never the main event)
export function Map({ density, glow }: { density: number; glow: number }) {
  const seed = (i: number) => {
    const x = Math.sin(i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const r3 = (v: number) => Math.round(v * 1000) / 1000; // round off Math.sin ULP drift so SSR/client hydration matches
  const pts = Array.from({ length: density }, (_, i) => ({ x: r3(8 + seed(i) * 84), y: r3(12 + seed(i + 99) * 76) }));
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.5 + glow * 0.4 }}>
      {pts.map((p, i) =>
        i > 0 && i % 2 === 0 ? (
          <line key={"l" + i} x1={p.x} y1={p.y} x2={pts[i - 1].x} y2={pts[i - 1].y} stroke="#8aa0ff" strokeWidth={0.2 + glow * 0.5} opacity={0.18 + glow * 0.45} />
        ) : null
      )}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.6 + glow * 0.7} fill={i < density * glow ? "#dfe8ff" : "#7f8895"} opacity={0.5 + glow * 0.4} />
      ))}
    </svg>
  );
}
