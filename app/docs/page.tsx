import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import InstallCommand, { CopyBlock } from "../install-command";
import DocsToc from "./docs-toc";
import { socialMeta } from "../seo";
import SiteFooter from "../site-footer";
import SiteNav from "../site-nav";

const COLUMN = "max-w-[1120px] px-6 sm:px-10";

// One source of truth for the rail + mobile TOC, so labels can't drift from sections.
const SECTIONS = [
  { id: "welcome", label: "Install" },
  { id: "agents", label: "Connect agents" },
  { id: "search", label: "Search by meaning" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "privacy", label: "Privacy" },
] as const;

const description =
  "Install Rift, connect it to your agents, and fix the common setup issues.";

export const metadata: Metadata = {
  title: "Docs",
  description,
  ...socialMeta({
    title: "Rift Docs",
    description,
    path: "/docs",
  }),
};

function C({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[5px] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.86em] text-ink-bright">
      {children}
    </code>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-14 first:pt-0">
      <h2 className="text-[28px] font-semibold leading-[1.12] text-ink" style={{ textWrap: "balance" }}>
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-[15.5px] leading-[1.7] text-ink-subtle">{children}</div>
    </section>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div>
      <span className="text-[12px] tabular-nums text-ink-faint">{n}</span>
      <h3 className="mt-2 text-[14.5px] font-medium text-ink-bright">{title}</h3>
      <div className="mt-1.5 text-[14px] leading-[1.65] text-ink-subtle">{children}</div>
    </div>
  );
}

function Issue({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[14.5px] font-medium text-ink-bright">{title}</h3>
      <div className="mt-1.5 text-[14px] leading-[1.65] text-ink-subtle">{children}</div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <SiteNav containerClass={COLUMN} />

      <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-24">
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <DocsToc sections={SECTIONS} variant="sidebar" />
          </div>
        </aside>

        <article className="max-w-[700px]">
          <h1
            className="max-w-[660px] text-[44px] font-semibold leading-[1.02] text-ink sm:text-[64px]"
            style={{ textWrap: "balance" }}
          >
            Start with one memory your agents can share
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-[1.6] text-ink-subtle">
            Rift runs on your Mac, records the agent sessions you choose, and gives that past work back to
            any tool that can talk to it. You shouldn&rsquo;t have to bring the same project back into focus twice.
          </p>

          <DocsToc sections={SECTIONS} variant="mobile" />

          <div className="mt-12">
            <Section id="welcome" title="Install Rift">
              <p>
                Install is one command. Run it in Terminal, or paste it into your agent and ask it to install
                Rift for you.
              </p>
              <InstallCommand />
              <p className="text-[13.5px] text-ink-faint">Requires macOS 12.3+, Node 20.19+, npm, git, and Apple Command Line Tools.</p>

              <div className="grid gap-x-8 gap-y-5 pt-2 sm:grid-cols-3">
                <Step n="01" title="Install">
                  Rift creates a local data folder, starts the background service, and keeps private defaults on.
                </Step>
                <Step n="02" title="Onboard">
                  Run <C>rift onboard</C> after install. It walks through first-run setup and a recall test.
                </Step>
                <Step n="03" title="Ask">
                  In a new agent session, ask it to recall prior Rift context before it starts working.
                </Step>
              </div>
            </Section>

            <Section id="agents" title="Tell your agents to use Rift">
              <p>
                The simplest setup is a short instruction in the file your agent already reads. For Codex, use{" "}
                <C>AGENTS.md</C>. For Claude Code, use <C>CLAUDE.md</C>.
              </p>
              <CopyBlock
                multiline
                label="Copy agent instruction"
                text="Before starting, ask Rift for relevant past context. Use Rift to recall decisions, files, and prior agent sessions that may matter for this task."
              />
              <p>
                Then check the connection from inside your agent. Run <C>/mcp</C> and look for <C>rift</C>.
                If it is missing, run <C>rift mcp install --client codex</C>, or swap <C>codex</C> for the
                agent you use.
              </p>
            </Section>

            <Section id="search" title="Rift finds the idea, not just the word">
              <p>
                This is the heart of Rift. It finds the right past work by meaning, not by exact words, so you
                can ask for &ldquo;the billing decision from last week&rdquo; and Rift surfaces the session even
                if nobody wrote those words. That recall is the efficiency you feel every day: you stop
                re-explaining context to every agent.
              </p>
              <p>
                Meaning search is on by default in the beta. It is set up for you, so there are no keys to
                manage and no wiring to think about. Plain keyword search works too, but the point of Rift is
                that you don&rsquo;t need to remember how you phrased something to find it again.
              </p>
            </Section>

            <Section id="troubleshooting" title="Common setup issues">
              <div className="space-y-6">
                <Issue title="The installer says Node is missing or too old">
                  Install or update Node with <C>brew install node</C> or <C>brew upgrade node</C>, then run the
                  Rift install command again.
                </Issue>
                <Issue title="The installer asks for Apple Command Line Tools">
                  Run <C>xcode-select --install</C>. Apple opens a small installer. When it finishes, run the
                  Rift install command again.
                </Issue>
                <Issue title="Your agent does not show Rift in /mcp">
                  Run <C>rift mcp install --client codex</C>, or use <C>--all</C> to refresh every supported
                  agent connection without reinstalling Rift.
                </Issue>
                <Issue title="You want older ChatGPT or Claude chats inside Rift">
                  Reply to the welcome email. Backfill is real, but I would rather help you through it during
                  the beta than publish a brittle path too early.
                </Issue>
                <Issue title="You did not get the welcome email">
                  You can still use this page. The email only links back here and gives you a way to reply.
                </Issue>
              </div>
            </Section>

            <Section id="privacy" title="What leaves your Mac">
              <p>
                The second thing that makes Rift worth running is that it is local-first. Your conversations and
                your archive live on your Mac, not on someone else&rsquo;s server, so the memory you build stays
                yours.
              </p>
              <p>
                Meaning search is the one part that reaches out: the text Rift indexes and the searches you type
                are embedded through your own Voyage key, so a search goes to Voyage and nothing else. Rift never
                sends your conversations to me. The full breakdown, and every other opt-in, is on the{" "}
                <Link href="/privacy" className="text-ink underline-offset-4 hover:underline">
                  privacy page
                </Link>
                .
              </p>
            </Section>
          </div>
        </article>
      </div>

      <SiteFooter containerClass={COLUMN} />
    </main>
  );
}
