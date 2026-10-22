"use client";

import { useState } from "react";

// The invite link, with a button that copies it.
export function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // no clipboard here: the link is on screen to select by hand
    }
  };
  return (
    <div className="share">
      <code>{link.replace(/^https:\/\//, "")}</code>
      <button type="button" className="btn go" onClick={copy} aria-live="polite">
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
