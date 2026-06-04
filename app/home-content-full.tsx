"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const MONO = "var(--font-mono)";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const START = "/start";

// Monochrome ink ladder — white IS the accent. Hierarchy is brightness, never hue.
const INK = "#f7f8f8";
const INK2 = "#c8cdd6";
const INK3 = "#8a8f98";
const INK4 = "#62666d";
const INK5 = "#4d5158";

// Monochrome syntax tiers: keyword/function brightest, strings dimmer, punctuation faint.
const SYN = { fn: "#f7f8f8", kw: "#d0d6e0", base: "#aab0b8", str: "#878d96", num: "#c8cdd6", punc: "#62666d" };

// Private-beta page is intentionally lean: hero → proof → how-it-works → CTA.
// Flip to true to restore the full explainer (tool-call proof, beta status,
// compatibility, capabilities bento, pricing) for cold / public-launch traffic.
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

/* Eyebrow — uppercase, positive tracking, mono: the page's taxonomy label. */
function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      style={{ fontFamily: MONO }}
      className={`text-[11px] uppercase tracking-[0.16em] text-[#8a8f98] ${className}`}
    >
      {children}
    </span>
  );
}

/* The two button shapes. Squared, never pill. Primary is pure white (max brightness =
   the page's single loudest element); secondary is a quiet hairline. */
function PrimaryCTA({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#f7f8f8] px-[18px] text-[14px] font-semibold text-[#08090a] transition-all duration-150 hover:bg-white ${className}`}
    >
      {children}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="transition-transform duration-150 group-hover:translate-x-0.5">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

function SecondaryCTA({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex h-11 items-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] px-[18px] text-[14px] font-medium text-[#d0d6e0] transition-all duration-150 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#f7f8f8] ${className}`}
    >
      {children}
    </Link>
  );
}

/* A live signal in monochrome: a bright dot with a faint halo ring. No color needed. */
function LiveDot({ size = 6 }: { size?: number }) {
  return (
    <span className="relative inline-flex flex-shrink-0 items-center justify-center" style={{ width: size + 6, height: size + 6 }}>
      <span className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
      <span className="rounded-full bg-[#f7f8f8]" style={{ width: size, height: size }} />
    </span>
  );
}

/* -------------------------------- Nav ---------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(8,9,10,0.72)] backdrop-blur-xl">
      <nav className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6 sm:px-10">
        <Link href="/" aria-label="Rift home" className="flex items-center gap-2.5">
          <span className="h-[13px] w-[13px] rotate-45 rounded-[3px] bg-[#f7f8f8]" />
          <span className="text-[16px] font-semibold tracking-tight text-[#f7f8f8]">rift</span>
        </Link>
        <div className="hidden items-center gap-8 sm:flex">
          <Link href="/#how" className="text-[13.5px] text-[#8a8f98] transition-colors hover:text-[#f7f8f8]">
            How it works
          </Link>
          <Link href="/privacy" className="text-[13.5px] text-[#8a8f98] transition-colors hover:text-[#f7f8f8]">
            Privacy
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <PrimaryCTA href={START} className="h-9 px-4 text-[13.5px]">Join the Mac beta</PrimaryCTA>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------- Hero ---------------------------------- */

/* App-grade primitives for the hero — dark surfaces (devs run these agents in dark
   mode), sans chrome, mono only for code. Static wrappers: the cycle animation is one
   clean window-level crossfade, not a per-row re-stagger on every switch. */
function Item({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function Body({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

/* Monochrome window controls — graduated greys read as the macOS traffic lights
   without breaking the black-and-white system. */
function MacDots() {
  return (
    <div className="flex flex-shrink-0 gap-[7px]">
      {["rgba(255,255,255,0.26)", "rgba(255,255,255,0.17)", "rgba(255,255,255,0.11)"].map((c, i) => (
        <span key={i} className="h-[11px] w-[11px] rounded-full" style={{ background: c }} />
      ))}
    </div>
  );
}

/* Shared dark window shell — depth via a background step + a 1px top inner-highlight,
   then one deep ambient shadow. Warm flag now only nudges the neutral a hair. */
function WinShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[16px]"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(180deg,#101113 0%,#0b0c0d 100%)",
        boxShadow:
          "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 50px 100px -45px rgba(0,0,0,0.85), 0 18px 40px -22px rgba(0,0,0,0.6)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)" }}
      />
      {children}
    </div>
  );
}

/* Cursor's branching tool-call glyph. */
function BranchGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8a8f98" strokeWidth="2" className="flex-shrink-0">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M6 8.2v7.6M18 11c0 4.5-12 1.5-12 6.8" />
    </svg>
  );
}

/* Tiny line icons for sidebar chrome — inherit color from parent. */
function Ico({ children, size = 13 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
      {children}
    </svg>
  );
}
const IcoPlus = () => <Ico><path d="M12 5v14M5 12h14" /></Ico>;
const IcoSearch = () => <Ico><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Ico>;
const IcoFolder = () => <Ico><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></Ico>;
const IcoBolt = () => <Ico><path d="M13 3L5 13h6l-1 8 8-10h-6z" /></Ico>;
const IcoGear = () => (
  <Ico>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3.5v2.5M12 18v2.5M4.2 7l2.2 1.3M17.6 15.7l2.2 1.3M19.8 7l-2.2 1.3M6.4 15.7L4.2 17" />
  </Ico>
);
const IcoFile = () => (
  <Ico size={11}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </Ico>
);
const IcoPanel = () => (
  <Ico size={14}>
    <rect x="3" y="4.5" width="18" height="15" rx="2" />
    <path d="M9 4.5v15" />
  </Ico>
);

/* Inline code token — mono, neutral. The only place mono is used inside the app windows. */
function CodeTok({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 11.5,
        color: "#e6e8ea",
        background: "rgba(255,255,255,0.07)",
        padding: "1px 5px",
        borderRadius: 5,
        whiteSpace: "nowrap",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {children}
    </span>
  );
}

/* Monochrome code line + added-line variant (left bar + faint wash, no green). */
function Mono({ c, children }: { c: string; children: React.ReactNode }) {
  return <span style={{ color: c }}>{children}</span>;
}
function AddLine({ gutter, children }: { gutter: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-3 pr-2"
      style={{ background: "rgba(255,255,255,0.055)", borderLeft: "2px solid rgba(255,255,255,0.5)", lineHeight: "21px" }}
    >
      <span className="w-6 flex-shrink-0 pl-2 text-right" style={{ fontFamily: MONO, fontSize: 11, color: INK5 }}>{gutter}</span>
      <span className="truncate" style={{ fontFamily: MONO, fontSize: 11.5 }}>{children}</span>
    </div>
  );
}

/* App titlebar — mac dots, centered breadcrumb, right slot. */
function TitleBar({ center, right }: { center: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div
      className="relative flex flex-shrink-0 items-center px-3.5"
      style={{ height: 40, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <MacDots />
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5">{center}</div>
      <div className="ml-auto flex items-center gap-2.5">{right}</div>
    </div>
  );
}

/* App composer — the real bottom-of-window input each app has, with its model chip. */
function InputBar({ placeholder, model }: { placeholder: string; model: string }) {
  return (
    <div className="flex-shrink-0 px-3.5 pb-3.5 pt-1.5">
      <div
        className="flex items-center gap-2 rounded-[11px] border px-3 py-2"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <span className="truncate text-[12px]" style={{ color: INK5 }}>
          {placeholder}
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-medium" style={{ color: INK3 }}>
            {model}
          </span>
          <span
            className="flex h-[18px] w-[18px] items-center justify-center rounded-[6px]"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c8cdd6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V6M6 12l6-6 6 6" />
            </svg>
          </span>
        </span>
      </div>
    </div>
  );
}

/* Sidebar section label. */
function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 pb-1 pt-2.5 text-[9.5px] font-medium uppercase tracking-[0.09em]" style={{ color: INK4 }}>
      {children}
    </span>
  );
}

