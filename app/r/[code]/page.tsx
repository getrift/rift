/* eslint-disable @next/next/no-html-link-for-pages -- the home page is the
   static one in public/site, served by a rewrite; a <Link> would load app/page.tsx */
import type { Metadata } from "next";
import { Cells, INVITE_CSS } from "../../invite-parts";
import { GRID, INVITES_END_TEXT, findInvite, type Invite } from "../../invites";
import { SitePage } from "../../site-frame";
import { socialMeta } from "../../seo";
import { monthlyPrice, stripe } from "../../stripe";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ code: string }> };

const title = "A free month of Onadit";
const description =
  "A friend is giving you your first month of Onadit, the local memory all your agents can use.";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: { absolute: title },
    description,
    robots: { index: false },
    ...socialMeta({ title: "A friend is giving you a free month of Onadit", description, path: `/r/${code}` }),
  };
}

// An invite link. The friend who opens it sees what they get; its owner opens
// it to see how many squares their friends have lit.
export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const client = stripe();
  let invite: Invite | null = null;
  if (client) invite = await findInvite(client, code).catch(() => null);
  const price = await monthlyPrice(client);

  if (!invite) {
    return (
      <Shell
        meta="Invite"
        heading={<>This invite link <i>does not work.</i></>}
        lede="Check the address with the friend who sent it."
        price={price}
      />
    );
  }
  if (!invite.open) {
    return (
      <Shell
        meta={`Invite ${invite.code}`}
        heading={<>This invite <i>has ended.</i></>}
        lede={`Invites ran until ${INVITES_END_TEXT}.${price ? ` You can still buy Onadit, at ${price} a month.` : ""}`}
        price={price}
      />
    );
  }

  const lit = Math.min(invite.friends.length, GRID);
  const joined = lit === 0 ? "" : ` · ${lit} ${lit === 1 ? "friend has" : "friends have"} joined`;
  return (
    <SitePage css={INVITE_CSS}>
      <section className="plate">
        <i className="x tl"></i><i className="x tr"></i><i className="x bl"></i><i className="x br"></i>
        <Cells lit={lit} label={`${lit} of ${GRID} squares lit`} />
        <p className="meta">{`Invite ${invite.code}${joined}`}</p>
        <h1>A friend is giving you <i>a free month of Onadit.</i></h1>
        <p className="lede">
          Onadit keeps your AI conversations on your Mac, so the agents you connect can look up
          what you already worked out.
        </p>
      </section>
      <div className="acts">
        <i className="x bl"></i><i className="x br"></i>
        <a className="btn" href="/">What Onadit does</a>
        <a className="btn go" href={`/checkout?ref=${invite.code}`} rel="nofollow">Start your free month</a>
      </div>
      <div className="fine">
        <p>
          Your first month is free{price ? `, then ${price} a month, VAT included` : ""}. Onadit runs on a Mac with
          Apple silicon and macOS 14 or later. This invite works until {INVITES_END_TEXT}.
        </p>
      </div>
    </SitePage>
  );
}

function Shell({ meta, heading, lede, price }: { meta: string; heading: React.ReactNode; lede: string; price: string | null }) {
  return (
    <SitePage css={INVITE_CSS}>
      <section className="plate">
        <i className="x tl"></i><i className="x tr"></i><i className="x bl"></i><i className="x br"></i>
        <p className="meta">{meta}</p>
        <h1>{heading}</h1>
        <p className="lede">{lede}</p>
      </section>
      <div className="acts">
        <i className="x bl"></i><i className="x br"></i>
        <a className="btn" href="/">What Onadit does</a>
        {price && <a className="btn go" href="/checkout" rel="nofollow">Buy Onadit</a>}
      </div>
    </SitePage>
  );
}
