"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

export const INSTALL_CMD = "curl -fsSL https://getrift.dev/install | bash";
export const DOWNLOAD_URL = "/download";

// Primary path for normal Apple Silicon Mac users: download the signed .pkg and
// double-click. No Node, no terminal. /download redirects to the GitHub release.
export function DownloadButton() {
  return (
    <div className="w-full">
      <a
        href={DOWNLOAD_URL}
        className="inline-flex h-11 items-center gap-2.5 rounded-[10px] border border-white/[0.12] bg-white/[0.06] px-5 text-[14px] font-medium text-ink-bright transition-[background-color,color,transform] duration-150 hover:bg-white/[0.1] hover:text-ink active:scale-[0.97]"
      >
        <Download className="h-4 w-4" />
        Download Rift for Apple Silicon
      </a>
      <p className="mt-2 text-[12px] leading-[17px] text-ink-faint">
        Apple Silicon (M1–M4) · macOS 12.3+ · .pkg, ~100&nbsp;MB. No Node, no
        terminal — double-click and Rift opens onboarding for you. Intel coming
        soon.
      </p>
    </div>
  );
}

export function CopyBlock({
  text,
  prefix,
  multiline = false,
  label = "Copy to clipboard",
}: {
  text: string;
  prefix?: string;
  multiline?: boolean;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable in restricted browser contexts.
    }
  }

  const button = (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-ink-faint transition-[color,background-color,transform] duration-150 hover:bg-white/[0.06] hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25 ${
        multiline ? "absolute right-2 top-2" : ""
      }`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );

  if (multiline) {
    // Prose snippet (e.g. an agent instruction) — body font, not mono.
    return (
      <div className="relative rounded-md border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 pr-12 text-[14px] leading-[1.6] text-ink-muted">
        <p className="whitespace-pre-wrap">{text}</p>
        {button}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-white/[0.08] bg-white/[0.04] px-4 py-3 font-mono text-[12.5px] leading-[18px]">
      {prefix && <span className="text-ink-faint">{prefix}</span>}
      <code className="min-w-0 flex-1 truncate text-ink-subtle">{text}</code>
      {button}
    </div>
  );
}

export default function InstallCommand() {
  return <CopyBlock text={INSTALL_CMD} prefix="$" label="Copy install command" />;
}
