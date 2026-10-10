---
title: Configuration
url: https://getrift.dev/docs/configuration
summary: Rift reads one JSON file when the engine starts. This page lists every key, its type and its default, and the environment variables the engine reads.
last_updated: 2026-10-09
---

# Configuration

Rift reads one JSON file when the engine starts. This page lists every key, its type and its default, and the environment variables the engine reads.

## The file

| | |
|---|---|
| Location | `~/Library/Application Support/Rift/data/config.json` |
| Override | `--config <path>` on any command, or the `RIFT_CONFIG` environment variable |
| Format | JSON |
| Read | Once, when the engine starts. Restart the engine after a change. |
| Unknown keys | Rejected. A file with a key this version does not know fails to load. |

Restart the engine with:

```sh
launchctl kickstart -k gui/$UID/com.getrift.daemon
```

## The default file

This is what the installer writes. Capture and enrichment are off.

```json config.json
{
  "sources": [
    { "path": "~/Library/Application Support/Rift/data/inbox", "extraction": "cloud", "mode": "watch", "scope": "project" }
  ],
  "embedding": { "provider": "voyage", "model": "voyage-3-lite" },
  "data_paths": {
    "data_dir": "~/Library/Application Support/Rift/data",
    "jobs_dir": "~/Library/Application Support/Rift/jobs"
  },
  "rate_limit": { "window_ms": 60000, "max_requests": 100 },
  "capture": { "enabled": false, "interval_seconds": 3600, "sources": ["claude_code", "codex_cli"] },
  "enrichment": { "ai_metadata": false }
}
```

The real file holds absolute paths. They are shortened to `~` here.

## Keys

### sources

Folders whose documents Rift indexes. At least one is required. The default is the inbox.

| Key | Type | Default | Meaning |
|---|---|---|---|
| `sources[].path` | string | required | An absolute folder path |
| `sources[].extraction` | `"cloud"` or `"local"` | required | Where the text is embedded: with Voyage, or on your Mac with Ollama |
| `sources[].mode` | `"watch"` or `"scheduled_scan"` | required | Watch the folder for changes, or scan it on a schedule |
| `sources[].scope` | `"client"`, `"project"` or `"document"` | required | How results from this folder are grouped |
| `sources[].client_name` | string | none | Required when `scope` is `"client"` |
| `sources[].exclude` | string array | none | Relative paths inside the folder to skip |
| `scan.interval_seconds` | integer | `604800` | How often scheduled sources are scanned. The default is 7 days |

### capture

| Key | Type | Default | Meaning |
|---|---|---|---|
| `capture.enabled` | boolean | `false` | Turns scheduled Capture on |
| `capture.interval_seconds` | integer | `3600` | Seconds between runs |
| `capture.sources` | string array | `["claude_code", "codex_cli"]` | Any of `claude_code`, `codex_cli`, `cursor_composer`, `claude_desktop_sessions`, `grok_cli` |
| `capture.triage.provider` | `"codex_cli"` or `"claude_code"` | `"codex_cli"` | Which of your tools judges and summarises sessions |
| `capture.codex_cli.max_session_bytes` | integer | 8 MB | Codex sessions above this size are set aside |
| `capture.cursor.max_session_bytes` | integer | 4 MB | The same, for Cursor sessions |
| `codex_cli.model` | string | none | The Codex model to use, if your plan does not offer the default |

### embedding and enrichment

| Key | Type | Default | Meaning |
|---|---|---|---|
| `embedding.provider` | `"voyage"` | required | The embedding provider for Search by meaning |
| `embedding.model` | string | `"voyage-3-lite"` | The embedding model. A key provided by Rift sets this to `voyage-4-lite` |
| `embedding.base_url` | URL | Voyage's API | Another endpoint for the same API |
| `embedding.output_dimension` | integer | none | The vector size to request |
| `voyage.project_label` | string | none | A display name for the Voyage project |
| `enrichment.ai_metadata` | boolean | `false` | Let one of your tools write richer summaries on import |
| `enrichment.metadata.provider` | `"codex_cli"` or `"claude_code"` | `"codex_cli"` | Which tool writes them |
| `local_generation.enabled` | boolean | `false` | Use a local Ollama model for summaries and digests |
| `local_generation.runtime` | `"ollama"` | none | Required when enabled |
| `local_generation.mode` | `"strict_local_only"` | `"strict_local_only"` | The only mode. Summaries never leave the Mac |
| `local_generation.base_url` | URL | `"http://localhost:11434"` | Where Ollama listens |
| `local_generation.metadata_model` | string | none | Required when enabled |
| `local_generation.digest_model` | string | none | Required when enabled |

### server and limits

| Key | Type | Default | Meaning |
|---|---|---|---|
| `server.port` | integer | `3577` | The engine's port. The installer and `rift update` assume 3577 |
| `server.host` | `"127.0.0.1"` | `"127.0.0.1"` | Cannot be changed. The engine never listens on the network |
| `rate_limit.window_ms` | integer | required | The length of the rate-limit window |
| `rate_limit.max_requests` | integer | required | Requests allowed per window |
| `request_limits.json_body_limit_bytes` | integer | `10485760` | Largest JSON request, 10 MB |
| `request_limits.multipart_limit_bytes` | integer | `104857600` | Largest upload, 100 MB |
| `request_limits.read_timeout_ms` | integer | `30000` | Timeout for reads |
| `request_limits.mutation_timeout_ms` | integer | `120000` | Timeout for writes |

