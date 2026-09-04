import type { Metadata } from "next";
import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";

const COLUMN = "max-w-xl px-6";

export const metadata: Metadata = {
  title: "Refunds",
  description: "Rift's refund policy: 14 days, no reason needed.",
};

export default function RefundsPage() {
  return (
    <main className="flex min-h-[100svh] flex-col bg-canvas font-sans text-ink antialiased">
      <SiteNav containerClass={COLUMN} />
      <article className={`mx-auto w-full flex-1 ${COLUMN} pb-16 pt-10`}>
        <h1 className="text-[30px] font-semibold tracking-tight text-ink">Refunds</h1>
        <div className="mt-6 space-y-5 text-[15.5px] leading-[1.7] text-ink-subtle">
          <p>
            Within 14 days of any payment, email{" "}
            <a href="mailto:beta@getrift.dev" className="text-ink underline-offset-4 hover:underline">
              beta@getrift.dev
            </a>{" "}
            and I refund it. You do not have to give a reason and I will not ask for one. That
            applies to your first payment and to every renewal.
          </p>
          <p>
            After 14 days, cancel in the{" "}
            <a href="/billing" className="text-ink underline-offset-4 hover:underline">
              billing portal
            </a>{" "}
            and you are not charged again. If Rift broke and I could not fix it, email me anyway —
            I would rather refund you than argue about a date.
          </p>
          <p>
            Refunds go back to the card that paid, through Stripe, usually within a few working
            days. If you are a consumer in the EU, this policy is in addition to your statutory
            right of withdrawal, not instead of it.
          </p>
        </div>
      </article>
      <SiteFooter containerClass={COLUMN} />
    </main>
  );
}
