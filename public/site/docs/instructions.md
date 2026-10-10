---
title: Agent instructions
url: https://getrift.dev/docs/instructions
summary: 1 line in CLAUDE.md or AGENTS.md makes your agent look in Rift before it starts. Here is the line, and how it sits next to the rules you already keep.
last_updated: 2026-10-10
---

# Agent instructions

1 line in CLAUDE.md or AGENTS.md makes your agent look in Rift before it starts. Here is the line, and how it sits next to the rules you already keep.

## The line

Connected agents can call Rift's tools, but they decide when. A line in your rule file makes the lookup a habit.

```md CLAUDE.md or AGENTS.md
Before a task, call rift_context_pack with a 1-line description of it.
```

A longer version, for agents that should also know when to dig further:

```md CLAUDE.md or AGENTS.md
## Rift

- Before a task that touches project history, call `rift_context_pack` with a
  1-line description of the task and `cwd` set to this folder.
- If the pack is thin, call `rift_search` with a narrow query and a low `top_k`.
- Open a result with `rift_open_evidence` before you rely on it.
- Skip Rift for trivial questions and for answers that are in the current files.
```

## Rule files and Rift do different jobs

| | Rule files (`CLAUDE.md`, `AGENTS.md`) | Rift |
|---|---|---|
| Holds | What you decided to write down | The conversations where you worked things out |
| Loaded | In full, at the start of every session | On request, a few passages at a time |
| Best for | Rules that always apply: commands, conventions, tone | Things that apply sometimes: a past decision, a dead end, where work stopped |
| Kept current by | You | Capture, once turned on |

Keep rules in the rule file. If you find yourself pasting the same instruction into every session, it belongs there, not in Rift.

## What the agent gets back

A context pack is a small JSON document, 6 KB by default. It groups what Rift found into decisions, constraints, examples and rules, and every item carries where it came from. The full shape, with a real response, is in [MCP tools](https://getrift.dev/docs/mcp-tools.md#rift-context-pack).
