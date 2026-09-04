"use client";

import { useEffect, useState } from "react";
import { CHECKOUT_URL, PRICE_LABEL } from "./pricing";

/* The primary CTA is Mac-only and goes straight to Stripe checkout. On Windows /
   Linux there's nothing to install, so the button turns into a "share with a Mac
   friend" action instead: native share sheet when available, clipboard copy as a
   fallback. Detection runs after mount so SSR and first paint render the default
   label (no hydration mismatch); it swaps in-place if the visitor is on a non-Mac
   desktop. */
export function useMacCta() {
  const [nonMac, setNonMac] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isWindows = /Windows/i.test(ua);
    const isLinux = /Linux/i.test(ua) && !/Android/i.test(ua);
    setNonMac(isWindows || isLinux);
  }, []);

  async function share() {
    const url = window.location.origin;
    const data = {
      title: "Rift",
      text: "Rift — one local memory, shared by every agent you use. For Mac.",
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(data);
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

  const label = copied
    ? "Link copied"
    : nonMac
      ? "Share with a Mac friend"
      : `Get Rift — ${PRICE_LABEL}`;

  return {
    label,
    onClick: nonMac ? share : () => window.location.assign(CHECKOUT_URL),
    nonMac,
  };
}
