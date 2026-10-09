---
title: Save from an agent
url: https://getrift.dev/docs/save
summary: A connected agent can file a session or a note the moment it matters, without waiting for Capture.
last_updated: 2026-10-09
---

# Save from an agent

A connected agent can file a session or a note the moment it matters, without waiting for Capture.

## When to use it

- You use a tool Capture does not read.
- Capture is off.
- You want something filed now, not at the next hourly run.

Ask the agent in plain words: "Save this session to Rift." It calls `rift_save`.

## The call

```json rift_save
{
  "source": "claude_code",
  "summary": "Chose a clean macOS VM over Docker for the install check.",
  "decisions": ["Docker is rejected for install checks: it cannot exercise the Mac-specific parts"],
  "key_outputs": ["docs/release-checklist.md"],
  "topics": ["installer", "release"],
  "content": "User: … Assistant: …"
}
```

`source` and `summary` are required. Send `content` too for anything of substance: the summary alone gives search very little to match. Every parameter is in [MCP tools](https://getrift.dev/docs/mcp-tools.md#rift-save).

## What comes back

The save is queued, and the call returns at once.

```json Response
{
  "job_id": "…",
  "quality": { "tier": "…", "warnings": [] }
}
```

`quality.warnings` tells the agent when the save is thin, for example when there is no transcript. If the same save was already made, the response carries `"duplicate": true` and nothing new is stored.

## Saving the same session twice

| You send | What happens |
|---|---|
| The same `content` again, no key | Nothing. Rift derives a key from the content and recognises it |
| An `idempotency_key` you chose, again | Nothing |
| A new `idempotency_key` with `replace_idempotency_key` set to the old one | The earlier save is replaced |

A good key has the shape `<tool>:<session id>:<version>`.

## From the command line

```sh
rift save --source codex_cli --summary "Moved capture limits to config" --content-file session.txt
git log -5 | rift save --source claude_code --summary "Last five commits" --stdin
```

## Where it goes

A saved session is stored like a captured one: the original payload as a file in `data/raw/conversations/<source>/`, and one row in the database. It is searchable as soon as the job finishes.
