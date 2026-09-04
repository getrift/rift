import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";
import { socialMeta } from "../seo";

const COLUMN = "max-w-xl px-6";

const description =
  "Rift is local-first. Your data stays on your Mac. The few things that can leave are named here, and they go to your own accounts.";

export const metadata: Metadata = {
  title: "Privacy",
  description,
  ...socialMeta({
    title: "Rift Privacy: what leaves your machine",
    description,
    path: "/privacy",
  }),
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
      <SiteNav containerClass={COLUMN} />

      <article className="mx-auto max-w-xl px-6 py-20 sm:py-28">
        <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-ink sm:text-[56px]">
          Privacy, in plain words
        </h1>
        <p className="mt-6 text-[18px] leading-[1.6] text-ink-subtle">
          Rift lives on your Mac. Your conversations, your search index, and your
          keys all stay there. By default,{" "}
          <span className="text-ink">
            nothing leaves your machine
          </span>
          : a fresh install makes zero AI calls and search runs on keywords
          alone.
        </p>
        <p className="mt-4 text-[15.5px] leading-[1.65] text-ink-subtle">
          A few things <span className="italic">can</span> leave, but only ones
          you switch on. Voyage and Codex go to{" "}
          <span className="text-ink">your own</span>{" "}
          accounts; feedback reaches me only if you enable the relay.
          Here&rsquo;s the whole story.
        </p>

        <div className="mt-12">
          <Row title="Semantic search, only with your Voyage key">
            Add a Voyage API key and search gets smarter. From then on, the text
            Rift indexes and the queries you type are sent to{" "}
            <C>api.voyageai.com</C> under your own key to be embedded. No key
            means no embedding, and nothing sent.
          </Row>

          <Row title="AI enrichment & capture, only if you opt in">
            Want titles, topics, and digests, or live capture of new chats? Turn
            them on and Rift hands that work to your own{" "}
            <C>codex</C> CLI (OpenAI), on your existing subscription. I hold no
            key and pay nothing here. Off by default. Prefer fully local? A local
            Ollama model can do enrichment instead.
          </Row>

          <Row title="Feedback, off by default, opt-in">
            Your <C>rift feedback</C> notes are saved locally. A note only reaches
            me if you turned on the feedback relay during <C>rift onboard</C>, and
            then just your note, a random per-install ID (not your name or
            hostname), and your email if you chose to share one. Leave the relay
            off and nothing is sent.
          </Row>

          <Row title="A version check">
            About once an hour the app pings <C>registry.npmjs.org</C> to see if a
            newer beta exists, the same plain request <C>npm install</C> makes.
            No content, no ID, no key.
          </Row>

          <Row title="What never happens">
            No telemetry to me. No usage counters, no crash reports, no analytics,
            no snippets or embeddings phoned home. The Rift app never sends your
            conversations or search activity to me. The only thing it sends is a
            feedback note you opt into and type yourself.
          </Row>

          <Row title="Paying for Rift">
            Separate from the app: checkout runs on <C>Stripe</C>, which collects
            your email and payment details to take the subscription and send the
            receipt. Card numbers never touch this site — the button hands you to
            Stripe&rsquo;s own page, and I never see a full card number. As the
            merchant I can see what Stripe shows me about your account: your name
            and email, the billing address and country you give it, your card&rsquo;s
            brand and last four digits, and your invoices, payments, refunds and
            subscription status. I use your email for receipts and things you need
            to know about Rift. You can manage or cancel anytime in the{" "}
            <Link href="/billing" className="text-ink underline-offset-4 hover:underline">
              billing portal
            </Link>
            . None of this touches the app, which never uploads your conversations
            or search activity.
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
            doesn&rsquo;t say, that&rsquo;s a bug. Run{" "}
            <C>rift feedback --kind=broke</C> and I&rsquo;ll fix it.
          </p>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-faint">
            Last reviewed: September 4, 2026
          </p>
          <div className="mt-8">
            <p className="text-[15px] leading-[1.65] text-ink-subtle">
              Rift is early, and built in the open.{" "}
              <Link href="/" className="text-ink underline-offset-4 hover:underline">
                Get Rift from the homepage →
              </Link>
            </p>
          </div>
        </div>
      </article>

      <SiteFooter containerClass={COLUMN} />
    </main>
  );
}
