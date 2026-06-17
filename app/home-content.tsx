"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import RetrievalField from "./retrieval-field";
import InviteModal from "./invite-modal";
import SiteNav from "./site-nav";

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="-m-2 flex h-10 w-10 items-center justify-center text-ink-faint transition-[color,transform] duration-150 hover:-translate-y-px hover:text-ink-muted"
    >
      {children}
    </a>
  );
}

/* Staggered word reveal for the headline — short rise, light blur. */
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.036, delayChildren: 0.1 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};
const headline = ["One", "local", "memory,", "shared", "by", "every", "agent", "you", "use"];

export default function HomeContent() {
  const reduce = useReducedMotion();
  const [beam, setBeam] = useState(false);
  const [invite, setInvite] = useState(false);

  return (
    <main className="relative flex h-[100svh] flex-col overflow-hidden bg-canvas font-sans text-ink antialiased">
      {/* the field — full-bleed behind everything, desktop only */}
      <div className="hidden md:block">
        <RetrievalField active={beam} />
      </div>
      {/* mobile: a calm static dot-grid stands in for the live field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 md:hidden"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1.4px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: "radial-gradient(78% 60% at 50% 30%, #000, transparent 80%)",
          maskImage: "radial-gradient(78% 60% at 50% 30%, #000, transparent 80%)",
        }}
      />

      {/* frosted backing — softens the field behind the copy for legibility,
          masked to the bottom-left so the swarm stays crisp everywhere else */}
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

      <SiteNav containerClass="px-6 sm:px-10" onJoin={() => setInvite(true)} />

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
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
            className="mt-5 max-w-[510px] text-[14.5px] leading-[23px] text-ink-subtle sm:text-[15.5px] sm:leading-[25px]"
            style={{ textWrap: "pretty" }}
          >
            Rift is a private memory that runs in the background on your Mac. It captures every
            conversation with your agents, structures it, and serves it back over MCP, so you
            never bring an agent up to speed again.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.58 }}
            className="mt-8"
          >
            <motion.button
              type="button"
              onClick={() => setInvite(true)}
              onHoverStart={() => setBeam(true)}
              onHoverEnd={() => setBeam(false)}
              onFocus={() => setBeam(true)}
              onBlur={() => setBeam(false)}
              whileHover={reduce ? undefined : { y: -1 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="group relative inline-flex h-[46px] items-center justify-center overflow-hidden rounded-[10px] bg-ink px-6 text-[14px] font-semibold leading-none text-canvas transition-shadow duration-150 ease-out hover:shadow-[0_10px_30px_-16px_rgba(255,255,255,0.4)]"
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
              <span className="relative z-10 inline-flex items-center gap-2">
                Join the Mac beta
                <svg
                  aria-hidden
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="-mr-1 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                >
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 flex w-full flex-col gap-4 px-6 py-7 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-10">
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
