import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Two Payment Links, because a link carries one price: monthly by default,
// annual on ?plan=annual. An unrecognised plan is REJECTED, never quietly
// converted — sending someone who clicked an annual link into a monthly
// subscription is a billing surprise, and "it still sells" is the wrong
// safety model when the outcome is a charge.
const PLANS = ["monthly", "annual"] as const;
type Plan = (typeof PLANS)[number];

function isPlan(value: string | null): value is Plan {
  return value !== null && (PLANS as readonly string[]).includes(value);
}

function checkoutUrl(plan: Plan): URL | null {
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
  const requested = new URL(req.url).searchParams.get("plan");
  if (requested !== null && !isPlan(requested)) {
    return new Response(
      `Unknown plan "${requested}". Use /checkout for monthly or /checkout?plan=annual.`,
      {
        status: 400,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
        },
      },
    );
  }
  const plan: Plan = requested ?? "monthly";
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
