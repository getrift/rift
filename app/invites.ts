import { createHash } from "node:crypto";
import type Stripe from "stripe";

// Launch invites. Every subscriber gets a link, /r/<code>, backed by a Stripe
// promotion code. A friend who subscribes through it gets their first month
// free. When the friend pays their first bill, the subscriber gets 1 month free
// as Stripe credit; the 16th friend makes Onadit free for them for good.
// Stripe holds all of it: the promotion code's metadata names the subscriber
// and lists the friends who have paid. There is no other store.

export const SITE = "https://onadit.com";
export const GRID = 16;
// Invites work until the end of 31 December 2026, Paris time.
export const INVITES_END = new Date("2027-01-01T00:00:00+01:00");
export const INVITES_END_TEXT = "31 December 2026";
// Made by scripts/stripe-invites-setup.sh, with these ids, in test and live mode.
export const FRIEND_COUPON = "onadit-invite-first-month";
export const LIFETIME_COUPON = "onadit-invite-lifetime";
// /checkout tags its sessions with this. The Stripe account sells other things
// too, so only these checkouts get an invite.
export const ONADIT_CHECKOUT = { site: "onadit" };

export function isOnaditCheckout(session: Stripe.Checkout.Session): boolean {
  return session.mode === "subscription" && session.metadata?.site === ONADIT_CHECKOUT.site;
}

// No 0, 1, I or O, so a code read aloud or retyped comes out right.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE = /^[2-9A-HJ-NP-Z]{6}$/;

export type Invite = {
  code: string;
  promotionCode: string;
  referrer: string;
  friends: string[];
  open: boolean;
};

export function invitesOpen(now = new Date()): boolean {
  return now < INVITES_END;
}

// The code comes from the customer id, so the thank-you page and the webhook,
// which can both run for the same purchase, make the same one.
export function inviteCode(customerId: string): string {
  const hash = createHash("sha256").update(`onadit-invite:${customerId}`).digest();
  return Array.from(hash.subarray(0, 6), (byte) => ALPHABET[byte % ALPHABET.length]).join("");
}

function toInvite(promo: Stripe.PromotionCode): Invite | null {
  const referrer = promo.metadata?.referrer;
  if (!referrer) return null;
  const friends = promo.metadata?.friends ? promo.metadata.friends.split(",") : [];
  return { code: promo.code, promotionCode: promo.id, referrer, friends, open: promo.active && invitesOpen() };
}

export async function findInvite(client: Stripe, code: string): Promise<Invite | null> {
  const wanted = code.toUpperCase();
  if (!CODE.test(wanted)) return null;
  const { data } = await client.promotionCodes.list({ code: wanted, limit: 1 });
  return data[0] ? toInvite(data[0]) : null;
}

// The subscriber's invite, made the first time it is asked for. Null once
// invites have ended, or in the rare case another subscriber's code is the same.
export async function ensureInvite(client: Stripe, customerId: string): Promise<Invite | null> {
  const code = inviteCode(customerId);
  const mine = (invite: Invite | null) => (invite?.referrer === customerId ? invite : null);
  const found = await findInvite(client, code);
  if (found || !invitesOpen()) return mine(found);
  try {
    const promo = await client.promotionCodes.create(
      {
        promotion: { type: "coupon", coupon: FRIEND_COUPON },
        code,
        expires_at: Math.floor(INVITES_END.getTime() / 1000),
        restrictions: { first_time_transaction: true },
        metadata: { referrer: customerId },
      },
      { idempotencyKey: `invite-${customerId}` },
    );
    return toInvite(promo);
  } catch (error) {
    // the other caller made it first
    const made = mine(await findInvite(client, code));
    if (made) return made;
    throw error;
  }
}

// Runs for every paid invoice. Rewards the subscriber who invited this
// customer, once, on the first invoice the friend actually pays. Returns what it
// did, for the webhook's log.
export async function rewardReferrer(client: Stripe, invoice: Stripe.Invoice): Promise<string> {
  const promotionCode = invoice.parent?.subscription_details?.metadata?.invited_with;
  const friend = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!promotionCode || !friend) return "not invited";
  if (invoice.amount_paid <= 0) return "nothing paid yet";

  const promo = await client.promotionCodes.retrieve(promotionCode);
  const invite = toInvite(promo);
  if (!invite || invite.referrer === friend) return "no one to reward";
  if (invite.friends.includes(friend)) return "already rewarded";
  if (invite.friends.length >= GRID) return "grid already full";

  const referrer = await client.customers.retrieve(invite.referrer, { expand: ["subscriptions"] });
  if (referrer.deleted) return "inviter deleted";
  const email = (value: string | null | undefined) => value?.trim().toLowerCase() || null;
  if (email(referrer.email) && email(referrer.email) === email(invoice.customer_email)) {
    return "same email as the inviter";
  }

  const friends = [...invite.friends, friend];
  const subscription = referrer.subscriptions?.data.find((s) =>
    ["active", "trialing", "past_due"].includes(s.status),
  );
  let reward: string;
  if (friends.length === GRID && subscription) {
    await client.subscriptions.update(subscription.id, { discounts: [{ coupon: LIFETIME_COUPON }] });
    reward = "free for life";
  } else {
    // Without a running subscription the 16th friend is a month of credit too:
    // the lifetime coupon needs a subscription to sit on.
    reward = await creditMonth(client, referrer, subscription, friend);
  }
  await client.promotionCodes.update(promo.id, { metadata: { friends: friends.join(",") } });
  return `${reward}, ${friends.length} of ${GRID}`;
}

// 1 month of the inviter's own plan, as a credit their next bills use first.
async function creditMonth(
  client: Stripe,
  referrer: Stripe.Customer,
  subscription: Stripe.Subscription | undefined,
  friend: string,
): Promise<string> {
  // A retry after a crash between the credit and the metadata update must not pay twice.
  const earlier = await client.customers.listBalanceTransactions(referrer.id, { limit: 100 });
  if (earlier.data.some((t) => t.metadata?.invite_friend === friend)) return "credit already given";

  let price = subscription?.items.data[0]?.price;
  if (!price?.unit_amount && process.env.STRIPE_PRICE_ID) {
    price = await client.prices.retrieve(process.env.STRIPE_PRICE_ID);
  }
  if (!price?.unit_amount) throw new Error("no price to size the free month with");

  await client.customers.createBalanceTransaction(
    referrer.id,
    {
      amount: -price.unit_amount,
      currency: price.currency,
      description: "1 free month: a friend you invited joined Onadit",
      metadata: { invite_friend: friend },
    },
    { idempotencyKey: `invite-month-${friend}` },
  );
  return "1 free month";
}

// The invite link by email, after checkout. Optional: it needs RESEND_API_KEY
// and INVITE_EMAIL_FROM, an address on a domain verified at Resend.
export async function emailInvite(to: string, invite: Invite): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.INVITE_EMAIL_FROM;
  if (!key || !from) return;
  const link = `${SITE}/r/${invite.code}`;
  const text = [
    "Thanks for buying Onadit.",
    "",
    `Here is your invite link: ${link}`,
    "",
    "A friend who joins with it gets their first month free.",
    "When they pay their first bill, you get a month free.",
    `Invite ${GRID} friends who pay and Onadit is free for you for life.`,
    "",
    `Open the link any time to see how many have joined. Invites work until ${INVITES_END_TEXT}.`,
  ].join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `invite-${invite.code}`,
    },
    body: JSON.stringify({ from, to, subject: "Your Onadit invite link", text }),
  });
  if (!res.ok) console.error("invite email failed", res.status, await res.text());
}
