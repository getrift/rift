import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Stripe's customer portal: a subscriber signs in with their email and can
// cancel, change the card or download invoices.
function portalUrl(): URL | null {
  const raw = process.env.STRIPE_BILLING_PORTAL_URL;
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
      "Billing is not configured. Set STRIPE_BILLING_PORTAL_URL to your Stripe customer portal link.",
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
