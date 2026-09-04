import type { Metadata } from "next";
import SiteNav from "../site-nav";
import SiteFooter from "../site-footer";
import { PRICE_ANNUAL_LABEL, PRICE_LABEL } from "../pricing";

const COLUMN = "max-w-xl px-6";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for buying and using Rift.",
};

/* Stripe requires a terms URL and a refund-policy URL on the checkout page.
   LAUNCH BLOCKER: the seller block below is a placeholder. Fill in the legal
   entity, address and registration number before this branch goes live — it
   renders visibly so it cannot ship unnoticed. */
function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/[0.08] py-7 first:border-t-0">
      <h2 className="text-[17px] font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-4 text-[15.5px] leading-[1.7] text-ink-subtle">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="flex min-h-[100svh] flex-col bg-canvas font-sans text-ink antialiased">
      <SiteNav containerClass={COLUMN} />
      <article className={`mx-auto w-full flex-1 ${COLUMN} pb-16 pt-10`}>
        <h1 className="text-[30px] font-semibold tracking-tight text-ink">Terms</h1>
        <p className="mt-3 text-[15.5px] leading-[1.7] text-ink-subtle">
          Short, because the product is simple: you pay a subscription, you get a licence to run
          Rift on your own Mac, and either of us can end it at any time.
        </p>

        <div className="mt-10">
          <Row title="Who you are buying from">
            <p className="rounded-[10px] border border-danger/40 bg-danger/[0.07] p-4 text-[14px] text-ink">
              PLACEHOLDER — fill in before launch: legal entity name, registered address, company
              registration number and VAT number. Stripe checkout links to this page, so it must
              identify the seller.
            </p>
          </Row>

          <Row title="What you get">
            <p>
              A subscription at {PRICE_LABEL} or {PRICE_ANNUAL_LABEL}, renewing automatically until
              you cancel. It licenses you to install and run Rift on Macs you own or control, for
              your own work. Rift runs locally: there is no account, no hosted service, and no seat
              limit to police.
            </p>
          </Row>

          <Row title="Cancelling">
            <p>
              Cancel anytime in the billing portal. Your subscription runs to the end of the period
              you already paid for and does not renew. Rift keeps working on your machine after
              that — it is local software, and nothing phones home to disable it — but you stop
              receiving updates and support.
            </p>
          </Row>

          <Row title="Refunds">
            <p>
              Within 14 days of a payment, ask and you get it back, no reason needed. After that,
              if something is broken and I cannot fix it, ask anyway. See the{" "}
              <a href="/refunds" className="text-ink underline-offset-4 hover:underline">
                refund policy
              </a>
              .
            </p>
          </Row>

          <Row title="What I do not promise">
            <p>
              Rift is early software sold as it is today. It does not guarantee uninterrupted
              operation, and it is not a backup: keep your own copies of anything you care about.
              Nothing here removes rights you have as a consumer under the law where you live.
            </p>
          </Row>

          <Row title="Your data">
            <p>
              Covered by the{" "}
              <a href="/privacy" className="text-ink underline-offset-4 hover:underline">
                privacy page
              </a>
              , which is the binding description of what Rift and this site do with your
              information.
            </p>
          </Row>
        </div>
      </article>
      <SiteFooter containerClass={COLUMN} />
    </main>
  );
}
