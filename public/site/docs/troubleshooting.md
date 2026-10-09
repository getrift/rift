---
title: Troubleshooting
url: https://getrift.dev/docs/troubleshooting
summary: Start with rift doctor. It names what is wrong and gives one action. This page lists every state it can report and every line rift status prints.
last_updated: 2026-10-09
---

# Troubleshooting

Start with rift doctor. It names what is wrong and gives one action. This page lists every state it can report and every line rift status prints.

## Start here

```sh
rift doctor
```

```text When all is well
Rift is working. Nothing needs attention.
```

If the shell answers `command not found: rift`, the command is not on your `PATH`. A package install puts it at `~/.rift/bin/rift`. Use that full path, or [add the folder to your PATH](https://getrift.dev/docs/install.md#use-the-command-line).

`rift doctor` only reads. It exits with code 1 when something is broken. To hand the problem to an agent, run `rift doctor --copy-prompt`. It builds a prompt with private details removed and copies it.

## The engine does not answer

| What you see | Cause | Do this |
|---|---|---|
| "Rift is not set up on this Mac yet" | No config file | `rift onboard` |
| "Rift has no access token on this Mac" | No token in the Keychain | `rift token issue` |
| "Rift's daemon rejected this command's token" | The token is out of date | `rift token issue` |
| "Rift's background engine is not responding" | The engine is not running | `launchctl kickstart -k gui/$UID/com.getrift.daemon` |
| "Login Keychain is locked" | Common over SSH | `security unlock-keychain ~/Library/Keychains/login.keychain-db` |
| The installer says port 3577 is in use | Another program holds the port | Stop that program, then run the installer again |

Engine logs are in `~/Library/Logs/Rift/` on a package install.

## What doctor can report

Doctor checks these in order and leads with the first one that is broken. Errors from before the engine last started are ignored.

| State | Level | Means | Do this |
|---|---|---|---|
| `voyage_key_missing` | Broken | Capture is on and there is no embedding key | Turn Search by meaning on in the app's Privacy settings, or `rift onboard --reconfigure-voyage` |
| `semantic_search_off` | Warning | No embedding key. Keyword search works | The same, if you want search by meaning |
| `codex_auth_expired` | Broken | Codex is signed out | `codex login` |
| `codex_preflight_failed` | Broken | Codex could not run. See the table below | Depends on the cause |
| `claude_auth_expired` | Broken | Claude Code is signed out | Run `claude` and sign in |
| `claude_preflight_failed` | Broken | Claude Code could not run. See the table below | Depends on the cause |
| `voyage_embed_errors` | Broken | An embedding request failed | `rift status`, then `rift onboard --reconfigure-voyage` if it names the key |
| `index_write_errors` | Broken | A write to the index failed | `rift status`, then `rift reindex` |
| `capture_failed` | Broken | The last Capture run had errors | Nothing. Rift retries |
| `capture_daemon_stale` | Warning | A scheduled run failed, but a later manual run worked | Nothing |
| `inbox_import_errors` | Warning | An export dropped in the inbox could not be read | Export again and drop the new file |
| `mcp_not_installed` | Warning | A tool on this Mac is not connected | `rift mcp install --client=<name>` |
| `menu_bar_unavailable` | Warning | SwiftBar is not installed | Install SwiftBar, then `rift menubar install` |
| `menu_bar_broken` | Warning | The menu-bar plugin is damaged | `rift menubar install` |
| `capture_quarantined` | Warning | Some sessions were too large and ran out of retries | `rift doctor repair capture-large-sessions` |
| `capture_repairing` | Warning | Large sessions are being saved in the background | Nothing |
| `update_available` | Warning | A newer version is out | See [Update](https://getrift.dev/docs/install.md#update) |

## When Capture cannot use Codex

Capture runs a short check before each run. If it fails, `rift status` shows why.

| Cause | Message | Do this |
|---|---|---|
| `auth` | "Codex login appears to have expired." | `codex login` |
| `model` | "Codex rejected the model …" | Set `codex_cli.model` in the config to a model your plan offers |
| `cli_incompatible` | "Codex CLI is too old for capture" | Upgrade Codex |
| `binary` | "Codex CLI could not be found or started" | Check that it is installed and on the `PATH` |
| `rate_limit` | "Codex hit a rate/usage limit or is out of credits" | Wait, or check your plan |
| `timeout`, `backend`, `unknown` | A timeout or a network problem | Nothing. Rift retries |

These are problems with the Codex install or its sign-in. Rift does not hold a Codex or OpenAI key.

## When Capture cannot use Claude Code

| Cause | Do this |
|---|---|
| `missing` | Install Claude Code, or set `RIFT_CLAUDE_CLI_PATH` |
| `incompatible` | Upgrade Claude Code |
| `wrapper` | A wrapper script is in the way. Set `RIFT_CLAUDE_CLI_PATH` to the real binary |
| `auth` | Run `claude` and sign in |
| `rate_limit` | Wait |
| `network` | Check your connection |
| `timeout`, `unknown` | Nothing. Rift retries |

## What rift status prints

| Line | What it tells you |
|---|---|
| Header | The version, whether the engine is running and for how long, and the port. A cross after the port means Capture is on with no embedding key |
| `Voyage:` | The embedding key is valid, and when it was last used. Replaced by `Search:` when there is no key |
| `Search:` | `keyword on · semantic off` when there is no key |
| `Index:` | When the index was last written, and the last error if there was one |
| `Inbox:` | Whether an export was dropped in `data/inbox/`, and how many are pending |
| `Memory:` | How many conversations, digests and documents Rift holds, and why a count is zero |
| `Codex CLI:` or `Claude Code:` | Whether the tool Capture uses is signed in and working |
| `Capture:` | The last run: how many sessions were saved, sent to review, or failed, and when the next run is due |
| `Cursor:`, `Cowork:`, `Grok CLI:` | Whether each opt-in source is on, and how to turn it on |
| `App chats:` | Chat apps found on this Mac whose chats need an export |
| `MCP:` | Which tools are connected. A cross comes with the command that fixes it |
| `Menu bar:` | Only shown when the menu-bar item is missing or broken |
| `Update:` | Only shown when a newer version is out |
| `Next:` | One action, or "nothing broken" |

The reasons a `Memory:` count can be zero: for digests, `AI enrichment off` or `none yet`. For documents, `no sources`, `source missing`, `source empty` or `Voyage key missing`.

## Other messages

| Message | Do this |
|---|---|
| "Authentication failed. Run: rift token issue" | Run it |
| "Cannot connect to daemon" | Restart the engine with the `launchctl kickstart` command above |
| "Config not found" | `rift onboard`, or point `RIFT_CONFIG` at the file |
| "Config invalid" | Fix the key it names. Unknown keys are rejected |
| "has keys this CLI does not recognize" | The config was written by a newer version. Update Rift |
| "Rate limited. Retry later." | Wait a minute |
| "Another exclusive operation is running" | A rebuild or reindex is in progress. Wait for it |

## Common fixes

- The menu-bar icon is missing: open SwiftBar, then run `rift menubar install`.
- The Claude Code hook gets in the way: set `RIFT_POLICY_DISABLED=1`, or remove the `rift-policy.mjs` entry from `~/.claude/settings.json`.
- Search by meaning stopped working: `rift onboard --reconfigure-voyage` replaces the key.
- An agent does not use Rift: check the `MCP:` line in `rift status`, then add [the line to your rule file](https://getrift.dev/docs/instructions.md).
