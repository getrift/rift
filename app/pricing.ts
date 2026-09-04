/* One price, one place. Changing what Rift costs is an edit here plus the
   Stripe prices themselves — nothing else on the site hardcodes a number.

   €12/month or €99/year, decided 2026-09-04 and matching the canonical price
   already recorded in the engine repo's PROJECT_STATE. Annual saves €45 on
   €144, which is 3.75 months free, or 31%.

   /checkout redirects to the monthly Stripe Payment Link in
   STRIPE_PAYMENT_LINK_URL; /checkout?plan=annual redirects to the annual one
   in STRIPE_PAYMENT_LINK_ANNUAL_URL. /billing redirects to the hosted customer
   portal in STRIPE_PORTAL_URL, which is where cancellation lives.

   LAUNCH CHECKLIST — none of this is code, and all of it blocks launch.

   In the Stripe dashboard:
   - two recurring prices on one product: €12/month and €99/year
   - each Payment Link's post-payment redirect -> https://getrift.dev/welcome
   - "customers can only subscribe once" on both links, so an existing
     subscriber is sent to the portal instead of buying a second subscription
     (https://docs.stripe.com/payments/checkout/limit-subscriptions)
   - the customer portal, with cancellation enabled
     (https://docs.stripe.com/customer-management)
   - terms URL https://getrift.dev/terms and refund URL https://getrift.dev/refunds
     on the payment page
   - email receipts on for successful payments
   - Stripe Tax on, with the origin address and tax registrations set — EU VAT
     on a digital service is charged at the buyer's rate, so this is not optional
   - the invoice/receipt footer carrying the legal entity

   On this site:
   - /terms still has a PLACEHOLDER seller block. Fill in the legal entity,
     address, registration and VAT number before the branch deploys.

   Then one live run end to end: purchase, redirect, download, receipt,
   cancellation, and a repeat-purchase attempt. */

export const PRICE = "€12";
export const PRICE_PERIOD = "month";
export const PRICE_LABEL = `${PRICE}/${PRICE_PERIOD}`;

export const PRICE_ANNUAL = "€99";
export const PRICE_ANNUAL_PERIOD = "year";
export const PRICE_ANNUAL_LABEL = `${PRICE_ANNUAL}/${PRICE_ANNUAL_PERIOD}`;

export const CHECKOUT_URL = "/checkout";
export const CHECKOUT_ANNUAL_URL = "/checkout?plan=annual";
