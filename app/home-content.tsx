"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Lock,
  Layers,
  EyeOff,
  Trash2,
} from "lucide-react";

// Matches the repo's `out-expo` easing token (tailwind.config.ts).
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const START_PATH = "/start";

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
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-white" />
      <span className="text-[15px] font-semibold tracking-tight text-text-primary">
        rift
      </span>
    </span>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-hairline bg-black/60 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" aria-label="Rift home">
          <Wordmark />
        </Link>
        <div className="flex items-center gap-7 text-[13px] text-text-secondary">
          <a href="#how" className="hidden transition-colors hover:text-text-primary sm:inline">
            How it works
          </a>
          <a href="#privacy" className="hidden transition-colors hover:text-text-primary sm:inline">
            Privacy
          </a>
          <a href="#pricing" className="hidden transition-colors hover:text-text-primary sm:inline">
            Pricing
          </a>
          <Link
            href={START_PATH}
            className="inline-flex h-9 items-center rounded-md bg-white px-4 font-medium text-black transition-colors duration-150 hover:bg-white/90"
          >
            Start
          </Link>
        </div>
      </nav>
    </header>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 pt-0.5 font-mono text-[13px] text-text-muted">{n}</div>
      <div>
        <h3 className="text-[15px] font-medium text-text-heading">{title}</h3>
        <p className="mt-1.5 text-[15px] leading-relaxed text-text-secondary">{children}</p>
      </div>
    </div>
  );
}

function Principle({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-hairline bg-bg-well p-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/[0.06] text-text-primary">
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <h3 className="mt-4 text-[15px] font-medium text-text-heading">{title}</h3>
      <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">{children}</p>
    </div>
  );
}

