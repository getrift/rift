import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { waitlistStore } from "./store";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort throttling thresholds. Durability/sharing across instances comes
// from whatever `waitlistStore` is backed by (in-memory today — see store.ts).
const WINDOW_MS = 60_000;
const MAX_PER_IP = 5; // per WINDOW_MS
const EMAIL_WINDOW_MS = 10 * 60_000;
const MAX_PER_EMAIL = 3; // per EMAIL_WINDOW_MS

function genericUnavailable() {
  return NextResponse.json(
    { ok: false, error: "Beta signup is temporarily unavailable. Please try again in a moment." },
    { status: 503 },
  );
}

export async function POST(req: Request) {
  let body: { email?: unknown; contact_fax?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never see or fill `contact_fax`. Bots that auto-fill
  // it get a fake success so they don't learn the trap exists. Nothing is sent.
  // The name deliberately avoids real autofill categories so a password manager
  // can't fill it for a genuine user and cause a silent no-send.
  const honeypot = typeof body.contact_fax === "string" ? body.contact_fax.trim() : "";
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const underIp = await waitlistStore.underRateLimit(`ip:${ip}`, WINDOW_MS, MAX_PER_IP);
  const underEmail = await waitlistStore.underRateLimit(`email:${email}`, EMAIL_WINDOW_MS, MAX_PER_EMAIL);
  if (!underIp || !underEmail) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Keep the configuration detail in the logs, not in the user-facing copy.
    console.error("[waitlist] RESEND_API_KEY is not set — cannot send invite request email.");
    return genericUnavailable();
  }

  // Durably record the signup before doing anything network-bound.
  await waitlistStore.recordSignup(email);

  // Dedupe accidental double-submits of the same email within a ~10 min bucket.
  // Hash the email rather than putting it in the header in cleartext — request
  // headers often end up in logs and observability tools.
  const bucket = Math.floor(Date.now() / EMAIL_WINDOW_MS);
  const idempotencyKey = `invite-${createHash("sha256").update(`${email}:${bucket}`).digest("hex").slice(0, 32)}`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Idempotency-Key": idempotencyKey,
  };

  const segmentId = process.env.RIFT_BETA_SEGMENT_ID;

  try {
    if (segmentId) {
      // Current Resend model: a global Contact assigned to a Segment (Audiences
      // are deprecated). Durable + broadcastable later (e.g. when free beta ends).
      const res = await fetch("https://api.resend.com/contacts", {
        method: "POST",
        headers,
        body: JSON.stringify({ email, unsubscribed: false, segments: [{ id: segmentId }] }),
      });
      // If the email already exists globally, explicitly attach it to this
      // segment so "already a contact elsewhere" still means "in Rift Beta".
      if (res.status === 409) {
        const segmentRes = await fetch(
          `https://api.resend.com/contacts/${encodeURIComponent(email)}/segments/${segmentId}`,
          {
            method: "POST",
            headers: { ...headers, "Idempotency-Key": `${idempotencyKey}-segment` },
          },
        );
        if (!segmentRes.ok && segmentRes.status !== 409) {
          const detail = await segmentRes.text().catch(() => "");
          console.error(`[waitlist] Resend segment add responded ${segmentRes.status}: ${detail}`);
          return genericUnavailable();
        }
      } else if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error(`[waitlist] Resend contact add responded ${res.status}: ${detail}`);
        return genericUnavailable();
      }
    } else {
      // No segment configured: fall back to a transactional notice to the inbox
      // so the signup email isn't lost. Set RIFT_BETA_SEGMENT_ID for a durable,
      // broadcastable list instead of per-signup inbox mail.
      const from = process.env.RIFT_WAITLIST_FROM || "Rift Beta <onboarding@resend.dev>";
      const to = process.env.RIFT_WAITLIST_TO || "clem.rog@gmail.com";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify({
          from,
          to,
          reply_to: email,
          subject: `Rift beta signup: ${email}`,
          text: `New Rift beta signup.\n\nEmail: ${email}\n\nReply to this email to reach them directly.\n\n(Set RIFT_BETA_SEGMENT_ID to collect these in a Resend Segment instead.)`,
        }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error(`[waitlist] Resend email responded ${res.status}: ${detail}`);
        return genericUnavailable();
      }
    }
  } catch (err) {
    console.error("[waitlist] Failed to reach Resend:", err);
    return genericUnavailable();
  }

  // Plain-text founder welcome. One job: explain Rift in human language and
  // send people to the canonical docs. Non-blocking: a delivery hiccup logs but
  // the signup still succeeds and the modal shows setup steps.
  // Needs a verified domain in RIFT_WAITLIST_FROM to reach external inboxes.
  try {
    const from = process.env.RIFT_WAITLIST_FROM || "Rift Beta <onboarding@resend.dev>";
    // Replies land on the brand inbox. Requires beta@getrift.dev to forward to
    // wherever you actually read mail (Resend Inbound can't be replied to).
    const replyTo = process.env.RIFT_REPLY_TO || "beta@getrift.dev";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { ...headers, "Idempotency-Key": `${idempotencyKey}-welcome` },
      body: JSON.stringify({
        from,
        to: email,
        reply_to: replyTo,
        subject: "You're in. Start here.",
        text: `Hey, thanks for joining the Rift beta. You're in.

I built Rift for one annoying loop: you explain the same project to Claude Code, Codex, Cursor, and ChatGPT over and over.

Rift gives them one private memory on your Mac. The work you did in one tool can help in the next, without you pasting old chats around or re-explaining what already happened.

Start here:
https://getrift.dev/docs#overview

The docs cover the install, connecting your own agents, and the common setup issues.

One note: Rift can find old work even when you don't remember the exact words for it. I set that up for you during the beta, so there's nothing to wire. If you reply and tell me what you want Rift to remember first, I'll make sure it's dialed in for your work.

Clément`,
      }),
    });
    if (!res.ok) {
      console.error(`[waitlist] welcome email responded ${res.status}: ${await res.text().catch(() => "")}`);
    }
  } catch (err) {
    console.error("[waitlist] Failed to send welcome email:", err);
  }

  return NextResponse.json({ ok: true });
}
