"use client";

import Link from "next/link";
import { useState } from "react";
import { RiftLogo } from "./rift-logo";
import InviteModal from "./invite-modal";
import { useMacCta } from "./use-mac-cta";

/* Shared site navbar — identical behavior on every page: locked Rift mark links
   home, About + Privacy links, and a "Join the Mac beta" button that opens the
   invite modal. `containerClass` lets each page align the row to its own content
   column without changing the nav's behavior. When `onJoin` is passed (the home
   page, which already owns a modal for its hero CTA), the button defers to it and
   this component skips rendering its own modal. */
export default function SiteNav({
  containerClass = "max-w-[1100px] px-6 sm:px-10",
  onJoin,
}: {
  containerClass?: string;
  onJoin?: () => void;
}) {
  const [invite, setInvite] = useState(false);
  const join = onJoin ?? (() => setInvite(true));
  const { label, onClick } = useMacCta(join);

  return (
    <>
      <header
        className={`relative z-20 mx-auto flex h-[60px] w-full items-center justify-between ${containerClass}`}
      >
        <Link href="/" aria-label="Rift home">
          <RiftLogo />
        </Link>
        <nav className="flex items-center gap-6 text-[13.5px] text-ink-subtle">
          {/* Examples is built but not surfaced yet — re-add this link when ready.
              The page still lives at /examples. */}
          <Link href="/about" className="transition-colors hover:text-ink">
            About
          </Link>
          <Link href="/docs" className="transition-colors hover:text-ink">
            Docs
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </Link>
          <button
            type="button"
            onClick={onClick}
            className="hidden h-8 items-center rounded-[9px] border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-3.5 text-[13px] font-medium text-ink-bright shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md backdrop-saturate-150 transition-[border-color,background-color,color] duration-150 hover:border-white/[0.18] hover:from-white/[0.12] hover:to-white/[0.05] hover:text-ink sm:inline-flex"
          >
            {label}
          </button>
        </nav>
      </header>
      {!onJoin && <InviteModal open={invite} onClose={() => setInvite(false)} />}
    </>
  );
}
