"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export const INSTALL_CMD = "curl -fsSL https://getrift.dev/install | bash";

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
    return (
      <div className="relative rounded-md border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 pr-12 font-mono text-[13px] leading-[1.65]">
        <code className="block whitespace-pre-wrap text-ink-muted">{text}</code>
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
