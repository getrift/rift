---
title: How retrieval works
url: https://onadit.com/docs/retrieval
summary: Onadit looks for a passage 2 ways at once, by keyword and by meaning, puts both on 1 scale, and nudges recent work up. This page gives the formula.
last_updated: 2026-10-22
---

# How retrieval works

Onadit looks for a passage 2 ways at once, by keyword and by meaning, puts both on 1 scale, and nudges recent work up. This page gives the formula.

## 2 lanes

Every search runs 2 lookups at the same time and merges the results by ID.

| Lane | How | Needs |
|---|---|---|
| Keyword | A full-text index over the archive, scored with BM25 | Nothing. Always on |
| Meaning | Your question is embedded, then compared with stored embeddings by cosine similarity | Search by meaning turned on |

Each lane fetches 3 times the number of results you asked for, and at least 30. A row found by both is marked `hybrid`.

With Search by meaning off, only the keyword lane runs. The response says `"mode": "lexical"`.

## How results are ranked

Each result gets 1 score, from 0 to about 1. How closely it matches your question counts for about half of it. The rest settles close calls: a recent passage, a conversation rated as useful, or one that both lanes found comes first when 2 matches are about as good. A clearly better match still beats a newer one. Archived conversations count for a little less than current ones.

We tune the weights from release to release, so this page describes the order, not the numbers.

2 things about dates:

- An [imported](https://onadit.com/docs/import.md#dates) conversation is dated by the day you imported it, not the day it happened
- Turning Search by meaning on in the app re-indexes everything, which resets every date to that day

## After ranking

- Near-identical copies of the same conversation are folded into 1 result
- Generated reports are placed behind first-hand material
- Each result is cut down to a snippet (400 characters) and a summary (800), with the size of the full text and a pointer to open it

## Current and archived conversations

New conversations land in the current table. `onadit compact` moves those older than 30 days to an archive table and writes 1 digest of them. It needs Search by meaning and a digest worker: Codex enrichment or a local Ollama model. Without them, or with Claude chosen for enrichment, it is unavailable. Compaction runs when you call it. It is not scheduled.

A ranked search covers documents, current conversations and digests. It searches the archive too in 2 cases:

- Search by meaning is off
- The best result scores under 0.4

`onadit_conversations_search` with `detail: "full"` searches the archive instead of current conversations.

## When a search is degraded

`"degraded": true` means the meaning lane was tried and did not finish, so the results are keyword only. The response gives the reason. The usual one is that embedding the question took longer than 1.5 seconds, the most Onadit will wait.

Search by meaning being off is not a degraded search. It is the keyword mode working as intended.

## How a context pack is built

`onadit_context_pack` runs the same search, then sorts what it finds for an agent that is about to work.

First it reads the task and picks an intent:

| Intent | When | Effect |
|---|---|---|
| `current_truth` | The task asks what is true now | Live files and trackers come first |
| `reasoning_archive` | The task asks why something was decided | Older conversations are treated as valid evidence |
| `blended` | Both, or neither | A mix |

Then it gives every source a level of trust:

| Level | What it is | Examples |
|---|---|---|
| `live_state` | Things that can be run or observed | Source code, install scripts, `package.json`, `config.json` |
| `tracker` | Files kept to record state | `PROJECT_STATE.md` and `TODO.md` |
| `committed_doc` | Durable written framing | `README`, `CLAUDE.md`, `AGENTS.md`, a PRD |
| `discussion` | Conversations and agent reasoning | Any captured or imported chat |
| `discounted` | Material that may be stale | Untracked or deleted files, generated reports |

A conversation is never the only authority for what is true now. When the pack has no `live_state` item to stand on, it says so: `"current_truth_caveat": "tracker-backed, not live-verified"`. When it knows which files would settle the question, it lists them and the agent should read them.

A decision or an example needs a relevance of at least 0.3 to be included. Items are dropped from the end until the whole response fits in `max_bytes`.

## The embedding model

| | |
|---|---|
| With a key Onadit provides | `voyage-4-lite`, 512 dimensions, served by MongoDB Atlas |
| With your own Voyage key | `voyage-3-lite` by default, 512 dimensions. Change it with `embedding.model`. The tables hold 512-dimension vectors, so a model that offers several sizes needs `embedding.output_dimension: 512` |
| Sources set to `"extraction": "local"` | An Ollama model on your Mac, 768 dimensions |
| With no key | No embedding. Imported and saved conversations are stored without a usable vector and found by keyword. Documents in `cloud` source folders are not indexed until a key is added |

Embeddings are cached on disk, so the same text is not sent twice.
