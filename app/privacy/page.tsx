import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — what leaves your machine | Rift",
  description:
    "Rift is local-first, not local-only. The exact contract: what stays on your Mac, and what — and only what — leaves it for embeddings and AI processing.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy — what leaves your machine | Rift",
    description:
      "Rift is local-first, not local-only. The exact contract: what stays on your Mac, and what — and only what — leaves it.",
    url: "https://getrift.dev/privacy",
    siteName: "Rift",
    type: "website",
  },
};

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

function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-[4px] bg-bg-well px-1 py-0.5 font-mono text-[0.86em] text-text-primary">
      {children}
    </code>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border-hairline pt-12">
      <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-text-muted">
        {n}
      </div>
      <h2 className="mt-4 text-[26px] font-semibold leading-tight tracking-tight text-text-primary sm:text-[30px]">
        {title}
      </h2>
      <div className="mt-6 space-y-5 text-[16px] leading-[1.7] text-text-secondary sm:text-[17px]">
        {children}
      </div>
    </section>
  );
}

function Fact({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 border-t border-border-hairline py-3 first:border-t-0 sm:grid-cols-[160px_1fr] sm:gap-6">
      <div className="font-mono text-[12px] uppercase tracking-[0.14em] text-text-muted">
        {k}
      </div>
      <div className="text-[15px] leading-relaxed text-text-secondary">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-app font-sans text-text-primary antialiased">
      <header className="border-b border-border-hairline">
        <nav className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
          <Link href="/" aria-label="Rift home">
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="text-[13px] text-text-secondary underline-offset-4 transition-colors hover:text-text-primary hover:underline"
          >
            Home
          </Link>
        </nav>
      </header>

      <article className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
        {/* Title */}
        <h1 className="text-[56px] font-semibold leading-[0.98] tracking-[-0.02em] text-text-primary sm:text-[76px]">
          Privacy
        </h1>
        <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.18em] text-text-muted">
          Last reviewed: June 5, 2026
        </p>

        {/* Intro */}
        <div className="mt-12 space-y-6 text-[17px] leading-[1.7] text-text-secondary sm:text-[18px]">
          <p>
            Rift is local-first, not local-only. This page is the contract:{" "}
            <span className="font-medium text-text-primary">
              exactly what stays on your Mac, and exactly what — and only what —
              leaves it.
            </span>{" "}
            If the running product ever contradicts this page, that&rsquo;s a
            bug, not fine print.
          </p>
          <p>
            The short version: your stored data never leaves your machine. No
            conversation content reaches the network by default. Two optional
            paths can send your content out, each a separate opt-in — embedding
            (only with a Voyage key) and AI processing (Codex enrichment and
            live capture). Everything below spells out where each byte goes.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-20 space-y-16">
          <Section n="01 — Stays on your Mac" title="What never leaves">
            <p>
              These live only on your machine. Rift never uploads, syncs, or
              backs them up:
            </p>
            <ul className="space-y-3">
              {[
                <>
                  Your stored transcripts and raw exports — ChatGPT, Claude,
                  Gemini, and Grok exports, plus captured Claude Code and Codex
                  CLI sessions. The original files Rift reads are left
                  untouched.
                </>,
                <>
                  The vector index (LanceDB tables) and the local embeddings
                  cache, under <C>~/Library/Application&nbsp;Support/Rift/</C>.
                </>,
                <>
                  Your Voyage API key, in <C>~/.rift.env</C> (mode 0600).{" "}
                  <C>rift status</C> shows only the last 4 characters.
                </>,
                <>
                  Your username, machine name, and home-directory paths — Rift
                  never <span className="italic">adds</span> any of these as
                  metadata to anything it sends. (If such strings sit inside a
                  conversation you index or process, that text travels as content
                  under the opt-in paths below — Rift forwards what you chose to
                  index verbatim, it just never attaches machine identifiers of
                  its own.)
                </>,
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="select-none text-text-muted">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              The stored copies never leave. The{" "}
              <span className="italic">content inside them</span> is sent out
              only for the optional paths you turn on — embedding and AI
              processing, the next two sections. The files are local; the words
              travel only where it says they do, and only once you opt in.
            </p>
          </Section>

          <Section n="02 — To Voyage AI · only with a key" title="Embedding">
            <p>
              Semantic search is optional and activates only when you add a
              Voyage API key. Without a key, search runs in keyword-only mode and
              embeds nothing — no text leaves your Mac. With a key, two things
              get sent to Voyage AI: the text Rift indexes — which can be a full
              conversation, not just a snippet — and your query text on{" "}
              <span className="italic">every</span> normal search — once a key
              exists, search becomes hybrid (lexical + vector), so each query is
              embedded and sent to Voyage before the lookup. The returned vectors
              are stored locally. A direct <C>rift get --id</C> lookup never
              embeds, with or without a key.
            </p>
            <div className="mt-2">
              <Fact k="Destination">
                <C>api.voyageai.com</C>
              </Fact>
              <Fact k="Payload">
                The conversation text being indexed (up to the full
                conversation); your search-query text when searching
              </Fact>
              <Fact k="Model">
                <C>voyage-3-lite</C>
              </Fact>
              <Fact k="Auth">Your own Voyage API key</Fact>
              <Fact k="Stored where">
                Returned vectors are stored locally in LanceDB
              </Fact>
            </div>
            <p>
              <span className="font-medium text-text-primary">
                Per-friend isolation.
              </span>{" "}
              During the beta, every friend gets their own Voyage project and
              key, scoped and budgeted separately. You can ask Clem to revoke
              yours at any time — revocation is immediate.
            </p>
          </Section>

          <Section
            n="03 — To your Codex CLI (OpenAI) · only if you opt in"
            title="AI processing"
          >
            <p>
              Rift can do three kinds of language-model work —{" "}
              <span className="font-medium text-text-primary">triage</span>{" "}
              (what to keep, part of live capture),{" "}
              <span className="font-medium text-text-primary">
                metadata extraction
              </span>{" "}
              (titles, topics, decisions), and{" "}
              <span className="font-medium text-text-primary">
                digest summaries
              </span>
              . All of it is{" "}
              <span className="font-medium text-text-primary">
                off by default
              </span>
              : a fresh install makes zero Codex model calls — no conversation
              content is processed — even on a Mac with Codex already installed
              and signed in. (Rift passes no conversation content during
              install; the installer only runs <C>codex --version</C> to detect
              whether the AI worker exists.) Two separate opt-ins turn it on —
              Codex AI enrichment (metadata + digests) via{" "}
              <C>rift onboard --enable-codex-enrichment</C>, and live chat
              capture (which triages new sessions) via{" "}
              <C>rift onboard --enable-capture</C>. Once on, the relevant
              conversation content is sent to Codex/OpenAI{" "}
              <span className="font-medium text-text-primary">
                under your own account
              </span>
              .
            </p>
            <div className="mt-2">
              <Fact k="Destination">
                OpenAI&rsquo;s Codex service, via your local <C>codex exec</C>
              </Fact>
              <Fact k="Payload">
                The conversation content being triaged, enriched, or summarized
              </Fact>
              <Fact k="Auth">
                Your own Codex session. Rift holds no OpenAI key and pays nothing
                here — it inherits the Codex subscription you already have
              </Fact>
              <Fact k="Default">
                Off. A fresh install runs no capture and no Codex enrichment —
                zero Codex model calls
              </Fact>
              <Fact k="Local option">
                Once enrichment is on, set <C>local_generation.enabled</C> to run
                metadata and digests on a local Ollama model instead of Codex.
                Capture triage currently always uses Codex CLI
              </Fact>
            </div>
            <p>
              Why Codex CLI when you do opt in? It needs no API key, costs you
              nothing beyond the subscription you already have, and in our
              testing so far produces better triage and metadata than the local
              models we&rsquo;ve tried. Prefer to keep enrichment fully local?
              Ollama covers metadata and digests today; local triage is on the
              roadmap.
            </p>
          </Section>

          <Section n="04 — To npm · hourly" title="Version check">
            <p>
              About once an hour, the daemon checks <C>registry.npmjs.org</C>{" "}
              for the latest beta version, so <C>rift status</C> can tell you
              when an update is available. It&rsquo;s a plain GET — no custom
              auth, no Rift user ID, no content, no key, no machine name — the
              same call any <C>npm install</C> already makes. Like any HTTP
              request it reaches npm from your IP with your runtime&rsquo;s
              default headers; nothing Rift adds identifies you.
            </p>
          </Section>

          <Section n="05 — To Clem · only if you opt in" title="Feedback relay">
            <p>
              The feedback relay is{" "}
              <span className="font-medium text-text-primary">
                off by default
              </span>
              . You can turn it on during <C>rift onboard</C>. When it&rsquo;s
              on, an explicit <C>rift feedback</C> note relays exactly these
              fields:
            </p>
            <div className="mt-2">
              <Fact k="note + kind">
                Your free-text note and its tag (
                <C>worked</C> / <C>broke</C> / <C>surprised</C> / <C>idea</C>) —
                forwarded verbatim, exactly as you type it
              </Fact>
              <Fact k="ts">The timestamp you hit enter</Fact>
              <Fact k="installation_id">
                A random per-install UUID — not your username or hostname
              </Fact>
              <Fact k="email">
                Only if you chose to share a beta contact email at onboarding —
                absent otherwise
              </Fact>
              <Fact k="build identity">
                The daemon&rsquo;s <C>version</C>, <C>commit</C>, and <C>node</C>{" "}
                version
              </Fact>
              <Fact k="status snapshot">
                Only with <C>--with-status</C>: sanitized counts and booleans —
                no paths, no error messages, no key bytes, no machine name
              </Fact>
            </div>
            <p>
              One more relay rides the same opt-in: if you share your email at{" "}
              <C>rift onboard</C>, a single <C>beta_signup</C> event (your email,
              the same <C>installation_id</C>, timestamp, and build identity — no
              note, no conversation content) is sent once so Clem can reach you.
            </p>
            <p>
              Rift never attaches your conversation content automatically — but
              the note is free text, sent as you wrote it. Anything you type or
              paste into it (a transcript, a path, a secret) travels as-is, so
              treat it like a message you&rsquo;re choosing to send.{" "}
              <C>rift feedback --history</C> shows a sanitized summary (timestamp,
              kind, and note); the full payload body is kept in the local JSONL
              record at <C>data/observability/feedback.jsonl</C>. Transport
              headers and the request signature aren&rsquo;t part of either.
            </p>
          </Section>

          <Section n="06 — Never" title="What Rift never collects">
            <ul className="space-y-3">
              {[
                <>
                  Telemetry to Rift — no install pings, no usage counters, no
                  retention metrics, no crash reports beyond what you paste into
                  a feedback note.
                </>,
                <>
                  No analytics endpoint for your content — no anonymized
                  snippets, no embeddings, no search logs sent to Rift or any
                  analytics service.
                </>,
                <>
                  No spend back-channels — Voyage cost is observed on
                  Clem&rsquo;s dashboard against your project; Rift never phones
                  home with numbers.
                </>,
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="select-none text-text-muted">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              This is distinct from the Voyage and Codex calls above: those carry
              content to <span className="italic">your</span> Voyage project and{" "}
              <span className="italic">your</span> Codex CLI to make search and
              triage work — never to a Rift-owned channel.
            </p>
          </Section>

          <Section n="07 — Yours to delete" title="Leaving is one command">
            <p>
              <C>rift uninstall</C> stops the daemon, removes the launchd job,
              and reverses the MCP entries from the supported MCP clients (Claude
              Desktop, Claude Code, Cursor, and Codex). Add{" "}
              <C>--purge-data</C> to erase Rift&rsquo;s entire data directory (
              <C>~/Library/Application&nbsp;Support/Rift/</C>). Two things are
              deliberately left for you to remove: your Voyage key in{" "}
              <C>~/.rift.env</C>, and the global npm package itself — the
              terminal prints the exact commands, and Clem can revoke the key
              server-side.
            </p>
          </Section>
        </div>

        {/* Closer */}
        <div className="mt-20 border-t border-dashed border-border-hairline pt-10">
          <p className="text-[15px] leading-relaxed text-text-secondary">
            This page is canonical. If a behavior in the running product
            contradicts it, that&rsquo;s a bug — run{" "}
            <C>rift feedback --kind=broke</C> and Clem will fix it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14px]">
            <Link
              href="/start"
              className="font-medium text-text-primary underline-offset-4 transition-colors hover:underline"
            >
              Start the beta →
            </Link>
            <Link
              href="/"
              className="text-text-secondary underline-offset-4 transition-colors hover:text-text-primary hover:underline"
            >
              Back home
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
