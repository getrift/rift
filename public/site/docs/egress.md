---
title: What leaves your Mac
url: https://getrift.dev/docs/egress
summary: A list of every network call Rift can make, what it sends, and whether it is on. Out of the box, only an update check leaves your Mac.
last_updated: 2026-10-10
---

# What leaves your Mac

A list of every network call Rift can make, what it sends, and whether it is on. Out of the box, only an update check leaves your Mac.

## The short version

- Your archive is stored on your Mac. There is no account and no cloud copy. We never receive your conversations.
- Keyword search, import and the MCP server work with nothing sent anywhere.
- Text leaves your Mac in 3 cases, and you turn each one on: Search by meaning, Capture, and an agent recalling a passage.

## Every call

| Call | Goes to | Sends | On by default |
|---|---|---|---|
| Update check | `registry.npmjs.org` | A plain request for the package's version list. Nothing about you | Yes. At start, then hourly |
| Embeddings | Voyage's models: `api.voyageai.com` with your own key, or MongoDB Atlas, which hosts them, with a key from Rift | The text to embed: search questions, saved and imported conversations, indexed documents | No. Needs Search by meaning |
| Key check | The same embedding service | The fixed text `rift onboarding probe` | Only when a key is added |
| Key service | Our key service | A random install ID. No text, no email. Like any web request, it shows your IP address, which we use to limit how many keys 1 address can get | No. Only when you turn Search by meaning on in the app |
| Session judging | Your own Claude Code or Codex, with your sign-in | The session transcript, up to about 256 KB, and a prompt | No. Needs Capture |
| Richer summaries and digests | Your own Claude Code or Codex | Conversation text | No. Needs enrichment |
| Feedback | Our feedback relay | The note you wrote, the Rift version, and a status snapshot if you add one | No. By invitation |

The engine itself listens on `127.0.0.1` only. It cannot be reached from the network.

## Search by meaning

When it is on, Rift sends text to Voyage to turn it into embeddings: every question an agent or you search for, and every conversation or document that enters the archive from then on. The embeddings come back and are stored on your Mac.

There are 2 ways to turn it on.

- In Rift.app, under Privacy. Rift asks our key service for a key, sending a random install ID. The key is for Voyage's models as hosted by MongoDB Atlas, and we pay for it. It is saved in `~/.rift.env`, and your text goes from your Mac to that service directly, not through us.
- With your own Voyage key: `rift onboard --voyage-key <key>`. Your text goes to `api.voyageai.com` under your account, and nothing is sent to us.

With it off, search is by keyword and nothing is sent.

## Capture

Capture needs Search by meaning, so everything above applies. It also runs your own Claude Code or Codex on each new session, which sends that session's text to Anthropic or OpenAI under your account. See [Capture](https://getrift.dev/docs/capture.md#what-your-tool-is-asked-to-do) for the exact commands.

Rift holds no Anthropic or OpenAI key and makes no call to either on its own.

## When an agent recalls a passage

This is the one that is easy to miss. When a connected agent calls a Rift tool, the passages it gets back become part of its conversation. They go wherever the rest of that conversation goes: to the agent's provider.

Rift decides what to return. It cannot decide what the agent does with it.

The archive is 1 pool. Passing `cwd` narrows documents and puts the current project's conversations first in a context pack. It does not keep the rest out: a passage from another project can still be returned, and `rift_search` does not filter conversations by `cwd`. If you work under terms that keep one client's material away from another's tools, take that into account before you connect an agent.

## What we can see

| | |
|---|---|
| Your conversations | Never |
| Your searches | Never |
| That an install exists | Only if you turn Search by meaning on in the app: 1 random ID, and the IP address the request came from |
| Your email | Only if you give it to us |

## Check it yourself

- The table above is the full list of calls the engine makes. On a terminal install, `rift update` also downloads the new version from npm when you run it.
- The engine's log is in `~/Library/Logs/Rift/`.
- `data/observability/embedding-events.jsonl` is a local record of embedding requests.
- `data/observability/agent-tool-usage.jsonl` is a local record of the tool calls your agents made.
- `rift status` shows whether a key is loaded and whether Capture is on.
