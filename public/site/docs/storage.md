---
title: Where data lives
url: https://onadit.com/docs/storage
summary: Everything Onadit stores is in 1 folder in your home directory, plus a few small files next to the tools it connects to.
last_updated: 2026-10-22
---

# Where data lives

Everything Onadit stores is in 1 folder in your home directory, plus a few small files next to the tools it connects to.

## The Onadit folder

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
| `config.json` | Settings. See [Configuration](https://onadit.com/docs/configuration.md). |
| `lancedb/` | The database: 1 table for recent conversations, 1 for older ones, plus digests and documents |
| `raw/conversations/<source>/` | The original payload of every conversation, 1 folder per source, and `inbox/` for exports dropped in the inbox. The index can be rebuilt from these. |
| `raw/digests/` | Digests written by `onadit compact` |
| `inbox/` | Drop an export here and Onadit imports it |
| `review-queue/` | Sessions Capture was unsure about. See [Capture](https://onadit.com/docs/capture.md#the-review-queue). |
| `quarantine/` | Sessions that were too large or unreadable |
| `capture-state.gen/` | Which sessions Capture has already seen. `capture-state.json` next to it is a copy for reading: editing it changes nothing |
| `.internal/` | The Codex model Capture picked for each level |
| `embeddings/` | A cache of embeddings, when Search by meaning is on |
| `briefs/`, `project-index.json` | Prepared project briefs and the map from sessions to projects |
| `observability/` | Local logs: capture runs, index and embedding events, which MCP tools were called, the update check |
| `rift.pid` | The engine's process ID while it runs |

## The database

Onadit uses [LanceDB](https://lancedb.com), an embedded database. Nothing listens on the network for it.

| Table | Holds | Main columns |
|---|---|---|
| `conversations_hot` | Current conversations. Every save and import lands here | `id`, `content`, `summary`, `embedding`, `source`, `domain`, `intent`, `quality`, `topics`, `decisions`, `key_outputs`, `indexed_at`, `idempotency_key` |
| `conversations_cold` | Archived conversations older than 30 days. Filled only when you run `onadit compact`, which needs Search by meaning and Codex or local enrichment. Nothing runs it on its own | Same as above |
| `digests` | Summaries written by `onadit compact` | `id`, `content`, `summary`, `embedding`, `period_start`, `period_end`, `digest_type` |
| `structured_docs` | Documents from folders you asked Onadit to index | `id`, `source_path`, `content`, `embedding`, `source_type`, `source_scope`, `indexed_at` |
| `structured_docs_local` | The same, for sources embedded on your Mac | Same as above |

Embeddings have 512 dimensions, or 768 for sources embedded on your Mac. A conversation imported with Search by meaning off is stored with an empty vector and found by keyword. When you turn Search by meaning on in Onadit.app, the whole archive is embedded once.

## Outside the Onadit folder

| Path | Holds |
|---|---|
| `~/Applications/Onadit.app` | The app |
| `~/.rift/bin/onadit` | The command line, on a package install. `~/.rift/bin/rift` is the same command under its earlier name |
| npm's global folder | The `onadit` package, on a terminal install |
| `~/Library/LaunchAgents/com.getrift.daemon.plist` | The launch agent |
| `~/Library/Logs/Rift/` | Engine logs, on a package install |
| `~/Library/Application Support/SwiftBar/Plugins/rift.10s.sh` | The menu-bar plugin, with its helper in `.rift-menu/` next to it |
| `~/.rift.env` | Your Voyage key, if you saved one. Readable by you only. |
| macOS Keychain, service `com.getrift.daemon` | The tokens the command line and the app use to talk to the engine |
| `~/Library/Application Support/Claude/claude_desktop_config.json` | An `onadit` entry, if you connected Claude |
| `~/.claude.json` | An `onadit` entry, if you connected Claude Code |
| `~/.codex/config.toml` | An `onadit` entry, if you connected Codex |
| `~/.cursor/mcp.json` | An `onadit` entry, if you connected Cursor |
| `~/.claude/settings.json` and `~/.claude/hooks/rift-policy.mjs` | Onadit's hooks, if you turned them on for Claude Code |
| `~/.codex/hooks.json` | Onadit's hooks, if you turned them on for Codex |

## Folders Onadit reads and never changes

| Folder | Read by |
|---|---|
| `~/.claude/projects/` | Capture, for Claude Code sessions |
| `~/.codex/sessions/` and `~/.codex/archived_sessions/` | Capture, for Codex sessions |
| `~/Library/Application Support/Claude/local-agent-mode-sessions/` | Capture, only if you opt in to Cowork sessions |
| `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` | Capture, only if you add Cursor to `capture.sources` |
| `~/.grok/` | Capture, only if you opt in to Grok CLI sessions |

## Back up or move the archive

The archive is ordinary files in `~/Library/Application Support/Rift/data/`. To keep it somewhere else, stop the engine, move everything in `data/` except `config.json` to the new place, set `data_paths.data_dir` in `config.json` to that folder's absolute path, then start the engine. `config.json` itself stays where it is. Onadit does not move the files for you: without them, the engine starts on an empty archive.

```sh
launchctl bootout gui/$UID/com.getrift.daemon
# move the files and edit config.json, then:
launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.getrift.daemon.plist
```
