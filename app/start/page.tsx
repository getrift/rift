import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import InstallCommand from "../install-command";

export const metadata: Metadata = {
  title: "Start Rift — Install local-first AI memory",
  description:
    "Install Rift on macOS and connect local-first memory to Claude, Codex, and Cursor — free while in beta.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Start Rift — Install local-first AI memory",
    description:
      "Install Rift on macOS and connect local-first memory to Claude, Codex, and Cursor — free while in beta.",
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
            Install Rift
          </span>
          <h1 className="mt-6 text-balance text-[40px] font-semibold leading-[1.05] tracking-tight text-text-primary sm:text-[54px]">
            Set up local memory on your Mac.
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-text-secondary sm:text-[19px]">
            Rift is in private beta. Run the installer, then let{" "}
            <code className="font-mono text-text-primary">rift onboard</code> walk you through
            setup — it configures your embedding access and explains what stays local and what
            leaves your machine. One more command then connects your AI tools over MCP.
          </p>
        </div>

        <div className="mt-10 max-w-2xl rounded-lg border border-border-hairline bg-bg-well p-5">
          <div className="font-mono text-[12px] uppercase tracking-wide text-text-muted">
            Before you run this
          </div>
          <ul className="mt-3 space-y-2.5 text-[14px] leading-relaxed text-text-secondary">
            <li className="flex gap-2.5">
              <span className="text-text-muted">—</span>
              <span>macOS 12.3+ with Node 20 or newer.</span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-text-muted">—</span>
              <span>
                The Codex CLI, installed and signed in (
                <code className="font-mono text-text-primary">codex login</code>). Rift runs
                triage through it, so the installer checks for it first.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="text-text-muted">—</span>
              <span>
                An embedding key — Clem sets you up with one as part of the private beta. You
                don&rsquo;t sign up for or pay an embedding provider yourself.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-6 max-w-2xl">
          <InstallCommand />
        </div>

        <div className="mt-14 grid max-w-2xl gap-9">
          <Step n="01" title="Run the installer">
            Paste the command into Terminal. It installs the Rift package, starts the local daemon,
            and prepares the macOS menu-bar integration when SwiftBar is available.
          </Step>
          <Step n="02" title="Complete onboarding">
            Run <code className="font-mono text-text-primary">rift onboard</code>. It checks your
            prerequisites and configures your beta embedding key, so capture and search work from
            the start.
          </Step>
          <Step n="03" title="Connect your tools">
            Add Rift to Claude Desktop, Claude Code, Codex, and Cursor with{" "}
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
