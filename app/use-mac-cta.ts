"use client";

import { useEffect, useState } from "react";

/* The primary CTA is Mac-only. On a Mac it downloads the app through /download
   (a 302 to the latest package). Anywhere else there's nothing to install, so
   the button sends the link to the visitor's Mac instead: native share sheet
   when available, clipboard copy as a fallback. Detection runs after mount so
   SSR and first paint render the Mac label (no hydration mismatch). */
export function useMacCta() {
  const [nonMac, setNonMac] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const iPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    setNonMac(/iPhone|iPad|iPod|Android|Windows|Linux|CrOS/i.test(ua) || iPadOS);
  }, []);

  async function share() {
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Onadit", text: "Onadit: local memory all your agents can use. For Mac.", url });
        return;
      }
    } catch {
      return; // visitor dismissed the share sheet
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — nothing more we can do */
    }
  }

  const label = copied ? "Link copied" : nonMac ? "Send to your Mac" : "Download for Mac";
  const onClick = nonMac ? share : () => window.location.assign("/download");

  return { label, onClick, nonMac };
}
