import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";
import SetupInstructions from "../setup-instructions";
import { RiftMark } from "../rift-logo";

const COLUMN = "max-w-xl px-6";

// Post-signup utility page, linked from the beta email — keep it out of search.
export const metadata: Metadata = {
  title: "Welcome to the beta",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-canvas font-sans text-ink antialiased">
      <SiteNav containerClass={COLUMN} />

      <article className="mx-auto max-w-xl px-6 py-20 sm:py-28">
        <span className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/[0.1] bg-white/[0.04] text-ink">
          <RiftMark size={22} />
        </span>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          You&rsquo;re in · Rift beta
        </p>
        <h1 className="mt-3 text-[32px] font-semibold leading-[1.04] tracking-[-0.02em] text-ink sm:text-[40px]">
          Start with one recall
        </h1>
        <p className="mt-4 text-[16px] leading-[1.6] text-ink-subtle">
          Setup runs about two minutes: install, import one past conversation, then search for a
          decision you already made. That first recall is the whole point — the rest builds from it.
        </p>

        <div className="mt-8">
          <SetupInstructions />
        </div>

        <div className="mt-12 space-y-3 border-t border-dashed border-white/[0.08] pt-8 text-[15px] leading-[1.65] text-ink-subtle">
          <p>
            New to Rift?{" "}
            <Link href="/about" className="text-ink underline-offset-4 hover:underline">
              See how it works
            </Link>
            , or read the{" "}
            <Link href="/privacy" className="text-ink underline-offset-4 hover:underline">
              privacy page
            </Link>
            .
          </p>
          <p>Hit a rough edge? Just reply to the email that brought you here — I read everything.</p>
        </div>
      </article>

      <SiteFooter containerClass={COLUMN} />
    </main>
  );
}
