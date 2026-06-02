"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SANS = "var(--font-sans)";
const MONO = "var(--font-mono)";
const SERIF = "var(--font-serif)";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ----------------------------- Claude Code ----------------------------- */

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2">
      <path d={d} />
    </svg>
  );
}

function ClaudeCodeSlide() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: 600,
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 250,
          flexShrink: 0,
          background: "#fafaf9",
          borderRight: "1px solid #f0efed",
          padding: "16px 12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 8px 18px",
          }}
        >
          <span style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: "#1a1a1a" }}>
            Claude Code
          </span>
          <span
            style={{
              fontFamily: SANS,
              fontSize: 9,
              color: "#8a8a8a",
              padding: "2px 6px",
              background: "#f0efed",
              borderRadius: 5,
            }}
          >
            Preview
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "9px 10px",
              background: "#efeeec",
              borderRadius: 8,
            }}
          >
            <span style={{ fontFamily: SANS, fontSize: 15, color: "#555" }}>+</span>
            <span style={{ fontFamily: SANS, fontSize: 14, color: "#1a1a1a" }}>New session</span>
          </div>
          {[
            { label: "Routines", d: "M13 2L4 14h6l-1 8 9-12h-6z" },
            { label: "Customize", d: "M3 7h18v13H3zM8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" },
            { label: "More", d: "M6 9l6 6 6-6" },
          ].map((it) => (
            <div key={it.label} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 10px" }}>
              <NavIcon d={it.d} />
              <span style={{ fontFamily: SANS, fontSize: 14, color: "#444" }}>{it.label}</span>
            </div>
          ))}
        </div>

        {/* Recents (flex-grow so footer pins) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 22, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px" }}>
            <span style={{ fontFamily: SANS, fontSize: 12, color: "#999" }}>Recents</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </div>
          {[
            { t: "rift-site · pricing page", sel: true },
            { t: "checkout-service · rate limiting", sel: false },
            { t: "api-gateway · auth refactor", sel: false },
            { t: "nightly digest cron", sel: false },
          ].map((r) => (
            <div
              key={r.t}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: r.sel ? "#efeeec" : "transparent",
                borderRadius: 8,
              }}
            >
              <div style={{ width: 6, height: 6, border: `1.4px solid ${r.sel ? "#999" : "#bbb"}`, borderRadius: "50%" }} />
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 13,
                  color: r.sel ? "#333" : "#666",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {r.t}
              </span>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
              padding: 10,
              borderTop: "1px solid #f0efed",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "#3a3a3a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: "#fff" }}>CR</span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 13, color: "#333" }}>Clément</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: "#aaa" }}>· Max</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, padding: "30px 40px 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ maxWidth: "70%", padding: "11px 16px", background: "#f3f2f0", borderRadius: 14 }}>
              <span style={{ fontFamily: SANS, fontSize: 15, color: "#1a1a1a", lineHeight: "22px" }}>
                What did we decide about pricing — and why did we kill the other option?
              </span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 13 }}>
            <span style={{ fontSize: 20, color: "#d97757", lineHeight: "24px", flexShrink: 0 }}>&#10043;</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 12px",
                  background: "#fafaf9",
                  border: "1px solid #ececea",
                  borderRadius: 8,
                  alignSelf: "flex-start",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <span style={{ fontFamily: SANS, fontSize: 12, color: "#555" }}>
                  Used{" "}
                  <span style={{ fontFamily: MONO, fontSize: 11, color: "#1a1a1a" }}>rift · rift_context_pack</span>
                </span>
                <span style={{ fontFamily: SANS, fontSize: 12, color: "#aaa" }}>3 results</span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 15, color: "#1a1a1a", lineHeight: "24px" }}>
                You locked a flat <strong style={{ fontWeight: 600 }}>€19/month</strong> at GA. Per-seat was on the
                table in March, but you killed it — it punished the exact teams you wanted adopting Rift, and made
                the &ldquo;own your memory&rdquo; pitch feel transactional.
              </span>
            </div>
          </div>
        </div>

        {/* Composer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", border: "1px solid #e6e6e4", borderRadius: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                <path d="M18 10a4 4 0 000-8 5 5 0 00-9 2 4 4 0 00-1 8z" />
              </svg>
              <span style={{ fontFamily: SANS, fontSize: 13, color: "#444" }}>Default</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", border: "1px solid #e6e6e4", borderRadius: 8 }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: "#999" }}>+</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: "#444" }}>Select repo…</span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              border: "1px solid #e2e2e0",
              borderRadius: 12,
            }}
          >
            <span style={{ fontFamily: SANS, fontSize: 14, color: "#aaa" }}>Describe a task or ask a question</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
              <path d="M9 10l-5 5 5 5M4 15h12a4 4 0 004-4V4" />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: "#666" }}>Accept edits</span>
              <span style={{ fontFamily: SANS, fontSize: 15, color: "#bbb" }}>+</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
                <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM5 11a7 7 0 0014 0M12 18v3" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: SANS, fontSize: 13, color: "#666" }}>Opus 4.8 · High</span>
              <div style={{ width: 13, height: 13, border: "1.5px solid #ccc", borderRadius: "50%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Cursor -------------------------------- */
/* VS Code "Dark+" token palette (Cursor's default theme) */
const KW = "#c586c0"; // control keywords (import/from/return/if)
const ST = "#569cd6"; // storage (export/const/async/function/await)
const TY = "#4ec9b0"; // types
const FN = "#dcdcaa"; // function calls
const STR = "#ce9178"; // strings
const VAR = "#9cdcfe"; // identifiers / properties
const CST = "#4fc1ff"; // constants
const CMT = "#6a9955"; // comments
const PL = "#d4d4d4"; // plain / punctuation

type Tok = [string, string];

const CHECKOUT_TS: Tok[][] = [
  [["import ", KW], ["{ PRICE_FLAT_EUR } ", VAR], ["from ", KW], ['"../config/pricing"', STR], [";", PL]],
  [["import ", KW], ["{ stripe } ", VAR], ["from ", KW], ['"../lib/stripe"', STR], [";", PL]],
  [["", PL]],
  [["export ", ST], ["async ", ST], ["function ", ST], ["checkout", FN], ["(", PL], ["req", VAR], [": ", PL], ["Request", TY], [") {", PL]],
  [["  const ", ST], ["session ", VAR], ["= ", PL], ["await ", ST], ["getSession", FN], ["(", PL], ["req", VAR], [");", PL]],
  [["  if ", KW], ["(!", PL], ["session", VAR], [") ", PL], ["return ", KW], ["unauthorized", FN], ["();", PL]],
  [["", PL]],
  [["  // flat €19/mo — per-seat was dropped (see PRICING.md)", CMT]],
  [["  const ", ST], ["intent ", VAR], ["= ", PL], ["await ", ST], ["stripe", VAR], [".", PL], ["paymentIntents", VAR], [".", PL], ["create", FN], ["({", PL]],
  [["    amount", VAR], [": ", PL], ["PRICE_FLAT_EUR", CST], [",", PL]],
  [["    currency", VAR], [": ", PL], ['"eur"', STR], [",", PL]],
  [["  });", PL]],
  [["", PL]],
  [["  return ", KW], ["json", FN], ["({ ", PL], ["secret", VAR], [": ", PL], ["intent", VAR], [".", PL], ["client_secret ", VAR], ["});", PL]],
  [["}", PL]],
];

function WinBtns() {
  return (
    <div style={{ display: "flex", gap: 13 }}>
      {[
        "M3 4h12v10H3zM3 7h12", // layout
        "M9 3v12M3 3h12v12H3z", // split
        "M12 3a3 3 0 11-6 0 3 3 0 016 0zM3 16a6 6 0 0112 0", // settings-ish
      ].map((d, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="#5a5a5c" strokeWidth="1.4">
          <path d={d} />
        </svg>
      ))}
    </div>
  );
}

function CursorSlide() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: 548, background: "#1e1e1e", borderRadius: 14, overflow: "hidden" }}>
      {/* Title bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 15px", background: "#181818", borderBottom: "1px solid #2a2a2a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Dots />
          <span style={{ fontFamily: SANS, fontSize: 12, color: "#8a8a8a", paddingLeft: 8 }}>checkout-service — Cursor</span>
        </div>
        <WinBtns />
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Activity bar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: 46, flexShrink: 0, padding: "16px 0", background: "#181818", borderRight: "1px solid #262626" }}>
          {[
            { d: "M4 4h6l2 2h8v11H4z", on: false },
            { d: "M11 4a7 7 0 105 12l4 4", on: false },
            { d: "M6 8v8M8 6h7a3 3 0 013 3v0a3 3 0 01-3 3H8", on: false },
            { d: "M21 15a2 2 0 01-2 2H8l-4 4V5a2 2 0 012-2h13a2 2 0 012 2z", on: true },
          ].map((it, i) => (
            <svg key={i} width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={it.on ? "#d4d4d4" : "#6a6a6a"} strokeWidth="1.7">
              <path d={it.d} />
            </svg>
          ))}
        </div>

        {/* Editor */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0, background: "#1e1e1e" }}>
          {/* Tab strip */}
          <div style={{ display: "flex", alignItems: "stretch", background: "#181818", borderBottom: "1px solid #262626" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", background: "#1e1e1e", borderRight: "1px solid #262626", borderTop: "1.5px solid #3a82f7" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "#e0a64f" }} />
              <span style={{ fontFamily: MONO, fontSize: 12, color: "#cfcfcf" }}>checkout.ts</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: "#6a6a6a" }}>×</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "#4a4a4a" }} />
              <span style={{ fontFamily: MONO, fontSize: 12, color: "#7a7a7a" }}>pricing.ts</span>
            </div>
          </div>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 18px", borderBottom: "1px solid #232323" }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#6a6a6a" }}>src</span>
            <span style={{ color: "#4a4a4a", fontSize: 11 }}>›</span>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#6a6a6a" }}>routes</span>
            <span style={{ color: "#4a4a4a", fontSize: 11 }}>›</span>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#9a9a9a" }}>checkout.ts</span>
          </div>
          {/* Code */}
          <div style={{ display: "flex", flexDirection: "column", padding: "14px 0", overflow: "hidden" }}>
            {CHECKOUT_TS.map((toks, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 18,
                  padding: "0 18px",
                  lineHeight: "21px",
                  background: i === 7 ? "rgba(255,255,255,0.035)" : "transparent",
                }}
              >
                <span style={{ width: 16, textAlign: "right", flexShrink: 0, fontFamily: MONO, fontSize: 12.5, color: "#5a5f6a", userSelect: "none" }}>
                  {i + 1}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 12.5, whiteSpace: "pre" }}>
                  {toks.map((t, j) => (
                    <span key={j} style={{ color: t[1] }}>
                      {t[0]}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <div style={{ display: "flex", flexDirection: "column", width: 408, flexShrink: 0, background: "#1c1c1c", borderLeft: "1px solid #2a2a2a" }}>
          {/* Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 16px", height: 41, borderBottom: "1px solid #2a2a2a" }}>
            <div style={{ display: "flex", alignItems: "center", height: "100%", borderBottom: "1.5px solid #d4d4d4" }}>
              <span style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 500, color: "#e4e4e4", letterSpacing: "0.03em" }}>CHAT</span>
            </div>
            <span style={{ fontFamily: SANS, fontSize: 12.5, color: "#6e6e6e", letterSpacing: "0.03em" }}>COMPOSER</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a5a5a" strokeWidth="2" style={{ marginLeft: "auto" }}>
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 15, padding: "16px 16px", flex: 1 }}>
            {/* User message */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 8px", background: "#262626", border: "1px solid #313131", borderRadius: 6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                </svg>
                <span style={{ fontFamily: MONO, fontSize: 10.5, color: "#9a9a9a" }}>checkout.ts</span>
                <span style={{ fontFamily: SANS, fontSize: 10.5, color: "#666" }}>Current file</span>
              </div>
              <div style={{ maxWidth: "92%", padding: "9px 13px", background: "#2b2b2b", borderRadius: 11 }}>
                <span style={{ fontFamily: SANS, fontSize: 13, color: "#e2e2e2", lineHeight: "19px" }}>
                  what did we decide about pricing, and why did we kill the other option?
                </span>
              </div>
            </div>

            {/* Tool call */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", background: "#161616", border: "1px solid #2a2a2a", borderRadius: 8 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7aa2f7" strokeWidth="2">
                <path d="M10 3H3v7h7zM21 3h-7v7h7zM21 14h-7v7h7zM10 14H3v7h7z" />
              </svg>
              <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#a9b1d6" }}>rift_context_pack</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: "#9ece6a", marginLeft: "auto" }}>3 hits</span>
            </div>

            {/* Answer */}
            <span style={{ fontFamily: SANS, fontSize: 13, color: "#d4d4d4", lineHeight: "20px" }}>
              Flat <span style={{ color: "#fff", fontWeight: 600 }}>€19/month</span> at GA. Per-seat was rejected in
              March — it punished the teams you wanted adopting Rift, and made the “own your memory” pitch feel
              transactional.
            </span>
          </div>

          {/* Composer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: "0 16px 16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, padding: "10px 12px", background: "#161616", border: "1px solid #2e2e2e", borderRadius: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 7px", background: "#242424", border: "1px solid #313131", borderRadius: 5 }}>
                  <span style={{ fontFamily: SANS, fontSize: 11, color: "#888" }}>@</span>
                  <span style={{ fontFamily: MONO, fontSize: 10.5, color: "#9a9a9a" }}>checkout.ts</span>
                </span>
              </div>
              <span style={{ fontFamily: SANS, fontSize: 12.5, color: "#5e5e5e" }}>Ask follow-up · ⌘L</span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: "#6e6e6e" }}>claude-opus-4.8</span>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span style={{ fontFamily: SANS, fontSize: 11, color: "#6e6e6e" }}>Agent</span>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 5, background: "#3a82f7" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Codex -------------------------------- */
/* The Codex desktop app — left nav · conversation · review diff */

function CodexNavItem({ d, label, badge, sel }: { d: string; label: string; badge?: string; sel?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 9px",
        borderRadius: 7,
        background: sel ? "#ececec" : "transparent",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={sel ? "#333" : "#888"} strokeWidth="1.8">
        <path d={d} />
      </svg>
      <span style={{ fontFamily: SANS, fontSize: 13, color: sel ? "#1a1a1a" : "#555" }}>{label}</span>
      {badge && (
        <span style={{ marginLeft: "auto", fontFamily: SANS, fontSize: 10, color: "#777", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "#e6e6e6", borderRadius: "50%" }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function DiffRow({ n, sign, code, kind }: { n: string; sign: string; code: string; kind: "ctx" | "add" | "del" }) {
  const bg = kind === "add" ? "#e6ffec" : kind === "del" ? "#ffebe9" : "transparent";
  const numBg = kind === "add" ? "#ccffd8" : kind === "del" ? "#ffd7d5" : "transparent";
  const signColor = kind === "add" ? "#1a7f37" : kind === "del" ? "#cf222e" : "#a0a0a0";
  const codeColor = kind === "ctx" ? "#57606a" : "#24292f";
  return (
    <div style={{ display: "flex", background: bg, lineHeight: "20px" }}>
      <span style={{ width: 30, flexShrink: 0, textAlign: "right", padding: "0 6px", fontFamily: MONO, fontSize: 11.5, color: "#8c959f", background: numBg, userSelect: "none" }}>
        {n}
      </span>
      <span style={{ width: 14, flexShrink: 0, textAlign: "center", fontFamily: MONO, fontSize: 11.5, color: signColor }}>{sign}</span>
      <span style={{ fontFamily: MONO, fontSize: 11.5, color: codeColor, whiteSpace: "pre" }}>{code}</span>
    </div>
  );
}

function CodexSlide() {
  return (
    <div style={{ display: "flex", width: "100%", height: 560, background: "#fff", borderRadius: 14, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", width: 224, flexShrink: 0, background: "#f8f8f8", borderRight: "1px solid #ededed", padding: "12px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 9px 14px" }}>
          <Dots />
        </div>
        <CodexNavItem d="M12 5v14M5 12h14" label="New task" />
        <CodexNavItem d="M11 4a7 7 0 105 12l4 4" label="Search" />
        <CodexNavItem d="M12 2v4M12 18v4M4 12h4M16 12h4M6 6l3 3M15 15l3 3" label="Automations" badge="1" />
        <CodexNavItem d="M5 4h14v6H5zM5 14h14v6H5z" label="Codex mobile" />

        <div style={{ padding: "16px 9px 7px" }}>
          <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.04em", color: "#9a9a9a" }}>TASKS</span>
        </div>
        {[
          { t: "checkout · flat pricing", sel: true },
          { t: "api-gateway · auth", sel: false },
          { t: "rift-site · hero copy", sel: false },
          { t: "digest · nightly cron", sel: false },
        ].map((r) => (
          <div key={r.t} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 9px", borderRadius: 7, background: r.sel ? "#ececec" : "transparent" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: r.sel ? "#10a37f" : "#c4c4c4" }} />
            <span style={{ fontFamily: SANS, fontSize: 12.5, color: r.sel ? "#222" : "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.t}</span>
          </div>
        ))}

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 9, padding: "9px", borderTop: "1px solid #ededed" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#10a37f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, color: "#fff" }}>CR</span>
          </div>
          <span style={{ fontFamily: SANS, fontSize: 12.5, color: "#333" }}>Clément</span>
          <span style={{ fontFamily: SANS, fontSize: 12.5, color: "#aaa" }}>· Plus</span>
        </div>
      </div>

      {/* Conversation */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <span style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 560, color: "#1a1a1a" }}>checkout · flat pricing</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto", padding: "2px 8px", background: "#f4f4f4", borderRadius: 6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M6 3v12M6 21a3 3 0 100-6 3 3 0 000 6zM18 9a3 3 0 100-6 3 3 0 000 6zM18 9c0 6-12 3-12 6" /></svg>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "#777" }}>pricing-flat</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "20px", flex: 1 }}>
          {/* User */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ maxWidth: "82%", padding: "9px 13px", background: "#f4f4f4", borderRadius: 12 }}>
              <span style={{ fontFamily: SANS, fontSize: 13.5, color: "#1a1a1a", lineHeight: "20px" }}>
                Switch checkout to the pricing we locked in — and remind me why we dropped per-seat.
              </span>
            </div>
          </div>

          {/* Tool call */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: "#fafafa", border: "1px solid #ececec", borderRadius: 8, alignSelf: "flex-start" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10a37f" strokeWidth="2">
              <path d="M10 3H3v7h7zM21 3h-7v7h7zM21 14h-7v7h7zM10 14H3v7h7z" />
            </svg>
            <span style={{ fontFamily: SANS, fontSize: 12, color: "#555" }}>
              Called <span style={{ fontFamily: MONO, fontSize: 11, color: "#1a1a1a" }}>rift · rift_context_pack</span>
            </span>
            <span style={{ fontFamily: SANS, fontSize: 12, color: "#aaa" }}>3 memories</span>
          </div>

          {/* Answer */}
          <span style={{ fontFamily: SANS, fontSize: 13.5, color: "#1a1a1a", lineHeight: "22px" }}>
            Flat <strong style={{ fontWeight: 600 }}>€19/month</strong> at GA. Per-seat was rejected on Mar 3 — it
            punished team adoption and undercut the “own your memory” pitch. Applying it to{" "}
            <span style={{ fontFamily: MONO, fontSize: 12.5, color: "#10a37f" }}>pricing.ts</span>:
          </span>

          {/* Edited file card */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", border: "1px solid #ececec", borderRadius: 9, alignSelf: "flex-start" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /></svg>
            <span style={{ fontFamily: MONO, fontSize: 12, color: "#222" }}>pricing.ts</span>
            <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#1a7f37" }}>+2</span>
            <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#cf222e" }}>−3</span>
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding: "0 20px 18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "12px 14px", border: "1px solid #e4e4e4", borderRadius: 12 }}>
            <span style={{ fontFamily: SANS, fontSize: 13, color: "#a0a0a0" }}>Ask for follow-up changes</span>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 9px", border: "1px solid #ededed", borderRadius: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e08a3c" }} />
                <span style={{ fontFamily: SANS, fontSize: 12, color: "#555" }}>Full access</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 9px", border: "1px solid #ededed", borderRadius: 7 }}>
                <span style={{ fontFamily: SANS, fontSize: 12, color: "#555" }}>GPT-5.5 · Extra High</span>
              </span>
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: 7, background: "#1a1a1a" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review / diff */}
      <div style={{ display: "flex", flexDirection: "column", width: 304, flexShrink: 0, background: "#fff", borderLeft: "1px solid #ededed" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.9"><path d="M9 11l3 3 8-8M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9" /></svg>
          <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 540, color: "#222" }}>Review</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#1a7f37" }}>+2</span>
            <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#cf222e" }}>−3</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderBottom: "1px solid #f4f4f4" }}>
          <span style={{ fontFamily: MONO, fontSize: 11, color: "#777" }}>main</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          <span style={{ fontFamily: MONO, fontSize: 11, color: "#10a37f" }}>pricing-flat</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 16px 8px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /></svg>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: "#333" }}>src/config/pricing.ts</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #f4f4f4" }}>
          <DiffRow n="1" sign="" code=" export const pricing = {" kind="ctx" />
          <DiffRow n="2" sign="−" code='   model: "per-seat",' kind="del" />
          <DiffRow n="3" sign="−" code="   eur: 7," kind="del" />
          <DiffRow n="4" sign="−" code="   minSeats: 3," kind="del" />
          <DiffRow n="2" sign="+" code='   model: "flat",' kind="add" />
          <DiffRow n="3" sign="+" code="   eur: 19," kind="add" />
          <DiffRow n="5" sign="" code=" };" kind="ctx" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Ghostty ------------------------------- */

function GhosttyTab({ label, kbd, active }: { label: string; kbd: string; active?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "0 14px",
        height: "100%",
        background: active ? "#16161e" : "transparent",
        borderRight: "1px solid #20202c",
        minWidth: 0,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 11, color: active ? "#9ece6a" : "#4a4a5a" }}>✳</span>
      <span style={{ fontFamily: MONO, fontSize: 11.5, color: active ? "#c0caf5" : "#6a6a7a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {label}
      </span>
      <span style={{ fontFamily: MONO, fontSize: 10.5, color: active ? "#565f89" : "#3a3a4a", flexShrink: 0 }}>{kbd}</span>
    </div>
  );
}

function GhosttyRow({ src, body, score }: { src: string; body: string; score: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <span style={{ flexShrink: 0, width: 150, fontFamily: MONO, fontSize: 12, color: "#7aa2f7" }}>{src}</span>
      <span style={{ flex: 1, fontFamily: MONO, fontSize: 12, color: "#a9b1d6" }}>{body}</span>
      <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 12, color: "#9ece6a" }}>{score}</span>
    </div>
  );
}

function GhosttySlide() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", background: "#16161e", borderRadius: 14, overflow: "hidden" }}>
      {/* Native tab bar */}
      <div style={{ display: "flex", alignItems: "center", height: 40, background: "#13131a", borderBottom: "1px solid #20202c" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "0 15px", borderRight: "1px solid #20202c", alignSelf: "stretch" }}>
          <Dots />
        </div>
        <div style={{ display: "flex", alignItems: "stretch", flex: 1, minWidth: 0, height: "100%" }}>
          <div style={{ display: "flex", maxWidth: 200, minWidth: 0 }}>
            <GhosttyTab label="rift · search" kbd="⌘1" active />
          </div>
          <div style={{ display: "flex", maxWidth: 210, minWidth: 0 }}>
            <GhosttyTab label="second-brain · claude" kbd="⌘2" />
          </div>
          <div style={{ display: "flex", maxWidth: 170, minWidth: 0 }}>
            <GhosttyTab label="primo · digest" kbd="⌘3" />
          </div>
          <div style={{ display: "flex", alignItems: "center", padding: "0 12px" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a4a5a" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          </div>
        </div>
      </div>

      {/* Terminal body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 22px" }}>
        <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
          <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 13, color: "#9ece6a" }}>~/rift ❯</span>
          <span style={{ fontFamily: MONO, fontSize: 13, color: "#c0caf5" }}>
            rift search <span style={{ color: "#e0af68" }}>&quot;why did we choose flat pricing&quot;</span>
          </span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 12, color: "#565f89" }}>3 results · 0.21s</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <GhosttyRow src="PRICING.md" body="Flat €19/mo · per-seat rejected" score="0.94" />
          <GhosttyRow src="claude · Mar 3" body="&quot;per-seat punishes team adoption&quot;" score="0.89" />
          <GhosttyRow src="codex · Mar 4" body="GTM thread · ownership pitch" score="0.82" />
        </div>
        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
          <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 13, color: "#9ece6a" }}>~/rift ❯</span>
          <div style={{ width: 8, height: 16, background: "#565f89" }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- shared -------------------------------- */

function Dots() {
  return (
    <div style={{ display: "flex", gap: 7 }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
      ))}
    </div>
  );
}

const TOOLS = ["Claude Code", "Cursor", "Codex", "Ghostty"] as const;

/* ------------------------------ Carousel ------------------------------- */

export default function ToolCarousel() {
  const [i, setI] = useState(0);
  const slides = [<ClaudeCodeSlide key="cc" />, <CursorSlide key="cu" />, <CodexSlide key="co" />, <GhosttySlide key="gh" />];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: "100%" }}>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: 5,
          background: "#f6f6f4",
          border: "1px solid #ececec",
          borderRadius: 9999,
        }}
      >
        {TOOLS.map((t, idx) => {
          const active = idx === i;
          return (
            <button
              key={t}
              onClick={() => setI(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 15px",
                background: active ? "#fff" : "transparent",
                border: active ? "1px solid #e6e6e6" : "1px solid transparent",
                borderRadius: 9999,
                cursor: "pointer",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
              }}
            >
              {idx === 0 && active && (
                <span style={{ width: 8, height: 8, background: "#d97757", transform: "rotate(45deg)", borderRadius: 1 }} />
              )}
              <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? "#171717" : "#8a8a8a" }}>
                {t}
              </span>
            </button>
          );
        })}
      </div>

      {/* Slide */}
      <div
        style={{
          width: "100%",
          maxWidth: 1000,
          border: "1px solid #e6e6e6",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 30px 70px -24px rgba(0,0,0,0.22), 0 10px 24px -10px rgba(0,0,0,0.08)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {slides[i]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <button
          onClick={() => setI((p) => (p - 1 + TOOLS.length) % TOOLS.length)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, border: "1px solid #e2e2e2", borderRadius: "50%", background: "#fff", cursor: "pointer" }}
          aria-label="Previous"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {TOOLS.map((t, idx) => (
            <button
              key={t}
              onClick={() => setI(idx)}
              aria-label={t}
              style={{
                width: idx === i ? 22 : 6,
                height: 6,
                background: idx === i ? "#1a1a1a" : "#d4d4d4",
                borderRadius: 3,
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setI((p) => (p + 1) % TOOLS.length)}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, border: "1px solid #e2e2e2", borderRadius: "50%", background: "#fff", cursor: "pointer" }}
          aria-label="Next"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}
