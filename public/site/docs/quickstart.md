---
title: Quickstart
url: https://onadit.com/docs/quickstart
summary: Connect 1 agent, bring some history in, and run a first lookup. About 5 minutes.
last_updated: 2026-10-22
---

# Quickstart

Connect 1 agent, bring some history in, and run a first lookup. About 5 minutes.

## Before you start

[Install Onadit](https://onadit.com/docs/install.md). The steps below use the command line. Onadit.app does the same things with buttons, and `onadit onboard` walks you through steps 1 to 3 in one go.

The package does not put `onadit` on your `PATH`. Run this first, in the terminal you will use:

```sh
export PATH="$HOME/.rift/bin:$PATH"
```

## 1. Bring some history in

Ask ChatGPT, Claude or Grok for an export of your data. It arrives as a zip. Then:

```sh
onadit import ~/Downloads/chatgpt-export.zip
```

The default source is ChatGPT. For another one, name it:

```sh
onadit import ~/Downloads/claude-export.zip --source claude_web
```

You can also drop the zip into `~/Library/Application Support/Rift/data/inbox/`. More in [Import](https://onadit.com/docs/import.md).

## 2. Find something

```sh
onadit search "pricing" --top-k 3
```

Search works by keyword out of the box. Nothing leaves your Mac.

## 3. Connect an agent

```sh
onadit mcp install --client claude-code
```

Use `claude-desktop`, `codex` or `cursor` for the others. `--all` writes the entry for all 4, and creates the config file of any that is not installed. Restart the tool so it picks the change up. More in [Connect an agent](https://onadit.com/docs/connect.md).

For Claude Code and Codex, the command then asks whether to turn on 2 optional hooks: a short project note at the start of each session, and a check that the agent asks Onadit before a task. The note goes to that tool's AI provider with the rest of the session. Answer `N` to leave them off. You can add them later with `onadit hooks install`.

Then ask the agent something only your history can answer:

```text In the agent
Use Onadit. What did I decide about pricing, and when?
```

It should call `onadit_context_pack` or `onadit_search` and answer with the passage and its source.

## 4. Make it a habit

Add 1 line to `CLAUDE.md` or `AGENTS.md`, so the agent looks before it starts:

```md
Before a task, call onadit_context_pack with a 1-line description of it.
```

More in [Agent instructions](https://onadit.com/docs/instructions.md).

## 5. Optional: turn Capture on

Capture files your new Claude Code and Codex sessions every hour. It is off until you turn it on, because it needs 2 things that send text out of your Mac:

- Search by meaning, which sends text to Voyage to be embedded
- Claude Code or Codex, signed in, which reads each new session to judge and summarise it

In Onadit.app, open Privacy and click Search by Meaning, then open Capture and click Turn On. From the command line, once Search by meaning is on:

```sh
onadit onboard --enable-capture
```

Read [Capture](https://onadit.com/docs/capture.md) and [What leaves your Mac](https://onadit.com/docs/egress.md) first.

## Check it

```sh
onadit status
```

The `MCP:` line shows which tools are connected, and the `Memory:` line shows how many conversations Onadit holds.
