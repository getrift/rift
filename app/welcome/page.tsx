import type { Metadata } from "next";
import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";
import SetupInstructions from "../setup-instructions";
import { RiftMark } from "../rift-logo";

const COLUMN = "max-w-xl px-6";

/* Post-payment landing. This is the URL to set as the Stripe Payment Link's
   "after payment" redirect, so a buyer lands on the installer instead of a
   Stripe receipt page. Not indexed: there is nothing here for a search visitor,
   and it should not compete with the homepage. */
export const metadata: Metadata = {
  title: "Welcome to Rift",
  description: "Install Rift and run your first recall.",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return (
    <main className="flex min-h-[100svh] flex-col bg-canvas font-sans text-ink antialiased">
      <SiteNav containerClass={COLUMN} />

      <section className={`mx-auto w-full flex-1 ${COLUMN} pb-16 pt-10`}>
        <span className="flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/[0.1] bg-white/[0.04] text-ink">
          <RiftMark size={22} />
        </span>
        <h1 className="mt-6 text-[26px] font-semibold tracking-tight text-ink">
          You&rsquo;re in. Let&rsquo;s get one recall working.
        </h1>
        <p className="mt-3 text-[15.5px] leading-[1.7] text-ink-subtle">
          Your receipt is in your inbox. Install Rift below — it captures your sessions from there,
          and your past work shows up in whatever tool you ask.
        </p>

        <div className="mt-8">
          <SetupInstructions />
        </div>

        <p className="mt-10 border-t border-white/[0.08] pt-6 text-[13.5px] leading-[21px] text-ink-faint">
          Stuck on install, or want your older AI chats backfilled? Email{" "}
          <a href="mailto:beta@getrift.dev" className="text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            beta@getrift.dev
          </a>{" "}
          and I&rsquo;ll do it with you. Manage your payment method, invoices or cancellation in the{" "}
          <a href="/billing" className="text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            billing portal
          </a>
          .
        </p>
      </section>

      <SiteFooter containerClass={COLUMN} />
    </main>
  );
}
