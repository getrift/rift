# Rift

A Next.js 15 project with Tailwind CSS, Zustand, and CodeMirror.

## Release

Production is the Vercel project `rift`, which serves onadit.com. It is not
connected to GitHub, so merging into `main` releases nothing. To release:
merge the reviewed pull request from a `crog/` branch, `git fetch origin`,
check out the fetched `origin/main` (the merge commit, not a local `main`
that may be stale) in a clean folder with no uncommitted work, copy
`.vercel/project.json` into it, and run `vercel deploy --prod` there. Then check onadit.com in a browser: it sits
behind Vercel's Security Checkpoint, so `curl` gets a challenge page.

## Share card

`public/og.png` is the share image of every page: the home page as a still, its
drawing sheet and its first sentence. `public/og.mp4` is the same card in motion,
an 8.4 s loop that starts and ends on that still: the text fades out, the
sentence is read in word by word as on the home page, the dots come in and
drift, then the button. iMessage and Discord play the video; other apps show the
image.

Both come from `scripts/og-card/card.html` (`?play` turns on the motion), in a
headless Chrome: `scripts/og-card/run.sh public/og.png` for the image,
`node scripts/og-card/video.mjs public/og.mp4` for the video, which sets every
animation to each frame's time so the clip is the same on every run. When the
home page's sentence, look or motion changes, update the card and render both
again. The static pages in `public/site` get their `og:video` tags from the
engine repo's build (`preview/site-v42/build.py`).

## Checkout and invites

`/checkout` starts a Stripe Checkout for the monthly plan. After paying, the
buyer lands on `/thanks`, which hands them an invite link, `/r/<code>`. A
friend who subscribes through it gets their first month free. When the friend
pays their first bill, the inviter gets 1 month free as Stripe credit. The 16th
friend makes Onadit free for the inviter for life. Invites stop working at the
end of 31 December 2026 (`INVITES_END` in `app/invites.ts`).

Stripe is the only store. Each invite is a promotion code whose metadata names
its owner (`referrer`) and lists the friends who have paid (`friends`). The
friend's subscription keeps the promotion code in its metadata
(`invited_with`), and `/stripe/webhook` rewards the owner on `invoice.paid`.
The invite page reads the list to light its 16 squares. The Stripe account
sells other things too, so `/checkout` tags its sessions `site: onadit`, and
only those get an invite.

Checkout charges VAT with Stripe Tax: the €5 includes it, and the buyer's
country sets the share. Without Stripe Tax set up in the account, creating a
checkout fails.

To set it up in a Stripe account:

1. Turn on Stripe Tax, with the registrations the company needs.
2. `scripts/stripe-invites-setup.sh` makes the 2 coupons (`--live` for live
   mode, `--price` to also make the €5 monthly plan, VAT included).
3. In the Vercel project, set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`
   (secrets, typed at `vercel env add`'s hidden prompt) and `STRIPE_PRICE_ID`.
4. In Stripe, add a webhook endpoint at `https://onadit.com/stripe/webhook`
   for `checkout.session.completed` and `invoice.paid`, on API version
   `2026-09-30.endive` (the one the `stripe` package uses). Its signing secret
   is `STRIPE_WEBHOOK_SECRET`.
5. Optional: `INVITE_EMAIL_FROM` (an address on a domain verified at Resend)
   also emails the invite link after checkout, with the existing `RESEND_API_KEY`.
