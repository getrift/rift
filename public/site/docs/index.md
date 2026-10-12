---
title: Onadit documentation
url: https://onadit.com/docs
summary: Onadit keeps your AI conversations on your Mac and lets the agents you connect search them while they work.
last_updated: 2026-10-12
---

# Onadit documentation

Onadit keeps your AI conversations on your Mac and lets the agents you connect search them while they work.

## What Onadit does

You work things out with AI tools all day: why one approach fits, what you ruled out, how you like things written. Most of it stays in the conversation where it happened. Onadit files those conversations on your Mac and gives your agents a way to look things up in them.

It has 3 parts.

| Part | What it does | Page |
|---|---|---|
| History in | Captures new Claude Code and Codex sessions every hour, and imports ChatGPT, Claude and Grok exports. | [Capture](https://onadit.com/docs/capture.md), [Import](https://onadit.com/docs/import.md) |
| The archive | Stores conversation text, summaries and a search index in a folder on your Mac. | [Where data lives](https://onadit.com/docs/storage.md) |
| Agents out | Runs a local MCP server. Connected agents call its tools to get ranked, sourced passages. | [Connect an agent](https://onadit.com/docs/connect.md), [MCP tools](https://onadit.com/docs/mcp-tools.md) |

## Start here

1. [Install Onadit](https://onadit.com/docs/install.md) on a Mac with Apple silicon and macOS 14 or later.
2. Follow the [Quickstart](https://onadit.com/docs/quickstart.md): connect 1 agent, bring some history in, and run a first lookup.
3. Add [1 line to your rule files](https://onadit.com/docs/instructions.md) so your agent looks before it starts.

## If you are an agent

Read [For agents](https://onadit.com/docs/for-agents.md). It tells you what to check on your user's machine and how to answer them.

Every page here is also published as Markdown. Add `.md` to a page address, or start from [llms.txt](https://onadit.com/llms.txt). The button at the top of each page copies it as Markdown.

## What Onadit is not

- It does not train or fine-tune a model. Agents read passages when a task calls for them.
- It does not replace `CLAUDE.md`, `AGENTS.md` or your notes. See [Agent instructions](https://onadit.com/docs/instructions.md).
- It is not a cloud service. There is no account, and we never receive your archive. See [What leaves your Mac](https://onadit.com/docs/egress.md).
