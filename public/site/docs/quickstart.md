---
title: Quickstart
url: https://getrift.dev/docs/quickstart
summary: Connect one agent, bring some history in, and run a first lookup. About five minutes.
last_updated: 2026-10-09
---

# Quickstart

Connect one agent, bring some history in, and run a first lookup. About five minutes.

## Before you start

[Install Rift](https://getrift.dev/docs/install.md). The steps below use the command line. Rift.app does the same things with buttons, and `rift onboard` walks you through steps 1 to 3 in one go.

The package does not put `rift` on your `PATH`. Run this first, in the terminal you will use:

```sh
export PATH="$HOME/.rift/bin:$PATH"
```

## 1. Bring some history in

Ask ChatGPT, Claude or Grok for an export of your data. It arrives as a zip. Then:

```sh
rift import ~/Downloads/chatgpt-export.zip
```

The default source is ChatGPT. For another one, name it:

```sh
rift import ~/Downloads/claude-export.zip --source claude_web
```

You can also drop the zip into `~/Library/Application Support/Rift/data/inbox/`. More in [Import](https://getrift.dev/docs/import.md).

## 2. Find something

```sh
rift search "pricing" --top-k 3
```

Search works by keyword out of the box. Nothing leaves your Mac.

## 3. Connect an agent

```sh
rift mcp install --client claude-code
```

Use `claude-desktop`, `codex` or `cursor` for the others, or `--all` for every one found on this Mac. Restart the tool so it picks the change up. More in [Connect an agent](https://getrift.dev/docs/connect.md).

Then ask the agent something only your history can answer:

```text In the agent
Use Rift. What did I decide about pricing, and when?
```

It should call `rift_context_pack` or `rift_search` and answer with the passage and its source.

## 4. Make it a habit

Add one line to `CLAUDE.md` or `AGENTS.md`, so the agent looks before it starts:

```md
Before a task, call rift_context_pack with a one-line description of it.
```

More in [Agent instructions](https://getrift.dev/docs/instructions.md).

## 5. Optional: turn Capture on

Capture files your new Claude Code and Codex sessions every hour. It is off until you turn it on, because it needs two things that send text out of your Mac:

- Search by meaning, which sends text to Voyage to be embedded.
- Claude Code or Codex, signed in, which reads each new session to judge and summarise it.

Search by meaning is a switch in Rift.app, under Privacy. Then turn Capture on from the command line:

```sh
rift onboard --advanced --enable-capture
```

Read [Capture](https://getrift.dev/docs/capture.md) and [What leaves your Mac](https://getrift.dev/docs/egress.md) first.

## Check it

```sh
rift status
```

The `MCP:` line shows which tools are connected, and the `Memory:` line shows how many conversations Rift holds.
