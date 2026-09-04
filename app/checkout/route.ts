import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Two Payment Links, because a link carries one price: monthly by default,
// annual on ?plan=annual. Anything else falls back to monthly rather than
// erroring, so a mangled link still sells.
function checkoutUrl(plan: string | null): URL | null {
  const raw =
    plan === "annual"
      ? process.env.STRIPE_PAYMENT_LINK_ANNUAL_URL
      : process.env.STRIPE_PAYMENT_LINK_URL;
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

export function GET(req: Request) {
  const plan = new URL(req.url).searchParams.get("plan");
  const url = checkoutUrl(plan);
  if (!url) {
    const envName =
      plan === "annual" ? "STRIPE_PAYMENT_LINK_ANNUAL_URL" : "STRIPE_PAYMENT_LINK_URL";
    return new Response(
      `Stripe checkout is not configured. Set ${envName} to your Stripe Payment Link.`,
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
