import type { Metadata } from "next";
import Link from "next/link";
import { RiftMark } from "../rift-logo";

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

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 select-none text-text-primary">
      <RiftMark size={16} />
      <span className="text-[15px] font-semibold tracking-tight text-text-primary">
        rift
      </span>
    </span>
  );
}

function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="mx-0.5 rounded-[4px] bg-bg-well px-1 py-0.5 font-mono text-[0.86em] text-text-primary">
      {children}
    </code>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border-hairline py-6 first:border-t-0">
      <h2 className="text-[17px] font-semibold tracking-tight text-text-primary">
        {title}
      </h2>
      <p className="mt-2 text-[15.5px] leading-[1.65] text-text-secondary">
        {children}
      </p>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg-app font-sans text-text-primary antialiased">
      <header className="border-b border-border-hairline">
        <nav className="mx-auto flex h-16 max-w-xl items-center px-6">
          <Link href="/" aria-label="Rift home">
            <Wordmark />
          </Link>
        </nav>
      </header>

      <article className="mx-auto max-w-xl px-6 py-20 sm:py-28">
        <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-text-primary sm:text-[56px]">
          Privacy, in plain words
        </h1>
        <p className="mt-6 text-[18px] leading-[1.6] text-text-secondary">
          Rift lives on your Mac. Your conversations, your search index, your
          keys — they stay there. By default,{" "}
          <span className="text-text-primary">
            nothing leaves your machine
          </span>
          : a fresh install makes zero AI calls and search runs on keywords
          alone.
        </p>
        <p className="mt-4 text-[15.5px] leading-[1.65] text-text-secondary">
          A few things <span className="italic">can</span> leave — but only ones
          you switch on. Voyage and Codex go to{" "}
          <span className="text-text-primary">your own</span>{" "}
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

          <Row title="The beta invite form on this site">
            Separate from the app: if you ask for an invite on the homepage, that
            form sends the email address you type to me, through{" "}
            <C>Resend</C> (an email provider), so I can reach you when your invite
            is ready. The email is all it collects, and skipping the form sends
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

        <div className="mt-12 border-t border-dashed border-border-hairline pt-8">
          <p className="text-[15px] leading-[1.65] text-text-secondary">
            This page is the contract. If the app ever does something this page
            doesn&rsquo;t say, that&rsquo;s a bug — run{" "}
            <C>rift feedback --kind=broke</C> and I&rsquo;ll fix it.
          </p>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-text-muted">
            Last reviewed: June 5, 2026
          </p>
          <div className="mt-8">
            <p className="text-[15px] leading-[1.65] text-text-secondary">
              Rift is in private beta.{" "}
              <Link href="/" className="text-text-primary underline-offset-4 hover:underline">
                Request an invite
              </Link>{" "}
              from the homepage. Already invited?{" "}
              <Link href="/start" className="text-text-primary underline-offset-4 hover:underline">
                Set up Rift →
              </Link>
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