export default function HomeContent() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-app font-sans text-text-primary antialiased">
      {/* Ambient hero glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <Nav />

      {/* Hero */}
      <section className="relative mx-auto max-w-5xl px-6 pt-24 pb-20 sm:pt-32">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border-hairline bg-bg-well px-3 py-1 text-[12px] text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Private beta · free while in beta
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-6 max-w-3xl text-balance text-[40px] font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-[56px]">
            The AI memory you actually own.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-text-secondary sm:text-[19px]">
            Every AI tool now has memory — locked in its cloud, on its terms, gone the day you
            leave. Rift keeps yours on your own machine, where it&rsquo;s portable across every
            tool you use — Claude, Codex, Cursor — and stays yours even when you walk away from a
            vendor.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={START_PATH}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-[14px] font-medium text-black transition-colors duration-150 hover:bg-white/90"
            >
              Start the free beta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border-hairline bg-white/[0.04] px-5 text-[14px] font-medium text-text-secondary transition-colors duration-150 hover:bg-bg-hover hover:text-text-primary"
            >
              See how it works
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </section>

      {/* The problem */}
      <section className="relative mx-auto max-w-5xl px-6 py-20">
        <div className="max-w-3xl border-t border-border-hairline pt-16">
          <Reveal>
            <h2 className="text-[28px] font-semibold tracking-tight text-text-primary sm:text-[34px]">
              Every AI has memory now. None of it moves with you.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
              <p>
                ChatGPT, Claude, and the rest finally remember you — inside their own walls. Your
                context lives on their servers, works in their app, and it&rsquo;s gone the day you
                switch. The memory exists; it just isn&rsquo;t yours.
              </p>
              <p>
                The &ldquo;memory&rdquo; features bolted onto each platform don&rsquo;t fix this.
                They lock your context inside one vendor&rsquo;s cloud, usable in one app at a
                time. Your history with AI is some of the most personal data you have. It
                shouldn&rsquo;t live on someone else&rsquo;s server, and it shouldn&rsquo;t be
                trapped in a single tool.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
        <div className="border-t border-border-hairline pt-16">
          <Reveal>
            <h2 className="text-[28px] font-semibold tracking-tight text-text-primary sm:text-[34px]">
              How Rift works
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
              A small daemon runs in the background on your Mac. You don&rsquo;t manage it — you
              just keep working.
            </p>
          </Reveal>

          <div className="mt-12 grid max-w-3xl gap-10">
            <Reveal delay={0.02}>
              <Step n="01" title="Import what you've already said">
                Bring your history in with one command — your ChatGPT, Claude, and Grok
                exports, plus automatic capture of your Claude Code and Codex sessions. Day one
                isn&rsquo;t an empty box; it&rsquo;s everything you&rsquo;ve already worked through.
              </Step>
            </Reveal>
            <Reveal delay={0.04}>
              <Step n="02" title="Capture as you go">
                From then on, Rift watches your Claude Code and Codex CLI sessions and saves them
                the moment they end — stored on your own machine.
              </Step>
            </Reveal>
            <Reveal delay={0.06}>
              <Step n="03" title="Triage & index">
                Rift uses your Codex CLI to triage what&rsquo;s worth remembering and extract
                metadata, then stores the searchable index locally. Throwaway debugging stays out
                of your memory.
              </Step>
            </Reveal>
            <Reveal delay={0.08}>
              <Step n="04" title="Recall over MCP">
                Your tools query that memory through the Model Context Protocol. Ask Claude
                Desktop or Cursor about a past decision and it pulls the real answer instead of
                guessing.
              </Step>
            </Reveal>
            <Reveal delay={0.1}>
              <Step n="05" title="Surfaces current truth">
                Rift weighs what&rsquo;s true <em>now</em> over what&rsquo;s merely recent, flags
                conflicting sources, and points your assistant at the live files worth trusting.
              </Step>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="privacy" className="relative mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
        <div className="border-t border-border-hairline pt-16">
          <Reveal>
            <h2 className="text-[28px] font-semibold tracking-tight text-text-primary sm:text-[34px]">
              Built local-first, on purpose.
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
              These aren&rsquo;t settings you turn on. They&rsquo;re how Rift is built.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Reveal delay={0.02}>
              <Principle icon={Lock} title="Local by default">
                Your conversations, index, and results live on your Mac. What reaches out, Rift
                names up front: the text you index and the queries you search go to an embedding
                provider (Voyage by default), and by default triage and enrichment run through
                your own locally authenticated Codex CLI. Nothing leaves silently.
              </Principle>
            </Reveal>
            <Reveal delay={0.04}>
              <Principle icon={Layers} title="One memory, every tool">
                The same memory is shared across Claude Desktop, Claude Code, Codex, and Cursor.
                Not another silo you have to feed by hand.
              </Principle>
            </Reveal>
            <Reveal delay={0.06}>
              <Principle icon={EyeOff} title="No Rift telemetry">
                Rift never phones home with your conversations. No product telemetry, no usage
                profiling, no content analytics sent to Rift.
              </Principle>
            </Reveal>
            <Reveal delay={0.08}>
              <Principle icon={Trash2} title="Yours to delete">
                One command removes the daemon and every integration. Add a flag and it erases
                every byte of local data, too.
              </Principle>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What leaves your machine */}
      <section className="relative mx-auto max-w-5xl px-6 py-20">
        <div className="border-t border-border-hairline pt-16">
          <Reveal>
            <h2 className="text-[28px] font-semibold tracking-tight text-text-primary sm:text-[34px]">
              What leaves your machine
            </h2>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
              Rift is local-first, not local-only — and the difference should be in writing, not
              buried. Here is exactly what stays and what goes.
            </p>
          </Reveal>

          <div className="mt-12 max-w-3xl divide-y divide-border-hairline border-y border-border-hairline">
            <Reveal delay={0.02}>
              <div className="grid gap-1 py-5 sm:grid-cols-[130px_1fr] sm:gap-6">
                <div className="font-mono text-[12px] uppercase tracking-wide text-emerald-400">
                  Local
                </div>
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  Your conversations, the index, and your results — stored on your Mac. Rift
                  never uploads, syncs, or backs up your transcripts.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.04}>
              <div className="grid gap-1 py-5 sm:grid-cols-[130px_1fr] sm:gap-6">
                <div className="font-mono text-[12px] uppercase tracking-wide text-text-primary">
                  Embedding
                </div>
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  To make memory searchable, text goes to an embedding provider (Voyage by
                  default) — both the content you index and the queries you search. Always on;
                  it&rsquo;s how vector search works.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="grid gap-1 py-5 sm:grid-cols-[130px_1fr] sm:gap-6">
                <div className="font-mono text-[12px] uppercase tracking-wide text-text-primary">
                  AI processing
                </div>
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  By default, triage, metadata, and digests run through your own locally
                  authenticated Codex CLI — so relevant conversation content goes to Codex/OpenAI
                  under your account. Switchable to local Ollama for metadata and digests.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="grid gap-1 py-5 sm:grid-cols-[130px_1fr] sm:gap-6">
                <div className="font-mono text-[12px] uppercase tracking-wide text-text-muted">
                  Never
                </div>
                <p className="text-[15px] leading-relaxed text-text-secondary">
                  No Rift telemetry, no usage profiling, no content analytics. Not what you
                  store, not what you search, not how you use it.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-3xl text-[14px] leading-relaxed text-text-muted">
              Every byte that leaves your machine is itemized in the{" "}
              <Link
                href="/privacy"
                className="text-text-primary underline-offset-4 transition-colors hover:underline"
              >
                full privacy contract
              </Link>
              {" "}&mdash; the same document the product is held to.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
        <div className="overflow-hidden rounded-lg border border-border-hairline bg-bg-surface p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
            <Reveal>
              <h2 className="text-[28px] font-semibold tracking-tight text-text-primary sm:text-[34px]">
                Free during the beta. €19/month when it ships.
              </h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-text-secondary sm:text-[17px]">
                No card, no paywall. Rift is in private beta — once you&rsquo;re set up, use it
                across every tool for as long as the beta runs. Early beta users will be offered
                €9/month for 12 months when paid plans start.
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-lg border border-border-hairline bg-black/25 p-5">
                <div className="font-mono text-[13px] text-text-muted">During beta</div>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-[42px] font-semibold leading-none tracking-tight text-text-primary">
                    Free
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-text-muted">
                  €19/month when paid plans start. Early users offered €9/month for 12 months.
                </p>
                <Link
                  href={START_PATH}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-white px-5 text-[14px] font-medium text-black transition-colors duration-150 hover:bg-white/90"
                >
                  Start the free beta
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Install note */}
      <section className="relative mx-auto max-w-5xl px-6 pb-20">
        <Reveal>
          <div className="border-t border-border-hairline pt-8">
            <p className="max-w-2xl text-[14px] leading-relaxed text-text-muted">
              Rift currently supports macOS with Node 20+ and is in private beta. The beta is
              free — installing is how it starts, not a step that comes after payment.
            </p>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-border-hairline">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center">
        <div>
          <Wordmark />
          <p className="mt-3 text-[13px] text-text-muted">
            Local-first memory for AI tools.
          </p>
        </div>
        <div className="flex items-center gap-7 text-[13px] text-text-secondary">
          <a href="#how" className="transition-colors hover:text-text-primary">
            How it works
          </a>
          <Link href="/privacy" className="transition-colors hover:text-text-primary">
            Privacy
          </Link>
          <Link href={START_PATH} className="transition-colors hover:text-text-primary">
            Start
          </Link>
          <span className="text-text-muted">&copy; {new Date().getFullYear()} Rift</span>
        </div>
      </div>
    </footer>
  );
}
