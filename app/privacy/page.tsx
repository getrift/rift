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
          Rift stores your conversations and search index on your Mac. A fresh
          install uses keyword search and makes no AI calls. No Rift account is
          needed. Your conversation content leaves only through the choices
          described below. There is also a version check, which sends no content.
        </p>
        <p className="mt-4 text-[15.5px] leading-[1.65] text-ink-subtle">
          Cloud search and AI processing use your own accounts. Feedback reaches
          me only if you enable the relay. When you ask your AI tool to search
          Rift, the excerpts it retrieves become part of that tool&rsquo;s chat.
        </p>

        <div className="mt-12">
          <Row title="Semantic search, only with your Voyage key">
            Add a Voyage API key and search gets smarter. From then on, the text
            Rift indexes and the queries you type are sent to{" "}
            <C>api.voyageai.com</C> under your own key to be embedded. No key
            means no embedding, and nothing sent.
          </Row>

          <Row title="AI enrichment & capture, only if you opt in">
            These features are off by default. When enabled, metadata extraction
            and capture triage send conversation content to your configured
            worker: Codex CLI (OpenAI) or Claude Code (Anthropic), under your own
            account. Digest summaries use Codex. Choosing Claude for metadata
            does not silently enable Codex digests. A local Ollama model can do
            metadata and digest work on your Mac instead.
          </Row>

          <Row title="When your AI tool uses Rift">
            When Claude, Codex, Cursor, or another connected tool calls Rift,
            matching conversation excerpts and their source references enter
            that chat. A cloud AI tool can send this context to its provider
            under your account and its own privacy settings. The local browser
            search stays on your Mac unless you have enabled cloud search.
          </Row>

          <Row title="Feedback, off by default, opt-in">
            Your <C>rift feedback</C> notes are saved locally. A note only reaches
            me if you turned on the feedback relay during <C>rift onboard</C>, and
            then just your note, a random per-install ID (not your name or
            hostname), your email if you chose to share one, and optional health
            information such as whether the daemon is running. Leave the relay
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

          <Row title="The beta signup on this site">
            Separate from the app: when you get access on the homepage, the email
            you type is stored in my contact list at <C>Resend</C> (an email
            provider) so I can email you about the beta, like when free access
            changes. The email is all it collects, and skipping the form stores
            nothing. It has nothing to do with the app, which never uploads your
            conversations or search activity.
          </Row>

          <Row title="Leaving is one command">
            In the macOS setup page, choose Remove Rift and confirm once. This
            removes Rift&rsquo;s archive, credentials, background service,
            bundled app and its connections to your AI tools. Original exports
            and unrelated tools are preserved. The same removal is available
            from Terminal with <C>rift uninstall --purge-data</C>. Without
            <C>--purge-data</C>, your archive and credentials are kept. A setup-page
            removal leaves a report in <C>~/Library/Logs/Rift/</C> and tells you
            if any step failed. Separately installed npm packages need their
            package manager&rsquo;s uninstall command.
          </Row>
        </div>

        <div className="mt-12 border-t border-dashed border-white/[0.08] pt-8">
          <p className="text-[15px] leading-[1.65] text-ink-subtle">
            This page is the contract. If the app ever does something this page
            doesn&rsquo;t say, that&rsquo;s a bug. Run{" "}
            <C>rift feedback --kind=broke</C> and I&rsquo;ll fix it.
          </p>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-faint">
            Last reviewed: September 5, 2026
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

      <SiteFooter containerClass={COLUMN} />
    </main>
  );
}
