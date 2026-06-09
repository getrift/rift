"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ProviderMark, type MarkId } from "./provider-icons";
import { RiftMark } from "./rift-logo";
import InviteModal from "./invite-modal";
import SiteNav from "./site-nav";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* Deterministic per-element noise so every pulse/float runs on its own clock —
   no synchronized loops, no Math.random (stable across renders). */
const fract = (x: number) => x - Math.floor(x);
const seeded = (n: number) => fract(Math.sin(n * 12.9898 + 78.233) * 43758.5453);

/* A small set of AI tools drifting around the Rift core. Intentionally NOT
   evenly spaced — each carries an angle, a radius factor, and a depth 0..1
   (near = larger/brighter/sharper, far = smaller/dimmer/softer) so the field
   reads as quiet space, not a clock face. */
type Node = { id: MarkId; deg: number; r: number; depth: number };
const NODES: Node[] = [
  // Deliberately scattered, never a clock face: angles avoid the cardinals,
  // radii swing wide (0.8–1.33) and depths layer front-to-back so the field
  // reads as uneven space. Diagonals push far out, near-axis nodes pull in;
  // two tight pairs (claude+cursor, deepseek+kimi) and a wide right-side void
  // keep the rhythm off-balance.
  { id: "chatgpt", deg: -86, r: 0.98, depth: 0.92 },
  { id: "claude", deg: -34, r: 1.33, depth: 1.0 },
  { id: "cursor", deg: -8, r: 0.8, depth: 0.46 },
  { id: "gemini", deg: 56, r: 1.16, depth: 0.64 },
  { id: "grok", deg: 100, r: 0.88, depth: 0.8 },
  { id: "mistral", deg: 146, r: 1.3, depth: 0.82 },
  { id: "deepseek", deg: 192, r: 1.1, depth: 0.95 },
  { id: "kimi", deg: 226, r: 0.82, depth: 0.5 },
];

function LiveDot() {
  return (
    <span className="relative inline-flex h-3 w-3 flex-shrink-0 items-center justify-center">
      <span className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.14)" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-ink" />
    </span>
  );
}

