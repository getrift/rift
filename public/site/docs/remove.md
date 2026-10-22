---
title: Remove Onadit
url: https://onadit.com/docs/remove
summary: Removing Onadit from the app deletes your archive. Removing it from the command line keeps the archive unless you ask otherwise.
last_updated: 2026-10-22
---

# Remove Onadit

Removing Onadit from the app deletes your archive. Removing it from the command line keeps the archive unless you ask otherwise.

## From the app

Onadit.app and the setup page have a Remove Onadit action. It always deletes the archive. It runs the command below with `--purge-data`.

## From the command line

```sh
onadit uninstall               # stops Onadit, keeps your archive
onadit uninstall --purge-data  # also deletes the archive, after you type DELETE
```

| Flag | Effect |
|---|---|
| `--purge-data` | Also deletes `~/Library/Application Support/Rift/`, then your saved key and tokens |
| `-y`, `--yes` | Skips the `DELETE` confirmation. Only with `--purge-data` |
| `--notify` | Writes a log to `~/Library/Logs/Rift/` and shows the result on screen |
| `--json` | Also prints the outcome as JSON, after the text lines |

The command exits with code 1 if any step failed, and lists what is left with the commands to remove it by hand.

## What happens, in order

1. The engine is stopped
2. The launch agent is backed up, then deleted
3. Onadit's entry is removed from Claude, Claude Code, Codex and Cursor, each config file backed up first
4. Onadit's hooks are removed from Claude Code and Codex, each settings file backed up first, and `~/.claude/hooks/rift-policy.mjs` is deleted
5. With `--purge-data` only: `~/Library/Application Support/Rift/` is deleted
6. If that worked: `~/.rift.env` and Onadit's Keychain tokens are deleted
7. In every case: the command-line shim, the menu-bar plugin files and `~/Applications/Onadit.app` are deleted

## What is kept without --purge-data

- `~/Library/Application Support/Rift/`, which holds your archive, the job queue and the engine files
- `~/.rift.env`, if you saved a Voyage key (the command tells you how to delete it)
- Onadit's tokens in the Keychain

The `onadit` command itself is gone after this. To delete the archive later, remove the folder, `~/.rift.env` and the Keychain items by hand.

## What is never removed

These are left in place in every mode. Delete them by hand if you want a clean machine.

| Left behind | Where |
|---|---|
| Logs | `~/Library/Logs/Rift/` |
| Launch agent backups | `~/Library/LaunchAgents/com.getrift.daemon.plist.bak.*` |
| Backups of your MCP config and hook settings files | Next to each file, named `<file>.bak.*` |
| Terminal-install leftovers | `~/.local/bin/onadit`, the `PATH` block in `~/.zshrc`, and the global npm package |
| SwiftBar | Wherever you installed it |

> If you moved the data folder with `data_paths.data_dir`, `--purge-data` does not delete it. It only deletes the default folder.
