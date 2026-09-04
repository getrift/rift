import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* Stripe's hosted customer portal. Subscribers manage payment method, invoices
   and cancellation there, so none of that needs account infrastructure here.
   Set STRIPE_PORTAL_URL to the portal's login link from the Stripe dashboard
   (Settings → Billing → Customer portal). Mirrors app/checkout/route.ts. */
function portalUrl(): URL | null {
  const raw = process.env.STRIPE_PORTAL_URL;
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const host = url.hostname;
    if (url.protocol !== "https:" || !(host === "stripe.com" || host.endsWith(".stripe.com"))) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function GET() {
  const url = portalUrl();
  if (!url) {
    return new Response(
      "The billing portal is not configured. Set STRIPE_PORTAL_URL to your Stripe customer portal login link.",
      {
        status: 503,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
        },
      },
    );
  }

  return NextResponse.redirect(url, { status: 307 });
}
