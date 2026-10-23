---
title: Command line
url: https://onadit.com/docs/cli
summary: Every onadit command, with its options. On a package install the command lives at ~/.rift/bin/onadit.
last_updated: 2026-10-22
---

# Command line

Every onadit command, with its options. On a package install the command lives at ~/.rift/bin/onadit.

## Where the command is

A package install puts the command at `~/.rift/bin/onadit` and leaves your `PATH` alone. A terminal install puts it in npm's global folder and, if `onadit` is not already on your `PATH`, links `~/.local/bin/onadit` and adds that folder to your `PATH` in `~/.zshrc`. To type `onadit` on its own after a package install:

```sh
export PATH="$HOME/.rift/bin:$PATH"
```

`rift`, the command's name before Onadit was renamed, still works and runs the same command.

In the usage lines below, `<angle brackets>` mark a value you must give, and `[square brackets]` mark something optional. An option shown outside square brackets is required.

## Global options

These work with every command, with the exceptions noted for `--json`.

| Option | Effect |
|---|---|
| `--config <path>` | Use another `config.json`. Default: `~/Library/Application Support/Rift/data/config.json`, or `RIFT_CONFIG` if set |
| `--json` | Print the result as JSON. Ignored by `onboard`, `setup`, `mcp install`, `hooks`, `feedback` and `token issue`, which print text. `uninstall` prints its text lines too, then the JSON |
| `-V`, `--version` | Print the version |
| `-h`, `--help` | Print help for the command |

## Everyday commands

### onadit status

Shows what the engine is doing, in about 12 lines, and 1 next action.

```sh
onadit status [--tools] [--no-capability-map] [--json]
```

| Option | Effect |
|---|---|
| `--tools` | Also print the guide your agents see |
| `--no-capability-map` | With `--json`, leave that guide out. For scripts that poll often |

