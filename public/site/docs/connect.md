---
title: Connect an agent
url: https://onadit.com/docs/connect
summary: Onadit is a local MCP server. Claude, Claude Code, Codex and Cursor connect with 1 command. Other MCP clients need the same 2 lines added by hand.
last_updated: 2026-10-22
---

# Connect an agent

Onadit is a local MCP server. Claude, Claude Code, Codex and Cursor connect with 1 command. Other MCP clients need the same 2 lines added by hand.

## How the connection works

```text
your agent  --stdio-->  Onadit MCP server  --127.0.0.1:3577-->  Onadit engine  -->  archive on disk
```

Your agent starts Onadit's MCP server as a child process and talks to it over standard input and output. That process calls the engine on your Mac, with a token from `~/.rift/token` if `onadit onboard` wrote one, and from your Keychain otherwise. Nothing in this path leaves the machine. What does leave is covered in [What leaves your Mac](https://onadit.com/docs/egress.md).

## 1 command

```sh
onadit mcp install --client claude-code
onadit mcp install --all        # all 4 supported tools
onadit mcp install --client cursor --dry-run   # show the change, write nothing
```

`--all` writes the entry for all 4 tools, and creates the config file of any tool that is not installed. Onadit.app has a button for each tool that does the same thing, and its Connect all button only connects the tools it finds. Restart the tool afterwards.

A package install does not put `onadit` on your `PATH`. Use `~/.rift/bin/onadit`, or see [Use the command line](https://onadit.com/docs/install.md#use-the-command-line).

| Tool | `--client` | File that is edited |
|---|---|---|
| Claude | `claude-desktop` | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Code | `claude-code` | `~/.claude.json`, or `$CLAUDE_CONFIG_DIR/.claude.json` |
| Codex | `codex` | `~/.codex/config.toml`, or `$CODEX_HOME/config.toml` |
| Cursor | `cursor` | `~/.cursor/mcp.json` |

The writer backs the file up first, keeps every other server and setting in it, and refuses to touch a file it cannot parse.

For Claude Code and Codex, the command then offers 2 optional hooks, described [below](#the-optional-hooks). In a terminal it asks before installing them. `--with-hooks` installs them without asking, and `--no-hooks` skips the question.

## What gets written

For Claude, Claude Code and Cursor:

```json
{
  "mcpServers": {
    "onadit": {
      "command": "/Users/you/Library/Application Support/Rift/node/bin/node",
      "args": [
        "/Users/you/Library/Application Support/Rift/app/dist/src/mcp/stdio.js",
        "/Users/you/Library/Application Support/Rift/data/config.json"
      ]
    }
  }
}
```

For Codex:

```toml ~/.codex/config.toml
[mcp_servers.onadit]
command = "/Users/you/Library/Application Support/Rift/node/bin/node"
args = ["/Users/you/Library/Application Support/Rift/app/dist/src/mcp/stdio.js", "/Users/you/Library/Application Support/Rift/data/config.json"]
```

The command is Onadit's own Node, the first argument is the MCP server, and the second is your config file. There is no API key and no environment variable in the entry. These paths are the ones a package install uses. A terminal install points at the npm package instead.

Onadit was called Rift until October 2026. A connection made back then is listed as `rift`, starts `server.js`, and names its tools `rift_*`, such as `rift_context_pack`. It keeps working, and an update does not rename it. To move it to the current names, run `onadit mcp install --client <name> --new-names`. Settings kept in the entry move with it, such as Codex's enabled and disabled tools. If a permission rule or a hook elsewhere still names the `mcp__rift__` tools, the command stops and lists the files to update first.

## Another MCP client

Onadit has writers for the 4 tools above. For another client, add a stdio server with the same command and arguments in that client's own config format. To get the exact values for your machine:

```sh
onadit mcp install --client cursor --dry-run
```

The client must be able to start a local process. A client that only connects to remote MCP servers cannot reach Onadit.

## Check the connection

```sh
onadit status
```

```text
MCP:         claude-desktop ✓  ·  codex ✓  ·  claude-code ✓  ·  cursor ✓
```

A cross next to a tool comes with the command that fixes it. Inside the agent, ask it to call `onadit_status`. If the tool list does not include Onadit, restart the agent.

If the MCP server prints "Onadit isn't set up on this Mac yet", run `onadit onboard`.

## The optional hooks

```sh
onadit hooks install --client claude-code
onadit hooks install --client codex
onadit hooks remove --client claude-code
```

This adds 2 hooks to Claude Code or Codex:

- A brief for the current project at the start of each session, which goes to that tool's AI provider with the rest of the session (`--no-session-brief` leaves it out)
- A check before Onadit's search tools: an open-ended `onadit_search` or `onadit_conversations_search` is held back until the agent has called `onadit_context_pack` or received the session brief, while lookups by id and precise queries (a path, an identifier, a quoted phrase) go straight through

Codex skips the new entries until you open it and run `/hooks` once to review them. `RIFT_POLICY_DISABLED=1` turns the check off and keeps the brief. `onadit hooks remove` takes both out and backs up the settings file first.

## Disconnect

`onadit uninstall` stops Onadit and removes its launch agent, its entry in all 4 tools and its hooks. Your archive stays unless you add `--purge-data`, see [Remove Onadit](https://onadit.com/docs/remove.md). To disconnect 1 tool only, delete the `onadit` entry (`rift` on an older connection) from its config file.
