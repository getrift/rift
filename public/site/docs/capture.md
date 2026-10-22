---
title: Capture
url: https://onadit.com/docs/capture
summary: Capture reads your new coding-agent sessions on a schedule, keeps the ones worth keeping, and files them in the archive. It is off until you turn it on.
last_updated: 2026-10-22
---

# Capture

Capture reads your new coding-agent sessions on a schedule, keeps the ones worth keeping, and files them in the archive. It is off until you turn it on.

## What it reads

| Source | App | Reads | On when Capture is on |
|---|---|---|---|
| `claude_code` | Claude Code | `~/.claude/projects/<project>/<uuid>.jsonl` | Yes |
| `codex_cli` | Codex | `*.jsonl` under `~/.codex/sessions/` and `~/.codex/archived_sessions/` | Yes |
| `cursor_composer` | Cursor | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb`, opened read-only | No. Add it to `capture.sources` |
| `claude_desktop_sessions` | Claude desktop app, agent and Cowork sessions | `~/Library/Application Support/Claude/local-agent-mode-sessions/` | No. `onadit onboard --enable-cowork-capture` |
| `grok_cli` | Grok CLI | `~/.grok/sessions/<project>/<uuid>/chat_history.jsonl` | No. `onadit onboard --enable-grok-capture` |

Capture never changes these files.

Ordinary chats in the ChatGPT and Claude desktop apps are not captured. Bring them in with an [export](https://onadit.com/docs/import.md).

## Turn it on

Capture needs 2 things:

- Search by meaning, since the capture loop does not start without an embedding key
- Claude Code or Codex, installed and signed in, to judge and summarise each session

In Onadit.app, open Privacy and click Search by Meaning, then open Capture and click Turn On. From the command line, once Search by meaning is on:

```sh
onadit onboard --enable-capture
```

Both ask which tool reads your sessions: Claude Code or Codex. The one installed and signed in is preselected. When both are, it is the one with more sessions on your Mac. To answer in advance, add `--capture-worker claude` or `--capture-worker codex`. With `--yes`, or without a terminal, that option is required the first time: Onadit does not pick a company for you.

Or set it in `config.json` and restart the engine:

```json config.json
"capture": {
  "enabled": true,
  "interval_seconds": 3600,
  "sources": ["claude_code", "codex_cli"],
  "triage": { "provider": "claude_code", "level": "balanced" }
}
```

In `config.json`, set `capture.triage.provider` yourself. If it is missing, Capture uses Codex.

## When it runs

The engine runs Capture once when it starts, then every `capture.interval_seconds`. The default is 3600, 1 hour. There is no separate scheduled job. To run it now:

```sh
onadit capture                       # run once
onadit capture --source claude_code  # 1 source only
onadit capture --dry-run             # judge sessions, save nothing
```

`onadit capture` runs even when Capture is off, on the sources in `capture.sources`. In this version, Claude desktop sessions are saved only by the scheduled run: `onadit capture` and `onadit review promote` fail on them.

> A dry run saves nothing, but it still sends session text to Claude Code or Codex to be judged. It also never records what it has seen. Before Capture's first real run for a source, a dry run judges every session already on your Mac, and does so again each time you run it.

## The first run

On its first run for a source, Capture records every session it finds as already seen and saves none of them. Sessions that existed before you turned Capture on are not imported.

2 exceptions:

- If one of those older sessions changes later, because you resumed it, it is read and judged in full
- Grok CLI sessions are captured from the start, old and new

Capture tells sessions apart by their source and session ID. For Claude Code and Codex, it notices that a session changed by a fingerprint: the file size and a hash of its last 4,096 bytes.

## How a session is judged

Each new or changed session goes to the tool you chose, saved as `capture.triage.provider`. It gets 1 prompt and returns 1 of 3 decisions.

| Decision | Meaning | What happens |
|---|---|---|
| `save` | It holds decisions, technical knowledge, project context, or anything else you would want to recall later | Saved with its full transcript and the summary |
| `review` | Borderline. It might be valuable, but the tool is not sure | Put in the review queue. Not searchable until you promote it |
| `discard` | Trivial, mechanical or repetitive, with nothing of lasting value | Marked as seen. Nothing is stored |

Along with the decision, the tool returns a confidence from 0 to 1, a summary, topics and a short rationale.

Details that matter:

- A session with fewer than 100 characters of content is discarded without being sent anywhere
- A long session is cut to its start and its end for judging, to stay under about 256 KB, but what gets saved is still the full transcript
- A session that fails is not marked as seen, so the next run tries it again
- Before each run, Capture sends 1 fixed test message to check that the tool answers: if the tool fails, the run stops and `onadit status` says why, and if it only times out, the run goes on

## Claude Code or Codex, and the model

You choose the tool when you turn Capture on. To change it later, use the Summarized by menu under Capture in Onadit.app, or run:

```sh
onadit onboard --capture-worker claude   # or codex
```

Onadit never moves your sessions from one tool to the other on its own.

The model is set by a level, not a model name, so a model the provider retires cannot stop Capture:

| Level | Claude Code | Codex |
|---|---|---|
| `balanced`, the default | `sonnet` | The balanced model from your account's model list |
| `fast` | `haiku` | A fast model from that list |

Change it in the Model menu in Onadit.app, or with `onadit onboard --capture-level fast`. Codex picks its model from the list your account has, in Codex's own order, checks it with a short test call, and remembers it. Onadit reads that list again every hour, so when OpenAI ships a model and Codex puts it first, Capture moves to it on its own. If OpenAI stops accepting a model, Codex picks another and `onadit status` says so. If OpenAI says a model is at capacity, Onadit uses the next one for at least 30 minutes, and tries the first one again at its next hourly check. It never moves your sessions from Codex to Claude Code, or the other way. `codex_cli.model` in `config.json` still sets an exact Codex model. If Codex refuses it, Onadit uses another and `onadit status` says so.

`onadit status` shows the model in use while Capture is on:

```text
Model:       sonnet (balanced)
```

## What your tool is asked to do

Capture runs your own Claude Code or Codex, with your own sign-in. It holds no API key for either.

```sh Codex
codex exec - --sandbox read-only --color never --skip-git-repo-check \
  --model <model> --output-schema <file> --output-last-message <file>
