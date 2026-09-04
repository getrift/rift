"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import SphereField from "./sphere-field";
import SiteNav from "./site-nav";
import SiteFooter from "./site-footer";
import { useMacCta } from "./use-mac-cta";
import { CHECKOUT_ANNUAL_URL, PRICE_ANNUAL_LABEL, PRICE_LABEL } from "./pricing";

/* Hero entrance — a "rack focus" that echoes the particle field: H1, subhead,
   and CTA each resolve from soft-and-low into sharp focus (blur → crisp), the
   same scattered-then-consolidated gesture the sphere performs. Expo settle
   (fast out, long gentle landing), choreographed as a calm overlapping cascade
   in the Linear / Stripe register — not a synchronized pop. */
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.18 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(9px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.82, ease: EXPO } },
};
const headline = ["One", "local", "memory,", "shared", "by", "every", "agent", "you", "use"];

export default function HomeContent() {
  const reduce = useReducedMotion();
  const [warm, setWarm] = useState(false);
  const { label, onClick, nonMac } = useMacCta();

  return (
    <main className="relative flex h-[100svh] flex-col overflow-hidden bg-canvas font-sans text-ink antialiased">
      {/* the field — a particle sphere of scattered memories; moving over it (or
          hovering the CTA) gathers the relevant ones into a node. Desktop only. */}
      <div className="hidden md:block">
        <SphereField active={warm} />
      </div>
      {/* mobile: a calm static dot-grid stands in for the live sphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 md:hidden"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
          WebkitMaskImage: "radial-gradient(46% 42% at 70% 38%, #000, transparent 72%)",
          maskImage: "radial-gradient(46% 42% at 70% 38%, #000, transparent 72%)",
        }}
      />

      {/* frosted backing — softens the field behind the copy for legibility,
          masked to the bottom-left so the sphere stays crisp everywhere else */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] backdrop-blur-[7px]"
        style={{
          WebkitMaskImage: "radial-gradient(125% 95% at 0% 100%, #000 0%, rgba(0,0,0,0.55) 32%, transparent 62%)",
          maskImage: "radial-gradient(125% 95% at 0% 100%, #000 0%, rgba(0,0,0,0.55) 32%, transparent 62%)",
        }}
      />
      {/* legibility scrim — a gentle darkening over the frosted area */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(8,9,10,0.86) 0%, rgba(8,9,10,0.48) 20%, rgba(8,9,10,0) 48%), linear-gradient(to right, rgba(8,9,10,0.62) 0%, rgba(8,9,10,0) 44%), linear-gradient(to bottom, rgba(8,9,10,0.5) 0%, rgba(8,9,10,0) 16%)",
        }}
      />

      <SiteNav containerClass="px-6 sm:px-10" />

      {/* content anchored bottom-left, full-bleed with small padding */}
      <section className="relative z-10 flex min-h-0 w-full flex-1 flex-col justify-end px-6 pb-10 sm:px-10">
        <div className="flex max-w-[600px] flex-col items-start text-left">
          <motion.h1
            variants={reduce ? undefined : headlineContainer}
            initial={reduce ? false : "hidden"}
            animate={reduce ? {} : "show"}
            className="text-[32px] font-[560] leading-[1.05] tracking-[-0.032em] text-ink sm:text-[48px] sm:leading-[1.02]"
            style={{ textWrap: "balance", textShadow: "0 2px 30px rgba(8,9,10,0.7)" }}
          >
            {headline.flatMap((word, i) => [
              <motion.span key={`h-${i}`} variants={reduce ? undefined : headlineWord} className="inline-block">
                {word}
              </motion.span>,
              i < headline.length - 1 ? <span key={`hs-${i}`}> </span> : null,
            ])}
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.95, ease: EXPO, delay: 0.66 }}
            className="mt-5 max-w-[510px] text-[14.5px] leading-[23px] text-ink-subtle sm:text-[15.5px] sm:leading-[25px]"
            style={{ textWrap: "pretty" }}
          >
            Rift is a private memory that runs in the background on your Mac. It captures every
            conversation with your agents, structures it, and serves it back over MCP, so you
            never bring an agent up to speed again.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(5px)" }}
            animate={reduce ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.72, ease: EXPO, delay: 0.92 }}
            className="mt-8"
          >
            <motion.button
              type="button"
              onClick={onClick}
              onHoverStart={() => setWarm(true)}
              onHoverEnd={() => setWarm(false)}
              onFocus={() => setWarm(true)}
              onBlur={() => setWarm(false)}
              className="inline-flex h-[46px] items-center justify-center rounded-[14px] bg-ink px-6 text-[14px] font-semibold leading-none text-canvas transition-shadow duration-150 ease-out hover:shadow-[0_10px_30px_-16px_rgba(255,255,255,0.4)]"
            >
              {label}
            </motion.button>
            {!nonMac && (
              <p className="mt-3 text-[12.5px] leading-[18px] text-ink-faint">
                {PRICE_LABEL}, or{" "}
                <a href={CHECKOUT_ANNUAL_URL} className="text-ink-muted underline-offset-4 hover:text-ink hover:underline">
                  {PRICE_ANNUAL_LABEL}
                </a>{" "}
                · cancel anytime · Apple Silicon Mac, macOS 12.3+
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <SiteFooter containerClass="px-6 sm:px-10" />
    </main>
  );
}
