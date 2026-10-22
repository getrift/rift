---
title: Performance
url: https://onadit.com/docs/performance
summary: What we measured in September 2026, on what, and what the numbers do not cover.
last_updated: 2026-10-22
---

# Performance

What we measured in September 2026, on what, and what the numbers do not cover.

## Lookup speed

Medians over 16 fixed test tasks, on a copy of 1 real archive of about 5,900 conversations and 48 documents, on 1 Mac, with Search by meaning on.

| | Repeat question | New question |
|---|---|---|
| Context pack | 65 ms | 343 ms |
| Ranked search | 47 ms | 296 ms |

A repeat question is one whose embedding is already cached. A new question has to be embedded first, and that 1 request to Voyage is most of the wait: 225 ms at the median, 352 ms at worst over 40 requests. Onadit waits at most 1.5 seconds for it, then answers by keyword.

These time Onadit's lookup. Your agent writes its answer after that.

## A replay of real use

We replayed 65 real agent sessions from September 1 to 24: 146 pack and search calls in all.

| | Median | 90th percentile |
|---|---|---|
| Repeat questions | 101 ms | 339 ms |
| New questions | 412 ms | 850 ms |

## Does it find the right thing

On the same fixed tasks, each with a source we knew to be the right one:

| | Result |
|---|---|
| Context packs that returned the right source | 7 of 10 |
| Context packs that showed the evidence text itself | 6 of 10 |
| Searches that returned the right source | 3 of 4 |

These are small samples from 1 archive. They tell you the order of magnitude, not a rate you should expect.

## Agents answering questions

We gave 18 questions, twice each, to headless Claude Code agents that could use only Onadit's tools. 6 of the 18 questions had no answer in the archive, to see whether the agent would say so.

| 36 runs | Result |
|---|---|
| Correct and supported, or correctly "not found" | 36 |
| Quotes the agent cited that were found word for word in the cited passage | 78 of 78 |
| Time to answer, median | 9.5 s |
| Of which waiting for Onadit, median | 0.8 s |

This shows agents using Onadit. It does not compare them with agents that have no Onadit. We have not run that comparison.

## Compared with grep

`grep` is faster than Onadit. It returns matching lines from files you point it at. Onadit returns ranked passages from conversations, with a source and a date on each, and can match on meaning when the words differ. Use `grep` when you remember the words and the file.

## What these numbers do not tell you

- Tokens saved: we have not measured it
- Answer quality against an agent without Onadit: we have not measured it
- Speed on your Mac, with your archive: these come from 1 machine and 1 archive
- Saving: an embedding for a newly saved conversation can take far longer than a lookup, and it happens in the background
- The minutes after Onadit rebuilds its keyword index, which it does when the index is missing or split into many small parts: keyword search is slow until that finishes
