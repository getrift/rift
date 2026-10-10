---
title: Command line
url: https://getrift.dev/docs/cli
summary: Every rift command, with its options. On a package install the command lives at ~/.rift/bin/rift.
last_updated: 2026-10-10
---

# Command line

Every rift command, with its options. On a package install the command lives at ~/.rift/bin/rift.

## Where the command is

A package install puts the command at `~/.rift/bin/rift` and leaves your `PATH` alone. A terminal install links `~/.local/bin/rift` and adds that folder to your `PATH`. To type `rift` on its own after a package install:

```sh
export PATH="$HOME/.rift/bin:$PATH"
```

In the usage lines below, `<angle brackets>` mark a value you must give, and `[square brackets]` mark something optional. An option shown outside square brackets is required.

## Global options

These work with every command.

| Option | Effect |
|---|---|
| `--config <path>` | Use another `config.json`. Default: `~/Library/Application Support/Rift/data/config.json`, or `RIFT_CONFIG` if set |
| `--json` | Print the result as JSON |
| `-V`, `--version` | Print the version |
| `-h`, `--help` | Print help for the command |

## Everyday commands

### rift status

Shows what the engine is doing, in about 12 lines, and 1 next action.

```sh
rift status [--tools] [--no-capability-map] [--json]
```

| Option | Effect |
|---|---|
| `--tools` | Also print the guide your agents see |
| `--no-capability-map` | With `--json`, leave that guide out. For scripts that poll often |

