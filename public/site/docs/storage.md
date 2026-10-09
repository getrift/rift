---
title: Where data lives
url: https://getrift.dev/docs/storage
summary: Everything Rift stores is in one folder in your home directory, plus a few small files next to the tools it connects to.
last_updated: 2026-10-09
---

# Where data lives

Everything Rift stores is in one folder in your home directory, plus a few small files next to the tools it connects to.

## The Rift folder

`~/Library/Application Support/Rift/`

| Path | Holds |
|---|---|
| `data/` | Your archive and settings. Described below. |
| `jobs/` | The job queue: `queue.json` and `payloads/` |
| `app/`, `node/` | The engine and its runtime. Package installs only. |
| `logs/` | Engine logs. Terminal installs only. Package installs log to `~/Library/Logs/Rift/`. |

## Inside data/

| Path | Holds |
|---|---|
| `config.json` | Settings. See [Configuration](https://getrift.dev/docs/configuration.md). |
| `lancedb/` | The database: one table for recent conversations, one for older ones, plus digests and documents |
| `raw/conversations/<source>/` | The original payload of every conversation, one folder per source. The index can be rebuilt from these. |
| `raw/digests/` | Weekly digests, when enrichment is on |
| `inbox/` | Drop an export here and Rift imports it |
| `review-queue/` | Sessions Capture was unsure about. See [Capture](https://getrift.dev/docs/capture.md#the-review-queue). |
| `quarantine/` | Sessions that were too large or unreadable |
| `capture-state.json` | Which sessions Capture has already seen |
| `embeddings/` | A cache of embeddings, when Search by meaning is on |
| `briefs/`, `project-index.json` | Prepared project briefs and the map from sessions to projects |
| `observability/` | Local logs: capture runs, index and embedding events, which MCP tools were called, the update check |
| `rift.pid` | The engine's process ID while it runs |

## The database

Rift uses [LanceDB](https://lancedb.com), an embedded database. Nothing listens on the network for it.

| Table | Holds | Main columns |
|---|---|---|
| `conversations_hot` | Current conversations. Every save and import lands here | `id`, `content`, `summary`, `embedding`, `source`, `domain`, `intent`, `quality`, `topics`, `decisions`, `key_outputs`, `indexed_at`, `idempotency_key` |
| `conversations_cold` | Archived conversations: those older than 30 days, once `rift compact` has run | Same as above |
| `digests` | Weekly summaries | `id`, `content`, `summary`, `embedding`, `period_start`, `period_end`, `digest_type` |
| `structured_docs` | Documents from folders you asked Rift to index | `id`, `source_path`, `content`, `embedding`, `source_type`, `source_scope`, `indexed_at` |
| `structured_docs_local` | The same, for sources embedded on your Mac | Same as above |

Embeddings have 512 dimensions. A conversation imported with Search by meaning off is stored with an empty vector and found by keyword.

## Outside the Rift folder

| Path | Holds |
|---|---|
| `~/Applications/Rift.app` | The app |
| `~/.rift/bin/rift` | The command line |
| `~/Library/LaunchAgents/com.getrift.daemon.plist` | The launch agent |
| `~/Library/Logs/Rift/` | Engine logs |
| `~/.rift.env` | Your Voyage key, if you saved one. Readable by you only. |
| macOS Keychain, service `com.getrift.daemon` | The tokens the command line and the app use to talk to the engine |
| `~/Library/Application Support/Claude/claude_desktop_config.json` | A `rift` entry, if you connected Claude |
| `~/.claude.json` | A `rift` entry, if you connected Claude Code |
| `~/.codex/config.toml` | A `rift` entry, if you connected Codex |
| `~/.cursor/mcp.json` | A `rift` entry, if you connected Cursor |

## Folders Rift reads and never changes

| Folder | Read by |
|---|---|
| `~/.claude/projects/` | Capture, for Claude Code sessions |
| `~/.codex/sessions/` and `~/.codex/archived_sessions/` | Capture, for Codex sessions |
| `~/Library/Application Support/Claude/local-agent-mode-sessions/` | Capture, only if you opt in to Cowork sessions |
| `~/.grok/` | Capture, only if you opt in to Grok CLI sessions |

## Back up or move the archive

The archive is ordinary files in `~/Library/Application Support/Rift/data/`. To keep it somewhere else, set `data_paths.data_dir` in `config.json` and restart the engine. The engine reads its settings once, when it starts.