### storage and schedules

| Key | Type | Default | Meaning |
|---|---|---|---|
| `data_paths.data_dir` | string | `"data"` | Where the archive lives. A relative path is resolved from the config file's folder |
| `data_paths.jobs_dir` | string | `"jobs"` | Where the job queue lives |
| `compaction.age_threshold_days` | integer | `30` | Conversations older than this move to the cold table |

### Reserved and internal keys

The file accepts these keys, but you should not need them. They are listed so the reference is complete.

| Key | Type | Default | Status |
|---|---|---|---|
| `compaction.schedule` | cron string | `"0 2 * * 0"` | Reserved. Nothing reads it in this version. Compaction runs when you call `rift compact` |
| `cron.cron_enabled` | boolean | `false` | Reserved for scheduled jobs |
| `openai.max_cost_per_batch_usd` | number | `5` | Reserved. This version makes no call to OpenAI's API |
| `openai.max_parallel_requests` | integer | `4` | Reserved, as above |
| `auth.test_token` | string | none | Internal. For automated tests |

## Your Voyage key

If you use your own Voyage key for Search by meaning, it is kept in `~/.rift.env`, readable by you only, as `VOYAGE_API_KEY`. The engine loads that file when it starts. It reads three names from it and ignores the rest: `VOYAGE_API_KEY`, `ANTHROPIC_API_KEY` and `HUBSPOT_ACCESS_TOKEN`. Only the first is needed for anything on this page. Replace the key with:

```sh
rift onboard --reconfigure-voyage
```

## Environment variables

The engine is started by launchd, so it does not see what you export in your shell. To set a variable for the engine, add it to `EnvironmentVariables` in `~/Library/LaunchAgents/com.getrift.daemon.plist`. The package installer keeps those entries when you update.

| Variable | Purpose |
|---|---|
| `RIFT_CONFIG` | The config file the command line uses by default |
| `VOYAGE_API_KEY` | The embedding key. Without it, search is keyword only |
| `RIFT_CLAUDE_CLI_PATH` | The `claude` binary to use when Claude Code judges or summarises sessions |
| `CODEX_HOME` | Codex's home folder |
| `CLAUDE_CONFIG_DIR` | Claude Code's config folder |
| `RIFT_SWIFTBAR_PLUGIN_DIR` | SwiftBar's plugin folder, if it is not the default |
| `RIFT_POLICY_DISABLED` | `1` turns the Claude Code hook into a no-op |
| `RIFT_DISABLE_AI_METADATA` | `1` forces plain summaries, with no AI tool involved |
| `RIFT_DISABLE_WATCHERS` | `1` stops the engine from watching folders |

### Switches for features that are off by default

| Variable | Effect |
|---|---|
| `RIFT_CHUNKING` | `1` splits long conversations into passages when they are indexed |
| `RIFT_INDEX_CARDS` | `1` lets short cards for report files into search results |
| `RIFT_FEEDBACK_RANKING` | `1` lets recorded outcomes influence ranking |
| `RIFT_CONV_DEDUP` | `0` turns off the merging of duplicate conversations in results. On by default |
| `RIFT_CANONICAL_FILES` | `0` stops project tracker files from being read into context packs. On by default |
| `RIFT_RECEIPT` | `0` removes the one-line note about what Rift recalled from responses. On by default |

### Internal and development variables

You should not need these. They are listed so the reference is complete.

| Variable | Used by | Purpose |
|---|---|---|
| `RIFT_LOCATOR_BOOST`, `RIFT_LOCATOR_DEMOTE_EXCEPTION` | Engine | Ranking experiments |
| `RIFT_CURSOR_CAPTURE`, `RIFT_CURSOR_SHOW_TITLES` | Engine | One-off Cursor discovery, and showing Cursor session titles |
| `RIFT_KEY_RELAY_URL` | Engine | Another address for the key service |
| `RIFT_COMMIT` | Engine | The commit reported in build information |
| `RIFT_TRACE_WORKER`, `RIFT_TRACE_WORKER_PATH` | Engine | Tracing of worker processes |
| `NODE_ENV` | Engine | Set to `production` by the launch agent |
| `RIFT_SKIP_POSTINSTALL_MENUBAR`, `RIFT_POSTINSTALL_MENUBAR` | npm install | Whether the menu-bar step runs after an npm install |
| `RIFT_PACKAGE_SPEC`, `RIFT_SKIP_BOOTSTRAP`, `RIFT_INSTALL_DEBUG`, `RIFT_INSTALL_RESOLVE_ONLY`, `RIFT_HEALTH_TIMEOUT_S`, `RIFT_BOOTOUT_PORT_FREE_DECISECONDS` | Terminal installer | Which package to install, debugging, and timeouts |
| `RIFT_BASE_URL`, `RIFT_LOG_DIR`, `RIFT_CODEX_BIN` | Menu-bar item | Where the engine, the logs and Codex are |
| `RIFT_APP_HOME`, `RIFT_APP_NODE`, `RIFT_APP_CLI`, `RIFT_APP_CONFIG`, `RIFT_APP_LAUNCHD_LABEL` | Rift.app | Development and tests only |
