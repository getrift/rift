import { NextResponse } from "next/server";
import { ONADIT_TAG, findInvite } from "../invites";
import { monthlyPrice, stripe } from "../stripe";

export const dynamic = "force-dynamic";

function unavailable(message: string, status: number) {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

// /checkout starts a Stripe Checkout for the monthly plan. /checkout?ref=<code>
// comes from an invite page: the friend's first month is free, and the
// subscription remembers the invite so /stripe/webhook can reward its owner.
export async function GET(request: Request) {
  const client = stripe();
  const price = process.env.STRIPE_PRICE_ID;
  if (!client || !price) {
    return unavailable("Checkout is not set up yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.", 503);
  }

  const url = new URL(request.url);
  const ref = url.searchParams.get("ref");
  try {
    const found = ref ? await findInvite(client, ref) : null;
    const invite = found?.open ? found : null;
    const amount = await monthlyPrice(client);
    const session = await client.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      metadata: ONADIT_TAG,
      // The price includes VAT; Stripe Tax works out the share for the buyer's country.
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: true },
      custom_text: {
        submit: {
          message: `${amount ?? "The price"} a month, VAT included. Cancel anytime at onadit.com/billing. Full refund within 14 days of any payment, no reason needed.`,
        },
      },
      success_url: `${url.origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: invite ? `${url.origin}/r/${invite.code}` : `${url.origin}/`,
      subscription_data: {
        metadata: { ...ONADIT_TAG, ...(invite && { invited_with: invite.promotionCode }) },
      },
      ...(invite && { discounts: [{ promotion_code: invite.promotionCode }] }),
    });
    if (!session.url) throw new Error("Stripe returned no checkout address");
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (error) {
    console.error("checkout failed", error);
    return unavailable("Checkout is unavailable right now. Try again in a minute.", 502);
  }
}
