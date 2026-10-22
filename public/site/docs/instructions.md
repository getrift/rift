---
title: Agent instructions
url: https://onadit.com/docs/instructions
summary: 1 line in CLAUDE.md or AGENTS.md makes your agent look in Onadit before it starts. Here is the line, and how it sits next to the rules you already keep.
last_updated: 2026-10-22
---

# Agent instructions

1 line in CLAUDE.md or AGENTS.md makes your agent look in Onadit before it starts. Here is the line, and how it sits next to the rules you already keep.

## The line

Connected agents can call Onadit's tools, but they decide when. A line in your rule file makes the lookup a habit.

```md CLAUDE.md or AGENTS.md
Before a task, call onadit_context_pack with a 1-line description of it.
```

In Cursor, put it in a rule under `.cursor/rules/` or in your user rules. In Claude, put it in a project's instructions or in your personal preferences.

On a connection made before the rename, the tool is called `rift_context_pack`: name that one instead, or [move the connection to the new names](https://onadit.com/docs/connect.md#what-gets-written). `onadit doctor` warns when a global `CLAUDE.md` or Codex `AGENTS.md` still names the `rift_` tools after a connection has moved.

A longer version, for agents that should also know when to dig further:

```md CLAUDE.md or AGENTS.md
## Onadit

- Before a task that touches project history, call `onadit_context_pack` with a
  1-line description of the task and `cwd` set to this folder.
- If the pack is thin, call `onadit_search` with a narrow query and a low `top_k`.
- Open a result with `onadit_open_evidence` before you rely on it.
- Skip Onadit for trivial questions and for answers that are in the current files.
```

## Rule files and Onadit do different jobs

| | Rule files (`CLAUDE.md`, `AGENTS.md`) | Onadit |
|---|---|---|
| Holds | What you decided to write down | The conversations where you worked things out |
| Loaded | In full, at the start of every session | On request, a few passages at a time |
| Best for | Rules that always apply: commands, conventions, tone | Things that apply sometimes: a past decision, a dead end, where work stopped |
| Kept current by | You | Capture, once turned on |

Keep rules in the rule file. If you find yourself pasting the same instruction into every session, it belongs there, not in Onadit.

## What the agent gets back

A context pack is small, 6 KB by default. It groups what Onadit found into decisions, constraints, examples and rules, and every item carries where it came from. The agent gets it twice: as a short Markdown summary that opens with an "Onadit recalled …" line, and as JSON. The full shape, with a real response, is in [MCP tools](https://onadit.com/docs/mcp-tools.md#onadit-context-pack).
