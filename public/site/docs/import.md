---
title: Import
url: https://getrift.dev/docs/import
summary: Import brings in your past ChatGPT, Claude and Grok conversations from the export file each provider gives you.
last_updated: 2026-10-09
---

# Import

Import brings in your past ChatGPT, Claude and Grok conversations from the export file each provider gives you.

## What you can import

| From | `--source` | Give Rift | What it reads |
|---|---|---|---|
| ChatGPT | `chatgpt_web` | The export zip, or its `conversations.json` files | The branch of each conversation you ended on. System and tool messages are skipped |
| Claude | `claude_web` | The claude.ai export zip | `conversations.json`. `projects.json` and `users.json` are ignored |
| Grok | `grok_web` | The account export zip | `prod-grok-backend.json`. Conversations with no reply are skipped |

Ask the provider for an export of your data in its settings. It arrives as a zip, usually by email.

## Three ways in

### The command line

```sh
rift import ~/Downloads/export.zip                      # ChatGPT is the default
rift import ~/Downloads/export.zip --source claude_web
rift import ~/Downloads/export.zip --source grok_web
```

For a zip, Rift looks inside to check that the layout matches the source you named. If it looks like another provider's export, the import stops and tells you which. `--no-sniff` skips that check.

### The inbox folder

Drop a `.zip` or `.json` file into:

```text
~/Library/Application Support/Rift/data/inbox/
```

The engine watches this folder. Put the file in a subfolder named after the source, such as `inbox/claude_web/`, to say what it is. Otherwise Rift works it out from the content.

### The app

Rift.app and the setup page take the same files by drag and drop.

## Importing again

It is safe to import a newer export over an older one.

- Each conversation gets an ID derived from its source and the provider's own conversation ID, so it maps to the same row every time.
- If the text is unchanged, the conversation is skipped.
- If the conversation grew, its row is replaced.
- One import is all or nothing. If any conversation in the file fails, nothing from that file is stored.

## Dates

An imported conversation is stamped with the time of the import, not the time the conversation took place. The original date is kept in the raw file, but search results and the recency boost use the import time.

In practice, a three-year-old chat imported today counts as recent for a few weeks. Keep that in mind when a result's date matters, and open the passage to check.

## Search by meaning and imports

Import works with keyword search alone. If Search by meaning is on, imported conversations are also sent to Voyage to be embedded. See [What leaves your Mac](https://getrift.dev/docs/egress.md).

By default the summary of an imported conversation is its title. No AI tool reads your import unless you turn enrichment on.

## Limits

| | |
|---|---|
| File types | `.zip` and `.json` |
| Upload size | 100 MB by default. Change it with `request_limits.multipart_limit_bytes` |
| Zip contents | At most 10,000 files and 1 GB uncompressed |
| Google Takeout archives | Not supported |
| Grok exports | Web search results, post IDs and thinking traces are not kept |
| Desktop apps | Rift cannot read chats straight from the ChatGPT or Claude desktop apps. Use an export |

## Many files at once

```sh
rift bulk-ingest --source chatgpt_web --dir ~/exports/
```