```

```sh Claude Code
claude -p --output-format json --json-schema <schema> --safe-mode \
  --no-session-persistence --strict-mcp-config --model sonnet --tools ""
```

Claude Code runs `haiku` instead at the `fast` level. Codex runs in a read-only sandbox, with a private home folder that holds only a copy of its sign-in file. Claude Code runs with no tools, no MCP servers and no saved session. Each call times out after 120 seconds, and a call that timed out is retried once.

These calls count against your plan with that provider. We have not published how much a typical day uses.

## The review queue

```sh
onadit review list
onadit review promote <id>
onadit review discard <id>
```

Queued sessions are JSON files in `data/review-queue/`. Promoting one saves it to the archive. All the options are in the [CLI reference](https://onadit.com/docs/cli.md#onadit-review).

## Large sessions

| Source | Limit | What happens above it |
|---|---|---|
| Codex | 8 MB per session file. Change it with `capture.codex_cli.max_session_bytes` | The session is set aside in `data/quarantine/`. When Codex is capture's worker, Onadit then summarises it in pieces in the background, up to 3 tries |
| Cursor | 4 MB of transcript. Change it with `capture.cursor.max_session_bytes` | Set aside. No automatic recovery |
| Claude Code, Claude desktop, Grok CLI | None | |

If the background recovery gives up, `onadit doctor` reports it and this command finishes the job. It summarises the session through Codex, whichever tool Capture uses:

```sh
onadit doctor repair capture-large-sessions
```

With Claude Code as capture's worker, there is no background recovery: a large Codex session stays set aside until you run that command, even though `onadit status` says it is being saved.

## What is stored for a saved session

- The original payload, as a file in `data/raw/conversations/<source>/`
- 1 row in the database: the full transcript, the summary, topics, decisions, the source, the time it was saved, and an embedding
- The folder the session ran in, so results can be tied to a project

If a saved session grows and is judged `save` again, the next run replaces its row and its file. If the grown version is judged `review` or `discard`, the earlier row stays, and saving the session later adds a second row.

Capture also keeps sentences you typed yourself that state a decision or a rule. A sentence is kept only if it is found word for word in a message you wrote. Context packs show these as "You said".
