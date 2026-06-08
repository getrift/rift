"use client";

import Link from "next/link";
import { useState } from "react";
import { RiftLogo } from "./rift-logo";
import InviteModal from "./invite-modal";

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

  return (
    <>
      <header
        className={`relative z-20 mx-auto flex h-[60px] w-full items-center justify-between ${containerClass}`}
      >
        <Link href="/" aria-label="Rift home">
          <RiftLogo />
        </Link>
        <nav className="flex items-center gap-6 text-[13.5px] text-[#8a8f98]">
          <Link href="/about" className="transition-colors hover:text-[#f7f8f8]">
            About
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-[#f7f8f8]">
            Privacy
          </Link>
          <button
            type="button"
            onClick={join}
            className="hidden h-8 items-center rounded-[9px] border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] px-3.5 text-[13px] font-medium text-[#dfe3e8] transition-[border-color,background-color,color,scale] duration-150 hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[#f7f8f8] active:scale-[0.97] sm:inline-flex"
          >
            Join the Mac beta
          </button>
        </nav>
      </header>
      {!onJoin && <InviteModal open={invite} onClose={() => setInvite(false)} />}
    </>
  );
}
