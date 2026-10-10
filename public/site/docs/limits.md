---
title: Limits
url: https://getrift.dev/docs/limits
summary: What Rift does not do today, stated plainly.
last_updated: 2026-10-10
---

# Limits

What Rift does not do today, stated plainly.

## Platform

- Mac only, with Apple silicon and macOS 14 or later. There is no Intel, Windows or Linux build.

## History

- Capture reads Claude Code and Codex sessions. See [Capture](https://getrift.dev/docs/capture.md) for the sources that are opt-in.
- Capture starts on the day you turn it on. Sessions that existed before are not imported, unless you resume them.
- Capture needs Search by meaning to be on. Without an embedding key, the capture loop does not start.
- An imported conversation is dated by its import, not by when it took place.
- Chat apps come in through an export file that you request from the provider. Rift cannot read the ChatGPT or Claude desktop apps directly.

## Agents

- Only MCP clients can search Rift. Importing a ChatGPT export puts those chats in Rift. It does not let the ChatGPT app search Rift.
- An agent decides when to call Rift. Without [a line in your rule file](https://getrift.dev/docs/instructions.md), it may not.

## Privacy

- A passage an agent recalls becomes part of its conversation, so it reaches that agent's provider.
- The archive is not walled off by project. `cwd` narrows documents and puts the current project's conversations first in a context pack, but conversations from other projects can still come back, and `rift_search` does not filter conversations by `cwd`.
- Capture summarises sessions through your own Claude Code or Codex, so session text goes to that provider and uses some of your plan. We have not published how much.
- Search by meaning, when on, sends passages and questions to Voyage. Keyword search sends nothing.

## Evidence

- We have no measured figure for tokens saved or for answer quality.
- The speed figures come from 16 fixed tasks on 1 Mac. See [Performance](https://getrift.dev/docs/performance.md) for the conditions.
