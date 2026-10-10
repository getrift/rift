---
title: How retrieval works
url: https://getrift.dev/docs/retrieval
summary: Rift looks for a passage two ways at once, by keyword and by meaning, puts both on one scale, and nudges recent work up. This page gives the formula.
last_updated: 2026-10-09
---

# How retrieval works

Rift looks for a passage two ways at once, by keyword and by meaning, puts both on one scale, and nudges recent work up. This page gives the formula.

## Two lanes

Every search runs two lookups at the same time and merges the results by ID.

| Lane | How | Needs |
|---|---|---|
| Keyword | A full-text index over the archive, scored with BM25 | Nothing. Always on |
| Meaning | Your question is embedded, then compared with stored embeddings by cosine similarity | Search by meaning turned on |

Each lane fetches three times the number of results you asked for, and at least 30. A row found by both is marked `hybrid`.

With Search by meaning off, only the keyword lane runs. The response says `"mode": "lexical"`.

## The score

```text
score = 0.55 × similarity
      + 0.10 × recency
      + 0.10 × quality
      + 0.10 × tier
      + 0.10 × 1.0          (reserved for recorded outcomes, fixed today)
      + 0.05 × found-both-ways
      + 0.05 × freshness
```

| Term | Value |
|---|---|
| Similarity | For a meaning match, the cosine similarity. For a keyword match, its BM25 score divided by the best keyword score, then scaled to the best meaning score in the same pool. For a row found both ways, the larger of the two |
| Recency | `1 / (1 + 0.01 × days)`. 1.0 today, 0.77 after 30 days, 0.5 after 100 |
| Freshness | `exp(-days / 14)`. 1.0 today, 0.61 after a week, 0.37 after two weeks, 0.12 after a month |
| Quality | 1.0, 0.7 or 0.4 for conversations rated high, medium or low. 1.0 for documents and digests |
| Tier | 1.0 for current conversations and documents, 1.1 for digests, 0.7 for archived conversations |
| Found both ways | 1.3 if both lanes found the row, otherwise 1.0 |

`days` counts from the time a row was indexed. For an [imported](https://getrift.dev/docs/import.md#dates) conversation that is the day of the import.

Similarity carries 55% of the score. The two time terms together carry 15%, so a recent passage wins a close call and loses to a clearly better match.

## After ranking

- Near-identical copies of the same conversation are folded into one result.
- Generated reports are placed behind first-hand material.
- Each result is cut down to a snippet (400 characters) and a summary (800), with the size of the full text and a pointer to open it.

## Current and archived conversations

New conversations land in the current table. `rift compact` moves those older than 30 days to an archive table and, if you have enrichment on, writes a weekly digest of them. Compaction runs when you call it. It is not scheduled.

A normal search covers documents, current conversations and digests. The archive is searched too in three cases:

- Search by meaning is off.
- The best result scores under 0.4.
- An agent asks for it with `rift_conversations_search` and `detail: "full"`.

## When a search is degraded

`"degraded": true` means the meaning lane was tried and did not finish, so the results are keyword only. The response gives the reason. The usual one is that embedding the question took longer than 1.5 seconds, the most Rift will wait.

Search by meaning being off is not a degraded search. It is the keyword mode working as intended.

## How a context pack is built

`rift_context_pack` runs the same search, then sorts what it finds for an agent that is about to work.

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
| `tracker` | Files kept to record state | `PROJECT_STATE.md`, `TODO.md`, dated decision notes |
| `committed_doc` | Durable written framing | `README`, `CLAUDE.md`, `AGENTS.md`, a PRD |
| `discussion` | Conversations and agent reasoning | Any captured or imported chat |
| `discounted` | Material that may be stale | Untracked or deleted files, generated reports |

A conversation is never the only authority for what is true now. When the pack has no `live_state` item to stand on, it says so: `"current_truth_caveat": "tracker-backed, not live-verified"`. When it knows which files would settle the question, it lists them and the agent should read them.

A decision or an example needs a relevance of at least 0.3 to be included. Items are dropped from the end until the whole response fits in `max_bytes`.

## The embedding model

| | |
|---|---|
| With a key Rift provides | `voyage-4-lite`, 512 dimensions, served by MongoDB Atlas |
| With your own Voyage key | `voyage-3-lite` by default, 512 dimensions. Change it with `embedding.model` |
| Sources set to `"extraction": "local"` | An Ollama model on your Mac, 768 dimensions |
| With no key | No embedding. Rows are stored without a vector and found by keyword |

Embeddings are cached on disk, so the same text is not sent twice.
