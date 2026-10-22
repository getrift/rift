---
title: Privacy, in plain words
url: https://onadit.com/docs/privacy
summary: Onadit stores your conversations and search index on your Mac. Conversation content leaves only through the choices described on this page.
last_updated: 2026-10-22
---

# Privacy, in plain words

Onadit stores your conversations and search index on your Mac. Conversation content leaves only through the choices described on this page.

## The short version

A fresh install uses keyword search and makes no AI calls. No Onadit account is needed. Your conversation content leaves only through the choices described below. There is also a version check, which sends no content.

Search by meaning sends text to Voyage's models, with a key Onadit gives you or with your own. AI processing uses your own accounts. 2 things can reach me: a random install ID if you ask Onadit for a search key, and feedback if you enable the relay. When you ask your AI tool to search Onadit, the excerpts it retrieves become part of that tool's chat.

Every network call is listed, one by one, in [What leaves your Mac](https://onadit.com/docs/egress.md).

## Search by meaning, off until you turn it on

Turn it on and search gets smarter. From then on, the text Onadit indexes and the queries you type are sent out to be embedded by Voyage's models. Turned on in the app, it also sends everything already in your archive, once, so all of it can be searched by meaning. There are 2 ways to turn it on.

In the app, Onadit asks my key service for a key. That request carries a random install ID and, like any web request, your IP address, which is used to limit how many keys 1 address can get. It carries no content, no name and no email. The key is for Voyage's models as hosted by MongoDB Atlas, and I pay for it. Your text then goes from your Mac to that service directly, not through me.

Or add your own Voyage API key, and your text goes to `api.voyageai.com` under your account, with nothing sent to me. With search by meaning off, nothing is embedded and nothing is sent.

## AI enrichment and capture, only if you opt in

These features are off by default. When enabled, metadata extraction and capture triage send conversation content to your configured worker: Codex CLI (OpenAI) or Claude Code (Anthropic), under your own account. Capture also sends a short test message before each run, and with Codex as the worker, a session too large to judge is later sent whole, in pieces, to be summarised. Digest summaries use Codex. Choosing Claude for metadata does not silently enable Codex digests. A local Ollama model can do metadata and digest work on your Mac instead.

## When your AI tool uses Onadit

When Claude, Codex, Cursor, or another connected tool calls Onadit, matching conversation excerpts and their source references enter that chat. A cloud AI tool can send this context to its provider under your account and its own privacy settings. If you turn on the optional session hooks, a short project note also enters every new Claude Code or Codex session this way. The local browser search stays on your Mac unless you have enabled cloud search.

## Feedback, off by default

Your `onadit feedback` notes are saved locally. A note only reaches me if you turned on the feedback relay, during `onadit onboard` or with `onadit feedback setup`, and then just your note and its tag, a random per-install ID (not your name or hostname), your email if you chose to share one, the Onadit, commit and Node versions, and optional health information such as whether the daemon is running. The relay runs on Cloudflare and emails each note to me through Resend. Leave the relay off and nothing is sent.

## A version check

About once an hour the app pings `registry.npmjs.org` to see if a newer version exists, the same plain request `npm install` makes. No content, no ID, no key.

## What never happens

No telemetry to me. No usage counters, no crash reports, no analytics, no snippets or embeddings phoned home. The Onadit app never sends your conversations or search activity to me. The only things it sends me are a feedback note you opt into and type yourself, and the random install ID when you ask Onadit for a search key.

## The email form on this site

Separate from the app: if you leave your email on this site, it is stored in my contact list at Resend, an email provider, so I can write to you about Onadit. The email is all it collects, and skipping the form stores nothing. It has nothing to do with the app, which never uploads your conversations or search activity.

## Visit counts on this site

Also separate from the app: this website counts visits with Cloudflare Web Analytics. It sees which pages are viewed, the site you came from, your browser, device type and country, and how fast pages load. It sets no cookies and does not follow you to other sites.

## Buying Onadit, and invites

Also separate from the app: when you buy Onadit, Stripe, a payment provider, takes the payment. Stripe keeps your email, your name, your card and your billing country. I see your email and your payments, never your full card number.

After you pay, you get an invite link. It is a Stripe promotion code tied to your Stripe customer record. A friend who joins with it has the invite noted on their Stripe subscription. Each month of credit they earn you sits on your Stripe customer record and carries their Stripe customer ID. Anyone who opens your link sees how many friends have joined, never who they are. If I email you the link, it goes through Resend, like the email form.

## Leaving is 1 command

In the macOS setup page, choose Remove Onadit and confirm once. This removes Onadit's archive, credentials, background service, bundled app and its connections to your AI tools. Original exports and unrelated tools are preserved.

The same removal is available from Terminal with `onadit uninstall --purge-data`. Without `--purge-data`, your archive and credentials are kept. A setup-page removal leaves a report in `~/Library/Logs/Rift/` and tells you if any step failed. Separately installed npm packages need their package manager's uninstall command. Each step is described in [Remove Onadit](https://onadit.com/docs/remove.md).

## This page is the contract

If the app ever does something this page does not say, that is a bug. Run `onadit feedback --kind=broke` and I will fix it.
