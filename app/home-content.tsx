"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ProviderMark, type MarkId } from "./provider-icons";
import { RiftLogo, RiftMark } from "./rift-logo";
import InviteModal from "./invite-modal";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* Deterministic per-element noise so every pulse/float/halo runs on its own
   clock — no synchronized loops, no Math.random (stable across renders). */
const fract = (x: number) => x - Math.floor(x);
const seeded = (n: number) => fract(Math.sin(n * 12.9898 + 78.233) * 43758.5453);

/* Distinct AI tools orbiting the Rift core. Intentionally NOT evenly spaced:
   each carries an angle, a radius factor (some sit closer, some farther) and a
   depth 0..1 (near = larger, brighter, sharper; far = smaller, dimmer, softer)
   so the field reads as space, not a clock face. */
type Node = { id: MarkId; deg: number; r: number; depth: number };
const NODES: Node[] = [
  { id: "chatgpt", deg: -88, r: 1.06, depth: 0.92 },
  { id: "cursor", deg: -41, r: 0.83, depth: 0.5 },
  { id: "claude", deg: 7, r: 1.14, depth: 1.0 },
  { id: "gemini", deg: 48, r: 0.92, depth: 0.66 },
  { id: "grok", deg: 95, r: 1.01, depth: 0.83 },
  { id: "mistral", deg: 138, r: 0.78, depth: 0.4 },
  { id: "deepseek", deg: 183, r: 1.1, depth: 0.96 },
  { id: "perplexity", deg: 227, r: 0.89, depth: 0.6 },
];
/* Routed "feeding" pulses: a chat captured in one tool travels through the Rift
   core and back out to another — cross-tool memory made visible. */
const ROUTES: [string, string][] = [
  ["claude", "cursor"],
  ["chatgpt", "gemini"],
  ["grok", "deepseek"],
  ["mistral", "perplexity"],
  ["claude", "grok"],
  ["chatgpt", "mistral"],
];

