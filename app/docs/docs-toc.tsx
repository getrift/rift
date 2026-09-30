"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type Section = { id: string; label: string };

function itemClass(isActive: boolean) {
  return [
    "flex h-8 items-center rounded-[8px] px-3 text-[13px] transition-colors duration-150",
    isActive
      ? "bg-white/[0.05] font-medium text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
      : "text-ink-subtle hover:bg-white/[0.035] hover:text-ink-bright",
  ].join(" ");
}

export default function DocsToc({
  sections,
  variant,
}: {
  sections: readonly Section[];
  variant: "sidebar" | "mobile";
}) {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    // Switch line sits just below the sticky region — matches the article's scroll-mt-24.
    const THRESHOLD = 110;

    // Honor an incoming anchor (e.g. /docs#welcome) before scroll-spy takes over.
    const hash = window.location.hash.slice(1);
    if (ids.includes(hash)) setActive(hash);

    // Active = the last section whose heading has crossed the switch line (the one you're reading).
    function pick() {
      // At the very bottom, the last (short) section can't push its heading past the line — pin it.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActive(ids[ids.length - 1]);
        return;
      }
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - THRESHOLD <= 0) current = id;
      }
      setActive(current);
    }

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // IntersectionObserver fires pick() at each section boundary — no per-frame scroll math.
    const obs = new IntersectionObserver(pick, {
      rootMargin: `-${THRESHOLD}px 0px 0px 0px`,
      threshold: 0,
    });
    els.forEach((el) => obs.observe(el));

    // Scroll only re-runs pick() so the end-of-page case resolves (IO doesn't fire at the very bottom).
    window.addEventListener("scroll", pick, { passive: true });
    pick();

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", pick);
    };
  }, [sections]);

  const items = sections.map((s) => (
    <a
      key={s.id}
      href={`#${s.id}`}
      aria-current={active === s.id ? "location" : undefined}
      className={itemClass(active === s.id)}
    >
      {s.label}
    </a>
  ));

  if (variant === "mobile") {
    return (
      <details className="mt-10 rounded-[12px] border border-white/[0.08] bg-white/[0.02] lg:hidden">
        <summary className="flex h-11 cursor-pointer list-none items-center justify-between px-4 text-[13px] font-medium text-ink-subtle">
          On this page
          <ChevronDown className="h-4 w-4 transition-transform duration-200 [details[open]_&]:rotate-180" />
        </summary>
        <nav
          aria-label="On this page"
          className="flex flex-col gap-0.5 border-t border-white/[0.06] p-1.5"
        >
          {items}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="Docs sections" className="-mx-3 flex flex-col gap-0.5">
      {items}
    </nav>
  );
}
