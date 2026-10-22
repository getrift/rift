import { createHash } from "node:crypto";
import type Stripe from "stripe";

// Launch invites. Every subscriber gets a link, /r/<code>, backed by a Stripe
// promotion code. A friend who subscribes through it gets their first month
// free. When the friend pays their first bill, the subscriber gets 1 month free
// as Stripe credit; 16 friends who paid make Onadit free for them for good.
// Stripe holds all of it. The promotion code's metadata names the subscriber.
// Each friend who paid leaves 1 credit on the subscriber's Stripe balance, with
// the friend's customer id in its metadata, and those credits are the count:
// each is its own object, so 2 friends paying at the same moment cannot erase
// each other. There is no other store.

export const SITE = "https://onadit.com";
export const GRID = 16;
// Invites work until the end of 31 December 2026, Paris time.
export const INVITES_END = new Date("2027-01-01T00:00:00+01:00");
export const INVITES_END_TEXT = "31 December 2026";
// Made by scripts/stripe-invites-setup.sh, with these ids, in test and live mode.
export const FRIEND_COUPON = "onadit-invite-first-month";
export const LIFETIME_COUPON = "onadit-invite-lifetime";
// /checkout tags its sessions and their subscriptions with this. The Stripe
// account sells other things too, so only these get invites and rewards.
export const ONADIT_TAG = { site: "onadit" };
const RUNNING = ["active", "trialing", "past_due"];

export function isOnaditCheckout(session: Stripe.Checkout.Session): boolean {
  return session.mode === "subscription" && session.metadata?.site === ONADIT_TAG.site;
}

// No 0, 1, I or O, so a code read aloud or retyped comes out right.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE = /^[2-9A-HJ-NP-Z]{6}$/;

export type Invite = {
  code: string;
  promotionCode: string;
  referrer: string;
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
  return { code: promo.code, promotionCode: promo.id, referrer, open: promo.active && invitesOpen() };
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

// The friends who have earned this customer a free month, read from the whole
// balance history, however long it gets.
export async function paidFriends(client: Stripe, customerId: string): Promise<Set<string>> {
  const friends = new Set<string>();
  for await (const credit of client.customers.listBalanceTransactions(customerId, { limit: 100 })) {
    if (credit.metadata?.invite_friend) friends.add(credit.metadata.invite_friend);
  }
  return friends;
}

function customerWithSubscriptions(client: Stripe, id: string) {
  return client.customers.retrieve(id, { expand: ["subscriptions", "subscriptions.data.discounts"] });
}

// The customer's running Onadit subscription, not one for another product.
function onaditSubscription(customer: Stripe.Customer): Stripe.Subscription | undefined {
  return customer.subscriptions?.data.find(
    (s) => s.metadata?.site === ONADIT_TAG.site && RUNNING.includes(s.status),
  );
}

// Runs for every paid invoice. Rewards the subscriber who invited this
// customer, once, on the first invoice the friend actually pays. Returns what it
// did, for the webhook's log.
export async function rewardReferrer(client: Stripe, invoice: Stripe.Invoice): Promise<string> {
  const promotionCode = invoice.parent?.subscription_details?.metadata?.invited_with;
  const friend = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!promotionCode || !friend) return "not invited";
  if (invoice.amount_paid <= 0) return "nothing paid yet";

  const referrerId = (await client.promotionCodes.retrieve(promotionCode)).metadata?.referrer;
  if (!referrerId || referrerId === friend) return "no one to reward";
  const referrer = await customerWithSubscriptions(client, referrerId);
  if (referrer.deleted) return "inviter deleted";
  const email = (value: string | null | undefined) => value?.trim().toLowerCase() || null;
  if (email(referrer.email) && email(referrer.email) === email(invoice.customer_email)) {
    return "same email as the inviter";
  }

  let friends = await paidFriends(client, referrer.id);
  let reward = "already rewarded";
  if (!friends.has(friend)) {
    if (friends.size >= GRID) {
      reward = "grid already full";
    } else {
      await creditMonth(client, referrer.id, onaditSubscription(referrer), friend);
      reward = "1 free month";
      // read again: a friend who paid at the same moment may have added theirs
      friends = await paidFriends(client, referrer.id);
    }
  }
  const lifetime = await keepLifetime(client, referrer, friends.size);
  return [reward, `${Math.min(friends.size, GRID)} of ${GRID}`, lifetime].filter(Boolean).join(", ");
}

// Runs for every paid Onadit invoice, the subscriber's own included: an inviter
// whose subscription had stopped when their 16th friend paid gets free for life
// once they subscribe again on the same Stripe customer.
export async function keepLifetimeFor(client: Stripe, invoice: Stripe.Invoice): Promise<string> {
  if (invoice.parent?.subscription_details?.metadata?.site !== ONADIT_TAG.site) return "not onadit";
  const id = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  if (!id) return "no customer";
  const customer = await customerWithSubscriptions(client, id);
  if (customer.deleted) return "customer deleted";
  const paid = (await paidFriends(client, id)).size;
  return (await keepLifetime(client, customer, paid)) ?? `${paid} of ${GRID}`;
}

// 16 friends who paid: the lifetime coupon on the customer's Onadit subscription.
async function keepLifetime(client: Stripe, customer: Stripe.Customer, paid: number): Promise<string | null> {
  if (paid < GRID) return null;
  const subscription = onaditSubscription(customer);
  if (!subscription) return "free for life once subscribed again";
  const coupon = (d: string | Stripe.Discount) =>
    typeof d === "string" ? null : typeof d.source.coupon === "string" ? d.source.coupon : d.source.coupon?.id;
  if (subscription.discounts.some((d) => coupon(d) === LIFETIME_COUPON)) return "free for life";
  await client.subscriptions.update(
    subscription.id,
    { discounts: [{ coupon: LIFETIME_COUPON }] },
    { idempotencyKey: `invite-lifetime-${subscription.id}` },
  );
  return "now free for life";
}

// 1 month of the inviter's own Onadit plan, as a credit their next bills use
// first. The idempotency key stops a retried event from paying twice.
async function creditMonth(
  client: Stripe,
  customerId: string,
  subscription: Stripe.Subscription | undefined,
  friend: string,
): Promise<void> {
  let price = subscription?.items.data[0]?.price;
  if (!price?.unit_amount && process.env.STRIPE_PRICE_ID) {
    price = await client.prices.retrieve(process.env.STRIPE_PRICE_ID);
  }
  if (!price?.unit_amount) throw new Error("no price to size the free month with");

  await client.customers.createBalanceTransaction(
    customerId,
    {
      amount: -price.unit_amount,
      currency: price.currency,
      description: "1 free month: a friend you invited joined Onadit",
      metadata: { invite_friend: friend },
    },
    { idempotencyKey: `invite-month-${friend}` },
  );
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
