"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ProviderMark, type MarkId } from "./provider-icons";

const MONO = "var(--font-mono)";
const START = "/start";
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* Nodes: providers on the left (your AI history feeds IN), agents on the right
   (served OUT over MCP). Angles are degrees around the convergence point. */
type Node = { id: MarkId; deg: number };
const NODES: Node[] = [
  { id: "chatgpt", deg: 128 },
  { id: "claude", deg: 162 },
  { id: "grok", deg: 198 },
  { id: "gemini", deg: 232 },
  { id: "codex", deg: -44 },
  { id: "cursor", deg: 0 },
  { id: "claudecode", deg: 44 },
];
/* Routed "feeding" pulses: a chat captured in one tool travels through the Rift
   core and back out to another — cross-tool memory made visible. */
const ROUTES: [string, string][] = [
  ["claude", "chatgpt"],
  ["chatgpt", "cursor"],
  ["grok", "codex"],
  ["gemini", "claudecode"],
  ["claude", "codex"],
  ["chatgpt", "claudecode"],
];

function LiveDot() {
  return (
    <span className="relative inline-flex h-3 w-3 flex-shrink-0 items-center justify-center">
      <span className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-[#f7f8f8]" />
    </span>
  );
}

/* Full-viewport background: provider/agent logos orbit a Rift core that sits on the
   word "solved" — wires + pulses (both ways) + routed pulses all converge there. */
function ConstellationBg({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [g, setG] = useState<{ cx: number; cy: number; pos: Record<string, { x: number; y: number }> } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const cr = el.getBoundingClientRect();
      let cx = cr.width / 2;
      let cy = cr.height * 0.5;
      const t = targetRef.current;
      if (t) {
        const tr = t.getBoundingClientRect();
        cx = (tr.left + tr.right) / 2 - cr.left;
        cy = (tr.top + tr.bottom) / 2 - cr.top;
      }
      const rx = Math.min(cr.width * 0.42, 640);
      const ry = Math.min(cr.height * 0.4, 392);
      const pos: Record<string, { x: number; y: number }> = {};
      for (const n of NODES) {
        const a = (n.deg * Math.PI) / 180;
        pos[n.id] = { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
      }
      setG({ cx, cy, pos });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const settle = setTimeout(measure, 950); // re-measure after the entrance settles
    return () => {
      ro.disconnect();
      clearTimeout(settle);
    };
  }, [targetRef]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage: "radial-gradient(64% 62% at 50% 48%, #000, transparent 80%)",
          maskImage: "radial-gradient(64% 62% at 50% 48%, #000, transparent 80%)",
        }}
      />
      {g && (
        <>
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <filter id="cglow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {NODES.map((n) => {
              const p = g.pos[n.id];
              return <line key={n.id} x1={p.x} y1={p.y} x2={g.cx} y2={g.cy} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />;
            })}
            {!reduce &&
              NODES.map((n, i) => {
                const p = g.pos[n.id];
                const b1 = i * 0.5;
                const b2 = i * 0.5 + 1.6;
                return (
                  <g key={"p" + n.id}>
                    <circle r={1.7} fill="rgba(255,255,255,0.55)">
                      <animateMotion dur="3.4s" begin={`${b1}s`} repeatCount="indefinite" calcMode="linear" path={`M ${p.x} ${p.y} L ${g.cx} ${g.cy}`} />
                      <animate attributeName="opacity" values="0;.7;.7;0" keyTimes="0;.12;.8;1" dur="3.4s" begin={`${b1}s`} repeatCount="indefinite" />
                    </circle>
                    <circle r={1.7} fill="rgba(255,255,255,0.4)">
                      <animateMotion dur="3.4s" begin={`${b2}s`} repeatCount="indefinite" calcMode="linear" path={`M ${g.cx} ${g.cy} L ${p.x} ${p.y}`} />
                      <animate attributeName="opacity" values="0;.5;.5;0" keyTimes="0;.12;.8;1" dur="3.4s" begin={`${b2}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                );
              })}
            {!reduce &&
              ROUTES.map(([a, b], i) => {
                const A = g.pos[a];
                const B = g.pos[b];
                if (!A || !B) return null;
                const begin = i * 1.15;
                return (
                  <circle key={"r" + i} r={2.6} fill="#fff" filter="url(#cglow)">
                    <animateMotion dur="4.4s" begin={`${begin}s`} repeatCount="indefinite" calcMode="linear" keyPoints="0;0.5;1" keyTimes="0;0.5;1" path={`M ${A.x} ${A.y} L ${g.cx} ${g.cy} L ${B.x} ${B.y}`} />
                    <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;.08;.5;.9;1" dur="4.4s" begin={`${begin}s`} repeatCount="indefinite" />
                  </circle>
                );
              })}
          </svg>

          {NODES.map((n) => {
            const p = g.pos[n.id];
            return (
              <div
                key={n.id}
                className="absolute flex h-[54px] w-[54px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.1)] text-[#9298a0] backdrop-blur-sm"
                style={{ left: p.x, top: p.y, transform: "translate(-50%,-50%)", background: "rgba(12,13,15,0.82)", boxShadow: "0 8px 26px -12px rgba(0,0,0,0.9)" }}
              >
                <ProviderMark id={n.id} size={28} />
              </div>
            );
          })}

          {/* Rift core — soft glow + breathing diamond, sitting on "solved" */}
          <motion.span
            className="absolute rounded-[6px]"
            style={{
              left: g.cx,
              top: g.cy,
              width: 16,
              height: 16,
              transform: "translate(-50%,-50%) rotate(45deg)",
              background: "linear-gradient(180deg,#fff,#b6bcc4)",
            }}
            animate={
              reduce
                ? {}
                : {
                    boxShadow: [
                      "0 0 0 1px rgba(255,255,255,.5),0 0 26px 7px rgba(255,255,255,.3),0 0 70px 20px rgba(255,255,255,.12)",
                      "0 0 0 1px rgba(255,255,255,.62),0 0 40px 11px rgba(255,255,255,.44),0 0 100px 30px rgba(255,255,255,.18)",
                      "0 0 0 1px rgba(255,255,255,.5),0 0 26px 7px rgba(255,255,255,.3),0 0 70px 20px rgba(255,255,255,.12)",
                    ],
                  }
            }
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-10 mx-auto flex h-[60px] w-full max-w-[1100px] items-center justify-between px-6 sm:px-10">
      <Link href="/" aria-label="Rift home" className="flex items-center gap-2.5">
        <span className="h-[13px] w-[13px] rotate-45 rounded-[3px] bg-[#f7f8f8]" />
        <span className="text-[16px] font-semibold tracking-tight text-[#f7f8f8]">rift</span>
      </Link>
      <Link href="/privacy" className="text-[13.5px] text-[#8a8f98] transition-colors hover:text-[#f7f8f8]">
        Privacy
      </Link>
    </header>
  );
}

/* Premium staggered word reveal for the headline. */
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.052, delayChildren: 0.12 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

export default function HomeContent() {
  const reduce = useReducedMotion();
  const solvedRef = useRef<HTMLSpanElement>(null);

  const line1 = ["Stop", "re-explaining", "what"];
  const line2 = ["you", "already"];

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#08090a] font-sans text-[#f7f8f8] antialiased">
      <ConstellationBg targetRef={solvedRef} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(42% 38% at 50% 48%, rgba(8,9,10,.74), rgba(8,9,10,.3) 60%, transparent 80%)" }}
      />

      <Nav />

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 sm:py-16">
        <div className="flex max-w-[760px] flex-col items-center text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] py-1.5 pl-2 pr-3 backdrop-blur-md"
          >
            <LiveDot />
            <span className="text-[12.5px] font-medium text-[#c8cdd6]">Local-first · Private beta · macOS</span>
          </motion.div>

          <motion.h1
            variants={reduce ? undefined : headlineContainer}
            initial={reduce ? false : "hidden"}
            animate={reduce ? {} : "show"}
            className="mt-7 text-[38px] font-[560] leading-[1.03] tracking-[-0.038em] text-[#f7f8f8] sm:text-[66px] sm:leading-[1.0]"
            style={{ textShadow: "0 2px 40px rgba(8,9,10,0.85)" }}
          >
            {line1.flatMap((w, i) => [
              <motion.span key={`l1-${i}`} variants={reduce ? undefined : headlineWord} className="inline-block">
                {w}
              </motion.span>,
              i < line1.length - 1 ? <span key={`l1s-${i}`}> </span> : null,
            ])}
            <br className="hidden sm:block" />{" "}
            {line2.flatMap((w, i) => [
              <motion.span key={`l2-${i}`} variants={reduce ? undefined : headlineWord} className="inline-block">
                {w}
              </motion.span>,
              <span key={`l2s-${i}`}> </span>,
            ])}
            <motion.span ref={solvedRef} variants={reduce ? undefined : headlineWord} className="inline-block">
              solved.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            className="mt-6 max-w-[560px] text-[17px] leading-[27px] text-[#8a8f98] sm:text-[19px] sm:leading-[30px]"
            style={{ textShadow: "0 1px 22px rgba(8,9,10,0.85)" }}
          >
            Your ChatGPT, Claude, Grok, and Gemini history becomes a private archive that lives on your Mac —
            searchable in a keystroke, reusable in Claude Code, Cursor, and Codex.{" "}
            <b className="font-semibold text-[#c8cdd6]">Local-first by default</b> — no conversation content leaves your Mac unless you turn on Voyage, Codex, or feedback.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.66 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href={START}
              className="group inline-flex h-[50px] items-center gap-2 rounded-[10px] bg-[#f7f8f8] px-6 text-[15px] font-semibold text-[#08090a] transition-all duration-150 hover:bg-white"
            >
              Join the Mac beta
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="transition-transform duration-150 group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/privacy"
              className="inline-flex h-[50px] items-center gap-2 rounded-[10px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-6 text-[15px] font-medium text-[#d0d6e0] backdrop-blur-md transition-all duration-150 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[#f7f8f8]"
            >
              Read the privacy contract
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex w-full max-w-[1100px] items-center justify-between px-6 py-7 text-[12.5px] text-[#62666d] sm:px-10">
        <span>© {new Date().getFullYear()} Rift</span>
        <Link href="/privacy" className="transition-colors hover:text-[#c8cdd6]">
          Privacy
        </Link>
      </footer>
    </main>
  );
}
