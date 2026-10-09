---
title: Capture
url: https://getrift.dev/docs/capture
summary: Capture reads your new coding-agent sessions on a schedule, keeps the ones worth keeping, and files them in the archive. It is off until you turn it on.
last_updated: 2026-10-09
---

# Capture

Capture reads your new coding-agent sessions on a schedule, keeps the ones worth keeping, and files them in the archive. It is off until you turn it on.

## What it reads

| Source | App | Reads | On when Capture is on |
|---|---|---|---|
| `claude_code` | Claude Code | `~/.claude/projects/<project>/<uuid>.jsonl` | Yes |
| `codex_cli` | Codex | `*.jsonl` under `~/.codex/sessions/` and `~/.codex/archived_sessions/` | Yes |
| `cursor_composer` | Cursor | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb`, opened read-only | No. Add it to `capture.sources` |
| `claude_desktop_sessions` | Claude desktop app, agent and Cowork sessions | `~/Library/Application Support/Claude/local-agent-mode-sessions/` | No. `rift onboard --enable-cowork-capture` |
| `grok_cli` | Grok CLI | `~/.grok/sessions/<project>/<uuid>/chat_history.jsonl` | No. `rift onboard --enable-grok-capture` |

Capture never changes these files.

Ordinary chats in the ChatGPT and Claude desktop apps are not captured. Bring them in with an [export](https://getrift.dev/docs/import.md).

## Turn it on

Capture needs two things:

- Search by meaning. The capture loop does not start without an embedding key.
- Claude Code or Codex, installed and signed in. One of them judges and summarises each session.

Search by meaning is a switch in Rift.app, under Privacy. Then, from the command line:

```sh
rift onboard --advanced --enable-capture
```

Or set it in `config.json` and restart the engine:

```json config.json
"capture": {
  "enabled": true,
  "interval_seconds": 3600,
  "sources": ["claude_code", "codex_cli"],
  "triage": { "provider": "codex_cli" }
}
```

## When it runs

The engine runs Capture once when it starts, then every `capture.interval_seconds`. The default is 3600, one hour. There is no separate scheduled job. To run it now:

```sh
rift capture            # run once
rift capture --dry-run  # judge sessions, save nothing
```

> A dry run saves nothing, but it still sends session text to Claude Code or Codex to be judged.

## The first run

On its first run for a source, Capture records every session it finds as already seen and saves none of them. Sessions that existed before you turned Capture on are not imported.

Two exceptions:

- If one of those older sessions changes later, because you resumed it, it is read and judged in full.
- Grok CLI sessions are captured from the start, old and new.

Capture tells sessions apart by a fingerprint: the file size and a hash of its last 4,096 bytes.

## How a session is judged

Each new or changed session goes to the tool you chose in `capture.triage.provider`: Codex by default, or Claude Code. It gets one prompt and returns one of three decisions.

| Decision | Meaning | What happens |
|---|---|---|
| `save` | It holds decisions, technical knowledge, project context, or anything else you would want to recall later | Saved with its full transcript and the summary |
| `review` | Borderline. It might be valuable, but the tool is not sure | Put in the review queue. Not searchable until you promote it |
| `discard` | Trivial, mechanical or repetitive, with nothing of lasting value | Marked as seen. Nothing is stored |

Along with the decision, the tool returns a confidence from 0 to 1, a summary, topics and a short rationale.

Details that matter:

- A session with fewer than 100 characters of content is discarded without being sent anywhere.
- A long session is cut to its start and its end for judging, to stay under about 256 KB. What gets saved is still the full transcript.
- A session that fails is not marked as seen, so the next run tries it again.
- Before each run, Capture sends one fixed test message to check that the tool answers. If that fails, the run stops and `rift status` says why.

## What your tool is asked to do

Capture runs your own Claude Code or Codex, with your own sign-in. It holds no API key for either.

```sh Codex
codex exec - --sandbox read-only --color never --skip-git-repo-check \
  --model <model> --output-schema <file> --output-last-message <file>
```

```sh Claude Code
claude -p --output-format json --json-schema <schema> --safe-mode \
  --no-session-persistence --strict-mcp-config --model haiku --tools ""
```

Codex runs in a read-only sandbox, with a private home folder that holds only a copy of its sign-in file. Claude Code runs with no tools, no MCP servers and no saved session. Each call times out after 120 seconds and is retried once.

These calls count against your plan with that provider. We have not published how much a typical day uses.

## The review queue

```sh
rift review list
rift review promote <id>
rift review discard <id>
```

Queued sessions are JSON files in `data/review-queue/`. Promoting one saves it to the archive. All the options are in the [CLI reference](https://getrift.dev/docs/cli.md#rift-review).

## Large sessions

| Source | Limit | What happens above it |
|---|---|---|
| Codex | 8 MB per session file. Change it with `capture.codex_cli.max_session_bytes` | The session is set aside in `data/quarantine/`. Rift then summarises it in pieces in the background, up to three tries |
| Cursor | 4 MB of transcript. Change it with `capture.cursor.max_session_bytes` | Set aside. No automatic recovery |
| Claude Code, Claude desktop, Grok CLI | None | |

If the background recovery gives up, `rift doctor` reports it and this command finishes the job:

```sh
rift doctor repair capture-large-sessions
```

## What is stored for a saved session

- The original payload, as a file in `data/raw/conversations/<source>/`.
- One row in the database: the full transcript, the summary, topics, decisions, the source, the time it was saved, and an embedding.
- The folder the session ran in, so results can be tied to a project.

If a saved session grows, the next run replaces its row and its file. It is not stored twice.

Capture also keeps sentences you typed yourself that state a decision or a rule. A sentence is kept only if it is found word for word in a message you wrote. Context packs show these as "You said".
