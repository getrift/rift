---
title: Install
url: https://onadit.com/docs/install
summary: Onadit installs from a signed package into your home folder, with no admin password. It needs a Mac with Apple silicon and macOS 14 or later.
last_updated: 2026-10-22
---

# Install

Onadit installs from a signed package into your home folder, with no admin password. It needs a Mac with Apple silicon and macOS 14 or later.

## Requirements

| | |
|---|---|
| Chip | Apple silicon (`arm64`). The package does not install on Intel Macs. |
| System | macOS 14 or later, for Onadit.app. |
| Runtime | None to install. The package brings its own Node (20.20.2). |
| For Capture | Search by meaning turned on, and Claude Code or Codex signed in. Capture summarises sessions through one of them. See [Capture](https://onadit.com/docs/capture.md). |
| For the menu-bar item | [SwiftBar](https://swiftbar.app). Onadit does not install it. |

## Install the package

1. Download `Onadit.pkg` from https://onadit.com/download
2. Open it and follow the installer, which installs for your user only, so macOS does not ask for an admin password
3. When it finishes, Onadit.app opens so you can import chats and connect your AI tools, or a private setup page opens in your browser if the app is missing

Then follow the [Quickstart](https://onadit.com/docs/quickstart.md).

## What the installer does

In order:

1. Writes the command-line shim at `~/.rift/bin/onadit`, and `~/.rift/bin/rift` for the earlier name, without touching your shell profile or your `PATH`
2. Creates the data, inbox, jobs and log folders, and writes a first `config.json` if there is none
3. Stops if port 3577 is held by a process that is not Onadit
4. Stops any earlier Onadit engine, backs up its launch agent, and writes a new one
5. Carries your custom environment variables over from the earlier launch agent
6. Starts the engine and waits up to 30 seconds for it to answer on `http://127.0.0.1:3577/health`
7. If anything in steps 4 to 6 fails, restores the earlier launch agent and starts it again
8. Installs the menu-bar plugin, which shows once SwiftBar is installed
9. Updates the connections and hooks that an earlier version set up in your AI tools, backing up each file first, and adds none
10. Moves Onadit.app to `~/Applications/Onadit.app`
11. Opens Onadit

Step 7 brings back the earlier settings, not the earlier version: the new files are already in place by then. To go back to an older version, run its package.

## What it puts on your Mac

| Path | What it is |
|---|---|
| `~/Library/Application Support/Rift/node/` | The bundled Node runtime |
| `~/Library/Application Support/Rift/app/` | The engine |
| `~/Library/Application Support/Rift/data/` | Your archive and `config.json`. See [Where data lives](https://onadit.com/docs/storage.md). |
| `~/Library/Application Support/Rift/jobs/` | The job queue |
| `~/Applications/Onadit.app` | The app |
| `~/.rift/bin/onadit` | The command line. `~/.rift/bin/rift` is the same command under its earlier name. |
| `~/Library/LaunchAgents/com.getrift.daemon.plist` | The launch agent that keeps the engine running |
| `~/Library/Logs/Rift/` | `stdout.log` and `stderr.log` |
| `~/Library/Application Support/SwiftBar/Plugins/rift.10s.sh` | The menu-bar plugin, with its helper in `.rift-menu/` next to it |

The engine is 1 background process, started at login and restarted if it stops. It listens on `127.0.0.1:3577` only.

## Use the command line

The package installs the command at `~/.rift/bin/onadit`. It does not change your `PATH`. Check the install with the full path, which works in any terminal:

```sh
~/.rift/bin/onadit status
```

To type `onadit` on its own, add the folder to your `PATH`. The first line covers the terminal you are in, the second every new one:

```sh
export PATH="$HOME/.rift/bin:$PATH"
echo 'export PATH="$HOME/.rift/bin:$PATH"' >> ~/.zshrc
```

The rest of these docs write `onadit` and assume you have done this.

```text Output on a Mac with Capture and Search by meaning turned on
Voyage:      key valid (last 4 …, last embed 14m ago)
Index:       last update 14m ago
Inbox:       empty — to add a chat export: onadit import <file> --source <name>
Memory:      6,904 conversations · docs 0 (source empty)
Codex CLI:   authed ✓ (last checked: 20m ago)
Capture:     working — last run 20m ago: 16 saved · next in 39m
Cursor:      not captured — to capture Cursor sessions, add "cursor_composer" to capture.sources in Onadit's config.json, then restart Onadit
MCP:         claude-desktop ✓  ·  codex ✓  ·  claude-code ✓  ·  cursor ✓

Next:        nothing broken. Try onadit search "<topic>".
```

The first line, which gives the version and the engine's uptime, and a few others are left out of this sample. Every line is explained in [Troubleshooting](https://onadit.com/docs/troubleshooting.md#what-onadit-status-prints).

## Install from the terminal

There is a second path for people who would rather use npm. It installs the engine, the command line and the menu-bar item. It does not install Onadit.app.

```sh
curl -fsSL https://onadit.com/install | bash
```

It needs macOS 12.3 or later, the Xcode Command Line Tools, Node 20.19 or later, npm and git. It installs the `onadit` package globally and writes the same config and launch agent. If `onadit` is not already on your `PATH`, it also links `~/.local/bin/onadit` and adds that folder to your `PATH` in `~/.zshrc`. Its engine logs go to `~/Library/Application Support/Rift/logs/`. Finish with `onadit onboard`.

## Update

Onadit checks the npm registry for a newer version when the engine starts, then every hour. The check is a plain request with nothing about you in it. There is no silent self-update.

- Package installs: download the latest `Onadit.pkg` and run it again, and it keeps your `config.json`, your archive and your custom environment variables (`onadit update` refuses on a package install and points you to the download)
- Terminal installs: run `onadit update`, which installs the new version, restarts the engine, and checks that the running engine reports the new version

A newer version shows up in `onadit status`, in `onadit doctor` and in the menu-bar item.