The lines are explained in [Troubleshooting](https://onadit.com/docs/troubleshooting.md#what-onadit-status-prints).

### onadit doctor

Checks the same things as `status`, names what is wrong in plain language, and gives 1 action. `onadit doctor` on its own only reads. It exits with code 1 when something is broken.

```sh
onadit doctor [--copy-prompt] [--target claude|codex]
onadit doctor repair capture-large-sessions [--dry-run] [--chunk-bytes <bytes>]
```

| Option | Effect |
|---|---|
| `--copy-prompt` | Builds a repair prompt with private details removed, copies it, and prints it, so you can hand the problem to an agent |
| `--target <assistant>` | Which assistant the prompt is written for: `claude` (default) or `codex` |
| `repair capture-large-sessions` | Saves the Codex sessions that were too large for Capture. Codex summarises each one in pieces, and it is saved as 1 conversation. `--dry-run` shows what would be saved |

### onadit search

Searches the archive from the terminal. It is the same search your agents use.

```sh
onadit search "why did we drop the queue" --scope conversations --top-k 5
```

| Option | Effect |
|---|---|
| `--scope <scope>` | `all`, `clients`, `projects`, `conversations` or `documents` |
| `--client <name>` | Only files from 1 client's folder. Conversations are not filtered |
| `--since <time>` | Only results indexed on or after this UTC time, written in full, such as `2026-10-01T00:00:00Z`. A date alone is refused |
| `--top-k <n>` | How many results |
| `--detail <level>` | `summary` (default), `middle` (the start and end of the text) or `full` |
| `--id <id>` | With `middle` or `full`, fetch 1 result by its ID |
| `--tier <tier>` | With `--id`: `hot`, `cold`, `digest`, `document` or `structured_doc` |
| `--source-table <name>` | With `--id`: the table the row lives in |

### onadit brief

Prints the project brief Onadit has prepared for a folder.

```sh
onadit brief [--cwd <dir>] [--hook]
```

`--hook` is for the SessionStart hook of Claude Code or Codex. It reads the hook payload on standard input.

### onadit setup

Opens Onadit.app to import chats and connect your tools. If the app is not installed, or with `--browser`, it opens the private setup page in your browser instead.

### onadit onboard

Does the same in the terminal, in 3 steps: add an archive, find something in it, connect a tool.

Some options start a longer setup instead, for Search by meaning, Capture, enrichment and feedback: `--advanced`, and the Voyage, Capture, enrichment, `--with-claude-hook` and feedback options in the table. The longer setup ignores `--query`, `--client` and `--source`, connects no tool, and imports ChatGPT exports only. Use `onadit import` for the others.

```sh
onadit onboard
onadit onboard --import-export ~/Downloads/export.zip --query "pricing" --client claude-code
```

| Option | Effect |
|---|---|
| `--import-export <path>` | Import this export (`.zip` or `.json`) without asking |
| `--no-import-export` | Skip the import step |
| `--source <name>` | The export's source, when it cannot be detected: `chatgpt_web`, `claude_web`, `gemini_web` or `grok_web`. 3-step setup only |
| `--query <words>` | What to look for after the import. 3-step setup only |
| `--client <name>` | The tool to connect: `claude-desktop`, `claude-code`, `codex` or `cursor`. 3-step setup only |
| `--yes` | Accept every default, for scripts |
| `--advanced` | Run the longer setup instead of the 3 steps: Voyage key, Capture, enrichment and feedback. On a Mac that already has a Voyage key, `--advanced` alone says so and stops |
| `--enable-capture` | Turn scheduled Capture on. Asks whether Claude Code or Codex reads your sessions. Needs a Voyage key: without one it is ignored |
| `--capture-worker <tool>` | `claude` or `codex`: answers that question, or switches the tool when Capture is already on. Required with `--yes` until a tool has been chosen |
| `--capture-level <level>` | `balanced` (the default) or `fast` |
| `--enable-grok-capture` | Add Grok CLI sessions to Capture, and turn Capture on. Needs a Voyage key |
| `--enable-cowork-capture` | Add Claude desktop agent sessions to Capture, and turn Capture on. Needs a Voyage key |
| `--no-codex-capture` | Skip the Capture check for this run |
| `--voyage-key <key>` | Save your own Voyage key for Search by meaning |
| `--no-voyage-key` | Finish with keyword search only |
| `--reconfigure-voyage` | Replace the saved Voyage key and nothing else |
| `--voyage-label <label>` | A display name for the Voyage project |
| `--enable-codex-enrichment` | Let Codex write richer summaries and weekly digests |
| `--enable-claude-enrichment` | Let Claude Code write richer summaries. Cannot be combined with the Codex option |
| `--with-claude-hook`, `--no-claude-hook` | In the longer setup: install, or skip, the Claude Code check before Onadit's tools. It does not add the session brief. The 3-step setup offers the hooks either way |
| `--skip-capture` | For tests. Skips the first Capture run after setup |
| `--enable-feedback-relay <url>`, `--no-feedback-relay`, `--invite <code>`, `--email <address>` | Feedback options, for people who were invited to send feedback. `--enable-feedback-relay` also needs the signing secret an invite gives. `--email` only saves your address on this Mac: nothing is sent without a relay |

## History

### onadit import

Imports an export from a chat app. See [Import](https://onadit.com/docs/import.md).

```sh
onadit import <file> [--source <source>] [--no-sniff] [--idempotency-key <key>]
onadit import ~/Downloads/chatgpt-export.zip
onadit import ~/Downloads/claude-export.zip --source claude_web
```

| Option | Effect |
|---|---|
| `--source <source>` | `chatgpt_web` (default), `claude_web`, `gemini_web` or `grok_web` |
| `--no-sniff` | Do not inspect the archive to check its source. Trust `--source` |
| `--idempotency-key <key>` | A key that makes a repeated import a no-op |

### onadit capture

Runs Capture once, now. See [Capture](https://onadit.com/docs/capture.md).

```sh
onadit capture [--dry-run] [--source <source>] [--claude-dir <path>] [--codex-dir <path>] [--cursor-dir <path>]
onadit capture recover-quarantine [--dry-run] [--chunk-bytes <bytes>]
```

| Option | Effect |
|---|---|
| `--dry-run` | Judge sessions but save nothing and change no state. Before a source's first real run, that means every session already on your Mac, each time you run it |
| `--source <source>` | Only 1 source: `claude_code`, `codex_cli`, `cursor_composer`, `claude_desktop_sessions` or `grok_cli` |
| `--claude-dir <path>` | Where Claude Code keeps its files |
| `--codex-dir <path>` | Where Codex keeps its files |
| `--cursor-dir <path>` | Cursor's application-support folder |
| `recover-quarantine` | Subcommand. Saves the Codex sessions that were too large for Capture: Codex summarises each one in pieces, and it is saved as 1 conversation. `--dry-run` shows what would be saved. `--chunk-bytes <bytes>` sets the piece size (default 524288) |

### onadit review

Manages the sessions Capture was unsure about.

```sh
onadit review list --min-confidence 0.6 --sort-by confidence --order desc
onadit review promote <id>
onadit review discard <id>
onadit review promote-many --source codex_cli --limit 20
onadit review discard-many --max-confidence 0.3
```

| Option | Applies to | Effect |
|---|---|---|
| `--source <source>` | list, promote-many, discard-many | Only 1 source |
| `--min-confidence <n>`, `--max-confidence <n>` | list, promote-many, discard-many | A confidence range, from 0 to 1 |
| `--topic <topic>` | list, promote-many, discard-many | Only 1 topic |
| `--queued-after <iso>`, `--queued-before <iso>` | list, promote-many, discard-many | A time range |
| `--search <text>` | list, promote-many, discard-many | Text in the summary, topics, source or project |
| `--sort-by <field>` | list, promote-many, discard-many | Sort by `queued` (the default), `confidence` or `source` |
| `--order <direction>` | list, promote-many, discard-many | `asc` or `desc`. By default the newest or the highest confidence comes first, and sources go from A to Z |
| `--page <n>`, `--per-page <n>` | list | Paging. 50 per page by default |
| `--ids <a,b,c>` | promote-many, discard-many | Act on these IDs |
| `--limit <n>` | promote-many, discard-many | Act on the first N matches only |

### onadit save

Saves 1 session or note. Agents normally do this through the `onadit_save` tool. See [Save from an agent](https://onadit.com/docs/save.md).

```sh
onadit save --source <source> --summary <text> [options]
onadit save --source claude_code --summary "Chose the queue over cron" --content-file session.txt
```

| Option | Effect |
|---|---|
| `--source <source>` | Required. `claude_code`, `gemini_cli` or `codex_cli` |
| `--summary <text>` | Required. A summary of the session |
| `--content <text>`, `--content-file <path>`, `--stdin` | The full transcript, given inline, from a file, or on standard input |
| `--domain <domain>` | 1 of `business`, `tech`, `personal`, `travel`, `health`, `finance` or `creative` |
| `--decisions <items>`, `--key-outputs <items>`, `--topics <items>` | Comma-separated lists |
| `--idempotency-key <key>` | A key that makes a repeated save a no-op |
| `--replace-idempotency-key <key>` | The key of an earlier save to replace |

### onadit backfill

Stages and imports a folder of web exports in 1 run.

```sh
onadit backfill --batch <path> --source <source> [options]
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

### onadit bulk-ingest

Imports every supported file in a folder.

```sh
onadit bulk-ingest --source <source> --dir <path> [--idempotency-prefix <prefix>]
```

| Option | Effect |
|---|---|
| `--source <source>` | Required. The source of every file in the folder, for example `chatgpt_web` |
| `--dir <path>` | Required. The folder |
| `--idempotency-prefix <prefix>` | A prefix for the keys that make a repeated run a no-op |

### onadit triage

Submits a folder of conversation files to be judged. Results land in `data/triage-results/`.

```sh
onadit triage --dir <path> [--idempotency-key <key>]
```

### onadit ingest

An older form of `onadit import`. Both options are required.

```sh
onadit ingest --source <source> --file <path> [--idempotency-key <key>]
```

### onadit cursor-probe

Lists the Cursor sessions Onadit could capture. It reads only and saves nothing.

```sh
onadit cursor-probe [--dir <path>] [--show-titles] [--show-provenance]
```

| Option | Effect |
|---|---|
| `--dir <path>` | Cursor's application-support folder, if it is not the default |
| `--show-titles` | Show session titles. They are your own words and may reveal private content |
| `--show-provenance` | Show how each session would be recorded |

## Agents

### onadit mcp install

Adds Onadit to an MCP client's config file. See [Connect an agent](https://onadit.com/docs/connect.md).

```sh
onadit mcp install --client <id> [--dry-run] [--with-hooks | --no-hooks] [--new-names]
onadit mcp install --all [--dry-run]
```

| Option | Effect |
|---|---|
| `--client <id>` | `claude-desktop`, `codex`, `claude-code` or `cursor` |
| `--all` | All 4 supported clients, whether or not they are installed. A missing config file is created |
| `--dry-run` | Print the change without writing it |
| `--with-hooks` | For Claude Code and Codex: also install the session hooks, without asking |
| `--no-hooks` | Do not offer the session hooks |
| `--new-names` | Move a connection made under the earlier `rift` names to the current ones. Rules written for the earlier tool names stop applying to it |

In a terminal, after connecting Claude Code or Codex, the command asks whether to turn on the session hooks described below.

### onadit hooks

Installs or removes the optional hooks for Claude Code or Codex. 1 asks the agent to call `onadit_context_pack` before an open-ended search, and 1 hands it a project brief when a session starts. Codex runs them only after you review them once with `/hooks` in Codex.

```sh
onadit hooks install --client <claude-code|codex> [--dry-run] [--no-session-brief]
onadit hooks remove --client <claude-code|codex>
```

| Option | Effect |
|---|---|
| `--client <id>` | Required. `claude-code` or `codex` |
| `--dry-run` | With `install`: print the outcome without writing it |
| `--no-session-brief` | With `install`: leave out the session-start brief |

`remove` takes Onadit's hooks back out, backs up the settings file first, and prints the backup ID.

## Maintenance

`reindex`, `reconcile`, `rebuild` and `compact` need a Voyage key, which Search by meaning sets. Without one, they stop with an "unavailable" error.

### onadit stats

Prints row counts per table. No options.

### onadit compact

Moves conversations older than 30 days to the archive table and writes 1 digest of them. It needs a Voyage key and Codex enrichment (`onadit onboard --enable-codex-enrichment`) or local generation. Without them it stops with "POST /compact unavailable". It runs only when you call it.

```sh
onadit compact [--dry-run] [--rollback] [--idempotency-key <key>]
```

| Option | Effect |
|---|---|
| `--dry-run` | Report what would move. Change nothing |
| `--rollback` | Undo the most recent compaction |
| `--idempotency-key <key>` | A key that makes a repeated run a no-op |

### onadit reindex

Rebuilds the search indexes from the raw files. `--scope` is required, and `--rebuild` works only with `--scope all`.

```sh
onadit reindex --scope <scope> [--idempotency-key <key>]
onadit reindex --scope all --rebuild [--idempotency-key <key>]
onadit reindex --scope conversations
```

| Option | Effect |
|---|---|
| `--scope <scope>` | Required. `all`, `conversations`, `documents` or `structured_docs` |
| `--rebuild` | Rebuild in full behind a shadow table, then swap it in. Only with `--scope all`. With another scope the command stops with "--rebuild requires --scope all" |
| `--idempotency-key <key>` | A key that makes a repeated run a no-op |

### onadit reconcile

Checks the index against the raw files and repairs gaps.

```sh
onadit reconcile [--idempotency-key <key>]
onadit reconcile --dedupe-conversations [--apply]
```

| Option | Effect |
|---|---|
| `--dedupe-conversations` | Look for duplicate conversations and report them, in place of the normal checks |
| `--apply` | With `--dedupe-conversations`, delete the duplicates and their raw files. Without it, nothing is deleted |
| `--idempotency-key <key>` | A key that makes a repeated run a no-op |

### onadit rebuild

Rebuilds every table from the raw files.

```sh
onadit rebuild [--offline]
```

`--offline` runs without the engine, which must be stopped first. It needs `VOYAGE_API_KEY` set in your shell: it does not read `~/.rift.env`.

### onadit update

Terminal installs: installs the latest version, restarts the engine, and checks that the running engine reports the new version. Package installs: changes nothing and tells you to download the package. No options. See [Update](https://onadit.com/docs/install.md#update).

### onadit uninstall

```sh
onadit uninstall [--purge-data [-y | --yes]] [--notify]
```

See [Remove Onadit](https://onadit.com/docs/remove.md) for what each option does.

### onadit token issue

Issues a new access token, stores it in the Keychain, tells the engine, and prints it. No options.

### onadit menubar install

Installs or refreshes the menu-bar plugin. The item shows once SwiftBar is installed.

```sh
onadit menubar install [--plugin-dir <path>] [--symlink] [--yes]
```

| Option | Effect |
|---|---|
| `--plugin-dir <path>` | SwiftBar's plugin folder, if it is not the default |
| `--symlink` | Link to the packaged files instead of copying them. For development checkouts |
| `--yes` | Accepted for install scripts. The command never asks anything |

### onadit feedback

Stores a note in a local file. It is sent to us only if you were invited to send feedback and accepted.

```sh
onadit feedback [--kind <kind>] [--with-status] <note>
onadit feedback --history
onadit feedback setup [--invite <code>]
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
| `onadit chunk-backfill [--dry-run] [--limit <n>] [--throttle-ms <ms>] [--allow-uncertified-copy]` | For Onadit's maintainers. Re-splits old conversations into passages, with the engine stopped |
| `onadit uninstall --result-file <path>` | Hidden. Lets Onadit.app read the outcome of a removal |
| `onadit setup --app-session` | Hidden. Hands Onadit.app a setup session |
| `onadit mcp refresh [--leaving <dir>] [--dry-run]` | Hidden. The installers run it after an upgrade to point existing connections and hooks at the new build. It creates none |
| `onadit onboard --relay-secret <secret>`, `--allow-unsigned-feedback-relay` | Hidden. For the feedback relay |
