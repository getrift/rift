import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../site-nav";

export const metadata: Metadata = {
  title: "About — why I built Rift",
  description:
    "Why I built Rift, how it works in a nutshell, and how to reach me. Rift is a local-first memory for your AI tools, built by Clément Rog.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — why I built Rift",
    description:
      "Why I built Rift, how it works in a nutshell, and how to reach me. A local-first memory for your AI tools.",
    url: "https://getrift.dev/about",
    siteName: "Rift",
    type: "website",
  },
};

function C({ children }: { children: React.ReactNode }) {
  return (
    <code className="mx-0.5 rounded-[4px] bg-bg-well px-1 py-0.5 font-mono text-[0.86em] text-text-primary">
      {children}
    </code>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border-hairline py-7 first:border-t-0">
      <h2 className="text-[17px] font-semibold tracking-tight text-text-primary">{title}</h2>
      <div className="mt-3 space-y-4 text-[15.5px] leading-[1.7] text-text-secondary">{children}</div>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-[10px] border border-border-hairline px-3.5 py-2 text-[14px] text-text-secondary transition-colors hover:border-[rgba(255,255,255,0.22)] hover:text-text-primary"
    >
      {children}
    </a>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg-app font-sans text-text-primary antialiased">
      <SiteNav containerClass="max-w-xl px-6" />

      <article className="mx-auto max-w-xl px-6 py-20 sm:py-28">
        <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-text-primary sm:text-[56px]">
          Why I built Rift
        </h1>
        <p className="mt-6 text-[18px] leading-[1.6] text-text-secondary">
          I&rsquo;m Clément. Rift is a local-first memory for the AI tools you already use. Here is the
          short version of why it exists and how it works.
        </p>

        <div className="mt-12">
          <Section title="Why I built it">
            <p>
              Every AI tool I use starts from zero. I would solve something with Claude on Monday, then
              re-explain the same context to Cursor on Wednesday, paste old threads into ChatGPT, and keep a
              folder of <C>.md</C> notes I had to remember to attach. The thinking I had already done lived
              scattered across a dozen apps, and none of them could see the others.
            </p>
            <p>
              I wanted one private memory that every tool could draw from, without shipping my conversations
              to someone else&rsquo;s server. Nothing did that, so I built it.
            </p>
          </Section>

          <Section title="How it works, in a nutshell">
            <p>
              Rift captures your chats from ChatGPT, Claude, Grok, and Gemini and indexes them into a private
              archive that lives on your Mac. You search it in a keystroke. And because it speaks{" "}
              <C>MCP</C>, your coding tools (Claude Code, Cursor, Codex) can pull the right context
              themselves, so you stop re-explaining what you already solved.
            </p>
            <p>
              It is local-first by default. A fresh install makes zero AI calls and search runs on keywords
              alone. A few things can leave, but only ones you switch on, and they go to your own accounts.
              The full story is on the{" "}
              <Link href="/privacy" className="text-text-primary underline-offset-4 hover:underline">
                privacy page
              </Link>
              .
            </p>
          </Section>

          <Section title="Questions? Reach out">
            <p>
              Rift is in private beta and I am building it in the open. If you have a question, an idea, or
              you hit a rough edge, reach out on X or LinkedIn. I read everything.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Social href="https://x.com/clementrog" label="Clément on X">
                <XIcon />
                <span>@clementrog</span>
              </Social>
              <Social href="https://www.linkedin.com/in/clementrog" label="Clément on LinkedIn">
                <LinkedInIcon />
                <span>Clément Rog</span>
              </Social>
            </div>
          </Section>
        </div>

        <div className="mt-12 border-t border-dashed border-border-hairline pt-8">
          <p className="text-[15px] leading-[1.65] text-text-secondary">
            Rift is in private beta.{" "}
            <Link href="/" className="text-text-primary underline-offset-4 hover:underline">
              Join the Mac beta from the homepage →
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
