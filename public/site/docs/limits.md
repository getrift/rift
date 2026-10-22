---
title: Limits
url: https://onadit.com/docs/limits
summary: What Onadit does not do today, stated plainly.
last_updated: 2026-10-22
---

# Limits

What Onadit does not do today, stated plainly.

## Platform

- Mac only, with Apple silicon and macOS 14 or later (12.3 or later for the terminal install), and there is no Intel, Windows or Linux build

## History

- Capture reads Claude Code and Codex sessions, plus the opt-in sources listed in [Capture](https://onadit.com/docs/capture.md)
- Capture starts on the day you turn it on, so sessions that existed before are not imported unless you resume them (Grok CLI is the exception: turning it on captures its old sessions too)
- Capture needs Search by meaning to be on, since the capture loop does not start without an embedding key
- An imported conversation is dated by its import, not by when it took place
- Chat apps come in through an export file that you request from the provider, since Onadit cannot read ordinary chats in the ChatGPT or Claude desktop apps

## Agents

- Only MCP clients can search Onadit: importing a ChatGPT export puts those chats in Onadit, but it does not let the ChatGPT app search Onadit
- An agent decides when to call Onadit, and without [a line in your rule file](https://onadit.com/docs/instructions.md) it may not

## Privacy

- A passage an agent recalls becomes part of its conversation, so it reaches that agent's provider
- The archive is not walled off by project: `cwd` narrows documents and puts the current project's conversations first in a context pack, but conversations from other projects can still come back, and `onadit_search` does not filter conversations by `cwd`
- Capture summarises sessions through your own Claude Code or Codex, so session text goes to that provider and uses some of your plan (we have not published how much)
- Search by meaning, when on, sends passages and questions to Voyage's models, hosted by MongoDB Atlas with the key Onadit provides, while keyword search sends nothing

## Evidence

- We have no measured figure for tokens saved or for answer quality
- The speed figures come from 16 fixed tasks on 1 Mac (the conditions are in [Performance](https://onadit.com/docs/performance.md))