function LiveDot() {
  return (
    <span className="relative inline-flex h-3 w-3 flex-shrink-0 items-center justify-center">
      <span className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-[#f7f8f8]" />
    </span>
  );
}

/* Full-viewport background: provider/agent logos orbit a Rift core centered in
   the viewport — wires + pulses (both ways) + routed pulses all converge there. */
function ConstellationBg({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [g, setG] = useState<{ cx: number; cy: number; pos: Record<string, { x: number; y: number }> } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const cr = el.getBoundingClientRect();
      const cx = cr.width / 2;
      const cy = cr.height / 2;
      const rx = Math.min(cr.width * 0.42, 620);
      const ry = Math.min(cr.height * 0.4, 380);
      const pos: Record<string, { x: number; y: number }> = {};
      for (const n of NODES) {
        const a = (n.deg * Math.PI) / 180;
        pos[n.id] = { x: cx + rx * n.r * Math.cos(a), y: cy + ry * n.r * Math.sin(a) };
      }
      setG({ cx, cy, pos });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* dot-grid ground — a slow, barely-there breath so even the field is alive */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage: "radial-gradient(64% 62% at 50% 50%, #000, transparent 80%)",
          maskImage: "radial-gradient(64% 62% at 50% 50%, #000, transparent 80%)",
        }}
        animate={reduce ? {} : { opacity: [0.78, 1, 0.86, 0.78] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.75, 1] }}
      />
      {g && (
        <>
          <svg
            className="absolute inset-0 h-full w-full"
            style={{ filter: active ? "brightness(1.42)" : "brightness(1)", transition: "filter 0.85s cubic-bezier(0.4,0,0.2,1)" }}
          >
            <defs>
              <filter id="cglow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="2.4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {NODES.map((n, i) => {
              const p = g.pos[n.id];
              const rest = 0.04 + n.depth * 0.07;
              const hot = 0.14 + n.depth * 0.16;
              const litDelay = 0.04 * i + (1 - n.depth) * 0.14;
              return (
                <line
                  key={n.id}
                  x1={p.x}
                  y1={p.y}
                  x2={g.cx}
                  y2={g.cy}
                  style={{
                    stroke: active ? `rgba(255,255,255,${hot})` : `rgba(255,255,255,${rest})`,
                    strokeWidth: active ? 1.1 + n.depth * 0.6 : 0.8 + n.depth * 0.4,
                    transition: "stroke 0.8s ease, stroke-width 0.8s ease",
                    transitionDelay: `${litDelay}s`,
                  }}
                />
              );
            })}
            {/* inbound capture pulses — each on its own period, phase, peak and
                easing (negative begin = already mid-flight at load, never synced);
                only some nodes also emit a fainter return pulse */}
            {!reduce &&
              NODES.flatMap((n, i) => {
                const p = g.pos[n.id];
                const s = (k: number) => seeded(i * 9.17 + k);
                const period = (4.6 + s(1) * 3.6).toFixed(2);
                const begin = (-s(2) * Number(period)).toFixed(2);
                const peak = (0.32 + s(3) * 0.42 * (0.6 + n.depth * 0.4)).toFixed(2);
                const inT = (0.14 + s(4) * 0.12).toFixed(2);
                const outT = (0.66 + s(5) * 0.16).toFixed(2);
                const acc = (0.3 + s(6) * 0.35).toFixed(2);
                const dec = (0.6 + s(7) * 0.32).toFixed(2);
                const dotR = (1.05 + n.depth * 1.25).toFixed(2);
                const els = [
                  <circle key={"f" + n.id} r={dotR} fill="#fff" opacity="0">
                    <animateMotion dur={`${period}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines={`${acc} 0 ${dec} 1`} path={`M ${p.x} ${p.y} L ${g.cx} ${g.cy}`} />
                    <animate attributeName="opacity" values={`0;${peak};${peak};0`} keyTimes={`0;${inT};${outT};1`} calcMode="spline" keySplines={`${acc} 0 0.3 1;0 0 1 1;0.3 0 ${dec} 1`} dur={`${period}s`} begin={`${begin}s`} repeatCount="indefinite" />
                  </circle>,
                ];
                if (s(8) > 0.42) {
                  const rp = (5.2 + s(9) * 3).toFixed(2);
                  const rb = (-s(10) * Number(rp)).toFixed(2);
                  const rpeak = (0.16 + s(11) * 0.22).toFixed(2);
                  els.push(
                    <circle key={"b" + n.id} r={(0.9 + n.depth * 0.7).toFixed(2)} fill="rgba(255,255,255,0.85)" opacity="0">
                      <animateMotion dur={`${rp}s`} begin={`${rb}s`} repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.4 0 0.5 1" path={`M ${g.cx} ${g.cy} L ${p.x} ${p.y}`} />
                      <animate attributeName="opacity" values={`0;${rpeak};${rpeak};0`} keyTimes="0;.2;.7;1" calcMode="spline" keySplines="0.4 0 0.3 1;0 0 1 1;0.3 0 0.5 1" dur={`${rp}s`} begin={`${rb}s`} repeatCount="indefinite" />
                    </circle>,
                  );
                }
                return els;
              })}

            {/* routed cross-tool pulses — brighter, glowing, on their own slow clocks */}
            {!reduce &&
              ROUTES.map(([a, b], i) => {
                const A = g.pos[a];
                const B = g.pos[b];
                if (!A || !B) return null;
                const rs = (k: number) => seeded(i * 13.3 + k + 100);
                const period = (6.2 + rs(1) * 3.4).toFixed(2);
                const begin = (-rs(2) * Number(period)).toFixed(2);
                const peak = (0.7 + rs(3) * 0.3).toFixed(2);
                const dotR = (2.1 + rs(4) * 1).toFixed(2);
                return (
                  <circle key={"r" + i} r={dotR} fill="#fff" opacity="0" filter="url(#cglow)">
                    <animateMotion dur={`${period}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keyPoints="0;0.5;1" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" path={`M ${A.x} ${A.y} L ${g.cx} ${g.cy} L ${B.x} ${B.y}`} />
                    <animate attributeName="opacity" values={`0;${peak};${peak};${peak};0`} keyTimes="0;.12;.5;.88;1" calcMode="spline" keySplines="0.4 0 0.4 1;0 0 1 1;0 0 1 1;0.4 0 0.4 1" dur={`${period}s`} begin={`${begin}s`} repeatCount="indefinite" />
                  </circle>
                );
              })}
          </svg>

          {NODES.map((n, i) => {
            const p = g.pos[n.id];
            const size = 44 + n.depth * 16;
            const icon = Math.round(22 + n.depth * 9);
            const restO = 0.4 + n.depth * 0.58;
            const blur = (1 - n.depth) * 1.5;
            const ax = 1 + seeded(i + 21) * 2.6;
            const ay = 2 + seeded(i + 31) * 4;
            const fp = 6.5 + seeded(i + 41) * 4.5;
            const litDelay = 0.04 * i + (1 - n.depth) * 0.14;
            return (
              <div
                key={n.id}
                className="absolute"
                style={{ left: p.x, top: p.y, transform: "translate(-50%,-50%)", zIndex: Math.round(n.depth * 10) }}
              >
                <motion.div
                  animate={reduce ? {} : { x: [0, ax, -ax * 0.6, 0], y: [0, -ay, ay * 0.5, 0] }}
                  transition={{ duration: fp, repeat: Infinity, ease: "easeInOut", times: [0, 0.33, 0.7, 1], delay: seeded(i + 51) * 2 }}
                  className={`flex items-center justify-center rounded-full border backdrop-blur-sm transition-[color,border-color,opacity,box-shadow] duration-[800ms] ease-out ${
                    active ? "border-[rgba(255,255,255,0.3)] text-[#e6e9ee]" : "border-[rgba(255,255,255,0.1)] text-[#9298a0]"
                  }`}
                  style={{
                    width: size,
                    height: size,
                    opacity: active ? Math.min(1, restO + 0.22) : restO,
                    filter: blur ? `blur(${blur}px)` : undefined,
                    background: "rgba(12,13,15,0.82)",
                    boxShadow: active ? "0 10px 30px -12px rgba(0,0,0,0.92)" : "0 8px 26px -12px rgba(0,0,0,0.9)",
                    transitionDelay: `${litDelay}s`,
                  }}
                >
                  <ProviderMark id={n.id} size={icon} />
                </motion.div>
              </div>
            );
          })}

          {/* Rift core — the convergence point IS the mark. Two halos on
              incommensurate clocks (so the glow never reads as one sine wave) plus
              a separate hover-charge layer that ramps in on its own. Dim at rest so
              the hero copy stays clean; the mark itself brightens via CSS on hover,
              never restarting the breath. */}
          <div className="absolute" style={{ left: g.cx, top: g.cy, transform: "translate(-50%,-50%)", zIndex: 11 }}>
            <motion.span
              aria-hidden
              className="absolute rounded-full"
              style={{ width: 210, height: 210, left: "50%", top: "50%", marginLeft: -105, marginTop: -105, background: "radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)" }}
              animate={reduce ? {} : { opacity: [0.16, 0.27, 0.2, 0.16], scale: [1, 1.06, 1.02, 1] }}
              transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.75, 1] }}
            />
            <motion.span
              aria-hidden
              className="absolute rounded-full"
              style={{ width: 120, height: 120, left: "50%", top: "50%", marginLeft: -60, marginTop: -60, background: "radial-gradient(circle, rgba(255,255,255,0.26), transparent 68%)" }}
              animate={reduce ? {} : { opacity: [0.1, 0.2, 0.13, 0.1], scale: [1.04, 1.12, 1.05, 1.04] }}
              transition={{ duration: 4.7, repeat: Infinity, ease: "easeInOut", times: [0, 0.45, 0.8, 1], delay: 0.9 }}
            />
            <motion.span
              aria-hidden
              className="absolute rounded-full"
              style={{ width: 240, height: 240, left: "50%", top: "50%", marginLeft: -120, marginTop: -120, background: "radial-gradient(circle, rgba(255,255,255,0.32), transparent 66%)" }}
              animate={reduce ? { opacity: active ? 0.5 : 0 } : { opacity: active ? [0.26, 0.5, 0.32, 0.26] : 0, scale: active ? [1, 1.2, 1.06, 1] : 1 }}
              transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.75, 1] }}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 block"
              style={{
                transform: "translate(-50%,-50%)",
                color: "#f7f8f8",
                filter: active ? "drop-shadow(0 0 16px rgba(255,255,255,0.6))" : "drop-shadow(0 0 9px rgba(255,255,255,0.32))",
                transition: "filter 0.85s ease",
              }}
              animate={reduce ? { opacity: active ? 0.92 : 0.5 } : { opacity: [0.42, 0.56, 0.48, 0.42] }}
              transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.7, 1] }}
            >
              <RiftMark size={34} />
            </motion.span>
          </div>
        </>
      )}
    </div>
  );
}

