---
title: What leaves your Mac
url: https://onadit.com/docs/egress
summary: A list of every network call Onadit can make, what it sends, and whether it is on. Out of the box, only an update check leaves your Mac.
last_updated: 2026-10-22
---

# What leaves your Mac

A list of every network call Onadit can make, what it sends, and whether it is on. Out of the box, only an update check leaves your Mac.

## The short version

- Your archive is stored on your Mac, with no account and no cloud copy, and we never receive your conversations
- Keyword search, import and the MCP server work with nothing sent anywhere
- Text leaves your Mac only through features you turn on: Search by meaning, Capture, AI enrichment, a feedback note you send, and an agent recalling a passage

## Every call

| Call | Goes to | Sends | On by default |
|---|---|---|---|
| Update check | `registry.npmjs.org` | A plain request for the package's version list. Nothing about you | Yes. At start, then hourly. There is no switch to turn it off |
| Embeddings | Voyage's models: `api.voyageai.com` with your own key, or `ai.mongodb.com` (MongoDB Atlas, which hosts them) with a key from Onadit | The text to embed: search questions, saved and imported conversations, indexed documents. Turned on in the app, also your whole existing archive, once. See below | No. Needs Search by meaning |
| Key check | The same embedding service | The fixed text `rift onboarding probe` | Only when a key is added |
| Key service | Our key service, `rift-relay.clem-rog.workers.dev`, which runs on Cloudflare | A random install ID. No text, no email. Like any web request, it shows your IP address, which we use to limit how many keys 1 address can get | No. Only when you turn Search by meaning on in the app |
| Capture check | Your own Claude Code or Codex, with your sign-in | A fixed test message, before each Capture run | No. Needs Capture |
| Codex model check | Your own Codex | Up to 4 tiny test calls when Codex lists a model Onadit has not tried, to find one that runs | No. Needs Codex for Capture or enrichment |
| Session judging | Your own Claude Code or Codex | The session transcript, cut to about 256 KB, and a prompt. With Codex as the worker, a session over 8 MB is later sent whole, in 512 KB pieces, to be summarised | No. Needs Capture |
| Richer summaries and digests | Your own Claude Code or Codex | Conversation text | No. Needs enrichment |
| Commands you run | Your own Codex | The text they work on. `onadit triage --dir`, `onadit backfill --provider codex-cli` and `onadit capture recover-quarantine` use Codex whatever your settings | Only when you run them |
| Feedback | Our feedback relay, which runs on Cloudflare and emails each note to us through Resend | The note and its tag, the time, a random install ID, your email if you shared one, the Onadit, commit and Node versions, and a status snapshot if you add `--with-status` | No. Only if you turn the relay on, with an invite |
| Sign-up | The same relay | Your email and install ID, once | Only if you give an email when you turn the relay on |

The engine itself listens on `127.0.0.1` only. It cannot be reached from the network.

## Search by meaning

When it is on, Onadit sends text to Voyage to turn it into embeddings: every question an agent or you search for, and every conversation or document that enters the archive. The embeddings come back and are stored on your Mac.

If you turn it on in Onadit.app, Onadit also sends everything already in your archive, once: current and archived conversations, digests and documents, so all of it can be searched by meaning. Adding your own key with `onadit onboard --voyage-key` does not send what is already there. `onadit reindex` would.

There are 2 ways to turn it on.

| How | The key | Where your text goes |
|---|---|---|
| In Onadit.app, under Privacy | Onadit asks our key service for one, sending a random install ID. It is for Voyage's models as hosted by MongoDB Atlas, we pay for it, and it is saved in `~/.rift.env` | From your Mac to `ai.mongodb.com` directly, not through us |
| `onadit onboard --voyage-key <key>` | Your own Voyage key | To `api.voyageai.com`, under your account. Nothing is sent to us |

With it off, search is by keyword and nothing is sent.

## Capture

Capture needs Search by meaning, so everything above applies. It also runs your own Claude Code or Codex on each new session, which sends that session's text to Anthropic or OpenAI under your account. A short test message goes the same way before each run. See [Capture](https://onadit.com/docs/capture.md#what-your-tool-is-asked-to-do) for the commands.

Onadit holds no Anthropic or OpenAI key and makes no call to either on its own.

## When an agent recalls a passage

This is the one that is easy to miss. When a connected agent calls an Onadit tool, the passages it gets back become part of its conversation. They go wherever the rest of that conversation goes: to the agent's provider.

The optional session hooks for Claude Code and Codex go further: they put a project note of about 2 KB into every new session, with no tool call. It holds lines from your tracker files and summaries of the project's latest captured sessions, and it reaches the provider the same way.

Onadit decides what to return. It cannot decide what the agent does with it.

The archive is 1 pool. Passing `cwd` narrows documents and puts the current project's conversations first in a context pack. It does not keep the rest out: a passage from another project can still be returned, and `onadit_search` does not filter conversations by `cwd`. If you work under terms that keep one client's material away from another's tools, take that into account before you connect an agent.

## What we can see

| | |
|---|---|
| Your conversations | Never |
| Your searches | Never |
| That an install exists | Only if you turn Search by meaning on in the app, or turn the feedback relay on: 1 random ID, and the IP address the request came from |
| Your email | Only if you give it to us |
| A feedback note | Only the notes you send through the relay |

## Check it yourself

- The table above lists every call the engine and the command line make, and on a terminal install `onadit update` also downloads the new version from npm when you run it
- The package also holds code for direct calls to `api.anthropic.com` and `api.openai.com` that this version never runs, so a search of its files finds those addresses
- The engine's log is in `~/Library/Logs/Rift/` on a package install, and in `~/Library/Application Support/Rift/logs/` on a terminal install
- `data/observability/embedding-events.jsonl` is a local record of embedding requests
- `data/observability/agent-tool-usage.jsonl` is a local record of the tool calls your agents made
- `onadit status` shows whether a key is loaded and whether Capture is on
