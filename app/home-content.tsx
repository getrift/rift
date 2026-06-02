"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ToolCarousel from "./carousel";

const MONO = "var(--font-mono)";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const START = "/start";

// Private-beta page is intentionally lean: hero → proof → how-it-works → CTA.
// Flip to true to restore the full explainer (carousel, compatibility, capabilities
// bento and long-form notes block) for cold / public-launch traffic.
const SHOW_FULL_PAGE = false;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------- Nav ---------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ededed] bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-6 sm:px-10">
        <Link href="/" aria-label="Rift home" className="flex items-center gap-2.5">
          <span className="h-[13px] w-[13px] rotate-45 rounded-[2px] bg-black" />
          <span className="text-[17px] font-semibold tracking-tight text-black">rift</span>
        </Link>
        <div className="hidden items-center gap-8 sm:flex">
          <Link href="/#how" className="text-[14px] text-[#666] transition-colors hover:text-black">
            How it works
          </Link>
          <Link href="/privacy" className="text-[14px] text-[#666] transition-colors hover:text-black">
            Privacy
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={START}
            className="inline-flex h-9 items-center rounded-full bg-black px-[18px] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Start beta setup
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------- Hero ---------------------------------- */

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-16 sm:px-10 sm:pt-24">
      <div aria-hidden className="rift-dotgrid pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div className="relative flex flex-col gap-7">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span style={{ fontFamily: MONO }} className="text-[13px] text-[#666]">
            Private beta for Mac users with AI exports
          </span>
        </div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, filter: "blur(12px)", y: 10 }}
          animate={reduce ? {} : { opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="max-w-[860px] text-[33px] font-[540] leading-[1.08] tracking-[-0.03em] text-[#0a0a0a] sm:text-[66px] sm:leading-[66px] sm:tracking-[-0.035em]"
        >
          Make your AI work compound.
        </motion.h1>
        <p className="max-w-[620px] text-[17px] leading-[26px] text-[#666] sm:text-[19px] sm:leading-[28px]">
          Rift turns ChatGPT, Claude, Grok, and Gemini exports into a searchable local archive on your Mac. Find the
          answer, decision, or constraint you already worked out, with the original conversation attached. Connected
          tools can ask Rift for that context later.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1.5">
          <Link
            href={START}
            className="inline-flex h-[52px] items-center gap-2 rounded-full bg-black px-6 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Start beta setup
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link
            href="#how"
            className="inline-flex h-[52px] items-center gap-2 rounded-full border border-[#e2e2e2] bg-white px-6 text-[15px] font-medium text-[#171717] transition-colors hover:bg-[#fafafa]"
          >
            See how it works
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
      {SHOW_FULL_PAGE && (
        <div className="relative mt-20 hidden sm:block">
          <ToolCarousel />
        </div>
      )}
      <div
        className={`relative mt-12 flex flex-wrap items-center gap-x-2 gap-y-1.5 ${
          SHOW_FULL_PAGE ? "sm:hidden" : ""
        }`}
      >
        <span style={{ fontFamily: MONO }} className="text-[12px] text-[#999]">
          imports exports
        </span>
        {["ChatGPT", "Claude", "Grok", "Gemini"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-[#e6e6e6] bg-white px-2.5 py-1 text-[12px] text-[#444]"
          >
            {t}
          </span>
        ))}
        <span style={{ fontFamily: MONO }} className="ml-2 text-[12px] text-[#999]">
          connects
        </span>
        {["Claude Code", "Cursor", "Codex", "Claude Desktop"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-[#e6e6e6] bg-white px-2.5 py-1 text-[12px] text-[#444]"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* -------------------------- Source search proof ------------------------ */

function SourceSearchProof() {
  return (
    <section className="border-t border-[#ededed] bg-[#fafafa]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <Reveal>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1">
              {[
                "Import and keyword search work without Codex or embeddings",
                "Results keep the source conversation attached",
                "Agents connect only after the archive proves useful",
              ].map((line) => (
                <div key={line} className="rounded-[12px] border border-[#e7e7e7] bg-white px-4 py-3">
                  <span style={{ fontFamily: MONO }} className="text-[11px] leading-[16px] text-[#555]">
                    {line}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <span style={{ fontFamily: MONO }} className="text-[12px] tracking-[0.12em] text-[#999]">
                FIRST VALUE
              </span>
              <h2 className="mt-4 max-w-[560px] text-[28px] font-[540] leading-[1.15] tracking-[-0.03em] text-[#0a0a0a] sm:text-[38px] sm:leading-[44px]">
                Find the source, not just the answer.
              </h2>
              <p className="mt-4 max-w-[560px] text-[17px] leading-[25px] text-[#666]">
                Search runs locally first. Results show the app, date, excerpt, and original conversation so you can
                verify the answer before you let any current tool reuse it.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div
            className="overflow-hidden rounded-[18px] border border-[#e2e2e2] bg-white"
            style={{ boxShadow: "0 24px 70px -34px rgba(0,0,0,0.34)" }}
          >
            <div className="border-b border-[#ededed] px-5 py-4">
              <div className="flex items-center gap-3 rounded-[12px] border border-[#e9e9e9] bg-[#fbfbfb] px-4 py-3">
                <span style={{ fontFamily: MONO }} className="text-[13px] text-[#999]">
                  search
                </span>
                <span className="truncate text-[14px] text-[#171717]">
                  pricing decision annual plan
                </span>
              </div>
            </div>
            <div className="grid gap-px bg-[#ededed]">
              {[
                {
                  title: "Decision: keep annual-first pricing for the beta",
                  source: "ChatGPT export · Apr 17, 2026",
                  excerpt:
                    "Annual-first keeps the setup fee simple while beta seats are limited. Monthly can wait until the installer is calmer.",
                  tag: "pricing",
                },
                {
                  title: "Constraint: do not promise the Mac package yet",
                  source: "Claude export · Jun 1, 2026",
                  excerpt:
                    "The double-click package is planned for beta.19, but the supported path today remains the terminal installer.",
                  tag: "launch",
                },
                {
                  title: "Outcome: connect agents after search is useful",
                  source: "Grok export · May 22, 2026",
                  excerpt:
                    "First prove recall with sources. Agent reuse is the second act, not the first reason to install.",
                  tag: "narrative",
                },
              ].map((result) => (
                <div key={result.title} className="bg-white p-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      style={{ fontFamily: MONO }}
                      className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-emerald-700"
                    >
                      {result.tag}
                    </span>
                    <span style={{ fontFamily: MONO }} className="text-[11px] text-[#999]">
                      {result.source}
                    </span>
                  </div>
                  <h3 className="mt-3 text-[17px] font-[560] leading-[23px] tracking-[-0.01em] text-[#0a0a0a]">
                    {result.title}
                  </h3>
                  <p className="mt-2 max-w-[650px] text-[14px] leading-[21px] text-[#666]">{result.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-[#171717]">
                    Open source conversation
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------- Feature illustration: capture + serve --------------- */

function FlowDiagram() {
  const chip = "rounded-full border border-[#e6e6e6] px-2.5 py-[3px] text-[11px] text-[#555]";
  return (
    <div className="mt-4 flex flex-col gap-3.5" style={{ width: "100%", maxWidth: 300 }}>
      <div className="flex flex-col gap-2">
        <span style={{ fontFamily: MONO }} className="text-[9.5px] uppercase tracking-[0.12em] text-[#aaa]">
          captured &amp; imported
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["ChatGPT", "Claude", "Grok", "Gemini"].map((t) => (
            <span key={t} style={{ fontFamily: MONO }} className={chip}>
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="border-t border-[#f0f0f0]" />
      <div className="flex flex-col gap-2">
        <span style={{ fontFamily: MONO }} className="text-[9.5px] uppercase tracking-[0.12em] text-[#aaa]">
          served over MCP
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["Claude", "Cursor", "Codex"].map((t) => (
            <span key={t} style={{ fontFamily: MONO }} className={chip}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------- Feature illustration: local-first ------------------- */

function LocalFirstViz() {
  const egress = [
    { name: "Voyage AI", detail: "semantic search · only with a key" },
    { name: "Codex CLI", detail: "enrichment + capture · opt-in · your OpenAI account" },
  ];
  return (
    <div className="mt-4 flex flex-col gap-4" style={{ width: "100%", maxWidth: 300 }}>
      <div className="flex flex-col gap-2">
        <span style={{ fontFamily: MONO }} className="text-[9.5px] uppercase tracking-[0.12em] text-[#aaa]">
          stays on your mac
        </span>
        {["transcripts & exports", "vector index", "search results"].map((x) => (
          <div key={x} className="flex items-center gap-2">
            <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-emerald-500" />
            <span style={{ fontFamily: MONO }} className="text-[12px] text-[#171717]">
              {x}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t border-[#f0f0f0] pt-4">
        <span style={{ fontFamily: MONO }} className="text-[9.5px] uppercase tracking-[0.12em] text-[#aaa]">
          leaves only when you opt in
        </span>
        {egress.map((e) => (
          <div key={e.name} className="flex flex-col gap-0.5">
            <span style={{ fontFamily: MONO }} className="text-[12px] text-[#171717]">
              {e.name}
            </span>
            <span style={{ fontFamily: MONO }} className="text-[10px] text-[#999]">
              {e.detail}
            </span>
          </div>
        ))}
      </div>
      <span className="text-[11px] text-[#999]">Nothing goes to Rift.</span>
    </div>
  );
}

/* ----------------- Feature illustration: current truth ----------------- */

function CurrentTruthViz() {
  return (
    <div className="mt-4 flex flex-col gap-3.5" style={{ width: "100%", maxWidth: 300 }}>
      <span style={{ fontFamily: MONO }} className="text-[9.5px] uppercase tracking-[0.12em] text-[#aaa]">
        how do we rate limit?
      </span>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </span>
          <span style={{ fontFamily: MONO }} className="text-[12px] text-[#171717]">
            rate-limit.ts
          </span>
          <span style={{ fontFamily: MONO }} className="ml-auto text-[9px] uppercase tracking-[0.06em] text-emerald-600">
            current
          </span>
        </div>
        <span className="pl-[23px] text-[12px] text-[#666]">Redis token-bucket · 100/min</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded-full border border-[#dcdcdc]">
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="3.5">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
          <span style={{ fontFamily: MONO }} className="text-[12px] text-[#bbb]">
            chat · Mar 3
          </span>
          <span style={{ fontFamily: MONO }} className="ml-auto text-[9px] uppercase tracking-[0.06em] text-[#bbb]">
            superseded
          </span>
        </div>
        <span className="pl-[23px] text-[12px] text-[#bbb] line-through">express-rate-limit</span>
      </div>
    </div>
  );
}

/* ----------------- Feature illustration: token-aware ------------------- */

function TokenBar({ label, meta, pct, color, reduce, delay }: { label: string; meta: string; pct: number; color: string; reduce: boolean | null; delay: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span style={{ fontFamily: MONO }} className="text-[11px] text-[#666]">
          {label}
        </span>
        <span style={{ fontFamily: MONO }} className="text-[10.5px] text-[#999]">
          {meta}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={reduce ? false : { width: "0%" }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay }}
        />
      </div>
    </div>
  );
}

function TokenViz() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-4 flex flex-col gap-4" style={{ width: "100%", maxWidth: 300 }}>
      <TokenBar label="raw archive" meta="48 KB · ~12k tokens" pct={100} color="#dadada" reduce={reduce} delay={0} />
      <TokenBar label="rift context pack" meta="3.8 KB · ~950 tokens" pct={9} color="#10b981" reduce={reduce} delay={0.18} />
      <div className="flex items-baseline gap-2">
        <span className="text-[16px] font-semibold text-emerald-600">−92%</span>
        <span className="text-[11.5px] leading-[16px] text-[#999]">
          tokens loaded — the slice that matters, not the transcript.
        </span>
      </div>
    </div>
  );
}

/* ----------------- Feature illustration: MCP surface ------------------- */

function McpToolsViz() {
  return (
    <div className="mt-4 flex flex-col gap-2.5" style={{ width: "100%", maxWidth: 300 }}>
      <div className="flex items-center gap-2">
        <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-emerald-500" />
        <span style={{ fontFamily: MONO }} className="text-[12px] text-[#171717]">
          rift_context_pack
        </span>
        <span style={{ fontFamily: MONO }} className="rounded border border-[#e0e0e0] px-1 py-px text-[8.5px] uppercase tracking-[0.06em] text-[#999]">
          default
        </span>
      </div>
      <span style={{ fontFamily: MONO }} className="pl-[13px] text-[11px] text-[#999]">
        returns a context pack · 4 memories
      </span>
      <span style={{ fontFamily: MONO }} className="border-t border-[#f0f0f0] pt-3 text-[10px] text-[#aaa]">
        also: search · history · save · status
      </span>
    </div>
  );
}

/* ----------------- Feature illustration: import ------------------------ */

const IMPORT_FILES = [
  { name: "chatgpt-export.zip", color: "#10a37f" },
  { name: "claude-conversations.json", color: "#d97757" },
  { name: "grok-export.json", color: "#1a1a1a" },
];

function ImportViz() {
  return (
    <div className="mt-4 flex flex-col gap-3" style={{ width: "100%", maxWidth: 300 }}>
      <div className="flex flex-col gap-2.5">
        {IMPORT_FILES.map((f) => (
          <div key={f.name} className="flex items-center gap-2.5">
            <span className="h-2 w-2 flex-shrink-0 rounded-[3px]" style={{ background: f.color }} />
            <span style={{ fontFamily: MONO }} className="truncate text-[12px] text-[#444]">
              {f.name}
            </span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" className="ml-auto flex-shrink-0">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
        ))}
      </div>
      <span className="border-t border-[#f0f0f0] pt-3 text-[11px] text-[#999]">
        Imported as-is — AI triage is an opt-in, off by default.
      </span>
    </div>
  );
}

/* ------------------------------ Features ------------------------------- */

function Crosshair({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", transform: "translateX(-50%)", ...style }}>
      <svg width="13" height="13" viewBox="0 0 13 13">
        <path d="M6.5 0v13M0 6.5h13" stroke="#d4d4d4" strokeWidth="1" />
      </svg>
    </div>
  );
}

function RowCrosshairs({ top, bottom }: { top?: boolean; bottom?: boolean }) {
  const xs = ["0", "33.333%", "66.666%", "100%"];
  return (
    <>
      {top && xs.map((x, i) => <Crosshair key={`t${i}`} style={{ left: x, top: -6 }} />)}
      {bottom && xs.map((x, i) => <Crosshair key={`b${i}`} style={{ left: x, bottom: -6 }} />)}
    </>
  );
}

function Cell({
  t1,
  t2,
  desc,
  divider,
  children,
}: {
  t1: string;
  t2: string;
  desc: string;
  divider?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-3 p-7 ${divider ? "border-t border-[#ededed] md:border-l md:border-t-0" : ""}`}>
      <h3 className="text-[20px] font-[560] leading-[25px] tracking-[-0.02em] text-[#0a0a0a]">
        {t1}
        <br />
        {t2}
      </h3>
      <p className="text-[14px] leading-[21px] text-[#666]">{desc}</p>
      {children}
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
      <Reveal>
        <h2 className="max-w-[680px] text-[28px] font-[540] leading-[1.15] tracking-[-0.03em] text-[#0a0a0a] sm:text-[36px] sm:leading-[42px]">
          What changes once Rift is connected.
        </h2>
        <p className="mt-3.5 max-w-[560px] text-[17px] leading-[25px] text-[#666]">
          Connected tools can start with what you already worked out — the decisions, constraints, and context
          you&rsquo;d otherwise re-explain from scratch.
        </p>
      </Reveal>

      {/* Row 1 */}
      <Reveal delay={0.05}>
        <div className="relative mt-11 flex flex-col items-stretch border-y border-[#ededed] md:flex-row">
          <RowCrosshairs top bottom />
          <Cell
            t1="Memory follows you,"
            t2="across tools"
            desc="Capture in one tool, recall in another — Claude, Codex, and Cursor all ask the same searchable archive. Nothing to re-paste."
          >
            <FlowDiagram />
          </Cell>
          <Cell
            t1="Local-first,"
            t2="nothing leaves unnamed"
            desc="Your transcripts, index, and results stay on your Mac. Optional semantic search and enrichment are named up front during onboarding."
            divider
          >
            <LocalFirstViz />
          </Cell>
          <Cell
            t1="Live files beat,"
            t2="stale chats"
            desc="When a current file contradicts an old chat, Rift trusts the file — and flags the chat as superseded."
            divider
          >
            <CurrentTruthViz />
          </Cell>
        </div>
      </Reveal>

      {/* Row 2 */}
      <Reveal delay={0.08}>
        <div className="relative flex flex-col items-stretch border-b border-[#ededed] md:flex-row">
          <RowCrosshairs bottom />
          <Cell
            t1="Context without,"
            t2="the bloat"
            desc="Rift returns a byte-capped slice sized for the task — the decision that matters, not a transcript dump."
          >
            <TokenViz />
          </Cell>
          <Cell
            t1="Your agent asks,"
            t2="mid-task"
            desc="Claude, Codex, and Cursor call Rift for a typed, bounded context pack while you work — never a raw transcript dump."
            divider
          >
            <McpToolsViz />
          </Cell>
          <Cell
            t1="Old archives become"
            t2="searchable"
            desc="New sessions compound from day one. Big ChatGPT, Claude, Grok, or Gemini exports come in through guided import so sources stay visible."
            divider
          >
            <ImportViz />
          </Cell>
        </div>
      </Reveal>

      {/* Pairs with — editorial */}
      <Reveal delay={0.05}>
        <div className="flex flex-col gap-[18px] pt-12">
          <span style={{ fontFamily: MONO }} className="text-[12px] tracking-[0.12em] text-[#999]">
            PAIRS WITH HAND-WRITTEN NOTES
          </span>
          <h3 className="max-w-[720px] text-[26px] font-[560] leading-[1.2] tracking-[-0.025em] text-[#0a0a0a] sm:text-[30px] sm:leading-[38px]">
            Already keep AI project notes? Rift covers the sessions you do not write down.
          </h3>
          <p className="max-w-[680px] text-[17px] leading-[27px] text-[#555] sm:text-[18px] sm:leading-[29px]">
            Hand-tended notes are great for what you deliberately save. Rift covers the other half: the decisions,
            dead-ends, and details buried in real sessions, imported with sources and served back when a connected
            tool asks for them.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* --------------------------- Claude Code proof ------------------------- */

function TermLine({ glyph, glyphColor, children }: { glyph?: string; glyphColor?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {glyph !== undefined && (
        <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 13, color: glyphColor, lineHeight: "20px" }}>
          {glyph === "dot" ? "⏺" : glyph}
        </span>
      )}
      <span style={{ fontFamily: MONO, fontSize: 13, color: "#e6e6e6", lineHeight: "20px" }}>{children}</span>
    </div>
  );
}

function ToolCallProof() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
      <Reveal>
        <h2 className="max-w-[700px] text-[28px] font-[540] leading-[1.15] tracking-[-0.03em] text-[#0a0a0a] sm:text-[36px] sm:leading-[42px]">
          Connected tools can reuse the same context.
        </h2>
        <p className="mt-3.5 max-w-[560px] text-[17px] leading-[25px] text-[#666]">
          After setup, Claude Code, Cursor, and Codex can ask Rift for source-backed context instead of making you
          paste the same background again.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div
          className="mt-9 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#161616]"
          style={{ boxShadow: "0 24px 60px -20px rgba(0,0,0,0.28), 0 8px 20px -8px rgba(0,0,0,0.12)" }}
        >
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex gap-[7px]">
              <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
            </div>
            <span style={{ fontFamily: MONO }} className="pl-2 text-[12px] text-[#777]">
              checkout-service — claude — 92×30
            </span>
          </div>
          <div className="flex flex-col gap-4 px-[18px] pb-[18px] pt-2">
            <TermLine glyph=">" glyphColor="#6e6e6e">
              <span style={{ color: "#c9c9c9" }}>add rate limiting to the checkout route — same approach we used before</span>
            </TermLine>
            <TermLine glyph="dot" glyphColor="#e6e6e6">
              I&rsquo;ll check how rate limiting was handled before pulling it into checkout.
            </TermLine>

            <div className="flex flex-col gap-[5px]">
              <TermLine glyph="dot" glyphColor="#34d399">
                <span style={{ color: "#666" }}>rift -</span> rift_context_pack
                <span style={{ color: "#7a7a7a" }}>(task: </span>
                <span style={{ color: "#c9a36a" }}>{`"rate limiting middleware"`}</span>
                <span style={{ color: "#7a7a7a" }}>)</span>
              </TermLine>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 13, color: "#5a5a5a", lineHeight: "20px" }}>
                  &#9215;
                </span>
                <div className="flex flex-col" style={{ fontFamily: MONO }}>
                  <span className="text-[13px] leading-[20px] text-[#9a9a9a]">Received 4 memories (3.8 KB)</span>
                  <span className="text-[13px] leading-[20px] text-[#9a9a9a]">
                    decision: token-bucket via Redis, 100 req/min — api-gateway
                  </span>
                  <span className="text-[13px] leading-[20px] text-[#6e6e6e]">… +9 lines (ctrl+r to expand)</span>
                </div>
              </div>
            </div>

            <TermLine glyph="dot" glyphColor="#e6e6e6">
              You standardized on a Redis token-bucket limiter (express-rate-limit was dropped — no shared state).
              Matching it on /checkout:
            </TermLine>

            <div className="flex flex-col gap-[5px]">
              <TermLine glyph="dot" glyphColor="#e6e6e6">
                Update<span style={{ color: "#7a7a7a" }}>(</span>src/routes/checkout.ts<span style={{ color: "#7a7a7a" }}>)</span>
              </TermLine>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 13, color: "#5a5a5a", lineHeight: "20px" }}>
                  &#9215;
                </span>
                <div className="flex flex-col" style={{ fontFamily: MONO }}>
                  <span className="text-[13px] leading-[21px] text-[#9a9a9a]">
                    Updated src/routes/checkout.ts with 2 additions
                  </span>
                  <div className="flex gap-[14px] px-1.5" style={{ background: "rgba(46,160,67,0.14)", lineHeight: "21px" }}>
                    <span className="text-[13px] text-[#5a5a5a]">1</span>
                    <span className="text-[13px] text-[#3fb950]">{`+ import { rateLimit } from "../middleware/rateLimit";`}</span>
                  </div>
                  <div className="flex gap-[14px] px-1.5" style={{ background: "rgba(46,160,67,0.14)", lineHeight: "21px" }}>
                    <span className="text-[13px] text-[#5a5a5a]">8</span>
                    <span className="text-[13px] text-[#3fb950]">{`+ router.post("/checkout", rateLimit({ max: 100, window: "1m" }), handler);`}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[7px] pt-1.5">
              <div className="flex items-center gap-2.5 rounded-lg border border-[#3a3a3a] px-[14px] py-[11px]">
                <span style={{ fontFamily: MONO }} className="text-[13px] text-[#6e6e6e]">
                  &gt;
                </span>
                <span className="h-4 w-[7px] bg-[#4a4a4a]" />
              </div>
              <div className="flex items-center justify-between px-1">
                <span style={{ fontFamily: MONO }} className="text-[11px] text-[#5a5a5a]">
                  ⏵⏵ accept edits on · ? for shortcuts
                </span>
                <span style={{ fontFamily: MONO }} className="text-[11px] text-[#5a5a5a]">
                  rift · connected
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------ How it works --------------------------- */

const STEPS = [
  {
    n: "01",
    title: "Import your AI exports",
    body: "Bring in ChatGPT, Claude, Grok, and Gemini exports. Rift parses the conversations and keeps the original sources visible.",
  },
  {
    n: "02",
    title: "Find what you worked out",
    body: "Search locally first. Pull back the answer, decision, constraint, or dead end with the conversation it came from.",
  },
  {
    n: "03",
    title: "Let current tools reuse it",
    body: "Connect Claude Code, Cursor, and Codex after setup so your agents can ask Rift for the context you would otherwise paste by hand.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="border-t border-[#ededed]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
        <Reveal>
          <span style={{ fontFamily: MONO }} className="text-[12px] tracking-[0.12em] text-[#999]">
            HOW IT WORKS
          </span>
          <h2 className="mt-4 max-w-[680px] text-[28px] font-[540] leading-[1.15] tracking-[-0.03em] text-[#0a0a0a] sm:text-[36px] sm:leading-[42px]">
            From old AI work to reusable context.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-11 grid gap-px overflow-hidden rounded-[14px] border border-[#ededed] bg-[#ededed] sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col gap-3 bg-white p-7">
                <span style={{ fontFamily: MONO }} className="text-[13px] text-emerald-600">
                  {s.n}
                </span>
                <h3 className="text-[18px] font-[560] tracking-[-0.01em] text-[#0a0a0a]">{s.title}</h3>
                <p className="text-[14px] leading-[21px] text-[#666]">{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- Beta status --------------------------- */

function BetaStatus() {
  const items = [
    {
      status: "ready for invite testing",
      title: "Export import + keyword search",
      body: "Import and keyword search work without Codex or embeddings. Start with ChatGPT, Claude, Grok, or Gemini exports.",
    },
    {
      status: "available after setup",
      title: "Agent connections",
      body: "Claude Desktop, Claude Code, Cursor, and Codex can ask Rift for source-backed context over MCP.",
    },
    {
      status: "planned for beta.19",
      title: "Double-click Mac package",
      body: "Today’s supported setup is the terminal installer. The Mac package is scoped, but not the live path yet.",
    },
  ];

  return (
    <section className="border-t border-[#ededed] bg-[#fafafa]">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:px-10 sm:py-20">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span style={{ fontFamily: MONO }} className="text-[12px] tracking-[0.12em] text-[#999]">
                BETA STATUS
              </span>
              <h2 className="mt-4 max-w-[620px] text-[28px] font-[540] leading-[1.15] tracking-[-0.03em] text-[#0a0a0a] sm:text-[34px] sm:leading-[40px]">
                Truthful enough to ship. Narrow enough to learn.
              </h2>
            </div>
            <p className="max-w-[380px] text-[15px] leading-[22px] text-[#666]">
              Private beta is for invited Mac users with real exports to test. The page stays lean because the product
              is still moving fast.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[14px] border border-[#e3e3e3] bg-[#e3e3e3] md:grid-cols-3">
            {items.map((item) => (
              <div key={item.title} className="bg-white p-6">
                <span
                  style={{ fontFamily: MONO }}
                  className="rounded-full bg-[#f3f3f3] px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-[#777]"
                >
                  {item.status}
                </span>
                <h3 className="mt-4 text-[17px] font-[560] tracking-[-0.01em] text-[#0a0a0a]">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-[21px] text-[#666]">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------- Compatibility --------------------------- */

const IMPORT_FROM = [
  { label: "Claude Code", tag: "capture" },
  { label: "Codex CLI", tag: "capture" },
  { label: "ChatGPT export", tag: "import" },
  { label: "Claude export", tag: "import" },
  { label: "Grok export", tag: "import" },
  { label: "Gemini export", tag: "import" },
  { label: "Project files", tag: "watch" },
];
const SERVE_TO = ["Claude Desktop", "Claude Code", "Cursor", "Codex"];

function RailTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{ fontFamily: MONO }}
      className="rounded border border-[#e0e0e0] px-1.5 py-px text-[9px] uppercase tracking-[0.06em] text-[#999]"
    >
      {children}
    </span>
  );
}

function Compatibility() {
  return (
    <section className="border-t border-[#ededed]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
        <Reveal>
          <span style={{ fontFamily: MONO }} className="text-[12px] tracking-[0.12em] text-[#999]">
            COMPATIBILITY
          </span>
          <h2 className="mt-4 max-w-[680px] text-[28px] font-[540] leading-[1.15] tracking-[-0.03em] text-[#0a0a0a] sm:text-[36px] sm:leading-[42px]">
            Works where your AI work already happens.
          </h2>
          <p className="mt-3.5 max-w-[620px] text-[17px] leading-[25px] text-[#666]">
            <span className="text-[#171717]">Import source</span> means Rift can read past work from there.{" "}
            <span className="text-[#171717]">Connected tool</span> means it can ask Rift for context while you work.
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-11 grid gap-5 md:grid-cols-2">
            <div className="rounded-[14px] border border-[#ededed] p-7">
              <span style={{ fontFamily: MONO }} className="text-[11px] uppercase tracking-[0.1em] text-[#999]">
                Captured &amp; imported from
              </span>
              <ul className="mt-5 flex flex-col">
                {IMPORT_FROM.map((x) => (
                  <li
                    key={x.label}
                    className="flex items-center justify-between border-b border-[#f4f4f4] py-2.5 last:border-0 last:pb-0"
                  >
                    <span className="text-[15px] text-[#171717]">{x.label}</span>
                    <RailTag>{x.tag}</RailTag>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[14px] border border-[#ededed] p-7">
              <span style={{ fontFamily: MONO }} className="text-[11px] uppercase tracking-[0.1em] text-[#999]">
                Served to · MCP clients
              </span>
              <ul className="mt-5 flex flex-col">
                {SERVE_TO.map((x) => (
                  <li key={x} className="flex items-center justify-between border-b border-[#f4f4f4] py-2.5">
                    <span className="text-[15px] text-[#171717]">{x}</span>
                    <span className="h-[6px] w-[6px] rounded-full bg-emerald-500" />
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[13px] leading-[19px] text-[#999]">
                These four are wired up by{" "}
                <span style={{ fontFamily: MONO }} className="text-[#666]">
                  rift mcp install
                </span>
                .
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- Pricing ------------------------------- */

function Pricing() {
  return (
    <section className="border-t border-[#ededed]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-24">
        <Reveal>
          <span style={{ fontFamily: MONO }} className="text-[12px] tracking-[0.12em] text-[#999]">
            PRICING
          </span>
          <h2 className="mt-4 max-w-[680px] text-[28px] font-[540] leading-[1.15] tracking-[-0.03em] text-[#0a0a0a] sm:text-[36px] sm:leading-[42px]">
            One license. One archive across your connected tools.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-14">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[44px] font-[560] leading-none tracking-[-0.02em] text-[#0a0a0a]">€99</span>
                <span className="text-[15px] text-[#666]">/ year</span>
                <span
                  style={{ fontFamily: MONO }}
                  className="ml-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.04em] text-emerald-600"
                >
                  best value
                </span>
              </div>
              <span className="text-[13px] text-[#999]">≈ €8.25 / month · billed annually</span>
            </div>
            <span className="hidden h-12 w-px bg-[#ededed] sm:block" />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[44px] font-[560] leading-none tracking-[-0.02em] text-[#0a0a0a]">€12</span>
                <span className="text-[15px] text-[#666]">/ month</span>
              </div>
              <span className="text-[13px] text-[#999]">month-to-month, cancel anytime</span>
            </div>
          </div>
          <p className="mt-9 max-w-[520px] text-[15px] leading-[23px] text-[#666]">
            One license covers the MCP clients you connect — no per-tool or per-seat fees. Free while in private
            beta; you&rsquo;ll get plenty of notice before it&rsquo;s paid.
          </p>
          <Link
            href={START}
            className="mt-7 inline-flex h-[52px] items-center gap-2 rounded-full bg-black px-6 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Start beta setup
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- CTA ---------------------------------- */

function CTA() {
  return (
    <section className="flex flex-col items-center gap-[26px] bg-[#0a0a0a] px-6 py-24 sm:px-10 sm:py-[120px]">
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <span style={{ fontFamily: MONO }} className="text-[13px] text-[#888]">
          private beta · macOS
        </span>
      </div>
      <h2 className="max-w-[820px] text-center text-[30px] font-[560] leading-[1.1] tracking-[-0.03em] text-white sm:text-[58px] sm:leading-[60px] sm:tracking-[-0.035em]">
        Search the work already
        <br />
        in your AI exports.
      </h2>
      <p className="max-w-[560px] text-center text-[17px] leading-[26px] text-[#a1a1a1] sm:text-[18px] sm:leading-[27px]">
        Private beta seats are opening for Mac users with real ChatGPT, Claude, Grok, or Gemini exports to test. Start
        with local import and source-backed search; connect agents after the archive proves useful.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2.5">
        <Link
          href={START}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
        >
          Start beta setup
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
        <Link
          href="#how"
          className="inline-flex items-center rounded-full border border-[#333] px-6 py-3.5 text-[15px] font-medium text-[#ededed] transition-colors hover:border-[#555]"
        >
          See how it works
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#ededed] bg-white">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center sm:px-10">
        <div className="flex items-center gap-2.5">
          <span className="h-[13px] w-[13px] rotate-45 rounded-[2px] bg-black" />
          <span className="text-[15px] font-semibold tracking-tight text-black">rift</span>
        </div>
        <div className="flex items-center gap-7 text-[13px] text-[#666]">
          <Link href="/privacy" className="transition-colors hover:text-black">
            Privacy
          </Link>
          <Link href={START} className="transition-colors hover:text-black">
            Start beta setup
          </Link>
          <span className="text-[#999]">© {new Date().getFullYear()} Rift</span>
        </div>
      </div>
    </footer>
  );
}

export default function HomeContent() {
  return (
    <main className="min-h-screen bg-white font-sans text-[#0a0a0a] antialiased">
      <Nav />
      <Hero />
      <SourceSearchProof />
      <HowItWorks />
      <BetaStatus />
      <ToolCallProof />
      {SHOW_FULL_PAGE && <Compatibility />}
      {SHOW_FULL_PAGE && <Features />}
      {SHOW_FULL_PAGE && <Pricing />}
      <CTA />
      <Footer />
    </main>
  );
}