/* Full-viewport background: a few provider/agent logos drift around a softly
   glowing Rift core centered in the viewport — wires + faint capture pulses
   converge there. Kept deliberately quiet so the hero copy stays the subject. */
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
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1.4px)",
          backgroundSize: "28px 28px",
          WebkitMaskImage: "radial-gradient(64% 62% at 50% 50%, #000, transparent 80%)",
          maskImage: "radial-gradient(64% 62% at 50% 50%, #000, transparent 80%)",
        }}
        animate={reduce ? {} : { opacity: [0.82, 1, 0.88, 0.82] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.75, 1] }}
      />
      {g && (
        <>
          <svg
            className="absolute inset-0 h-full w-full"
            style={{ filter: active ? "brightness(1.2)" : "brightness(1)", transition: "filter 0.9s cubic-bezier(0.4,0,0.2,1)" }}
          >
            {NODES.map((n, i) => {
              const p = g.pos[n.id];
              const rest = 0.035 + n.depth * 0.05;
              const hot = 0.1 + n.depth * 0.1;
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
                    strokeWidth: 0.85 + n.depth * 0.35,
                    transition: "stroke 0.85s ease",
                    transitionDelay: `${litDelay}s`,
                  }}
                />
              );
            })}
            {/* inbound capture pulses — each on its own period, phase, and easing
                (negative begin = already mid-flight at load, never synced). Faint
                by design; only some nodes also emit an even fainter return pulse. */}
            {!reduce &&
              NODES.flatMap((n, i) => {
                const p = g.pos[n.id];
                const s = (k: number) => seeded(i * 9.17 + k);
                const period = (5.4 + s(1) * 3.6).toFixed(2);
                const begin = (-s(2) * Number(period)).toFixed(2);
                const peak = (0.18 + s(3) * 0.24 * (0.6 + n.depth * 0.4)).toFixed(2);
                const inT = (0.14 + s(4) * 0.12).toFixed(2);
                const outT = (0.66 + s(5) * 0.16).toFixed(2);
                const acc = (0.3 + s(6) * 0.35).toFixed(2);
                const dec = (0.6 + s(7) * 0.32).toFixed(2);
                const dotR = (0.9 + n.depth * 1.0).toFixed(2);
                const els = [
                  <circle key={"f" + n.id} r={dotR} fill="#fff" opacity="0">
                    <animateMotion dur={`${period}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines={`${acc} 0 ${dec} 1`} path={`M ${p.x} ${p.y} L ${g.cx} ${g.cy}`} />
                    <animate attributeName="opacity" values={`0;${peak};${peak};0`} keyTimes={`0;${inT};${outT};1`} calcMode="spline" keySplines={`${acc} 0 0.3 1;0 0 1 1;0.3 0 ${dec} 1`} dur={`${period}s`} begin={`${begin}s`} repeatCount="indefinite" />
                  </circle>,
                ];
                if (s(8) > 0.5) {
                  const rp = (6.2 + s(9) * 3).toFixed(2);
                  const rb = (-s(10) * Number(rp)).toFixed(2);
                  const rpeak = (0.1 + s(11) * 0.14).toFixed(2);
                  els.push(
                    <circle key={"b" + n.id} r={(0.8 + n.depth * 0.5).toFixed(2)} fill="rgba(255,255,255,0.8)" opacity="0">
                      <animateMotion dur={`${rp}s`} begin={`${rb}s`} repeatCount="indefinite" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.4 0 0.5 1" path={`M ${g.cx} ${g.cy} L ${p.x} ${p.y}`} />
                      <animate attributeName="opacity" values={`0;${rpeak};${rpeak};0`} keyTimes="0;.2;.7;1" calcMode="spline" keySplines="0.4 0 0.3 1;0 0 1 1;0.3 0 0.5 1" dur={`${rp}s`} begin={`${rb}s`} repeatCount="indefinite" />
                    </circle>,
                  );
                }
                return els;
              })}
          </svg>

          {NODES.map((n, i) => {
            const p = g.pos[n.id];
            const size = 42 + n.depth * 14;
            const icon = Math.round(21 + n.depth * 9);
            const restO = 0.28 + n.depth * 0.44;
            const blur = (1 - n.depth) * 1.6;
            const ax = 0.6 + seeded(i + 21) * 1.6;
            const ay = 1 + seeded(i + 31) * 2.4;
            const fp = 8 + seeded(i + 41) * 5;
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
                  className={`flex items-center justify-center rounded-full border backdrop-blur-sm transition-[color,border-color,opacity] duration-[900ms] ease-out ${
                    active ? "border-white/[0.24] text-ink-bright" : "border-white/[0.08] text-ink-subtle"
                  }`}
                  style={{
                    width: size,
                    height: size,
                    opacity: active ? Math.min(1, restO + 0.18) : restO,
                    filter: blur ? `blur(${blur}px)` : undefined,
                    background: "rgba(12,13,15,0.82)",
                    transitionDelay: `${litDelay}s`,
                  }}
                >
                  <ProviderMark id={n.id} size={icon} />
                </motion.div>
              </div>
            );
          })}

          {/* Rift core — the convergence point IS the mark. One slow resting halo
              plus a hover-charge layer that ramps in on its own when the CTA is
              focused. Dim at rest so the hero copy stays clean. */}
          <div className="absolute" style={{ left: g.cx, top: g.cy, transform: "translate(-50%,-50%)", zIndex: 11 }}>
            <motion.span
              aria-hidden
              className="absolute rounded-full"
              style={{ width: 200, height: 200, left: "50%", top: "50%", marginLeft: -100, marginTop: -100, background: "radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%)" }}
              animate={reduce ? {} : { opacity: [0.12, 0.2, 0.15, 0.12], scale: [1, 1.05, 1.02, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.75, 1] }}
            />
            <motion.span
              aria-hidden
              className="absolute rounded-full"
              style={{ width: 230, height: 230, left: "50%", top: "50%", marginLeft: -115, marginTop: -115, background: "radial-gradient(circle, rgba(255,255,255,0.22), transparent 66%)" }}
              animate={reduce ? { opacity: active ? 0.4 : 0 } : { opacity: active ? [0.2, 0.36, 0.24, 0.2] : 0, scale: active ? [1, 1.16, 1.05, 1] : 1 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.75, 1] }}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 block"
              style={{
                transform: "translate(-50%,-50%)",
                color: "#f7f8f8",
                filter: active ? "drop-shadow(0 0 14px rgba(255,255,255,0.5))" : "drop-shadow(0 0 8px rgba(255,255,255,0.28))",
                transition: "filter 0.9s ease",
              }}
              animate={reduce ? { opacity: active ? 0.9 : 0.48 } : { opacity: [0.4, 0.52, 0.45, 0.4] }}
              transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.7, 1] }}
            >
              <RiftMark size={34} />
            </motion.span>
          </div>
        </>
      )}
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="text-ink-faint transition-colors hover:text-ink-muted"
    >
      {children}
    </a>
  );
}

/* Premium staggered word reveal for the headline — quieted: shorter rise, less blur. */
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.036, delayChildren: 0.1 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};

const headline = ["One", "memory,", "shared", "by", "every", "agent", "you", "use."];

export default function HomeContent() {
  const reduce = useReducedMotion();
  const [beam, setBeam] = useState(false);
  const [invite, setInvite] = useState(false);

  return (
    <main className="relative flex h-[100svh] flex-col overflow-hidden bg-canvas font-sans text-ink antialiased">
      <div className="hidden md:block">
        <ConstellationBg active={beam} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(54% 52% at 50% 48%, rgba(8,9,10,.84), rgba(8,9,10,.40) 58%, transparent 82%), linear-gradient(180deg, rgba(8,9,10,.5) 0%, transparent 26%, transparent 72%, rgba(8,9,10,.66) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] md:hidden"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1.4px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: "radial-gradient(80% 58% at 50% 12%, #000, transparent 78%)",
          maskImage: "radial-gradient(80% 58% at 50% 12%, #000, transparent 78%)",
        }}
      />

      <SiteNav onJoin={() => setInvite(true)} />

      <section className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1100px] flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        <div className="flex max-w-[760px] flex-col items-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] py-1.5 pl-2.5 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
          >
            <LiveDot />
            <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.085em]">
              <span className="text-ink-muted">Private Mac beta</span>
              <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-white/[0.22]" />
              <span className="text-ink-subtle">Local-first</span>
            </span>
          </motion.div>

          <motion.h1
            variants={reduce ? undefined : headlineContainer}
            initial={reduce ? false : "hidden"}
            animate={reduce ? {} : "show"}
            className="mt-7 text-[40px] font-[560] leading-[1.03] tracking-[-0.034em] text-ink sm:text-[56px] sm:leading-[1.0]"
            style={{ textWrap: "balance", textShadow: "0 2px 30px rgba(8,9,10,0.6)" }}
          >
            {headline.flatMap((w, i) => [
              <motion.span key={`h-${i}`} variants={reduce ? undefined : headlineWord} className="inline-block">
                {w}
              </motion.span>,
              i < headline.length - 1 ? <span key={`hs-${i}`}> </span> : null,
            ])}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            className="mt-6 max-w-[560px] text-[16px] leading-[26px] text-ink-subtle sm:text-[17px] sm:leading-[28px]"
            style={{ textWrap: "pretty" }}
          >
            Rift keeps one private memory of your AI work on your Mac. Claude Code, Cursor, and Codex
            pull only the decisions and context that matter — so you never re-explain yourself.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.58 }}
            className="mt-9"
          >
            <motion.button
              type="button"
              onClick={() => setInvite(true)}
              onHoverStart={() => setBeam(true)}
              onHoverEnd={() => setBeam(false)}
              onFocus={() => setBeam(true)}
              onBlur={() => setBeam(false)}
              whileHover={reduce ? undefined : { y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="group relative inline-flex h-[50px] items-center justify-center overflow-hidden rounded-[10px] bg-ink px-7 text-[15px] font-semibold leading-none text-canvas transition-shadow duration-150 ease-out hover:shadow-[0_10px_30px_-16px_rgba(255,255,255,0.4)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(8,9,10,0.16) 1px, transparent 1.5px)",
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

      <footer className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col gap-4 px-6 py-7 text-[12.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <span>© {new Date().getFullYear()} Rift</span>
        <div className="flex items-center gap-6">
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
