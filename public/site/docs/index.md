---
title: Rift documentation
url: https://getrift.dev/docs
summary: Rift keeps your AI conversations on your Mac and lets the agents you connect search them while they work.
last_updated: 2026-10-09
---

# Rift documentation

Rift keeps your AI conversations on your Mac and lets the agents you connect search them while they work.

## What Rift does

You work things out with AI tools all day: why one approach fits, what you ruled out, how you like things written. Most of it stays in the conversation where it happened. Rift files those conversations on your Mac and gives your agents a way to look things up in them.

It has three parts.

| Part | What it does | Page |
|---|---|---|
| History in | Captures new Claude Code and Codex sessions every hour, and imports ChatGPT, Claude and Grok exports. | [Capture](https://getrift.dev/docs/capture.md), [Import](https://getrift.dev/docs/import.md) |
| The archive | Stores conversation text, summaries and a search index in a folder on your Mac. | [Where data lives](https://getrift.dev/docs/storage.md) |
| Agents out | Runs a local MCP server. Connected agents call its tools to get ranked, sourced passages. | [Connect an agent](https://getrift.dev/docs/connect.md), [MCP tools](https://getrift.dev/docs/mcp-tools.md) |

## Start here

1. [Install Rift](https://getrift.dev/docs/install.md) on a Mac with Apple silicon and macOS 14 or later.
2. Follow the [Quickstart](https://getrift.dev/docs/quickstart.md): connect one agent, bring some history in, and run a first lookup.
3. Add [one line to your rule files](https://getrift.dev/docs/instructions.md) so your agent looks before it starts.

## If you are an agent

Read [For agents](https://getrift.dev/docs/for-agents.md). It tells you what to check on your user's machine and how to answer them.

Every page here is also published as Markdown. Add `.md` to a page address, or start from [llms.txt](https://getrift.dev/llms.txt). The button at the top of each page copies it as Markdown.

## What Rift is not

- It does not train or fine-tune a model. Agents read passages when a task calls for them.
- It does not replace `CLAUDE.md`, `AGENTS.md` or your notes. See [Agent instructions](https://getrift.dev/docs/instructions.md).
- It is not a cloud service. There is no account, and we never receive your archive. See [What leaves your Mac](https://getrift.dev/docs/egress.md).
