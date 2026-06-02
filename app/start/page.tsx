import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import InstallCommand from "../install-command";

export const metadata: Metadata = {
  title: "Start Rift — Private beta setup",
  description:
    "Set up the current Rift private beta on macOS. The terminal installer is the supported path today; a double-click Mac package is planned for beta.19.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Start Rift — Private beta setup",
    description:
      "Set up the current Rift private beta on macOS. The terminal installer is the supported path today; a double-click Mac package is planned for beta.19.",
    url: "https://getrift.dev/start",
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
        <h2 className="text-[15px] font-medium text-text-heading">{title}</h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-text-secondary">{children}</p>
      </div>
    </div>
  );
}

export default function StartPage() {
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

      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-border-hairline bg-bg-well px-3 py-1 text-[12px] text-text-secondary">
            Technical beta setup
          </span>
          <h1 className="mt-6 text-balance text-[40px] font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-[54px]">
            Set up Rift on your Mac.
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-text-secondary sm:text-[19px]">
            This is the current terminal-based setup path for invited beta users. A double-click Mac
            package is planned for beta.19; today this command installs the CLI and background
            service, then <code className="font-mono text-text-primary">rift onboard</code> explains
            what stays local, what can leave, and which optional tool integrations you want.
          </p>
        </div>

        <div className="mt-10 max-w-2xl rounded-lg border border-border-hairline bg-bg-well p-5">
          <div className="font-mono text-[12px] uppercase tracking-wide text-text-muted">
            Before you run this
          </div>
          <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-text-secondary">
            <li className="flex gap-2.5">
              <span className="text-text-muted">—</span>
              <span>macOS 12.3+ with Node 20.19 or newer.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-text-muted">—</span>
              <span>
                Codex CLI is optional. Import and keyword search work without Codex or
                embeddings. Codex AI enrichment stays off until you opt in during{" "}
                <code className="font-mono text-text-primary">rift onboard</code> — until then
                import uses AI-free metadata, even if Codex is installed.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-text-muted">—</span>
              <span>
                Embedding access is optional for semantic search. If your invite uses that path,
                Clem sets you up; you don&rsquo;t sign up for or pay an embedding provider yourself.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6 max-w-2xl">
          <InstallCommand />
        </div>

        <div className="mt-14 grid max-w-2xl gap-9">
          <Step n="01" title="Run the beta setup command">
            Paste the command into Terminal. It installs the Rift CLI, starts the local background
            service, and prepares the macOS menu-bar integration when SwiftBar is available.
          </Step>
          <Step n="02" title="Complete onboarding">
            Run <code className="font-mono text-text-primary">rift onboard</code>. It checks your
            prerequisites, configures the beta environment for your invite, and shows the privacy
            receipt up front. Import and keyword search are local by default; semantic search, Codex
            enrichment, and live capture are each a separate opt-in you choose here.
          </Step>
          <Step n="03" title="Connect your tools">
            When you are ready, add Rift to Claude Desktop, Claude Code, Codex, and Cursor with{" "}
            <code className="font-mono text-text-primary">rift mcp install --all</code>.
          </Step>
        </div>

        <div className="mt-14 border-t border-border-hairline pt-8">
          <Link
            href="/#how"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-text-primary underline-offset-4 transition-colors hover:underline"
          >
            Read how Rift works
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
