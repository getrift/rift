/* One price, one place. Changing what Rift costs is an edit here plus the
   Stripe Payment Link itself — nothing else on the site hardcodes a number.

   /checkout redirects to the Stripe Payment Link in STRIPE_PAYMENT_LINK_URL
   (see app/checkout/route.ts). /billing redirects to the hosted customer
   portal in STRIPE_PORTAL_URL, which is where cancellation lives.

   Three settings live in the Stripe dashboard, not here:
   - the Payment Link's post-payment redirect -> https://getrift.dev/welcome
   - "customers can only subscribe once" on the Payment Link, so an existing
     subscriber is sent to the portal instead of buying a second subscription
     (https://docs.stripe.com/payments/checkout/limit-subscriptions)
   - the customer portal itself, with cancellation enabled
     (https://docs.stripe.com/customer-management)

   PRICE IS NOT SETTLED. $10/month here is a placeholder: the recorded
   canonical price is EUR 12/month or EUR 99/year. Decide before launch — one
   number changes here, and the Stripe product has to match. */

export const PRICE = "$10";
export const PRICE_PERIOD = "month";
export const PRICE_LABEL = `${PRICE}/${PRICE_PERIOD}`;
export const CHECKOUT_URL = "/checkout";
