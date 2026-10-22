---
title: Onadit documentation
url: https://onadit.com/docs
summary: Onadit keeps your AI conversations on your Mac and lets the agents you connect search them while they work.
last_updated: 2026-10-22
---

# Onadit documentation

Onadit keeps your AI conversations on your Mac and lets the agents you connect search them while they work.

## What Onadit does

You work things out with AI tools all day: why one approach fits, what you ruled out, how you like things written. Most of it stays in the conversation where it happened. Onadit files those conversations on your Mac and gives your agents a way to look things up in them.

It has 3 parts.

![Onadit in 3 parts. History in: new Claude Code and Codex sessions captured every hour once Capture is on, ChatGPT, Claude and Grok chats imported from an export, and sessions your agent saves when you ask it to. The archive: conversations, summaries and a search index, in a folder on your Mac. Context out: your agents ask a question over MCP and get ranked passages back, with their sources.](https://onadit.com/docs/concept.svg)

| Part | What it does | Page |
|---|---|---|
| History in | Imports ChatGPT, Claude and Grok exports. Once you turn Capture on, it also captures new Claude Code and Codex sessions every hour. | [Capture](https://onadit.com/docs/capture.md), [Import](https://onadit.com/docs/import.md) |
| The archive | Stores conversation text, summaries and a search index in a folder on your Mac. | [Where data lives](https://onadit.com/docs/storage.md) |
| Context out | Runs a local MCP server. Connected agents call its tools to get ranked, sourced passages. | [Connect an agent](https://onadit.com/docs/connect.md), [MCP tools](https://onadit.com/docs/mcp-tools.md) |

## What it looks like

With [1 line in your rule file](https://onadit.com/docs/instructions.md), your agent looks in Onadit on its own before it starts a task. 4 examples, with made-up projects:

#### Continue after a limit

> I was working on the invoice export in Claude Code this morning and hit my limit. Continue it, please.

Codex calls `onadit_context_pack` with that task. It gets back what you decided in the Claude Code session and the passage that matches the task, in a pack capped at 6 KB, about 1,500 tokens. Codex picks up where Claude Code stopped, without rereading the whole session or asking you to explain it again.

#### Ask why

> Why are we on SQLite and not Postgres?

Claude Code searches the archive and finds the whole story: the brainstorm in a Grok chat and a Claude chat you imported, then the Codex session where you settled it, because the app has 1 user, runs on a laptop and has nothing to host. It answers with that reason and its 3 sources, then gets on with the task.

#### Find it without the words

> Find where we talked about people giving up during setup.

The conversation it wants never says "giving up" or "setup". It says "first-run friction" and "people bail at the permissions screen". With [Search by meaning](https://onadit.com/docs/retrieval.md#2-lanes) on, Onadit matches the idea rather than the words, so Claude still finds it. Keyword search alone would come back empty.

#### Write like you

> Write the release notes for 2.1.

Cursor calls `onadit_context_pack` first. Among the results is a line you typed in a Claude Code session months ago: "keep release notes short, in plain words, with no emojis". Onadit hands it back as something you said, with the session it came from, so Cursor writes the notes your way the first time.

## Start here

1. [Install Onadit](https://onadit.com/docs/install.md) on a Mac with Apple silicon and macOS 14 or later
2. Follow the [Quickstart](https://onadit.com/docs/quickstart.md): connect 1 agent, bring some history in, and run a first lookup
3. Add [1 line to your rule files](https://onadit.com/docs/instructions.md) so your agent looks before it starts

## If you are an agent

Read [For agents](https://onadit.com/docs/for-agents.md). It tells you what to check on your user's machine and how to answer them.

Every page here is also published as Markdown. Add `.md` to a page address, or start from [llms.txt](https://onadit.com/llms.txt). The button at the top of each page copies it as Markdown.

## What Onadit is not

- It does not train or fine-tune a model: agents read passages when a task calls for them
- It does not replace `CLAUDE.md`, `AGENTS.md` or your notes (see [Agent instructions](https://onadit.com/docs/instructions.md))
- It is not a cloud service: there is no account, and we never receive your archive (see [What leaves your Mac](https://onadit.com/docs/egress.md))