The lines are explained in [Troubleshooting](https://getrift.dev/docs/troubleshooting.md#what-rift-status-prints).

### rift doctor

Checks the same things as `status`, names what is wrong in plain language, and gives 1 action. It only reads. It exits with code 1 when something is broken.

```sh
rift doctor [--copy-prompt] [--target claude|codex]
rift doctor repair capture-large-sessions [--dry-run] [--chunk-bytes <bytes>]
```

| Option | Effect |
|---|---|
| `--copy-prompt` | Builds a repair prompt with private details removed, copies it, and prints it, so you can hand the problem to an agent |
| `--target <assistant>` | Which assistant the prompt is written for: `claude` (default) or `codex` |
| `repair capture-large-sessions` | Saves sessions that were too large for Capture, in pieces. `--dry-run` shows what would be saved |

### rift search

Searches the archive from the terminal. It is the same search your agents use.

```sh
rift search "why did we drop the queue" --scope conversations --top-k 5
```

| Option | Effect |
|---|---|
| `--scope <scope>` | `all`, `clients`, `projects`, `conversations` or `documents` |
| `--client <name>` | Only results for 1 client name |
| `--since <date>` | Only results indexed after an ISO-8601 date |
| `--top-k <n>` | How many results |
| `--detail <level>` | `summary` (default), `middle` (the start and end of the text) or `full` |
| `--id <id>` | With `middle` or `full`, fetch 1 result by its ID |
| `--tier <tier>` | With `--id`: `hot`, `cold`, `digest`, `document` or `structured_doc` |
| `--source-table <name>` | With `--id`: the table the row lives in |

### rift brief

Prints the project brief Rift has prepared for a folder.

```sh
rift brief [--cwd <dir>] [--hook]
```

`--hook` is for Claude Code's SessionStart hook. It reads the hook payload on standard input.

### rift setup

Opens Rift.app to import chats and connect your tools. `--browser` opens the private setup page instead.

### rift onboard

Does the same in the terminal, in 3 steps: add an archive, find something in it, connect a tool.

```sh
rift onboard
rift onboard --import-export ~/Downloads/export.zip --query "pricing" --client claude-code
```

| Option | Effect |
|---|---|
| `--import-export <path>` | Import this export (`.zip` or `.json`) without asking |
| `--no-import-export` | Skip the import step |
| `--source <name>` | The export's source, when it cannot be detected: `chatgpt_web`, `claude_web`, `gemini_web` or `grok_web` |
| `--query <words>` | What to look for after the import |
| `--client <name>` | The tool to connect: `claude-desktop`, `claude-code`, `codex` or `cursor` |
| `--yes` | Accept every default, for scripts |
| `--advanced` | Also set up Search by meaning, Capture and feedback |
| `--enable-capture` | Turn scheduled Capture on |
| `--enable-grok-capture` | Add Grok CLI sessions to Capture |
| `--enable-cowork-capture` | Add Claude desktop agent sessions to Capture |
| `--no-codex-capture` | Skip the Capture check for this run |
| `--voyage-key <key>` | Save your own Voyage key for Search by meaning |
| `--no-voyage-key` | Finish with keyword search only |
| `--reconfigure-voyage` | Replace the saved Voyage key and nothing else |
| `--voyage-label <label>` | A display name for the Voyage project |
| `--enable-codex-enrichment` | Let Codex write richer summaries and weekly digests |
| `--enable-claude-enrichment` | Let Claude Code write richer summaries. Cannot be combined with the Codex option |
| `--with-claude-hook`, `--no-claude-hook` | Install, or skip, the Claude Code hook |
| `--skip-capture` | For tests. Skips the first Capture run after setup |
| `--enable-feedback-relay <url>`, `--no-feedback-relay`, `--invite <code>`, `--email <address>` | Feedback options, for people who were invited to send feedback |

## History

### rift import

Imports an export from a chat app. See [Import](https://getrift.dev/docs/import.md).

```sh
rift import <file> [--source <source>] [--no-sniff] [--idempotency-key <key>]
rift import ~/Downloads/chatgpt-export.zip
rift import ~/Downloads/claude-export.zip --source claude_web
```

| Option | Effect |
|---|---|
| `--source <source>` | `chatgpt_web` (default), `claude_web`, `gemini_web` or `grok_web` |
| `--no-sniff` | Do not inspect the archive to check its source. Trust `--source` |
| `--idempotency-key <key>` | A key that makes a repeated import a no-op |

### rift capture

Runs Capture once, now. See [Capture](https://getrift.dev/docs/capture.md).

```sh
rift capture [--dry-run] [--source <source>] [--claude-dir <path>] [--codex-dir <path>] [--cursor-dir <path>]
rift capture recover-quarantine [--chunk-bytes <bytes>]
```

| Option | Effect |
|---|---|
| `--dry-run` | Judge sessions but save nothing and change no state |
| `--source <source>` | Only 1 source: `claude_code`, `codex_cli`, `cursor_composer`, `claude_desktop_sessions` or `grok_cli` |
| `--claude-dir <path>` | Where Claude Code keeps its files |
| `--codex-dir <path>` | Where Codex keeps its files |
| `--cursor-dir <path>` | Cursor's application-support folder |
| `recover-quarantine` | Subcommand. Saves oversized Codex sessions in pieces. `--chunk-bytes <bytes>` sets the piece size (default 524288) |

### rift review

Manages the sessions Capture was unsure about.

```sh
rift review list --min-confidence 0.6 --sort-by confidence --order desc
rift review promote <id>
rift review discard <id>
rift review promote-many --source codex_cli --limit 20
rift review discard-many --max-confidence 0.3
```

| Option | Applies to | Effect |
|---|---|---|
| `--source <source>` | list, promote-many, discard-many | Only 1 source |
| `--min-confidence <n>`, `--max-confidence <n>` | list, promote-many, discard-many | A confidence range, from 0 to 1 |
| `--topic <topic>` | list, promote-many, discard-many | Only 1 topic |
| `--queued-after <iso>`, `--queued-before <iso>` | list, promote-many, discard-many | A time range |
| `--search <text>` | list, promote-many, discard-many | Text in the summary, topics, source or project |
| `--sort-by <field>`, `--order <direction>` | list, promote-many, discard-many | Sort by `queued`, `confidence` or `source`, `asc` or `desc` |
| `--page <n>`, `--per-page <n>` | list | Paging. 50 per page by default |
| `--ids <a,b,c>` | promote-many, discard-many | Act on these IDs |
| `--limit <n>` | promote-many, discard-many | Act on the first N matches only |

### rift save

Saves 1 session or note. Agents normally do this through the `rift_save` tool. See [Save from an agent](https://getrift.dev/docs/save.md).

```sh
rift save --source <source> --summary <text> [options]
rift save --source claude_code --summary "Chose the queue over cron" --content-file session.txt
```

| Option | Effect |
|---|---|
| `--source <source>` | Required. `claude_code`, `gemini_cli` or `codex_cli` |
| `--summary <text>` | Required. A summary of the session |
| `--content <text>`, `--content-file <path>`, `--stdin` | The full transcript, given inline, from a file, or on standard input |
| `--domain <domain>` | A category |
| `--decisions <items>`, `--key-outputs <items>`, `--topics <items>` | Comma-separated lists |
| `--idempotency-key <key>` | A key that makes a repeated save a no-op |
| `--replace-idempotency-key <key>` | The key of an earlier save to replace |

### rift backfill

Stages and imports a folder of web exports in 1 run.

```sh
rift backfill --batch <path> --source <source> [options]
```

| Option | Effect |
|---|---|
| `--batch <path>` | Required. The folder of exports |
| `--source <source>` | Required. `chatgpt_web`, `claude_web`, `gemini_web` or `grok_web` |
| `--dry-run` | Check the folder and write its manifest, then stop without importing |
| `--force-unstaged` | Import files even if the check flagged them as junk |
| `--limit <count>` | Stop after the first N files that are not yet imported |
| `--provider <provider>` | Use this tool to judge and summarise, for this run only. Supported: `codex-cli` |
| `--triage-provider <provider>` | The same, for judging only |
| `--extraction-provider <provider>` | The same, for summaries only |

### rift bulk-ingest

Imports every supported file in a folder.

```sh
rift bulk-ingest --source <source> --dir <path> [--idempotency-prefix <prefix>]
```

| Option | Effect |
|---|---|
| `--source <source>` | Required. The source of every file in the folder, for example `chatgpt_web` |
| `--dir <path>` | Required. The folder |
| `--idempotency-prefix <prefix>` | A prefix for the keys that make a repeated run a no-op |

### rift triage

Submits a folder of conversation files to be judged. Results land in `data/triage-results/`.

```sh
rift triage --dir <path> [--idempotency-key <key>]
```

### rift ingest

An older form of `rift import`. Both options are required.

```sh
rift ingest --source <source> --file <path> [--idempotency-key <key>]
```

### rift cursor-probe

Lists the Cursor sessions Rift could capture. It reads only and saves nothing.

```sh
rift cursor-probe [--dir <path>] [--show-titles] [--show-provenance]
```

| Option | Effect |
|---|---|
| `--dir <path>` | Cursor's application-support folder, if it is not the default |
| `--show-titles` | Show session titles. They are your own words and may reveal private content |
| `--show-provenance` | Show how each session would be recorded |

## Agents

### rift mcp install

Adds Rift to an MCP client's config file. See [Connect an agent](https://getrift.dev/docs/connect.md).

```sh
rift mcp install --client <id> [--dry-run]
rift mcp install --all [--dry-run]
```

| Option | Effect |
|---|---|
| `--client <id>` | `claude-desktop`, `codex`, `claude-code` or `cursor` |
| `--all` | Every supported client |
| `--dry-run` | Print the change without writing it |

### rift hooks install

Installs the optional Claude Code hook.

```sh
rift hooks install --client claude-code [--dry-run] [--no-session-brief]
```

`--no-session-brief` leaves out the hook that hands Claude Code a project brief at the start of a session.

## Maintenance

### rift stats

Prints row counts per table. No options.

### rift compact

Moves conversations older than 30 days to the archive table and, with enrichment on, writes a weekly digest. It runs only when you call it.

```sh
rift compact [--dry-run] [--rollback] [--idempotency-key <key>]
```

| Option | Effect |
|---|---|
| `--dry-run` | Report what would move. Change nothing |
| `--rollback` | Undo the most recent compaction |
| `--idempotency-key <key>` | A key that makes a repeated run a no-op |

### rift reindex

Rebuilds the search indexes from the raw files. `--scope` is required, and `--rebuild` works only with `--scope all`.

```sh
rift reindex --scope <scope> [--idempotency-key <key>]
rift reindex --scope all --rebuild [--idempotency-key <key>]
rift reindex --scope conversations
```

| Option | Effect |
|---|---|
| `--scope <scope>` | Required. `all`, `conversations`, `documents` or `structured_docs` |
| `--rebuild` | Rebuild in full behind a shadow table, then swap it in. Only with `--scope all`. With another scope the command stops with "--rebuild requires --scope all" |
| `--idempotency-key <key>` | A key that makes a repeated run a no-op |

### rift reconcile

Checks the index against the raw files and repairs gaps.

```sh
rift reconcile [--idempotency-key <key>]
rift reconcile --dedupe-conversations [--apply]
```

| Option | Effect |
|---|---|
| `--dedupe-conversations` | Look for duplicate conversations and report them, in place of the normal checks |
| `--apply` | With `--dedupe-conversations`, delete the duplicates and their raw files. Without it, nothing is deleted |
| `--idempotency-key <key>` | A key that makes a repeated run a no-op |

### rift rebuild

Rebuilds every table from the raw files.

```sh
rift rebuild [--offline]
```

`--offline` runs without the engine, which must be stopped first.

### rift update

Terminal installs: installs the latest version, restarts the engine, and checks that the running engine reports the new version. Package installs: changes nothing and tells you to download the package. No options. See [Update](https://getrift.dev/docs/install.md#update).

### rift uninstall

```sh
rift uninstall [--purge-data [--yes]] [--notify]
```

See [Remove Rift](https://getrift.dev/docs/remove.md) for what each option does.

### rift token issue

Issues a new access token, stores it in the Keychain, tells the engine, and prints it. No options.

### rift menubar install

Installs or refreshes the menu-bar item. Needs SwiftBar.

```sh
rift menubar install [--plugin-dir <path>] [--symlink] [--yes]
```

| Option | Effect |
|---|---|
| `--plugin-dir <path>` | SwiftBar's plugin folder, if it is not the default |
| `--symlink` | Link to the packaged files instead of copying them. For development checkouts |
| `--yes` | Do not ask anything. For install scripts |

### rift feedback

Stores a note in a local file. It is sent to us only if you were invited to send feedback and accepted.

```sh
rift feedback [--kind <kind>] [--with-status] <note>
rift feedback --history
rift feedback setup [--invite <code>]
```

| Option | Effect |
|---|---|
| `--kind <kind>` | Tag the note: `worked`, `broke`, `surprised` or `idea` |
| `--with-status` | Attach a status snapshot, with paths and content removed |
| `--history` | Print the notes stored on this Mac |
| `setup --invite <code>` | Turn sending on, with the invite code you were given |

## Internal commands and options

These exist in the command line but are not meant for everyday use. They are listed so that nothing you see in `--help` is unexplained.

| Command or option | What it is for |
|---|---|
| `rift chunk-backfill [--dry-run] [--limit <n>] [--throttle-ms <ms>] [--allow-uncertified-copy]` | For Rift's maintainers. Re-splits old conversations into passages, with the engine stopped |
| `rift uninstall --result-file <path>` | Hidden. Lets Rift.app read the outcome of a removal |
| `rift setup --app-session` | Hidden. Hands Rift.app a setup session |
| `rift onboard --relay-secret <secret>`, `--allow-unsigned-feedback-relay` | Hidden. For the feedback relay |
