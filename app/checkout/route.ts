import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function checkoutUrl(): URL | null {
  const raw = process.env.STRIPE_PAYMENT_LINK_URL;
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
  const url = checkoutUrl();
  if (!url) {
    return new Response(
      "Stripe checkout is not configured. Set STRIPE_PAYMENT_LINK_URL to your Stripe Payment Link.",
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
