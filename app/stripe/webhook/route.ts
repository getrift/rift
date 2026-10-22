import type Stripe from "stripe";
import { emailInvite, ensureInvite, isOnaditCheckout, rewardReferrer } from "../../invites";
import { stripe } from "../../stripe";

export const dynamic = "force-dynamic";

// Stripe calls this for 2 events, set on the webhook endpoint in Stripe:
// - checkout.session.completed: a new subscriber from /checkout gets their
//   invite link, by email when sending is set up (the thank-you page shows it too).
// - invoice.paid: an invited friend paid a bill, so their inviter may earn a month.
// An error answers 500, and Stripe tries again later.
export async function POST(request: Request) {
  const client = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!client || !secret) return new Response("Stripe is not set up", { status: 503 });

  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature") ?? "",
      secret,
    );
  } catch {
    return new Response("Bad signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (isOnaditCheckout(session) && typeof session.customer === "string") {
        const invite = await ensureInvite(client, session.customer);
        const email = session.customer_details?.email;
        if (invite && email) await emailInvite(email, invite);
      }
    } else if (event.type === "invoice.paid") {
      const outcome = await rewardReferrer(client, event.data.object);
      console.log("invoice.paid", event.data.object.id, outcome);
    }
  } catch (error) {
    console.error(event.type, event.id, error);
    return new Response("Failed, retry later", { status: 500 });
  }
  return Response.json({ received: true });
}
