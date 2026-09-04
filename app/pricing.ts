/* One price, one place. Changing what Rift costs is an edit here plus the
   Stripe prices themselves — nothing else on the site hardcodes a number.

   €12/month or €99/year, decided 2026-09-04 and matching the canonical price
   already recorded in the engine repo's PROJECT_STATE. Annual is ~2 months
   free, which is the reason to offer it at all.

   /checkout redirects to the monthly Stripe Payment Link in
   STRIPE_PAYMENT_LINK_URL; /checkout?plan=annual redirects to the annual one
   in STRIPE_PAYMENT_LINK_ANNUAL_URL. /billing redirects to the hosted customer
   portal in STRIPE_PORTAL_URL, which is where cancellation lives.

   Settings that live in the Stripe dashboard, not here:
   - each Payment Link's post-payment redirect -> https://getrift.dev/welcome
   - "customers can only subscribe once" on both links, so an existing
     subscriber is sent to the portal instead of buying a second subscription
     (https://docs.stripe.com/payments/checkout/limit-subscriptions)
   - the customer portal itself, with cancellation enabled
     (https://docs.stripe.com/customer-management) */

export const PRICE = "€12";
export const PRICE_PERIOD = "month";
export const PRICE_LABEL = `${PRICE}/${PRICE_PERIOD}`;

export const PRICE_ANNUAL = "€99";
export const PRICE_ANNUAL_PERIOD = "year";
export const PRICE_ANNUAL_LABEL = `${PRICE_ANNUAL}/${PRICE_ANNUAL_PERIOD}`;

export const CHECKOUT_URL = "/checkout";
export const CHECKOUT_ANNUAL_URL = "/checkout?plan=annual";
