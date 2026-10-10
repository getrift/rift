---
title: Connect an agent
url: https://getrift.dev/docs/connect
summary: Rift is a local MCP server. Claude, Claude Code, Codex and Cursor connect with 1 command. Other MCP clients need the same 2 lines added by hand.
last_updated: 2026-10-10
---

# Connect an agent

Rift is a local MCP server. Claude, Claude Code, Codex and Cursor connect with 1 command. Other MCP clients need the same 2 lines added by hand.

## How the connection works

```text
your agent  --stdio-->  Rift MCP server  --127.0.0.1:3577-->  Rift engine  -->  archive on disk
```

Your agent starts Rift's MCP server as a child process and talks to it over standard input and output. That process calls the engine on your Mac, using a token it reads from your Keychain. Nothing in this path leaves the machine. What does leave is covered in [What leaves your Mac](https://getrift.dev/docs/egress.md).

## 1 command

```sh
rift mcp install --client claude-code
rift mcp install --all        # every supported tool found on this Mac
rift mcp install --client cursor --dry-run   # show the change, write nothing
```

Rift.app has a button for each tool that does the same thing. Restart the tool afterwards.

| Tool | `--client` | File that is edited |
|---|---|---|
| Claude | `claude-desktop` | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Claude Code | `claude-code` | `~/.claude.json`, or `$CLAUDE_CONFIG_DIR/.claude.json` |
| Codex | `codex` | `~/.codex/config.toml`, or `$CODEX_HOME/config.toml` |
| Cursor | `cursor` | `~/.cursor/mcp.json` |

The writer backs the file up first, keeps every other server and setting in it, and refuses to touch a file it cannot parse.

## What gets written

For Claude, Claude Code and Cursor:

```json
{
  "mcpServers": {
    "rift": {
      "command": "/Users/you/Library/Application Support/Rift/node/bin/node",
      "args": [
        "/Users/you/Library/Application Support/Rift/app/dist/src/mcp/server.js",
        "/Users/you/Library/Application Support/Rift/data/config.json"
      ]
    }
  }
}
```

For Codex:

```toml ~/.codex/config.toml
[mcp_servers.rift]
command = "/Users/you/Library/Application Support/Rift/node/bin/node"
args = ["/Users/you/Library/Application Support/Rift/app/dist/src/mcp/server.js", "/Users/you/Library/Application Support/Rift/data/config.json"]
```

The command is Rift's own Node, the first argument is the MCP server, and the second is your config file. There is no API key and no environment variable in the entry. These paths are the ones a package install uses. A terminal install points at the npm package instead.

## Another MCP client

Rift has writers for the 4 tools above. For another client, add a stdio server with the same command and arguments in that client's own config format. To get the exact values for your machine:

```sh
rift mcp install --client cursor --dry-run
```

The client must be able to start a local process. A client that only connects to remote MCP servers cannot reach Rift.

## Check the connection

```sh
rift status
```

```text
MCP:         claude-desktop ✓  ·  codex ✓  ·  claude-code ✓  ·  cursor ✓
```

A cross next to a tool comes with the command that fixes it. Inside the agent, ask it to call `rift_status`. If the tool list does not include Rift, restart the agent.

If the MCP server prints "No auth token found", run `rift token issue`.

## The optional Claude Code hook

```sh
rift hooks install --client claude-code
```

This adds 2 things to Claude Code: a brief for the current project at the start of each session, and a check that runs before Rift's tools are called. `--no-session-brief` leaves the first one out. Turn the check off with `RIFT_POLICY_DISABLED=1`.

## Disconnect

`rift uninstall` removes the `rift` entry from all 4 tools. To disconnect 1 tool only, delete the `rift` entry from its config file.
