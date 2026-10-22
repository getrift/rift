import Stripe from "stripe";

// Stripe is set up in the Vercel project: STRIPE_SECRET_KEY for the API,
// STRIPE_PRICE_ID for the monthly plan, STRIPE_WEBHOOK_SECRET for
// /stripe/webhook. Without them, the routes that need Stripe answer 503.
let client: Stripe | null | undefined;

export function stripe(): Stripe | null {
  if (client === undefined) {
    const key = process.env.STRIPE_SECRET_KEY;
    client = key ? new Stripe(key) : null;
  }
  return client;
}

// "€5" for the monthly plan, or null when Stripe or the price is missing.
export async function monthlyPrice(client: Stripe | null): Promise<string | null> {
  const id = process.env.STRIPE_PRICE_ID;
  if (!client || !id) return null;
  try {
    const price = await client.prices.retrieve(id);
    if (price.unit_amount == null) return null;
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: price.currency,
      minimumFractionDigits: price.unit_amount % 100 ? 2 : 0,
    }).format(price.unit_amount / 100);
  } catch {
    return null;
  }
}
