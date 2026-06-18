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
        <h1 className="mt-6 text-[32px] font-semibold leading-[1.04] tracking-[-0.02em] text-ink sm:text-[40px]">
          Start with one recall
        </h1>
        <p className="mt-4 text-[16px] leading-[1.6] text-ink-subtle">
          Copy the command, import one export, then search for a decision you already made.
        </p>

        <div className="mt-8">
          <SetupInstructions />
        </div>

        <div className="mt-12 border-t border-dashed border-white/[0.08] pt-8">
          <p className="text-[15px] leading-[1.65] text-ink-subtle">
            Hit a rough edge? Reach out from the{" "}
            <Link href="/about" className="text-ink underline-offset-4 hover:underline">
              about page
            </Link>{" "}
            — I read everything.
          </p>
        </div>
      </article>

      <SiteFooter containerClass={COLUMN} />
    </main>
  );
}
