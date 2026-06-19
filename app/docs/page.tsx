import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import InstallCommand from "../install-command";
import { RiftMark } from "../rift-logo";
import { socialMeta } from "../seo";
import SiteFooter from "../site-footer";
import SiteNav from "../site-nav";

const COLUMN = "max-w-[1120px] px-6 sm:px-10";

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
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/[0.08] py-12 first:border-t-0 first:pt-0">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">{eyebrow}</p>
      <h2 className="mt-3 text-[28px] font-semibold leading-[1.12] text-ink" style={{ textWrap: "balance" }}>
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-[15.5px] leading-[1.7] text-ink-subtle">{children}</div>
    </section>
  );
}

function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-white/[0.08] bg-white/[0.025] p-5">
      <h3 className="text-[15px] font-semibold text-ink-bright">{title}</h3>
      <div className="mt-2 text-[14px] leading-[1.65] text-ink-subtle">{children}</div>
    </div>
  );
}

function Issue({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-white/[0.07] py-5 first:border-t-0 first:pt-0 last:pb-0">
      <h3 className="text-[14.5px] font-medium text-ink-bright">{title}</h3>
      <div className="mt-2 text-[14px] leading-[1.65] text-ink-subtle">{children}</div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="block rounded-[8px] px-3 py-2 text-[13.5px] text-ink-subtle transition-colors hover:bg-white/[0.04] hover:text-ink">
      {children}
    </a>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <SiteNav containerClass={COLUMN} />

      <div className="mx-auto grid w-full max-w-[1120px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-24">
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-white/[0.09] bg-white/[0.035] text-ink">
                <RiftMark size={18} />
              </span>
              <span className="text-[14px] font-medium text-ink-bright">Rift Docs</span>
            </div>
            <nav aria-label="Docs sections" className="-mx-3">
              <NavLink href="#welcome">Welcome</NavLink>
              <NavLink href="#agents">Connect your agents</NavLink>
              <NavLink href="#search">Search by meaning</NavLink>
              <NavLink href="#troubleshooting">Troubleshooting</NavLink>
              <NavLink href="#privacy">Privacy</NavLink>
            </nav>
          </div>
        </aside>

        <article className="max-w-[720px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">Rift Docs</p>
          <h1
            className="mt-4 max-w-[660px] text-[44px] font-semibold leading-[1.02] text-ink sm:text-[64px]"
            style={{ textWrap: "balance" }}
          >
            Start with one memory your agents can share
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-[1.6] text-ink-subtle">
            Rift runs on your Mac, records the agent sessions you choose, and gives that past work back to
            any tool that can talk to it. You shouldn&rsquo;t have to bring the same project back into focus twice.
          </p>

          <div className="mt-12">
            <Section id="welcome" eyebrow="Welcome" title="Install Rift">
              <p>
                Install is one command. Run it in Terminal, or paste it into your agent and ask it to install
                Rift for you.
              </p>
              <InstallCommand />
              <p className="text-[13.5px] text-ink-faint">Requires macOS 12.3+, Node 20.19+, npm, git, and Apple Command Line Tools.</p>

              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <Step title="Install">
                  Rift creates a local data folder, starts the background service, and keeps private defaults on.
                </Step>
                <Step title="Onboard">
                  Run <C>rift onboard</C> after install. It walks through first-run setup and a recall test.
                </Step>
                <Step title="Ask">
                  In a new agent session, ask it to recall prior Rift context before it starts working.
                </Step>
              </div>
            </Section>

            <Section id="agents" eyebrow="Agents" title="Tell your agents to use Rift">
              <p>
                The simplest setup is a short instruction in the file your agent already reads. For Codex, use
                <C>AGENTS.md</C>. For Claude Code, use <C>CLAUDE.md</C>.
              </p>
              <div className="rounded-[12px] border border-white/[0.08] bg-white/[0.025] p-5 font-mono text-[13px] leading-[1.65] text-ink-muted">
                Before starting, ask Rift for relevant past context. Use Rift to recall decisions, files, and
                prior agent sessions that may matter for this task.
              </div>
              <p>
                Then check the connection from inside your agent. Run <C>/mcp</C> and look for <C>rift</C>.
                If it is missing, run <C>rift mcp install --client codex</C>, or swap <C>codex</C> for the
                agent you use.
              </p>
            </Section>

            <Section id="search" eyebrow="Search" title="Rift should find the idea, not just the word">
              <p>
                Search starts working right away with exact words. That is enough to prove the install, but it
                is not the full Rift experience.
              </p>
              <p>
                The real value is meaning search. That means you can ask for &ldquo;the billing decision from last
                week&rdquo; and Rift can find the session even if nobody wrote those exact words. During the beta I
                set this up by hand, so you don&rsquo;t have to think about any of the wiring behind it.
              </p>
              <p>
                Reply to the welcome email after you install. Tell me what you want Rift to remember first, and
                I&rsquo;ll help you get the deeper search path working.
              </p>
            </Section>

            <Section id="troubleshooting" eyebrow="Debug" title="Common setup issues">
              <div className="rounded-[12px] border border-white/[0.08] bg-white/[0.025] p-5">
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

            <Section id="privacy" eyebrow="Privacy" title="What leaves your Mac">
              <p>
                A fresh install is local-first. Conversation content stays on your Mac, and the first search
                path runs without sending your archive to an AI provider.
              </p>
              <p>
                Some richer features can use your own external accounts later, but they are explicit opt-ins.
                The detailed version is on the{" "}
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