/* How Rift actually appears in an agent run: a collapsed tool-call row naming the tool,
   the way Cursor/Codex render it ("Ran <Tool> in rift") and Claude renders it
   ("Used rift · <tool>"). Results stay collapsed; the chain of thought lives in the
   one-line Thought between calls. */
function ToolPill({ tool, claude = false }: { tool: string; claude?: boolean }) {
  if (claude) {
    return (
      <div className="flex items-center gap-1.5 text-[12px]">
        <span className="font-medium" style={{ color: INK }}>Used</span>
        <span style={{ color: INK }}>rift</span>
        <span style={{ color: INK4 }}>·</span>
        <span style={{ color: INK2 }}>{tool}</span>
        <span className="ml-auto" style={{ color: INK5 }}>›</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-[8px] border px-3 py-[6px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
      <BranchGlyph />
      <span className="text-[12px]" style={{ color: INK3 }}>
        Ran <span style={{ color: INK }}>{tool}</span> in rift
      </span>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={INK5} strokeWidth="2.2" className="ml-auto flex-shrink-0">
        <path d="M8 9l4 4 4-4M8 15l4-4 4 4" />
      </svg>
    </div>
  );
}

/* One-line reasoning/feedback between calls — the agent's chain of thought + learning. */
function Thought({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] leading-[18px]" style={{ color: INK3 }}>
      {children}
    </p>
  );
}

/* Indeterminate spinner for in-progress rows. */
function Spinner({ color }: { color: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      className="flex-shrink-0"
      animate={reduce ? {} : { rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.2" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  );
}

/* File header strip inside a code block. */
function FileTab({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px]" style={{ background: "rgba(0,0,0,0.3)", color: INK3, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <IcoFile /> {name}
      <span className="ml-auto" style={{ fontFamily: MONO, fontSize: 9.5, color: INK5 }}>TS</span>
    </div>
  );
}

/* 1 — Claude Code · dark desktop app · a work project. Recognizable by the
   Chat/Code tabs + Recents sidebar; Rift appears as "Used rift" tool rows. */
function ClaudeCodeWindow() {
  const recents = [
    { label: "Rate limit checkout", active: true },
    { label: "Auth redirect fix" },
    { label: "Migrate to pg16" },
    { label: "Stripe webhook retries" },
  ];
  return (
    <WinShell>
      <TitleBar
        center={
          <>
            <span className="text-[12px]" style={{ color: INK3 }}>checkout-service</span>
            <span className="text-[12px]" style={{ color: INK5 }}>/</span>
            <span className="text-[12px] font-medium" style={{ color: INK }}>Rate limit checkout</span>
          </>
        }
        right={<span style={{ color: INK4 }}><IcoPanel /></span>}
      />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[178px] flex-col px-2.5 py-3 md:flex" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.22)" }}>
          <div className="mb-2 flex gap-0.5 rounded-[8px] p-[3px]" style={{ background: "rgba(255,255,255,0.05)" }}>
            {["Chat", "Code"].map((t) => (
              <span
                key={t}
                className="flex-1 rounded-[6px] py-[3px] text-center text-[11px] font-medium"
                style={t === "Code" ? { background: "rgba(255,255,255,0.1)", color: INK } : { color: INK3 }}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-[7px] px-2 py-[5px] text-[11.5px]" style={{ color: INK2 }}>
            <span style={{ color: INK3 }}><IcoPlus /></span>
            New session
          </div>
          <SideLabel>Recents</SideLabel>
          <div className="flex flex-col gap-0.5">
            {recents.map((r) => (
              <div key={r.label} className="flex items-center gap-2 rounded-[7px] px-2 py-[5px]" style={r.active ? { background: "rgba(255,255,255,0.06)" } : undefined}>
                <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full" style={{ background: r.active ? INK : INK5 }} />
                <span className="truncate text-[11.5px]" style={{ color: r.active ? INK : INK3, fontWeight: r.active ? 500 : 400 }}>
                  {r.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2 pt-2">
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full text-[9px] font-semibold" style={{ background: "rgba(255,255,255,0.12)", color: INK }}>
              CR
            </span>
            <span className="text-[11px]" style={{ color: INK3 }}>Clément · Max</span>
          </div>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <Body className="flex flex-1 flex-col gap-2.5 px-5 py-4">
            <Item className="flex justify-end">
              <span className="max-w-[86%] rounded-[14px] px-3.5 py-2 text-[12.5px] leading-[18px]" style={{ background: "rgba(255,255,255,0.06)", color: INK }}>
                Add rate limiting to the checkout route.
              </span>
            </Item>
            {/* Driven by CLAUDE.md — a real run: named tool calls with a one-line thought between. */}
            <Item><Thought>Checking how we settled this before I build.</Thought></Item>
            <Item><ToolPill claude tool="rift_search" /></Item>
            <Item><Thought>Found it in a Claude chat (May 14): Redis token-bucket, 100&nbsp;req/min.</Thought></Item>
            <Item><ToolPill claude tool="rift_context_pack" /></Item>
            <Item>
              <p className="text-[12.5px] leading-[20px]" style={{ color: INK }}>
                Reusing it on <CodeTok>/checkout</CodeTok>:
              </p>
            </Item>
            <Item>
              <div className="overflow-hidden rounded-[8px] border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <FileTab name="src/routes/checkout.ts" />
                <AddLine gutter="+">
                  <Mono c={SYN.fn}>rateLimit</Mono>
                  <Mono c={SYN.punc}>{"({ "}</Mono>
                  <Mono c={SYN.kw}>max</Mono>
                  <Mono c={SYN.punc}>: </Mono>
                  <Mono c={SYN.num}>100</Mono>
                  <Mono c={SYN.punc}>, </Mono>
                  <Mono c={SYN.kw}>window</Mono>
                  <Mono c={SYN.punc}>: </Mono>
                  <Mono c={SYN.str}>&quot;1m&quot;</Mono>
                  <Mono c={SYN.punc}>{" })"}</Mono>
                </AddLine>
              </div>
            </Item>
          </Body>
          <InputBar placeholder="Type / for commands" model="Opus 4.8" />
        </main>
      </div>
    </WinShell>
  );
}

/* 2 — Cursor · dark desktop app · freelance client work. Recognizable by the
   IN PROGRESS / READY FOR REVIEW agent list + editor; Rift appears as "Ran … in rift". */
const CURSOR_TINT = "#e6e8ea";
function CursorWindow() {
  return (
    <WinShell>
      <TitleBar
        center={
          <>
            <span className="text-[12px]" style={{ color: INK3 }}>acme-billing</span>
            <span className="text-[12px]" style={{ color: INK5 }}>/</span>
            <span className="text-[12px] font-medium" style={{ color: INK }}>Invoice numbering</span>
          </>
        }
        right={<span style={{ color: INK4 }}><IcoPanel /></span>}
      />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[182px] flex-col px-2.5 py-3 md:flex" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.22)" }}>
          <div className="flex items-center gap-2 rounded-[7px] px-2 py-[5px] text-[11.5px] font-medium" style={{ color: INK2 }}>
            <span style={{ color: INK3 }}><IcoPlus /></span>
            New Agent
          </div>
          <SideLabel>In progress 1</SideLabel>
          <div className="flex items-center gap-2 rounded-[7px] px-2 py-[5px]" style={{ background: "rgba(255,255,255,0.06)" }}>
            <Spinner color={CURSOR_TINT} />
            <span className="truncate text-[11.5px] font-medium" style={{ color: INK }}>Invoice numbering</span>
          </div>
          <SideLabel>Ready for review 3</SideLabel>
          <div className="flex flex-col gap-0.5">
            {["PDF export fix", "Tax-rate table", "Webhook signing"].map((t) => (
              <div key={t} className="flex items-center gap-2 rounded-[7px] px-2 py-[5px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={INK5} strokeWidth="2.4" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="9" opacity="0.7" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
                <span className="truncate text-[11.5px]" style={{ color: INK3 }}>{t}</span>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          {/* editor file tab */}
          <div className="flex flex-shrink-0 items-center gap-2 border-b px-4" style={{ height: 30, borderColor: "rgba(255,255,255,0.05)" }}>
            <span className="inline-flex items-center gap-1.5 border-b-2 pb-[6px] pt-[8px]" style={{ borderColor: INK }}>
              <span className="h-[7px] w-[7px] rounded-[2px]" style={{ background: INK3 }} />
              <span className="text-[11.5px]" style={{ color: INK2 }}>InvoiceNumber.php</span>
            </span>
          </div>
          <Body className="flex flex-1 flex-col gap-2.5 px-5 py-3.5">
            <Item>
              <div className="rounded-[10px] border px-3.5 py-2 text-[12.5px] leading-[18px]" style={{ borderColor: "rgba(255,255,255,0.08)", color: INK2 }}>
                Generate the next invoice number in InvoiceNumber.php.
              </div>
            </Item>
            {/* Driven by .cursor/rules — Cursor consults Rift as part of writing the code. */}
            <Item><Thought>Checking the format the client agreed on.</Thought></Item>
            <Item><ToolPill tool="Rift Context Pack" /></Item>
            <Item><Thought>Signed off as FR-{`{year}`}-#### sequential (ChatGPT, Mar&nbsp;3) — applying it.</Thought></Item>
            <Item>
              <div className="overflow-hidden rounded-[8px] border" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center" style={{ lineHeight: "21px" }}>
                  <span className="w-7 flex-shrink-0 pr-1 text-right" style={{ fontFamily: MONO, fontSize: 11, color: INK5 }}>12</span>
                  <span className="truncate pl-2" style={{ fontFamily: MONO, fontSize: 11.5 }}>
                    <Mono c={SYN.kw}>$seq</Mono><Mono c={SYN.punc}> = </Mono><Mono c={SYN.fn}>Invoice</Mono><Mono c={SYN.punc}>::</Mono><Mono c={SYN.fn}>yearly</Mono><Mono c={SYN.punc}>(</Mono><Mono c={SYN.kw}>$year</Mono><Mono c={SYN.punc}>)-&gt;</Mono><Mono c={SYN.fn}>count</Mono><Mono c={SYN.punc}>() + </Mono><Mono c={SYN.num}>1</Mono><Mono c={SYN.punc}>;</Mono>
                  </span>
                </div>
                <AddLine gutter="13">
                  <Mono c={SYN.kw}>return </Mono><Mono c={SYN.fn}>sprintf</Mono><Mono c={SYN.punc}>(</Mono><Mono c={SYN.str}>&apos;FR-%d-%04d&apos;</Mono><Mono c={SYN.punc}>, </Mono><Mono c={SYN.kw}>$year</Mono><Mono c={SYN.punc}>, </Mono><Mono c={SYN.kw}>$seq</Mono><Mono c={SYN.punc}>);</Mono>
                </AddLine>
              </div>
            </Item>
            <Item>
              <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: INK3 }}>
                <kbd className="rounded-[4px] border px-1 py-px text-[10px]" style={{ borderColor: "rgba(255,255,255,0.14)", color: INK2 }}>Tab</kbd>
                to accept
              </span>
            </Item>
          </Body>
          <InputBar placeholder="Plan, search, build anything…" model="Composer 2.5 · Fast" />
        </main>
      </div>
    </WinShell>
  );
}

/* 3 — Codex · dark desktop app · a personal side-project. Recognizable by the
   New chat / Search / Projects sidebar; Rift appears as named steps. */
function CodexWindow() {
  return (
    <WinShell>
      <TitleBar
        center={
          <>
            <span className="text-[12px]" style={{ color: INK3 }}>pocket-budget</span>
            <span className="text-[12px]" style={{ color: INK5 }}>/</span>
            <span className="text-[12px] font-medium" style={{ color: INK }}>Recurring transactions</span>
          </>
        }
        right={<span style={{ color: INK4 }}><IcoPanel /></span>}
      />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[178px] flex-col px-2.5 py-3 md:flex" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.22)" }}>
          {[
            { icon: <IcoPlus />, label: "New chat" },
            { icon: <IcoSearch />, label: "Search" },
            { icon: <IcoBolt />, label: "Automations" },
          ].map((i) => (
            <div key={i.label} className="flex items-center gap-2 rounded-[7px] px-2 py-[5px] text-[11.5px]" style={{ color: INK2 }}>
              <span style={{ color: INK3 }}>{i.icon}</span>
              {i.label}
            </div>
          ))}
          <SideLabel>Projects</SideLabel>
          <div className="flex flex-col gap-0.5">
            {[
              { label: "pocket-budget", active: true },
              { label: "rift" },
              { label: "linc" },
              { label: "second-brain" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-2 rounded-[7px] px-2 py-[5px]" style={p.active ? { background: "rgba(255,255,255,0.06)" } : undefined}>
                <span style={{ color: p.active ? INK : INK4 }}><IcoFolder /></span>
                <span className="truncate text-[11.5px]" style={{ color: p.active ? INK : INK3, fontWeight: p.active ? 500 : 400 }}>{p.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2 px-2 pt-2 text-[11px]" style={{ color: INK3 }}>
            <IcoGear /> Settings
          </div>
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <Body className="flex flex-1 flex-col gap-2.5 px-5 py-4">
            <Item className="flex justify-end">
              <span className="max-w-[86%] rounded-[13px] px-3.5 py-2 text-[12.5px] leading-[18px]" style={{ background: "rgba(255,255,255,0.06)", color: INK2 }}>
                How did I structure recurring transactions last time?
              </span>
            </Item>
            {/* The explicit-ask case: Codex chains a few Rift calls, then answers. */}
            <Item>
              <span className="inline-flex items-center gap-1 text-[11.5px]" style={{ color: INK3 }}>
                Worked for 9s
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </Item>
            <Item><Thought>Searching your history for the prior schema.</Thought></Item>
            <Item><ToolPill tool="Rift Search" /></Item>
            <Item><ToolPill tool="Rift Context Pack" /></Item>
            <Item><Thought>Thought briefly</Thought></Item>
            <Item>
              <p className="text-[12.5px] leading-[20px]" style={{ color: INK2 }}>
                You used a <CodeTok>recurrences</CodeTok> table + monthly cron (Claude, Feb&nbsp;8) — decided against one row per instance.
              </p>
            </Item>
          </Body>
          <InputBar placeholder="Ask Codex to edit or explain…" model="5.5 · Extra High" />
        </main>
      </div>
    </WinShell>
  );
}

const PLATFORMS = [
  { id: "claude", name: "claude code", Win: ClaudeCodeWindow },
  { id: "cursor", name: "cursor", Win: CursorWindow },
  { id: "codex", name: "codex", Win: CodexWindow },
];

/* Dark environment panel — deep canvas gradient + a faint neutral light pool and a
   dot-grid texture, so the windows separate via shadow + step, not a heavy band. */
function EnvBackdrop() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0c0d0e 0%,#090a0b 100%)" }} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,0.06), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(125% 105% at 50% 0%, #000 35%, transparent 82%)",
          WebkitMaskImage: "radial-gradient(125% 105% at 50% 0%, #000 35%, transparent 82%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }} />
    </>
  );
}

/* The hero showcase: a coding agent (cycling, full app with sidebar) live on a dark
   panel, calling Rift over MCP — the memory it pulled from. */
function HeroShowcase() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  // Auto-advance, but let the visitor hold a slide: pausing stops the cycle so the
  // thing selling the product can be read at the viewer's pace. Reduced-motion never auto-plays.
  const [paused, setPaused] = useState(false);
  const autoplay = !reduce && !paused;

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setActive((a) => (a + 1) % PLATFORMS.length), 5600);
    return () => clearInterval(t);
  }, [autoplay]);

  const select = (i: number) => {
    setActive(i);
    setPaused(true); // a deliberate pick means they want to stay here
  };

  const platform = PLATFORMS[active];
  const ActiveWin = platform.Win;

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-[20px] sm:rounded-[24px]"
        style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 100px -50px rgba(0,0,0,0.9)" }}
      >
        <EnvBackdrop />
        {/* the tab strip — names the three agents so the cycle reads as "any of these" */}
        <div className="relative flex items-center justify-center gap-1 pt-5">
          {PLATFORMS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-label={`Show ${p.name}`}
              aria-selected={i === active}
              onClick={() => select(i)}
              className="rounded-[7px] px-3 py-1.5 text-[12px] font-medium capitalize transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b0c] focus-visible:ring-[#f7f8f8]"
              style={i === active ? { background: "rgba(255,255,255,0.08)", color: INK } : { color: INK4 }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="relative flex justify-center px-5 pb-10 pt-7 sm:px-10 sm:pb-14 lg:pb-[56px]">
          {/* agent surface — cycles through Claude Code / Cursor / Codex, calling Rift over MCP */}
          <div className="relative w-full lg:w-[760px]" style={{ height: 452 }}>
            <AnimatePresence>
              <motion.div
                key={platform.id}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <ActiveWin />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* progress + pause — keyboard-focusable, screen-reader labelled */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="flex items-center gap-2" aria-hidden>
          {PLATFORMS.map((p, i) => (
            <span
              key={p.id}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === active ? 18 : 6, background: i === active ? INK : "rgba(255,255,255,0.18)" }}
            />
          ))}
        </div>
        {!reduce && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume auto-rotation" : "Pause auto-rotation"}
            aria-pressed={paused}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[#8a8f98] transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-[#d0d6e0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090a] focus-visible:ring-[#f7f8f8]"
          >
            {paused ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 5l12 7-12 7z" />
              </svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-12 sm:px-10 sm:pt-16">
      <div aria-hidden className="rift-dotgrid pointer-events-none absolute inset-x-0 top-0 h-[440px]" />
      <div className="relative flex max-w-[920px] flex-col gap-5">
        <div className="flex items-center gap-2 self-start rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] py-1.5 pl-2 pr-3">
          <LiveDot />
          <span className="text-[12.5px] font-medium text-[#c8cdd6]">Private beta · macOS</span>
        </div>
        <motion.h1
          initial={reduce ? false : { opacity: 0, filter: "blur(12px)", y: 10 }}
          animate={reduce ? {} : { opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="max-w-[820px] text-[34px] font-[560] leading-[1.04] tracking-[-0.035em] text-[#f7f8f8] sm:text-[58px] sm:leading-[1.02]"
        >
          Stop re-explaining what you already solved.
        </motion.h1>
        <p className="max-w-[580px] text-[17px] leading-[26px] text-[#8a8f98] sm:text-[19px] sm:leading-[29px]">
          Turn your ChatGPT, Claude, Grok, and Gemini history into a private archive on your Mac — searchable in a
          keystroke, and reusable in Claude Code, Cursor, and Codex.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <PrimaryCTA href={START} className="h-[50px] px-6 text-[15px]">Join the Mac beta</PrimaryCTA>
          <SecondaryCTA href="#how" className="h-[50px] px-6 text-[15px]">See how it works</SecondaryCTA>
        </div>
      </div>
      <Reveal delay={0.12} className="relative mt-10 sm:mt-12">
        <HeroShowcase />
      </Reveal>
    </section>
  );
}

/* ----------------------- Section heading helper ------------------------ */

function SectionHead({
  eyebrow,
  title,
  desc,
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={`max-w-[700px] text-[28px] font-[560] leading-[1.12] tracking-[-0.03em] text-[#f7f8f8] sm:text-[38px] sm:leading-[1.08] ${eyebrow ? "mt-4" : ""}`}>
        {title}
      </h2>
      {desc && <p className="mt-4 max-w-[580px] text-[17px] leading-[26px] text-[#8a8f98]">{desc}</p>}
    </div>
  );
}

/* -------------------------- Source search proof ------------------------ */

/* Small monochrome mark per import source — abstract, not a brand logo. */
function SourceMark({ kind }: { kind: "claude" | "chatgpt" | "grok" }) {
  const common = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none", stroke: INK3, strokeWidth: 1.8 } as const;
  if (kind === "claude") return <svg {...common}><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" strokeLinecap="round" /></svg>;
  if (kind === "chatgpt") return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 4v8l5 3" strokeLinecap="round" /></svg>;
  return <svg {...common}><path d="M5 19L19 5M9 5h10v10" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SourceSearchProof() {
  const results = [
    {
      idx: "01",
      kind: "claude" as const,
      title: "Standardized on a Redis token-bucket, 100 req/min",
      source: "Claude export · May 14, 2026",
      excerpt:
        "express-rate-limit kept per-process counters — no shared state once we ran multiple workers. Moved the limiter into the API gateway.",
      tag: "decision",
      dim: false,
    },
    {
      idx: "02",
      kind: "chatgpt" as const,
      title: "In-memory window drifted across staging pods",
      source: "ChatGPT export · Apr 22, 2026",
      excerpt:
        "Bumping the in-memory window worked locally, then quotas diverged once staging ran multiple replicas. Abandoned before the gateway rewrite.",
      tag: "superseded",
      dim: true,
    },
    {
      idx: "03",
      kind: "grok" as const,
      title: "Limiter must survive a gateway restart",
      source: "Grok export · May 2, 2026",
      excerpt:
        "Counts live in Redis so a redeploy doesn't reset everyone's quota mid-window. Non-negotiable for the checkout path.",
      tag: "constraint",
      dim: false,
    },
  ];
  return (
    <section className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-20 sm:px-10 sm:py-28 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <Reveal>
          <div className="flex flex-col gap-7">
            <SectionHead
              eyebrow="Search"
              title="Find the decision, not just the answer."
              desc={
                <>
                  You already solved it once — in some chat you can&rsquo;t find. Rift surfaces the answer with the
                  conversation, app, and date attached, so you can trust it before you reuse it.
                </>
              }
            />
            <div className="flex flex-col gap-3">
              {[
                "Every result carries its original source",
                "Runs on your Mac — no API keys to start",
                "You decide when your agents get access",
              ].map((line) => (
                <div key={line} className="flex items-center gap-2.5">
                  <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.14)]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={INK2} strokeWidth="3">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="text-[15px] leading-[21px] text-[#c8cdd6]">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div
            className="overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)]"
            style={{ background: "#0f1011", boxShadow: "0 30px 80px -44px rgba(0,0,0,0.85)" }}
          >
            <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-3.5">
              <div className="flex items-center gap-3 rounded-[11px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={INK4} strokeWidth="2" className="flex-shrink-0">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
                </svg>
                <span className="truncate text-[14px] text-[#e6e8ea]">
                  why did we drop express-rate-limit?
                </span>
                <kbd style={{ fontFamily: MONO }} className="ml-auto hidden rounded-[5px] border border-[rgba(255,255,255,0.1)] px-1.5 py-0.5 text-[10px] text-[#62666d] sm:block">
                  ⌘K
                </kbd>
              </div>
              <div className="mt-2 flex items-center gap-2 px-1 text-[11px]" style={{ fontFamily: MONO, color: INK4 }}>
                <span>3 results</span>
                <span style={{ color: INK5 }}>·</span>
                <span>local keyword search</span>
                <span style={{ color: INK5 }}>·</span>
                <span>4 ms</span>
              </div>
            </div>
            <div className="grid gap-px bg-[rgba(255,255,255,0.06)]">
              {results.map((result) => (
                <div key={result.title} className="group flex gap-3.5 bg-[#0f1011] p-5 transition-colors duration-150 hover:bg-[#141516]">
                  <div className="flex flex-col items-center gap-2 pt-0.5">
                    <span style={{ fontFamily: MONO }} className="text-[10px] tabular-nums text-[#4d5158]">{result.idx}</span>
                    <span style={{ opacity: result.dim ? 0.5 : 1 }}><SourceMark kind={result.kind} /></span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        style={{ fontFamily: MONO }}
                        className={`rounded-[5px] border px-2 py-1 text-[10px] uppercase tracking-[0.08em] ${
                          result.dim
                            ? "border-[rgba(255,255,255,0.08)] text-[#62666d]"
                            : "border-[rgba(255,255,255,0.2)] text-[#e6e8ea]"
                        }`}
                      >
                        {result.tag}
                      </span>
                      <span style={{ fontFamily: MONO }} className="text-[11px] text-[#62666d]">
                        {result.source}
                      </span>
                    </div>
                    <h3 className={`mt-3 text-[16px] font-[560] leading-[22px] tracking-[-0.01em] ${result.dim ? "text-[#8a8f98]" : "text-[#f7f8f8]"}`}>
                      {result.title}
                    </h3>
                    <p className="mt-2 max-w-[650px] text-[14px] leading-[21px] text-[#8a8f98]">{result.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-[#c8cdd6]">
                      Open source conversation
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform duration-150 group-hover:translate-x-0.5">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </div>
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

/* ---------------- Feature illustration: capture → rift → serve --------- */

function PipeNode({ label, glyph }: { label?: string; glyph?: boolean }) {
  return (
    <span className="relative z-10 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center">
      {glyph ? (
        <span className="h-[11px] w-[11px] rotate-45 rounded-[2px]" style={{ background: INK, boxShadow: "0 0 0 4px rgba(255,255,255,0.08)" }} />
      ) : (
        <span className="h-[7px] w-[7px] rounded-full border" style={{ borderColor: "rgba(255,255,255,0.4)", background: "#0f1011" }} />
      )}
      {label}
    </span>
  );
}

function FlowDiagram() {
  const chip = "rounded-[6px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.025)] px-2 py-[3px] text-[11px] text-[#c8cdd6]";
  return (
    <div className="mt-4" style={{ width: "100%", maxWidth: 300 }}>
      <div className="relative flex flex-col gap-3 pl-[9px]">
        {/* the connecting rail */}
        <span aria-hidden className="absolute left-[9px] top-2 bottom-2 w-px -translate-x-1/2" style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.18),rgba(255,255,255,0.04))" }} />
        <div className="flex items-start gap-3">
          <PipeNode />
          <div className="flex flex-col gap-1.5 pt-px">
            <Eyebrow className="!text-[9.5px] !tracking-[0.12em] !text-[#62666d]">captured &amp; imported</Eyebrow>
            <div className="flex flex-wrap gap-1.5">
              {["ChatGPT", "Claude", "Grok", "Gemini"].map((t) => (
                <span key={t} style={{ fontFamily: MONO }} className={chip}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PipeNode glyph />
          <span className="text-[12px] font-medium" style={{ color: INK }}>rift archive <span style={{ color: INK4, fontWeight: 400 }}>· local, source-tagged</span></span>
        </div>
        <div className="flex items-start gap-3">
          <PipeNode />
          <div className="flex flex-col gap-1.5 pt-px">
            <Eyebrow className="!text-[9.5px] !tracking-[0.12em] !text-[#62666d]">served over MCP</Eyebrow>
            <div className="flex flex-wrap gap-1.5">
              {["Claude", "Cursor", "Codex"].map((t) => (
                <span key={t} style={{ fontFamily: MONO }} className={chip}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Feature illustration: local-first ------------------- */

function LocalFirstViz() {
  const egress = [
    { name: "Voyage AI", detail: "semantic search · only with a key" },
    { name: "Codex CLI", detail: "enrichment · opt-in · your OpenAI account" },
  ];
  return (
    <div className="mt-4 flex flex-col gap-3" style={{ width: "100%", maxWidth: 300 }}>
      {/* the device boundary — everything inside stays put */}
      <div className="rounded-[10px] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.015)] p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={INK3} strokeWidth="1.8"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
          <Eyebrow className="!text-[9.5px] !tracking-[0.12em] !text-[#8a8f98]">your mac</Eyebrow>
        </div>
        <div className="flex flex-col gap-1.5">
          {["transcripts & exports", "vector index", "search results"].map((x) => (
            <div key={x} className="flex items-center gap-2">
              <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full bg-[#f7f8f8]" />
              <span style={{ fontFamily: MONO }} className="text-[12px] text-[#d0d6e0]">{x}</span>
            </div>
          ))}
        </div>
      </div>
      {/* opt-in egress crosses a dashed boundary */}
      <div className="flex items-center gap-2">
        <span className="h-px flex-1" style={{ background: "repeating-linear-gradient(90deg,rgba(255,255,255,0.22) 0 4px,transparent 4px 8px)" }} />
        <span style={{ fontFamily: MONO }} className="text-[9px] uppercase tracking-[0.1em] text-[#62666d]">opt-in egress</span>
        <span className="h-px flex-1" style={{ background: "repeating-linear-gradient(90deg,rgba(255,255,255,0.22) 0 4px,transparent 4px 8px)" }} />
      </div>
      {egress.map((e) => (
        <div key={e.name} className="flex items-start gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={INK4} strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div className="flex flex-col gap-0.5">
            <span style={{ fontFamily: MONO }} className="text-[12px] text-[#d0d6e0]">{e.name}</span>
            <span style={{ fontFamily: MONO }} className="text-[10px] text-[#62666d]">{e.detail}</span>
          </div>
        </div>
      ))}
      <span className="text-[11px] text-[#62666d]">Nothing goes to Rift.</span>
    </div>
  );
}

/* ----------------- Feature illustration: current truth ----------------- */

function CurrentTruthViz() {
  return (
    <div className="mt-4 flex flex-col gap-3" style={{ width: "100%", maxWidth: 300 }}>
      <Eyebrow className="!text-[9.5px] !tracking-[0.12em] !text-[#62666d]">how do we rate limit?</Eyebrow>
      <div className="flex flex-col gap-1.5 rounded-[8px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded-full bg-[#f7f8f8]">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#08090a" strokeWidth="3.5"><path d="M5 12l5 5L20 7" /></svg>
          </span>
          <span style={{ fontFamily: MONO }} className="text-[12px] text-[#f7f8f8]">rate-limit.ts</span>
          <span style={{ fontFamily: MONO }} className="ml-auto text-[9px] uppercase tracking-[0.06em] text-[#c8cdd6]">current</span>
        </div>
        <span className="pl-[23px] text-[12px] text-[#8a8f98]">Redis token-bucket · 100/min</span>
      </div>
      <div className="flex flex-col gap-1.5 px-2.5" style={{ opacity: 0.55 }}>
        <div className="flex items-center gap-2">
          <span className="flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded-full border border-[rgba(255,255,255,0.16)]">
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={INK4} strokeWidth="3.5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </span>
          <span style={{ fontFamily: MONO }} className="text-[12px] text-[#62666d]">chat · Mar 3</span>
          <span style={{ fontFamily: MONO }} className="ml-auto text-[9px] uppercase tracking-[0.06em] text-[#62666d]">superseded</span>
        </div>
        <span className="pl-[23px] text-[12px] text-[#62666d] line-through">express-rate-limit</span>
      </div>
    </div>
  );
}

/* ----------------- Feature illustration: token-aware ------------------- */

function TokenViz() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-4 flex flex-col gap-3.5" style={{ width: "100%", maxWidth: 300 }}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span style={{ fontFamily: MONO }} className="text-[11px] text-[#8a8f98]">raw archive</span>
          <span style={{ fontFamily: MONO }} className="text-[10.5px] tabular-nums text-[#62666d]">48 KB · ~12k tok</span>
        </div>
        {/* the full track is the raw archive; the bright slice is what Rift actually sends */}
        <div className="relative h-7 w-full overflow-hidden rounded-[7px]" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div aria-hidden className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(90deg,transparent 0 9px,rgba(255,255,255,0.04) 9px 10px)" }} />
          <motion.div
            className="absolute inset-y-0 left-0 flex items-center rounded-[7px] pl-2.5"
            style={{ background: "#f7f8f8" }}
            initial={reduce ? false : { width: "0%" }}
            whileInView={{ width: "9%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          />
          <span className="absolute inset-y-0 left-[calc(9%+10px)] flex items-center text-[10.5px]" style={{ fontFamily: MONO, color: INK2 }}>
            context pack · 3.8 KB
          </span>
        </div>
      </div>
      <div className="flex items-baseline gap-2.5">
        <span className="text-[42px] font-[600] leading-none tracking-[-0.035em] text-[#f7f8f8] tabular-nums">−92%</span>
        <span className="text-[11.5px] leading-[15px] text-[#62666d]">
          tokens loaded — the slice that matters, not the transcript.
        </span>
      </div>
    </div>
  );
}

/* ----------------- Feature illustration: MCP surface ------------------- */

const MCP_TOOLS = [
  { name: "rift_context_pack", note: "bounded pack · 4 memories", def: true },
  { name: "rift_search", note: "ranked source-backed hits", def: false },
  { name: "rift_conversations_search", note: "filtered recall", def: false },
  { name: "rift_save", note: "write a memory", def: false },
  { name: "rift_status", note: "index health", def: false },
];

function McpToolsViz() {
  return (
    <div className="mt-4 flex flex-col" style={{ width: "100%", maxWidth: 300 }}>
      {MCP_TOOLS.map((t, i) => (
        <div key={t.name} className="flex items-center gap-2 py-[5px]" style={i ? { borderTop: "1px solid rgba(255,255,255,0.05)" } : undefined}>
          <span className="h-[5px] w-[5px] flex-shrink-0 rounded-full" style={{ background: t.def ? INK : INK5 }} />
          <span style={{ fontFamily: MONO }} className={`text-[12px] ${t.def ? "text-[#f7f8f8]" : "text-[#c8cdd6]"}`}>{t.name}</span>
          {t.def && (
            <span style={{ fontFamily: MONO }} className="rounded-[4px] border border-[rgba(255,255,255,0.16)] px-1 py-px text-[8.5px] uppercase tracking-[0.06em] text-[#c8cdd6]">
              default
            </span>
          )}
          <span style={{ fontFamily: MONO }} className="ml-auto truncate pl-2 text-[10px] text-[#62666d]">{t.note}</span>
        </div>
      ))}
    </div>
  );
}

/* ----------------- Feature illustration: import ------------------------ */

const IMPORT_FILES = [
  { name: "chatgpt-export.zip", convos: "1,204" },
  { name: "claude-conversations.json", convos: "863" },
  { name: "grok-export.json", convos: "97" },
];

function ImportViz() {
  return (
    <div className="mt-4 flex flex-col gap-3" style={{ width: "100%", maxWidth: 300 }}>
      <div className="flex flex-col gap-2">
        {IMPORT_FILES.map((f) => (
          <div key={f.name} className="flex items-center gap-2.5 rounded-[7px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] px-2.5 py-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK3} strokeWidth="1.7" className="flex-shrink-0"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /></svg>
            <span style={{ fontFamily: MONO }} className="truncate text-[12px] text-[#d0d6e0]">{f.name}</span>
            <span style={{ fontFamily: MONO }} className="ml-auto flex-shrink-0 text-[10px] tabular-nums text-[#62666d]">{f.convos}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="3" className="flex-shrink-0"><path d="M5 12l5 5L20 7" /></svg>
          </div>
        ))}
      </div>
      <span className="border-t border-[rgba(255,255,255,0.06)] pt-3 text-[11px] text-[#62666d]">
        2,164 conversations imported as-is — AI triage is opt-in, off by default.
      </span>
    </div>
  );
}

/* ------------------------------ Features ------------------------------- */

function Crosshair({ style }: { style: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", transform: "translateX(-50%)", ...style }}>
      <svg width="13" height="13" viewBox="0 0 13 13">
        <path d="M6.5 0v13M0 6.5h13" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
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
    <div className={`flex min-w-0 flex-1 flex-col gap-3 p-7 ${divider ? "border-t border-[rgba(255,255,255,0.06)] md:border-l md:border-t-0" : ""}`}>
      <h3 className="text-[20px] font-[560] leading-[25px] tracking-[-0.02em] text-[#f7f8f8]">
        {t1}
        <br />
        {t2}
      </h3>
      <p className="text-[14px] leading-[21px] text-[#8a8f98]">{desc}</p>
      {children}
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Capabilities"
            title="What changes once Rift is connected."
            desc={
              <>
                Connected tools can start with what you already worked out — the decisions, constraints, and context
                you&rsquo;d otherwise re-explain from scratch.
              </>
            }
          />
        </Reveal>

        {/* Row 1 */}
        <Reveal delay={0.05}>
          <div className="relative mt-11 flex flex-col items-stretch border-y border-[rgba(255,255,255,0.06)] md:flex-row">
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
          <div className="relative flex flex-col items-stretch border-b border-[rgba(255,255,255,0.06)] md:flex-row">
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
            <Eyebrow>Pairs with hand-written notes</Eyebrow>
            <h3 className="max-w-[720px] text-[26px] font-[560] leading-[1.2] tracking-[-0.025em] text-[#f7f8f8] sm:text-[30px] sm:leading-[38px]">
              Already keep AI project notes? Rift covers the sessions you do not write down.
            </h3>
            <p className="max-w-[680px] text-[17px] leading-[27px] text-[#8a8f98] sm:text-[18px] sm:leading-[29px]">
              Hand-tended notes are great for what you deliberately save. Rift covers the other half: the decisions,
              dead-ends, and details buried in real sessions, imported with sources and served back when a connected
              tool asks for them.
            </p>
          </div>
        </Reveal>
      </div>
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
      <span style={{ fontFamily: MONO, fontSize: 13, color: INK2, lineHeight: "20px" }}>{children}</span>
    </div>
  );
}

function ToolCallProof() {
  return (
    <section className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="In the loop"
            title="Your agent asks Rift mid-task — instead of asking you."
            desc={
              <>
                Claude Code, Cursor, and Codex pull a source-backed context pack the moment they need it — so the work you
                already did carries forward instead of getting re-explained.
              </>
            }
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div
            className="mt-9 overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.08)]"
            style={{ background: "#0b0c0d", boxShadow: "0 30px 80px -44px rgba(0,0,0,0.85)" }}
          >
            <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
              <MacDots />
              <span style={{ fontFamily: MONO }} className="pl-2 text-[12px] text-[#62666d]">
                checkout-service — claude — 92×30
              </span>
            </div>
            <div className="flex flex-col gap-4 px-[18px] pb-[18px] pt-3.5">
              <TermLine glyph=">" glyphColor={INK4}>
                <span style={{ color: INK2 }}>add rate limiting to the checkout route — same approach we used before</span>
              </TermLine>
              <TermLine glyph="dot" glyphColor={INK}>
                I&rsquo;ll check how rate limiting was handled before pulling it into checkout.
              </TermLine>

              <div className="flex flex-col gap-[5px]">
                <TermLine glyph="dot" glyphColor={INK}>
                  <span style={{ color: INK4 }}>rift -</span> rift_context_pack
                  <span style={{ color: INK4 }}>(task: </span>
                  <span style={{ color: SYN.str }}>{`"rate limiting middleware"`}</span>
                  <span style={{ color: INK4 }}>)</span>
                </TermLine>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 13, color: INK5, lineHeight: "20px" }}>
                    &#9215;
                  </span>
                  <div className="flex flex-col" style={{ fontFamily: MONO }}>
                    <span className="text-[13px] leading-[20px] text-[#8a8f98]">Received 4 memories (3.8 KB)</span>
                    <span className="text-[13px] leading-[20px] text-[#c8cdd6]">
                      <span style={{ color: INK4 }}>decision:</span> token-bucket via Redis, 100 req/min — api-gateway
                    </span>
                    <span className="text-[13px] leading-[20px] text-[#5d626a]">… +9 lines (ctrl+r to expand)</span>
                  </div>
                </div>
              </div>

              <TermLine glyph="dot" glyphColor={INK}>
                You standardized on a Redis token-bucket limiter (express-rate-limit was dropped — no shared state).
                Matching it on /checkout:
              </TermLine>

              <div className="flex flex-col gap-[5px]">
                <TermLine glyph="dot" glyphColor={INK}>
                  Update<span style={{ color: INK4 }}>(</span>src/routes/checkout.ts<span style={{ color: INK4 }}>)</span>
                </TermLine>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ flexShrink: 0, fontFamily: MONO, fontSize: 13, color: INK5, lineHeight: "20px" }}>
                    &#9215;
                  </span>
                  <div className="flex flex-1 flex-col overflow-hidden rounded-[6px] border" style={{ borderColor: "rgba(255,255,255,0.07)", fontFamily: MONO }}>
                    <span className="px-2 py-[3px] text-[12px] text-[#8a8f98]" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      Updated src/routes/checkout.ts with 2 additions
                    </span>
                    <div className="flex items-center gap-[14px] px-2" style={{ background: "rgba(255,255,255,0.055)", borderLeft: "2px solid rgba(255,255,255,0.5)", lineHeight: "21px" }}>
                      <span className="text-[12px]" style={{ color: INK5 }}>1</span>
                      <span className="truncate text-[12px]">
                        <Mono c={SYN.punc}>+ </Mono><Mono c={SYN.kw}>import</Mono><Mono c={SYN.punc}> {"{ "}</Mono><Mono c={SYN.fn}>rateLimit</Mono><Mono c={SYN.punc}>{" } "}</Mono><Mono c={SYN.kw}>from</Mono><Mono c={SYN.punc}> </Mono><Mono c={SYN.str}>&quot;../middleware/rateLimit&quot;</Mono><Mono c={SYN.punc}>;</Mono>
                      </span>
                    </div>
                    <div className="flex items-center gap-[14px] px-2" style={{ background: "rgba(255,255,255,0.055)", borderLeft: "2px solid rgba(255,255,255,0.5)", lineHeight: "21px" }}>
                      <span className="text-[12px]" style={{ color: INK5 }}>8</span>
                      <span className="truncate text-[12px]">
                        <Mono c={SYN.punc}>+ </Mono><Mono c={SYN.fn}>router</Mono><Mono c={SYN.punc}>.</Mono><Mono c={SYN.fn}>post</Mono><Mono c={SYN.punc}>(</Mono><Mono c={SYN.str}>&quot;/checkout&quot;</Mono><Mono c={SYN.punc}>, </Mono><Mono c={SYN.fn}>rateLimit</Mono><Mono c={SYN.punc}>({"{ "}</Mono><Mono c={SYN.kw}>max</Mono><Mono c={SYN.punc}>: </Mono><Mono c={SYN.num}>100</Mono><Mono c={SYN.punc}> {"}"})</Mono><Mono c={SYN.punc}>, </Mono><Mono c={SYN.fn}>handler</Mono><Mono c={SYN.punc}>);</Mono>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-[7px] pt-1.5">
                <div className="flex items-center gap-2.5 rounded-[10px] border border-[rgba(255,255,255,0.1)] px-[14px] py-[11px]">
                  <span style={{ fontFamily: MONO }} className="text-[13px] text-[#62666d]">
                    &gt;
                  </span>
                  <span className="h-4 w-[7px]" style={{ background: INK5 }} />
                </div>
                <div className="flex items-center justify-between px-1">
                  <span style={{ fontFamily: MONO }} className="text-[11px] text-[#52565d]">
                    ⏵⏵ accept edits on · ? for shortcuts
                  </span>
                  <span style={{ fontFamily: MONO }} className="flex items-center gap-1.5 text-[11px] text-[#8a8f98]">
                    <LiveDot size={5} />
                    rift · connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------- Local & precise strip ----------------------- */

function ValueCard({
  kicker,
  title,
  desc,
  children,
}: {
  kicker: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-[#0f1011] p-7 transition-colors duration-150 hover:bg-[#141516]">
      <Eyebrow>{kicker}</Eyebrow>
      <h3 className="mt-3 text-[19px] font-[560] leading-[25px] tracking-[-0.02em] text-[#f7f8f8]">{title}</h3>
      <p className="mt-2.5 text-[14px] leading-[21px] text-[#8a8f98]">{desc}</p>
      <div className="mt-auto pt-2">{children}</div>
    </div>
  );
}

function LocalAndPrecise() {
  return (
    <section className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Trust"
            title="Private by default. Precise by design."
            desc="Your work stays on your machine, and your tools get the exact slice they need — never a raw transcript dump."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-11 grid gap-px overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] md:grid-cols-3">
            <ValueCard
              kicker="Local-first"
              title="Your archive never leaves your Mac"
              desc="Transcripts, index, and results stay local. Semantic search and enrichment only reach out when you hand over a key."
            >
              <LocalFirstViz />
            </ValueCard>
            <ValueCard
              kicker="Token-aware"
              title="The decision, not the transcript"
              desc="Rift returns a byte-capped context pack sized for the task — so your agent spends its window on signal, not scrollback."
            >
              <TokenViz />
            </ValueCard>
            <ValueCard
              kicker="Always current"
              title="Live files beat stale chats"
              desc="When a current file contradicts an old conversation, Rift trusts the file and flags the chat as superseded."
            >
              <CurrentTruthViz />
            </ValueCard>
          </div>
        </Reveal>
      </div>
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
    <section id="how" className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="How it works"
            title="Three steps from scattered chats to context your tools can use."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-11 grid gap-px overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col gap-3 bg-[#0f1011] p-7 transition-colors duration-150 hover:bg-[#141516]">
                <span style={{ fontFamily: MONO }} className="text-[13px] text-[#f7f8f8] tabular-nums">
                  {s.n}
                </span>
                <h3 className="text-[18px] font-[560] tracking-[-0.01em] text-[#f7f8f8]">{s.title}</h3>
                <p className="text-[14px] leading-[21px] text-[#8a8f98]">{s.body}</p>
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
      live: true,
      title: "Export import + keyword search",
      body: "Import and keyword search work without Codex or embeddings. Start with ChatGPT, Claude, Grok, or Gemini exports.",
    },
    {
      status: "available after setup",
      live: true,
      title: "Agent connections",
      body: "Claude Desktop, Claude Code, Cursor, and Codex can ask Rift for source-backed context over MCP.",
    },
    {
      status: "planned for beta.19",
      live: false,
      title: "Double-click Mac package",
      body: "Today's supported setup is the terminal installer. The Mac package is scoped, but not the live path yet.",
    },
  ];

  return (
    <section className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-[1200px] px-6 py-16 sm:px-10 sm:py-24">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Beta status</Eyebrow>
              <h2 className="mt-4 max-w-[620px] text-[28px] font-[560] leading-[1.12] tracking-[-0.03em] text-[#f7f8f8] sm:text-[34px] sm:leading-[40px]">
                Truthful enough to ship. Narrow enough to learn.
              </h2>
            </div>
            <p className="max-w-[380px] text-[15px] leading-[22px] text-[#8a8f98]">
              Private beta is for invited Mac users with real exports to test. The page stays lean because the product
              is still moving fast.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] md:grid-cols-3">
            {items.map((item) => (
              <div key={item.title} className="bg-[#0f1011] p-6">
                <span
                  style={{ fontFamily: MONO }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] ${
                    item.live
                      ? "border-[rgba(255,255,255,0.2)] text-[#e6e8ea]"
                      : "border-[rgba(255,255,255,0.08)] text-[#8a8f98]"
                  }`}
                >
                  <span className={`h-[5px] w-[5px] rounded-full ${item.live ? "bg-[#f7f8f8]" : "bg-[#4d5158]"}`} />
                  {item.status}
                </span>
                <h3 className="mt-4 text-[17px] font-[560] tracking-[-0.01em] text-[#f7f8f8]">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-[21px] text-[#8a8f98]">{item.body}</p>
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
      className="rounded-[4px] border border-[rgba(255,255,255,0.1)] px-1.5 py-px text-[9px] uppercase tracking-[0.06em] text-[#8a8f98]"
    >
      {children}
    </span>
  );
}

function Compatibility() {
  return (
    <section className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Compatibility"
            title="Works where your AI work already happens."
            desc={
              <>
                <span className="text-[#d0d6e0]">Import source</span> means Rift can read past work from there.{" "}
                <span className="text-[#d0d6e0]">Connected tool</span> means it can ask Rift for context while you work.
              </>
            }
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-11 grid gap-5 md:grid-cols-2">
            <div className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-7">
              <Eyebrow className="!tracking-[0.1em]">Captured &amp; imported from</Eyebrow>
              <ul className="mt-5 flex flex-col">
                {IMPORT_FROM.map((x) => (
                  <li
                    key={x.label}
                    className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] py-2.5 last:border-0 last:pb-0"
                  >
                    <span className="text-[15px] text-[#d0d6e0]">{x.label}</span>
                    <RailTag>{x.tag}</RailTag>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[#0f1011] p-7">
              <Eyebrow className="!tracking-[0.1em]">Served to · MCP clients</Eyebrow>
              <ul className="mt-5 flex flex-col">
                {SERVE_TO.map((x) => (
                  <li key={x} className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] py-2.5">
                    <span className="text-[15px] text-[#d0d6e0]">{x}</span>
                    <LiveDot size={6} />
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[13px] leading-[19px] text-[#62666d]">
                These four are wired up by{" "}
                <span style={{ fontFamily: MONO }} className="text-[#c8cdd6]">
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
    <section className="border-t border-[rgba(255,255,255,0.06)]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <Reveal>
          <SectionHead
            eyebrow="Pricing"
            title="One license. One archive across your connected tools."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-14">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[44px] font-[560] leading-none tracking-[-0.02em] text-[#f7f8f8] tabular-nums">€99</span>
                <span className="text-[15px] text-[#8a8f98]">/ year</span>
                <span
                  style={{ fontFamily: MONO }}
                  className="ml-1 rounded-[5px] border border-[rgba(255,255,255,0.2)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.04em] text-[#e6e8ea]"
                >
                  best value
                </span>
              </div>
              <span className="text-[13px] text-[#62666d]">≈ €8.25 / month · billed annually</span>
            </div>
            <span className="hidden h-12 w-px bg-[rgba(255,255,255,0.08)] sm:block" />
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[44px] font-[560] leading-none tracking-[-0.02em] text-[#f7f8f8] tabular-nums">€12</span>
                <span className="text-[15px] text-[#8a8f98]">/ month</span>
              </div>
              <span className="text-[13px] text-[#62666d]">month-to-month, cancel anytime</span>
            </div>
          </div>
          <p className="mt-9 max-w-[520px] text-[15px] leading-[23px] text-[#8a8f98]">
            One license covers the MCP clients you connect — no per-tool or per-seat fees. Free while in private
            beta; you&rsquo;ll get plenty of notice before it&rsquo;s paid.
          </p>
          <PrimaryCTA href={START} className="mt-7 h-[50px] px-6 text-[15px]">Join the Mac beta</PrimaryCTA>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- CTA ---------------------------------- */

function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-[rgba(255,255,255,0.06)]">
      {/* one contained atmospheric light behind the headline — neutral, not a colour wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2"
        style={{ background: "radial-gradient(50% 60% at 50% 0%, rgba(255,255,255,0.08), transparent 70%)" }}
      />
      <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-[26px] px-6 py-24 sm:px-10 sm:py-[120px]">
        <div className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] py-1.5 pl-2 pr-3">
          <LiveDot />
          <span className="text-[12.5px] font-medium text-[#c8cdd6]">Private beta · macOS</span>
        </div>
        <h2 className="max-w-[820px] text-center text-[30px] font-[560] leading-[1.08] tracking-[-0.035em] text-[#f7f8f8] sm:text-[58px] sm:leading-[1.02]">
          Never solve the same
          <br />
          problem twice.
        </h2>
        <p className="max-w-[560px] text-center text-[17px] leading-[26px] text-[#8a8f98] sm:text-[18px] sm:leading-[27px]">
          We&rsquo;re opening Mac beta seats for people with real ChatGPT, Claude, Grok, or Gemini history to bring in.
          Local search works the moment you import — agents connect when you&rsquo;re ready.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2.5">
          <PrimaryCTA href={START} className="h-[50px] px-6 text-[15px]">Join the Mac beta</PrimaryCTA>
          <SecondaryCTA href="/privacy" className="h-[50px] px-6 text-[15px]">Read the privacy contract</SecondaryCTA>
        </div>
        <p className="text-center text-[13px] text-[#5d626a]">
          Ships as a native Mac app — terminal install available now for early seats.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#08090a]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center sm:px-10">
        <div className="flex items-center gap-2.5">
          <span className="h-[13px] w-[13px] rotate-45 rounded-[3px] bg-[#f7f8f8]" />
          <span className="text-[15px] font-semibold tracking-tight text-[#f7f8f8]">rift</span>
        </div>
        <div className="flex items-center gap-7 text-[13px] text-[#8a8f98]">
          <Link href="/privacy" className="transition-colors hover:text-[#f7f8f8]">
            Privacy
          </Link>
          <Link href={START} className="transition-colors hover:text-[#f7f8f8]">
            Join the Mac beta
          </Link>
          <span className="text-[#5d626a]">© {new Date().getFullYear()} Rift</span>
        </div>
      </div>
    </footer>
  );
}

export default function HomeContentFull() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#08090a] font-sans text-[#f7f8f8] antialiased">
      <Nav />
      <Hero />
      <SourceSearchProof />
      <LocalAndPrecise />
      {SHOW_FULL_PAGE && <ToolCallProof />}
      <HowItWorks />
      {SHOW_FULL_PAGE && <BetaStatus />}
      {SHOW_FULL_PAGE && <Compatibility />}
      {SHOW_FULL_PAGE && <Features />}
      {SHOW_FULL_PAGE && <Pricing />}
      <CTA />
      <Footer />
    </main>
  );
}
