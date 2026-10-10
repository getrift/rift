---
title: Performance
url: https://getrift.dev/docs/performance
summary: What we measured in September 2026, on what, and what the numbers do not cover.
last_updated: 2026-10-09
---

# Performance

What we measured in September 2026, on what, and what the numbers do not cover.

## Lookup speed

Medians over 16 fixed test tasks, on a copy of one real archive of about 6,900 conversations, on one Mac, with Search by meaning on.

| | Repeat question | New question |
|---|---|---|
| Context pack | 65 ms | 343 ms |
| Ranked search | 47 ms | 296 ms |

A repeat question is one whose embedding is already cached. A new question has to be embedded first, and that one request to Voyage is most of the wait: 225 ms at the median, 352 ms at worst over 40 requests. Rift waits at most 1.5 seconds for it, then answers by keyword.

These time Rift's lookup. Your agent writes its answer after that.

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

These are small samples from one archive. They tell you the order of magnitude, not a rate you should expect.

## Agents answering questions

We gave 18 questions, twice each, to headless Claude Code agents that could use only Rift's tools. 16 of the 36 runs had no answer in the archive, to see whether the agent would say so.

| 36 runs | Result |
|---|---|
| Correct and supported, or correctly "not found" | 36 |
| Correctly said "not found" when there was no answer | 16 of 16 |
| Quotes the agent cited that were found word for word in the cited passage | 78 of 78 |
| Time to answer, median | 9.5 s |
| Of which waiting for Rift, median | 0.8 s |

This shows agents using Rift. It does not compare them with agents that have no Rift. We have not run that comparison.

## Compared with grep

`grep` is faster than Rift. It returns matching lines from files you point it at. Rift returns ranked passages from conversations, with a source and a date on each, and can match on meaning when the words differ. Use `grep` when you remember the words and the file.

## What these numbers do not tell you

- Tokens saved. We have not measured it.
- Answer quality against an agent without Rift. We have not measured it.
- Speed on your Mac, with your archive. One machine, one archive.
- Saving. An embedding for a newly saved conversation can take far longer than a lookup. It happens in the background.
- The first minute after an update. The keyword index is rebuilt once, and keyword search is slow until that finishes.
