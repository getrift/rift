"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export const INSTALL_CMD = "curl -fsSL https://getrift.dev/install | bash";

export default function InstallCommand() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable in restricted browser contexts.
    }
  }

  return (
    <div className="group flex items-center gap-3 rounded-md border border-border-hairline bg-bg-well px-4 py-3 font-mono text-[12.5px] leading-[18px]">
      <span className="text-text-muted">$</span>
      <code className="min-w-0 flex-1 truncate text-text-secondary">{INSTALL_CMD}</code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy install command"
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-text-muted transition-[color,background-color,transform] duration-150 hover:bg-bg-hover hover:text-text-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
