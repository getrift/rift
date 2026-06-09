import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../site-nav";

export const metadata: Metadata = {
  title: "Privacy — what leaves your machine | Rift",
  description:
    "Rift is local-first. Your data stays on your Mac. The few things that can leave are named here — Voyage and Codex go to your own accounts; feedback reaches me only if you enable the relay.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy — what leaves your machine | Rift",
    description:
      "Rift is local-first. Your data stays on your Mac. The few things that can leave: Voyage and Codex go to your own accounts; feedback reaches me only if you enable the relay.",
    url: "https://getrift.dev/privacy",
    siteName: "Rift",
    type: "website",
  },
};

function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="mx-0.5 rounded-[4px] bg-white/[0.04] px-1 py-0.5 font-mono text-[0.86em] text-ink">
      {children}
    </code>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/[0.08] py-6 first:border-t-0">
      <h2 className="text-[17px] font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-2 text-[15.5px] leading-[1.65] text-ink-subtle">
        {children}
      </p>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <SiteNav />

      <article className="mx-auto max-w-xl px-6 py-20 sm:py-28">
        <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-ink sm:text-[56px]">
          Privacy, in plain words
        </h1>
        <p className="mt-6 text-[18px] leading-[1.6] text-ink-subtle">
          Rift lives on your Mac. Your conversations, your search index, your
          keys — they stay there. By default,{" "}
          <span className="text-ink">
            nothing leaves your machine
          </span>
          : a fresh install makes zero AI calls and search runs on keywords
          alone.
        </p>
        <p className="mt-4 text-[15.5px] leading-[1.65] text-ink-subtle">
          A few things <span className="italic">can</span> leave — but only ones
          you switch on. Voyage and Codex go to{" "}
          <span className="text-ink">your own</span>{" "}
          accounts; feedback reaches me only if you enable the relay.
          Here&rsquo;s the whole story.
        </p>

        <div className="mt-12">
          <Row title="Semantic search — only with your Voyage key">
            Add a Voyage API key and search gets smarter. From then on, the text
            Rift indexes and the queries you type are sent to{" "}
            <C>api.voyageai.com</C> under your own key to be embedded. No key
            means no embedding — and nothing sent.
          </Row>

          <Row title="AI enrichment & capture — only if you opt in">
            Want titles, topics, and digests, or live capture of new chats? Turn
            them on and Rift hands that work to your own{" "}
            <C>codex</C> CLI (OpenAI), on your existing subscription. I hold no
            key and pay nothing here. Off by default. Prefer fully local? A local
            Ollama model can do enrichment instead.
          </Row>

          <Row title="Feedback — off by default, opt-in">
            Your <C>rift feedback</C> notes are saved locally. A note only reaches
            me if you turned on the feedback relay during <C>rift onboard</C> — and
            then just your note, a random per-install ID (not your name or
            hostname), and your email if you chose to share one. Leave the relay
            off and nothing is sent.
          </Row>

          <Row title="A version check">
            About once an hour the app pings <C>registry.npmjs.org</C> to see if a
            newer beta exists — the same plain request <C>npm install</C> makes.
            No content, no ID, no key.
          </Row>

          <Row title="What never happens">
            No telemetry to me. No usage counters, no crash reports, no analytics,
            no snippets or embeddings phoned home. The Rift app never sends your
            conversations or search activity to me — the only thing it sends is a
            feedback note you opt into and type yourself.
          </Row>

          <Row title="The beta signup on this site">
            Separate from the app: when you get access on the homepage, the email
            you type is stored in my contact list at <C>Resend</C> (an email
            provider) so I can email you about the beta, like when free access
            changes. The email is all it collects, and skipping the form stores
            nothing. It has nothing to do with the app, which never uploads your
            conversations or search activity.
          </Row>

          <Row title="Leaving is one command">
            <C>rift uninstall</C> stops everything and cleans up its MCP entries.
            Add <C>--purge-data</C> to wipe Rift&rsquo;s data directory entirely.
            Your Voyage key and the npm package are left for you to remove, and
            you can ask me to revoke your key anytime.
          </Row>
        </div>

        <div className="mt-12 border-t border-dashed border-white/[0.08] pt-8">
          <p className="text-[15px] leading-[1.65] text-ink-subtle">
            This page is the contract. If the app ever does something this page
            doesn&rsquo;t say, that&rsquo;s a bug — run{" "}
            <C>rift feedback --kind=broke</C> and I&rsquo;ll fix it.
          </p>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-faint">
            Last reviewed: June 5, 2026
          </p>
          <div className="mt-8">
            <p className="text-[15px] leading-[1.65] text-ink-subtle">
              Rift is in private beta.{" "}
              <Link href="/" className="text-ink underline-offset-4 hover:underline">
                Join the Mac beta from the homepage →
              </Link>
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
