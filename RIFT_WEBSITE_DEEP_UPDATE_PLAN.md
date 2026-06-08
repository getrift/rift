# Rift Website Deep Update Plan

Date: 2026-06-02  
Scope: `/Users/clement/projects/rift` website, aligned with `/Users/clement/projects/second-brain` product truth  
Mode: private-beta launch, get live ASAP without fake maturity

## Executive Decision

Ship a lean private-beta page around this promise:

> **Make your AI work compound.**

The page should not sell a generic memory layer or an agent framework. The first buyer-visible outcome is simpler and stronger:

1. Import real AI exports.
2. Search locally with sources.
3. Get first useful recall without Codex or embeddings.
4. Connect agents only after the archive proves useful.

## Current Product Facts

- Import sources to lead with: ChatGPT, Claude, Grok, Gemini exports.
- Captured after setup: new Claude Code and Codex sessions.
- Served to after setup: Claude Desktop, Claude Code, Cursor, Codex.
- First import/search path: works without Codex, embeddings, or an AI worker.
- Optional enrichment: Codex and semantic search.
- Setup today: terminal installer.
- Mac package: planned for beta.19, not the live path yet.

## Live Page Plan

### 1. Hero

Copy:

> Private beta for Mac users with AI exports  
> Make your AI work compound.  
> Rift turns ChatGPT, Claude, Grok, and Gemini exports into a searchable local archive on your Mac. Find the answer, decision, or constraint you already worked out, with the original conversation attached. Connected tools can ask Rift for that context later.

CTA:

> Start beta setup

### 2. First Proof

Lead with source-backed recall, not the terminal agent demo.

Required elements:

- proof chips: Codex not needed for first recall, source attached, agents come later
- search query
- result title
- source app/export and date
- excerpt
- "Open source conversation" action

### 3. How It Works

Steps:

1. Import your AI exports.
2. Find what you worked out.
3. Let current tools reuse it after setup.

### 4. Beta Status

Keep this specific and modest:

- Export import + keyword search: live in beta.
- Agent connections: available after setup.
- Double-click Mac package: planned for beta.19.

This is the beta-momentum block. It builds trust through specificity instead of launch theater.

### 5. Agent Proof

Move the terminal demo after first recall. The terminal proof is useful, but it is the second act.

Headline:

> Connected tools can reuse the same context.

Body:

> After setup, Claude Code, Cursor, and Codex can ask Rift for source-backed context instead of making you paste the same background again.

### 6. Final CTA

Headline:

> Search the work already in your AI exports.

Body:

> Private beta seats are opening for Mac users with real ChatGPT, Claude, Grok, or Gemini exports to test. Start with local import and source-backed search; connect agents after the archive proves useful.

## `/start` Accuracy Rules

The setup page must not contradict the homepage.

Required copy:

- macOS 12.3+ with Node 20.19 or newer.
- Codex CLI is optional.
- Import and keyword search work without Codex.
- Embedding access is optional for semantic search.
- The terminal installer is supported today.
- The Mac package is planned for beta.19.

## Installer Rule

The website cannot claim no-Codex first value if `/install` hard-fails without Codex.

Required behavior:

- macOS, Command Line Tools, Node, npm, and git remain hard requirements.
- Codex is a warning, not a failed install.
- The warning should tell users import and keyword search still work.

## Words To Avoid

- broad every-model claims
- any tool
- automatic history ingestion
- memory layer
- unlimited context
- download the Mac app
- Mac package in validation
- Codex as a prerequisite
- embedding key as a prerequisite

## Ship Checklist

- Homepage sequence is hero -> source proof -> how it works -> beta status -> agent proof -> CTA.
- `/start` states optional Codex/embedding accurately.
- `/install` does not fail solely because Codex is missing.
- Stale broad claims are removed from visible copy and restorable hidden sections.
- `pnpm lint` passes.
- `pnpm build` passes.
- `/` and `/start` return 200 locally.
