import { GRID, INVITES_END, SITE, findInvite, paidFriends } from "../../../invites";
import { stripe } from "../../../stripe";

export const dynamic = "force-dynamic";

// GET /api/invites/<code>: an invite's count, for Onadit.app's Invite section.
// It says no more than the invite page itself, which anyone with the link can
// open. The edge keeps each answer 5 minutes, so opening the app does not reach
// Stripe every time.
const CACHED = { "cache-control": "public, s-maxage=300, stale-while-revalidate=3600" };

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const client = stripe();
  if (!client) return Response.json({ error: "not set up" }, { status: 503 });
  try {
    const invite = await findInvite(client, code);
    if (!invite) return Response.json({ error: "no such invite" }, { status: 404, headers: CACHED });
    const paid = (await paidFriends(client, invite.referrer)).size;
    return Response.json(
      {
        code: invite.code,
        link: `${SITE}/r/${invite.code}`,
        paid: Math.min(paid, GRID),
        grid: GRID,
        lifetime: paid >= GRID,
        open: invite.open,
        ends_at: INVITES_END.toISOString(),
      },
      { headers: CACHED },
    );
  } catch (error) {
    console.error("invite count", error);
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
