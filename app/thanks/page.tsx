import type { Metadata } from "next";
import { CopyLink } from "../copy-link";
import { Cells, INVITE_CSS } from "../invite-parts";
import { GRID, INVITES_END_TEXT, SITE, ensureInvite, isOnaditCheckout, paidFriends, type Invite } from "../invites";
import { SitePage } from "../site-frame";
import { stripe } from "../stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your Onadit purchase, and your invite link.",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

// Where Stripe Checkout sends a buyer back. It makes their invite link, unless
// the webhook already has, and hands it over.
export default async function ThanksPage({ searchParams }: Props) {
  const { session_id: id } = await searchParams;
  const client = stripe();
  let paid = false;
  let invite: Invite | null = null;
  if (client && id?.startsWith("cs_")) {
    try {
      const session = await client.checkout.sessions.retrieve(id);
      paid = session.status === "complete" && isOnaditCheckout(session);
      if (paid && typeof session.customer === "string") invite = await ensureInvite(client, session.customer);
    } catch (error) {
      console.error("thanks page", error);
    }
  }

  const install = (
    <div className="acts">
      <i className="x bl"></i><i className="x br"></i>
      <a className="btn" href="/docs">Read the docs</a>
      <a className="btn go" href="/docs/install">Install Onadit</a>
    </div>
  );

  // /billing, the Stripe customer portal, comes with crog/site-stripe
  const billing = (
    <>Manage or cancel your subscription at <a href="/billing">onadit.com/billing</a>.</>
  );

  if (!paid) {
    return (
      <SitePage css={INVITE_CSS}>
        <section className="plate">
          <i className="x tl"></i><i className="x tr"></i><i className="x bl"></i><i className="x br"></i>
          <p className="meta">Purchase</p>
          <h1>We could not find <i>this purchase.</i></h1>
          <p className="lede">If you just paid, Stripe has emailed you a receipt. This page needs the address Stripe sent you back to.</p>
        </section>
        {install}
      </SitePage>
    );
  }

  if (!invite) {
    return (
      <SitePage css={INVITE_CSS}>
        <section className="plate">
          <i className="x tl"></i><i className="x tr"></i><i className="x bl"></i><i className="x br"></i>
          <p className="meta">Payment received</p>
          <h1>You are in. <i>Thank you.</i></h1>
          <p className="lede">Stripe has emailed you a receipt. Next, install Onadit on your Mac.</p>
        </section>
        {install}
        <div className="fine">
          <p>{billing}</p>
        </div>
      </SitePage>
    );
  }

  // the squares: friends who paid, counted from the credits they earned its owner
  const friends = client ? await paidFriends(client, invite.referrer).catch(() => new Set()) : new Set();
  const lit = Math.min(friends.size, GRID);
  return (
    <SitePage css={INVITE_CSS}>
      <section className="plate">
        <i className="x tl"></i><i className="x tr"></i><i className="x bl"></i><i className="x br"></i>
        <p className="meta">Payment received</p>
        <h1>You are in. <i>Now give a month away.</i></h1>
        <p className="lede">
          Send this link to a friend. Their first month is free. When they pay their first bill,
          you get a month free.
        </p>
        <CopyLink link={`${SITE}/r/${invite.code}`} />
        <Cells lit={lit} label={`${lit} of ${GRID} squares lit`} />
        <p className="meta">1 square per friend who pays. Light all {GRID} and Onadit is free for you for life.</p>
      </section>
      {install}
      <div className="fine">
        <p>
          Free months go on your Stripe balance, and your next bills use them first. Your link works
          until {INVITES_END_TEXT}. Open it any time to see how many squares are lit. {billing}
        </p>
      </div>
    </SitePage>
  );
}
