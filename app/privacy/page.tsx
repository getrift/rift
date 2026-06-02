import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

function Block({
  label,
  labelClass,
  title,
  children,
}: {
  label: string;
  labelClass: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border-hairline pt-8">
      <div className={`font-mono text-[12px] uppercase tracking-wide ${labelClass}`}>
        {label}
      </div>
      <h2 className="mt-3 text-[22px] font-semibold tracking-tight text-text-heading sm:text-[26px]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-secondary">
        {children}
      </div>
    </div>
  );
}

function Detail({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-2.5 sm:grid-cols-[150px_1fr] sm:gap-5">
      <div className="font-mono text-[12px] uppercase tracking-wide text-text-muted">{k}</div>
      <div className="text-[14px] leading-relaxed text-text-secondary">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-app font-sans text-text-primary antialiased">
      <header className="border-b border-border-hairline">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" aria-label="Rift home">
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <span className="inline-flex items-center rounded-full border border-border-hairline bg-bg-well px-3 py-1 text-[12px] text-text-secondary">
          Privacy contract
        </span>
        <h1 className="mt-6 text-balance text-[40px] font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-[52px]">
          What leaves your machine, in writing.
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-text-secondary sm:text-[18px]">
          Rift is local-first, not local-only. This page is the contract: exactly what stays on
          your Mac, and exactly what &mdash; and only what &mdash; leaves it. If the product ever
          contradicts this page, that&rsquo;s a bug, not fine print.
        </p>

        {/* TL;DR */}
        <div className="mt-12 rounded-lg border border-border-hairline bg-bg-well p-6">
          <div className="font-mono text-[12px] uppercase tracking-wide text-text-muted">
            The short version
          </div>
          <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-text-secondary">
            <li className="flex gap-2.5">
              <span className="text-text-muted">&mdash;</span>
              <span>
                <span className="text-text-primary">Your stored data stays on your Mac.</span>{" "}
                Transcripts, the vector index, and your search results live on disk under{" "}
                <code className="font-mono text-[13px] text-text-primary">
                  ~/Library/Application&nbsp;Support/Rift/
                </code>
                . Rift never uploads, syncs, or backs them up.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-text-muted">&mdash;</span>
              <span>
                <span className="text-text-primary">
                  No conversation content reaches the network by default.
                </span>{" "}
                Import and keyword search run fully local &mdash; no key, no Codex. Two things can
                send your content out once you turn them on: embedding (only with a Voyage key) and
                AI processing (Codex enrichment and live capture, each a separate opt-in). The
                daemon also makes one metadata-only npm version check (no content &mdash; see below).
                All of it is spelled out below. Nothing else leaves on Rift&rsquo;s behalf.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-text-muted">&mdash;</span>
              <span>
                <span className="text-text-primary">Clem sees nothing by default.</span> A feedback
                relay exists, but it&rsquo;s off until you turn it on.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-text-muted">&mdash;</span>
              <span>
                <span className="text-text-primary">Your key stays yours.</span> Your Voyage key
                lives in{" "}
                <code className="font-mono text-[13px] text-text-primary">~/.rift.env</code> (mode
                0600) &mdash; never logged, never sent to Clem, and only sent to Voyage itself as
                auth for embedding requests.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-14 space-y-12">
          {/* Stays local */}
          <Block
            label="Stays on your Mac"
            labelClass="text-emerald-400"
            title="What never leaves"
          >
            <p>
              These live only on your machine. Rift never uploads, syncs, or backs them up:
            </p>
            <ul className="space-y-2.5">
              {[
                "Your stored transcripts and raw exports — ChatGPT, Claude, and Grok exports, plus captured Claude Code and Codex CLI sessions. The original files Rift reads are left untouched.",
                "The vector index (LanceDB tables) and the local embeddings cache.",
                "Your Voyage API key, in ~/.rift.env (mode 0600). Status output shows only the last 4 characters.",
                "Your username, machine name, and home-directory paths — none of these appear in anything that leaves.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="text-text-muted">&mdash;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              The stored copies never leave. The <em>content inside them</em> is sent out only for
              the optional paths you turn on &mdash; embedding (with a Voyage key) and AI processing
              (Codex enrichment or live capture) &mdash; that&rsquo;s the next two sections. The
              files are local; the words travel only where it says they do, and only once you opt
              in.
            </p>
          </Block>

          {/* Voyage */}
          <Block
            label="To Voyage AI · only with a key"
            labelClass="text-text-primary"
            title="Embedding (optional)"
          >
            <p>
              Semantic search is optional and activates only when you add a Voyage API key. With a
              key, text is sent to Voyage AI for embedding two ways: when Rift indexes new content
              (snippets, one per chunk), and when you run a semantic search &mdash; the query text
              itself is embedded before the vector lookup. The returned vectors are stored locally.
              Without a key, search stays lexical/keyword and no text is embedded or sent. (A direct{" "}
              <code className="font-mono text-[13px] text-text-primary">rift get --id</code> lookup
              never embeds; keyword search never embeds; only a semantic search embeds the query
              first.)
            </p>
            <div className="mt-2 divide-y divide-border-hairline border-y border-border-hairline">
              <Detail k="Destination">
                <code className="font-mono text-[13px] text-text-primary">api.voyageai.com</code>
              </Detail>
              <Detail k="Payload">
                Content snippets when indexing; your search-query text when searching
              </Detail>
              <Detail k="Model">
                <code className="font-mono text-[13px] text-text-primary">voyage-3-lite</code>
              </Detail>
              <Detail k="Auth">Your own Voyage API key</Detail>
              <Detail k="Stored where">Returned vectors are stored locally in LanceDB</Detail>
            </div>
            <p>
              <span className="text-text-primary">Per-friend isolation.</span> During the beta,
              every friend gets their own Voyage project and key, scoped and budgeted separately.
              You can ask Clem to revoke yours at any time &mdash; revocation is immediate.
            </p>
          </Block>

          {/* Codex CLI */}
          <Block
            label="To your Codex CLI (OpenAI) · only if you opt in"
            labelClass="text-text-primary"
            title="AI processing (optional)"
          >
            <p>
              Rift can do three kinds of language-model work &mdash; <strong>triage</strong> (what
              to keep, part of live capture), <strong>metadata extraction</strong> (titles, topics,
              decisions), and <strong>digest summaries</strong>. All of it is{" "}
              <span className="text-text-primary">off by default</span>: a fresh install makes zero
              Codex calls, even on a Mac with Codex already installed and signed in. Two separate
              opt-ins turn it on &mdash; Codex AI enrichment (metadata + digests) via{" "}
              <code className="font-mono text-[13px] text-text-primary">
                rift onboard --enable-codex-enrichment
              </code>
              , and live chat capture (which triages new sessions) via{" "}
              <code className="font-mono text-[13px] text-text-primary">
                rift onboard --enable-capture
              </code>
              . Once on, the relevant conversation content is sent to Codex/OpenAI{" "}
              <span className="text-text-primary">under your own account</span>.
            </p>
            <div className="mt-2 divide-y divide-border-hairline border-y border-border-hairline">
              <Detail k="Destination">
                OpenAI&rsquo;s Codex service, via your local{" "}
                <code className="font-mono text-[13px] text-text-primary">codex exec</code>
              </Detail>
              <Detail k="Payload">
                The conversation content being triaged, enriched, or summarized
              </Detail>
              <Detail k="Auth">
                Your own Codex session. Rift holds no OpenAI key and pays nothing here &mdash; it
                inherits the Codex subscription you already have
              </Detail>
              <Detail k="Default">
                Off. A fresh install runs no capture and no Codex enrichment &mdash; zero Codex
                calls. Enable Codex metadata enrichment with{" "}
                <code className="font-mono text-[13px] text-text-primary">
                  --enable-codex-enrichment
                </code>{" "}
                and live capture with{" "}
                <code className="font-mono text-[13px] text-text-primary">--enable-capture</code>{" "}
                during <code className="font-mono text-[13px] text-text-primary">rift onboard</code>
              </Detail>
              <Detail k="Local option">
                Once enrichment is on, set{" "}
                <code className="font-mono text-[13px] text-text-primary">
                  local_generation.enabled
                </code>{" "}
                to run metadata and digests on a local Ollama model instead of Codex. Capture triage
                currently always uses Codex CLI
              </Detail>
            </div>
            <p>
              Why Codex CLI when you do opt in? It needs no API key, costs you nothing beyond the
              subscription you already have, and produces materially better triage and metadata than
              the local models we&rsquo;ve benchmarked. Prefer to keep enrichment fully local? Ollama
              covers metadata and digests today; local triage is on the roadmap.
            </p>
          </Block>

          {/* npm */}
          <Block
            label="To npm · hourly"
            labelClass="text-text-secondary"
            title="Version check"
          >
            <p>
              About once an hour, the daemon checks{" "}
              <code className="font-mono text-[13px] text-text-primary">registry.npmjs.org</code>{" "}
              for the latest beta version, so <code className="font-mono text-[13px] text-text-primary">rift status</code>{" "}
              can tell you when an update is available. It&rsquo;s a plain GET with no auth and no
              identifying headers &mdash; the same call any{" "}
              <code className="font-mono text-[13px] text-text-primary">npm install</code> already
              makes. No content, no installation ID, no key, no machine name leaves.
            </p>
          </Block>

          {/* Clem */}
          <Block
            label="To Clem · only if you opt in"
            labelClass="text-text-secondary"
            title="Feedback relay"
          >
            <p>
              The feedback relay is <span className="text-text-primary">off by default</span>. You
              can turn it on during{" "}
              <code className="font-mono text-[13px] text-text-primary">rift onboard</code>. When
              it&rsquo;s on, only your explicit{" "}
              <code className="font-mono text-[13px] text-text-primary">rift feedback</code> notes
              &mdash; plus optional non-content health metadata, never conversation content, paths,
              or secrets &mdash; flow to Clem. Audit every byte ever sent with{" "}
              <code className="font-mono text-[13px] text-text-primary">rift feedback --history</code>.
            </p>
          </Block>

          {/* Never */}
          <Block
            label="Never"
            labelClass="text-text-muted"
            title="What Rift never collects"
          >
            <ul className="space-y-2.5">
              {[
                "Telemetry to Rift — no install pings, no usage counters, no retention metrics, no crash reports beyond what you paste into a feedback note.",
                "No analytics endpoint for your content — no anonymized snippets, no embeddings, no search logs sent to Rift or any analytics service.",
                "No spend back-channels — Voyage cost is observed on Clem's dashboard against your project; Rift never phones home with numbers.",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="text-text-muted">&mdash;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              This is distinct from the Voyage and Codex calls above: those carry content to{" "}
              <em>your</em> Voyage project and <em>your</em> Codex CLI to make search and triage
              work &mdash; never to a Rift-owned channel.
            </p>
          </Block>

          {/* Uninstall */}
          <Block
            label="Yours to delete"
            labelClass="text-text-muted"
            title="Leaving is one command"
          >
            <p>
              <code className="font-mono text-[13px] text-text-primary">rift uninstall</code> stops
              the daemon, removes the launchd job, and reverses the MCP entries from every connected
              tool. Add{" "}
              <code className="font-mono text-[13px] text-text-primary">--purge-data</code> to erase
              every byte of local data too. Your Voyage key is left in{" "}
              <code className="font-mono text-[13px] text-text-primary">~/.rift.env</code> until you
              remove it &mdash; the terminal prints the exact command, and Clem can revoke it
              server-side.
            </p>
          </Block>
        </div>

        {/* Closer */}
        <div className="mt-14 border-t border-border-hairline pt-8">
          <p className="text-[15px] leading-relaxed text-text-secondary">
            This page is canonical. If a behavior in the running product contradicts it, that&rsquo;s
            a bug &mdash; run{" "}
            <code className="font-mono text-[13px] text-text-primary">
              rift feedback --kind=broke
            </code>{" "}
            and Clem will fix it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/start"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-text-primary underline-offset-4 transition-colors hover:underline"
            >
              Start the beta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[14px] text-text-secondary transition-colors hover:text-text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back home
            </Link>
          </div>
          <p className="mt-8 text-[12px] text-text-muted">Last reviewed 2026-06-02.</p>
        </div>
      </section>
    </main>
  );
}