function Nav() {
  return (
    <header className="relative z-10 mx-auto flex h-[60px] w-full max-w-[1100px] items-center justify-between px-6 sm:px-10">
      <Link href="/" aria-label="Rift home">
        <RiftLogo />
      </Link>
      <nav className="flex items-center gap-6 text-[13.5px] text-[#8a8f98]">
        <Link href="/about" className="transition-colors hover:text-[#f7f8f8]">
          About
        </Link>
        <Link href="/privacy" className="transition-colors hover:text-[#f7f8f8]">
          Privacy
        </Link>
      </nav>
    </header>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="text-[#62666d] transition-colors hover:text-[#c8cdd6]"
    >
      {children}
    </a>
  );
}

/* Premium staggered word reveal for the headline. */
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.062, delayChildren: 0.14 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.82, ease: EASE } },
};

export default function HomeContent() {
  const reduce = useReducedMotion();
  const [beam, setBeam] = useState(false);
  const [invite, setInvite] = useState(false);

  const line1 = ["Stop", "re-explaining", "what"];
  const line2 = ["you", "already"];

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#08090a] font-sans text-[#f7f8f8] antialiased">
      <ConstellationBg active={beam} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(48% 44% at 50% 50%, rgba(8,9,10,.84), rgba(8,9,10,.4) 58%, transparent 82%)" }}
      />
      {/* Mobile: copy column is tall and narrow, so the wires cut through it.
          Reinforce the central fade so the constellation recedes behind the message. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] sm:hidden"
        style={{ background: "radial-gradient(60% 46% at 50% 50%, rgba(8,9,10,.95), rgba(8,9,10,.62) 54%, transparent 86%)" }}
      />

      <Nav />

      <section className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 sm:py-16">
        <div className="flex max-w-[760px] flex-col items-center text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-2.5 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] py-1.5 pl-2.5 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md"
          >
            <LiveDot />
            <span className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.085em] text-[#c8cdd6]">
              <span>Local-first</span>
              <span aria-hidden className="h-2.5 w-px bg-[rgba(255,255,255,0.14)]" />
              <span>Private beta</span>
              <span aria-hidden className="h-2.5 w-px bg-[rgba(255,255,255,0.14)]" />
              <span>macOS</span>
            </span>
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
            <motion.span variants={reduce ? undefined : headlineWord} className="inline-block">
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
            Rift auto-captures your ChatGPT, Claude, Grok, and Gemini chats and indexes them into a
            private archive that lives on your Mac, searchable in a keystroke.{" "}
            <span className="text-[#c8cdd6]">By default, nothing leaves it.</span>
          </motion.p>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.58 }}
            className="mt-4 max-w-[560px] text-[15px] leading-[24px] text-[#62666d] sm:text-[16px] sm:leading-[26px]"
            style={{ textShadow: "0 1px 22px rgba(8,9,10,0.85)" }}
          >
            <span className="text-[#8a8f98]">Before:</span> you hand over folders of .md files
            and paste old history into every new chat.{" "}
            <span className="text-[#8a8f98]">After:</span> Claude Code, Cursor, and Codex pull
            the right context themselves over MCP, and feel way smarter from the first message.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.66 }}
            className="mt-9"
          >
            <motion.button
              type="button"
              onClick={() => setInvite(true)}
              onHoverStart={() => setBeam(true)}
              onHoverEnd={() => setBeam(false)}
              onFocus={() => setBeam(true)}
              onBlur={() => setBeam(false)}
              whileHover={
                reduce
                  ? undefined
                  : {
                      y: -1,
                      boxShadow: [
                        "0 0 0 1px rgba(255,255,255,0.5),0 10px 30px -8px rgba(255,255,255,0.35),0 0 48px 6px rgba(255,255,255,0.12)",
                        "0 0 0 1px rgba(255,255,255,0.66),0 14px 42px -8px rgba(255,255,255,0.5),0 0 84px 20px rgba(255,255,255,0.2)",
                        "0 0 0 1px rgba(255,255,255,0.5),0 10px 30px -8px rgba(255,255,255,0.35),0 0 48px 6px rgba(255,255,255,0.12)",
                      ],
                    }
              }
              transition={{
                boxShadow: { duration: 2.6, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 0.3, ease: "easeOut" },
              }}
              className="group relative inline-flex h-[50px] items-center justify-center overflow-hidden rounded-[12px] bg-[#f7f8f8] px-7 text-[15px] font-semibold text-[#08090a] transition-shadow duration-300 ease-out hover:shadow-[0_10px_34px_-10px_rgba(255,255,255,0.4)]"
            >
              {/* memory-grid bloom: a faint dot grid that lights up diagonally from the
                  top-right corner on hover, echoing the falloff of the Rift mark */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(8,9,10,0.18) 1px, transparent 1.5px)",
                  backgroundSize: "9px 9px",
                  WebkitMaskImage: "radial-gradient(125% 125% at 100% 0%, #000 0%, transparent 58%)",
                  maskImage: "radial-gradient(125% 125% at 100% 0%, #000 0%, transparent 58%)",
                }}
              />
              <span className="relative z-10">Join the Mac beta</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex w-full max-w-[1100px] items-center justify-between px-6 py-7 text-[12.5px] text-[#62666d] sm:px-10">
        <span>© {new Date().getFullYear()} Rift</span>
        <div className="flex items-center gap-6">
          <Link href="/about" className="transition-colors hover:text-[#c8cdd6]">
            About
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-[#c8cdd6]">
            Privacy
          </Link>
          <SocialLink href="https://x.com/clementrog" label="Clément on X">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialLink>
          <SocialLink href="https://www.linkedin.com/in/clementrog" label="Clément on LinkedIn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </SocialLink>
        </div>
      </footer>

      <InviteModal open={invite} onClose={() => setInvite(false)} />
    </main>
  );
}
