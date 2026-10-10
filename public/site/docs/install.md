---
title: Install
url: https://getrift.dev/docs/install
summary: Rift installs from a signed package into your home folder, with no admin password. It needs a Mac with Apple silicon and macOS 14 or later.
last_updated: 2026-10-10
---

# Install

Rift installs from a signed package into your home folder, with no admin password. It needs a Mac with Apple silicon and macOS 14 or later.

## Requirements

| | |
|---|---|
| Chip | Apple silicon (`arm64`). The package does not install on Intel Macs. |
| System | macOS 14 or later, for Rift.app. |
| Runtime | None to install. The package brings its own Node (20.20.2). |
| For Capture | Claude Code or Codex, signed in. Capture summarises sessions through one of them. See [Capture](https://getrift.dev/docs/capture.md). |
| For the menu-bar item | [SwiftBar](https://swiftbar.app). Rift does not install it. |

## Install the package

1. Download `Rift.pkg` from https://getrift.dev/download.
2. Open it and follow the installer. It installs for your user only, so macOS does not ask for an admin password.
3. When it finishes, Rift.app opens so you can import chats and connect your AI tools. If the app is missing, a private setup page opens in your browser instead.

Then follow the [Quickstart](https://getrift.dev/docs/quickstart.md).

## What the installer does

In order:

1. Writes the command-line shim at `~/.rift/bin/rift`. It does not edit your shell profile or your `PATH`.
2. Creates the data, inbox, jobs and log folders, and writes a first `config.json` if there is none.
3. Stops if port 3577 is held by a process that is not Rift.
4. Stops any earlier Rift engine, backs up its launch agent, and writes a new one.
5. Carries your custom environment variables over from the earlier launch agent.
6. Starts the engine and waits up to 30 seconds for it to answer on `http://127.0.0.1:3577/health`.
7. If anything in steps 4 to 6 fails, puts the earlier engine back.
8. Installs the menu-bar item, if SwiftBar is present.
9. Moves Rift.app to `~/Applications/Rift.app`.
10. Opens Rift.

## What it puts on your Mac

| Path | What it is |
|---|---|
| `~/Library/Application Support/Rift/node/` | The bundled Node runtime |
| `~/Library/Application Support/Rift/app/` | The engine |
| `~/Library/Application Support/Rift/data/` | Your archive and `config.json`. See [Where data lives](https://getrift.dev/docs/storage.md). |
| `~/Library/Application Support/Rift/jobs/` | The job queue |
| `~/Applications/Rift.app` | The app |
| `~/.rift/bin/rift` | The command line |
| `~/Library/LaunchAgents/com.getrift.daemon.plist` | The launch agent that keeps the engine running |
| `~/Library/Logs/Rift/` | `stdout.log` and `stderr.log` |

The engine is 1 background process, started at login and restarted if it stops. It listens on `127.0.0.1:3577` only.

## Use the command line

The package installs the command at `~/.rift/bin/rift`. It does not change your `PATH`. Check the install with the full path, which works in any terminal:

```sh
~/.rift/bin/rift status
```

To type `rift` on its own, add the folder to your `PATH`. The first line covers the terminal you are in, the second every new one:

```sh
export PATH="$HOME/.rift/bin:$PATH"
echo 'export PATH="$HOME/.rift/bin:$PATH"' >> ~/.zshrc
```

The rest of these docs write `rift` and assume you have done this.

```text Output on a Mac with Capture and Search by meaning turned on
Voyage:      key valid (last 4 …, last embed 14m ago)
Index:       last update 14m ago
Inbox:       nothing dropped yet — drop a web export under data/inbox/
Memory:      6,904 conversations · digests 0 (AI enrichment off) · docs 0 (source empty)
Codex CLI:   authed ✓ (last checked: 20m ago)
Capture:     last run 20m ago — 16 saved · 0 review · 0 failed · next in 39m
Cursor:      available — add cursor_composer to capture.sources to capture your Cursor sessions
MCP:         claude-desktop ✓  ·  codex ✓  ·  claude-code ✓  ·  cursor ✓

Next:        nothing broken. Try rift search "<topic>".
```

The first line, which gives the version and the engine's uptime, and a few others are left out of this sample. Every line is explained in [Troubleshooting](https://getrift.dev/docs/troubleshooting.md#what-rift-status-prints).

## Install from the terminal

There is a second path for people who would rather use npm. It installs the engine, the command line and the menu-bar item. It does not install Rift.app.

```sh
curl -fsSL https://getrift.dev/install | bash
```

It needs macOS 12.3 or later, the Xcode Command Line Tools, Node 20.19 or later, npm and git. It installs the `@getrift/rift` package globally, writes the same config and launch agent, links `~/.local/bin/rift`, and adds that folder to your `PATH` in `~/.zshrc`. Finish with `rift onboard`.

## Update

Rift checks the npm registry for a newer version when the engine starts, then every hour. The check is a plain request with nothing about you in it. There is no silent self-update.

- Package installs: download the latest `Rift.pkg` and run it again. Your `config.json`, your archive and your custom environment variables are kept, and the earlier engine is restored if the new one fails to start. `rift update` refuses on a package install and points you to the download.
- Terminal installs: run `rift update`. It installs the new version, restarts the engine, and checks that the running engine reports the new version.

A newer version shows up in `rift status`, in `rift doctor`, in the menu-bar item and in Rift.app.
