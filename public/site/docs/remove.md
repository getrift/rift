---
title: Remove Rift
url: https://getrift.dev/docs/remove
summary: Removing Rift from the app deletes your archive. Removing it from the command line keeps the archive unless you ask otherwise.
last_updated: 2026-10-09
---

# Remove Rift

Removing Rift from the app deletes your archive. Removing it from the command line keeps the archive unless you ask otherwise.

## From the app

Rift.app and the setup page have a Remove Rift action. It always deletes the archive. It runs the command below with `--purge-data`.

## From the command line

```sh
rift uninstall               # stops Rift, keeps your archive
rift uninstall --purge-data  # also deletes the archive, after you type DELETE
```

| Flag | Effect |
|---|---|
| `--purge-data` | Also deletes `~/Library/Application Support/Rift/`, then your saved key and tokens |
| `-y`, `--yes` | Skips the `DELETE` confirmation. Only with `--purge-data` |
| `--notify` | Writes a log to `~/Library/Logs/Rift/` and shows the result on screen |
| `--json` | Prints the outcome as JSON |

The command exits with code 1 if any step failed, and lists what is left with the commands to remove it by hand.

## What happens, in order

1. The engine is stopped.
2. The launch agent is backed up, then deleted.
3. The `rift` entry is removed from Claude, Claude Code, Codex and Cursor. Each config file is backed up first.
4. With `--purge-data` only: `~/Library/Application Support/Rift/` is deleted.
5. If that worked: `~/.rift.env` and Rift's Keychain tokens are deleted.
6. In every case: the command-line shim, the menu-bar plugin files and `~/Applications/Rift.app` are deleted.

## What is kept without --purge-data

- `~/Library/Application Support/Rift/`, which holds your archive, the job queue and the engine files.
- `~/.rift.env`, if you saved a Voyage key. The command tells you how to delete it.
- Rift's tokens in the Keychain.

## What is never removed

These are left in place in every mode. Delete them by hand if you want a clean machine.

| Left behind | Where |
|---|---|
| Logs | `~/Library/Logs/Rift/` |
| Launch agent backups | `~/Library/LaunchAgents/com.getrift.daemon.plist.bak.*` |
| Backups of your MCP config files | Next to each config file, ending in `.bak.<date>` |
| The optional Claude Code hook | `~/.claude/hooks/rift-policy.mjs` and its entries in `~/.claude/settings.json` |
| Terminal-install leftovers | `~/.local/bin/rift`, the `PATH` block in `~/.zshrc`, and the global npm package |
| SwiftBar | Wherever you installed it |

> If you moved the data folder with `data_paths.data_dir`, `--purge-data` does not delete it. It only deletes the default folder.
