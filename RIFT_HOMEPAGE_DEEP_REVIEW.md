# Rift Homepage Deep Review - PMM + Front-End Design

Date: 2026-05-29  
Scope: `/Users/clement/projects/rift` homepage promoting `/Users/clement/projects/second-brain`  
Output type: ruthless review, not implementation

## Executive Verdict

The page has a real product underneath it, but the current homepage sells "AI context plumbing" before it sells the buyer outcome.

The strongest Rift story is not "unlimited context." That phrase is both generic and technically loose. The real story is:

> Your AI work stops evaporating. Every future agent can reuse the decisions, constraints, and project memory you already paid for in past conversations.

The product is richer and more defensible than the homepage suggests. Current source truth says Rift is a local-first personal knowledge engine, package `@getrift/rift`, with a CLI, daemon, LanceDB storage, Fastify API, and MCP surface. In plain English: a small background app on the Mac captures or imports AI work, stores searchable memory locally, and lets supported AI tools retrieve compact context when needed. Current source: `/Users/clement/projects/second-brain/PROJECT_STATE.md:7`, `/Users/clement/projects/second-brain/README.md:5`, `/Users/clement/projects/second-brain/src/mcp/server.ts:115`.

The homepage currently says: "Give your favorite AI unlimited context." That sounds like a generic 2025 AI wrapper. Rift is sharper than that: private, cross-tool memory for serious AI users who are tired of re-explaining decisions across Claude, Codex, Cursor, and archived ChatGPT/Claude/Grok/Gemini work.

My CTO recommendation: rebuild the narrative around "remembered work" and "portable decision memory," then let the technical details prove the claim. Keep the private-beta feel. Do not pretend this is a huge ARR company. But make every section specific, credible, and outcome-driven.

## Verified Product Truth

I am not guessing here. This is what the repo supports today.

### What Rift Is

Rift is local-first personal AI memory. It captures local Claude Code and Codex CLI sessions, triages them, indexes them, and exposes searchable memory over MCP so Claude Desktop, Claude Code, Codex, and Cursor can retrieve past context. Source: `/Users/clement/projects/second-brain/README.md:3-7`.

Technical translation:

- Local-first: the main database and stored transcripts live on the user's Mac.
- Daemon: a background process that keeps Rift running without the user manually starting it.
- LanceDB: the local database used to store searchable chunks and vectors.
- MCP: the connector standard that lets AI tools call external tools, like "ask Rift for relevant memory."
- Embedding: a numerical representation of text that helps search by meaning, not just exact words.

Why it matters: the buyer does not care about MCP at first. They care that Claude/Codex/Cursor can remember decisions from previous work without copy-paste.

### What It Outputs

Rift outputs:

- Search results via `rift search`.
- Compact task context through `rift_context_pack`.
- Conversation-specific search through `rift_conversations_search`.
- Agent session saves through `rift_save`.
- Status through `rift_status`.

The MCP server defines these tools in `/Users/clement/projects/second-brain/src/mcp/server.ts:115-169`. The key PMM point: the hero should not say "MCP surface." It should say "your agent gets the relevant prior decisions before it acts."

### Compatible Tools

Supported MCP clients today:

- Claude Desktop
- Claude Code
- Cursor
- Codex

Source: `/Users/clement/projects/second-brain/README.md:76-91`.

Important accuracy issue: ChatGPT, Gemini, Grok, and Claude web are import sources. They are not all live destination tools in the current MCP install list. The homepage must not imply ChatGPT can automatically call Rift today unless that is now true in code.

### Ingested Sources

Auto-captured forward from:

- Claude Code
- Codex CLI

Source: `/Users/clement/projects/second-brain/src/capture/sources.ts:1-8`.

Imported from web exports:

- ChatGPT web
- Claude web
- Gemini web
- Grok web

Source: `/Users/clement/projects/second-brain/src/ingestion/parsers/types.ts:28-43`.

Watched or scanned files include Markdown, text, logs, JS/TS, Python, Ruby, Go, Rust, Java, Swift, JSON/YAML/TOML/XML/SVG/HTML/CSS/SQL, PDF, DOCX, and named files such as Makefile, Dockerfile, `.env.example`, LICENSE, and CHANGELOG. Source: `/Users/clement/projects/second-brain/src/ingestion/extractor.ts:17-63`.

### Backfill and Import Reality

There is no actual wall-clock benchmark in the repo that proves "12,431 messages indexed in 40s." The homepage currently shows that in the import visual. I would not ship that claim unless you have a real benchmark.

What is verified:

- Forward capture starts only after install. Existing Claude Code and Codex CLI sessions are watermarked and not retroactively ingested by default. Source: `/Users/clement/projects/second-brain/README.md:13-16`.
- Historical backfill is a separate paid service, not an automatic happy path. Source: `/Users/clement/projects/second-brain/README.md:135-154`.
- Backfill involves export import/audit, targeted de-watermarking, triage tuning over about one week, and a 60-minute validation call. Source: `/Users/clement/projects/second-brain/README.md:139-144`.
- The historical import runbook caps processing at 300 files/day, 1,500 files/week, and $25/week triage spend. Source: `/Users/clement/projects/second-brain/docs/historical-import-runbook.md:86-99`.
- The launch target was "time-to-first-useful-recall" under 10 minutes for a user with an existing ChatGPT export. That is a target, not proof. Source: `/Users/clement/projects/second-brain/LAUNCH.md:241-242`.

Recommendation: the homepage can say "new sessions start compounding immediately" and "historical archives can be backfilled with a guided import." Do not say "thousands indexed in seconds" without a benchmark.

### Privacy Reality

The homepage currently says versions of "never leaves your machine" and "embeddings only - text never sent." This is too loose.

Verified privacy contract:

- Stored transcripts, vector index, and search results stay on the Mac.
- Content snippets and semantic search query text go to Voyage AI for embeddings.
- Triage, metadata extraction, and digest summaries run through the user's authenticated Codex CLI by default, which sends relevant conversation content to Codex/OpenAI under the user's own account.
- Clem sees nothing by default.

Source: `/Users/clement/projects/second-brain/docs/feedback/PRIVACY.md:10-33`, `/Users/clement/projects/second-brain/docs/feedback/PRIVACY.md:66-118`.

Recommendation: say "stored locally, explicit network calls named up front." Do not say "never leaves your machine" unless the sentence is clearly scoped to stored transcripts/data at rest.

## Current Homepage Diagnosis

Current sequence in `/Users/clement/projects/rift/app/home-content.tsx:851-859`:

1. Nav
2. Hero
3. Tool carousel
4. Feature/bento grid
5. LLM-wiki editorial block
6. Terminal proof
7. CTA
8. Footer

This sequence is backwards for conversion.

The page asks the visitor to understand a carousel, a six-cell architecture grid, MCP vocabulary, local-first claims, token caps, imports, and an LLM-wiki comparison before showing the clearest proof: a coding agent using prior memory mid-task.

The proof block at `/Users/clement/projects/rift/app/home-content.tsx:680-785` is the page's strongest asset. It should move up, directly after the hero, because it shows the "aha": the agent remembers the prior decision and applies it without the user re-explaining.

## Recommended Block Sequence

### 1. Hero: Pain + Outcome + Beta CTA

Current:

> Give your favorite AI unlimited context.

Problem:

- "Unlimited context" is generic.
- It implies a technical impossibility: model context windows are still bounded.
- It does not create urgency.
- It hides the cross-vendor lock-in wedge.

Recommended hero:

> Stop re-explaining your work to every AI tool.

Subcopy:

> Rift turns your AI chats, code sessions, and project decisions into private memory on your Mac. Claude, Codex, Cursor, and Claude Desktop can pull the right context when they need it.

Note: I intentionally did not include ChatGPT as a destination tool because the current supported MCP client list does not include it. ChatGPT can be an import source.

CTA:

- Primary: `Request private beta access`
- Secondary: `See it remember a decision`

Why: "Download for macOS" is fine for a fully open utility. For a private beta opening seats soon, it is too transactional and under-qualifies users.

### 2. Proof: "Your Agent Remembers the Decision"

Move the terminal proof before the bento grid.

Section headline:

> Your agent remembers the decision, not just the file.

Subcopy:

> Ask the way you normally would. Rift finds the relevant prior decision, the source it came from, and the constraint that mattered, then gives your agent just enough context to act.

Visual:

Keep a terminal/code-agent proof, but tighten the demo.

Current demo issue: it uses "rate limiting" in proof and "pricing" in carousel/bento. That splits the story. Use one narrative across all screenshots:

- User asks: "Add rate limiting to checkout like last time."
- Rift retrieves: "Redis token-bucket, 100 req/min, express-rate-limit rejected because no shared state."
- Agent applies it.

That is an outcome. It shows memory turning into work.

### 3. How It Works: Three Steps

The page needs a simple explanation before the six-cell grid.

Recommended section:

> How Rift works

Cards or steps:

1. Capture and import your AI work  
   "New Claude Code and Codex sessions are captured automatically. ChatGPT, Claude, Gemini, and Grok exports can be imported when you choose."

2. Build private memory on your Mac  
   "Rift indexes the useful parts locally, keeps the database on your machine, and names the few network calls it needs for embedding and triage."

3. Serve only the useful context  
   "When your agent needs memory, Rift returns a compact context pack: decisions, constraints, examples, and source pointers. No transcript dump."

This turns mechanism into a story: input -> memory -> useful work.

### 4. Compatibility: Split Sources From Destinations

The current page blurs this.

Recommended block:

> Works where your AI work already happens.

Two columns:

- Captures and imports from: Claude Code, Codex CLI, ChatGPT export, Claude export, Gemini export, Grok export, project files.
- Serves memory to: Claude Desktop, Claude Code, Cursor, Codex, and other MCP-capable clients when supported.

Plain-English explanation:

> Import source means Rift can read old work from there. Connected tool means that app can ask Rift for memory while you work.

Why this matters: it avoids overclaiming and helps non-technical visitors understand compatibility.

### 5. Trust and Privacy

This must come earlier than the technical bento because trust is a purchase blocker.

Recommended headline:

> Stored on your Mac. Network calls named up front.

Subcopy:

> Rift keeps your transcripts, search index, and results on disk under your Mac account. To make semantic search work, snippets and search queries are embedded through Voyage AI. Triage runs through your authenticated Codex CLI by default. No content telemetry to Rift.

This is more honest and stronger than "never leaves." Buyers who care about privacy will respect the precision.

### 6. Historical Backfill

Current homepage treats import like a lightweight dropzone:

> 12,431 messages indexed - 40s

That clashes with the README, which says historical backfill is paid, audited, tuned over about one week, and validated. Do not hide this. Use it as premium positioning.

Recommended section:

> Your old archive can become useful, but not blindly.

Copy:

> Rift does not dump two years of noisy chat history into memory. New sessions start compounding immediately. Historical archives can be backfilled through a guided process: import, audit, triage tuning, and validation of what should be remembered.

Beta framing:

> Private beta seats include guided setup. Historical backfill is available separately for users with large archives.

This sounds serious and reduces support expectations.

### 7. Bento Grid: Demote to "Capabilities"

The current bento should not be the first explanation. Keep it as a capabilities section after the visitor understands the product.

New headline:

> What changes after Rift is connected

New cells:

1. Agents start with your prior decisions  
   Outcome: less re-explaining.

2. Memory follows you across tools  
   Outcome: Claude, Codex, Cursor share one memory substrate.

3. Live files beat stale chats  
   Outcome: fewer hallucinations from old decisions.

4. Context packs stay small  
   Outcome: agents get constraints without transcript bloat.

5. Archives become searchable  
   Outcome: old ChatGPT/Claude/Grok/Gemini work is not dead history.

6. Network calls are explicit  
   Outcome: privacy model is understandable.

### 8. Optional Philosophy Section

The Karpathy LLM-wiki paragraph is too long and too insider. It is credible to a tiny audience, but it should not sit before the proof or core "how it works."

If kept, move it after the core story and shorten heavily.

Recommended:

> If your wiki is the map, Rift is the trail.

Copy:

> A hand-written LLM wiki is still useful for stable doctrine. Rift covers the part no one writes down: the decisions, tradeoffs, false starts, and implementation details buried in real AI sessions.

This keeps the idea without making the page depend on knowing Andrej Karpathy's pattern.

### 9. Final CTA

Current:

> Give your AI a memory that's actually yours.

This is directionally good. The support copy is the issue:

> Two minutes to set up. It captures as you work, recalls across every tool, and never leaves your machine.

Problems:

- "Two minutes" may be true for install, but not for first useful recall with import/backfill.
- "every tool" overclaims.
- "never leaves your machine" is too broad.

Recommended:

> Bring your AI history with you.

Subcopy:

> Opening private beta seats for Mac users who already work across Claude, Codex, Cursor, or large AI chat archives. Start with forward capture, connect your agents, and backfill history when it is worth doing properly.

CTA:

- `Request private beta access`
- `Read the setup notes`

## Section-by-Section Review

### Nav

Current issue: Product, Docs, Privacy, Pricing are rendered as non-clickable spans. Sign in is also non-clickable. Source: `/Users/clement/projects/rift/app/home-content.tsx:44-52`.

Why it matters: fake navigation is one of the fastest ways to make a private beta page feel LLM-generated. If a label is visible, it must either work or not exist.

Recommendation:

- Keep only working links.
- For private beta, use: `How it works`, `Privacy`, `Start`.
- Remove `Pricing` unless there is a real pricing page and price decision.
- Remove `Sign in` unless there is an account surface.

### Hero

Current issue: the eyebrow "the local memory layer for AI tools" is a generic category phrase. Source: `/Users/clement/projects/rift/app/home-content.tsx:73-77`.

Better eyebrow options:

- `Private beta for Mac AI power users`
- `Personal AI memory, owned locally`
- `For people using more than one AI tool`

Current H1 issue: "unlimited context" is weak and inaccurate. Source: `/Users/clement/projects/rift/app/home-content.tsx:85`.

Recommended H1:

> Stop re-explaining your work to every AI tool.

Alternative H1s:

1. `Your AI work, remembered across every tool.`
2. `Make every agent start with what you already know.`
3. `Portable memory for your AI work.`

Recommended subcopy:

> Rift turns your AI chats, code sessions, and project decisions into private memory on your Mac. Connected agents pull compact, source-grounded context when they need it.

### Hero Carousel

What works:

- It shows the product in the tools people already use.
- The Claude/Cursor/Codex/Ghostty framing is the right instinct.

What does not:

- It looks like simulated UI, not proof.
- The carousel competes with the hero instead of proving one crisp story.
- The tabs and dots read like a standard SaaS landing-page module.
- On mobile, the carousel overflows and becomes cropped. Screenshot evidence: `/tmp/rift-homepage-mobile.png`.

Recommendation:

- Replace the carousel with one focused before/after proof on first load.
- Add a small "Works in Claude Code, Cursor, Codex, Claude Desktop" row after the proof.
- If you keep tabs, make each tab an actual use case, not just tool names:
  - `Code decision`
  - `Pricing rationale`
  - `Project constraint`
  - `Past archive search`

### Bento Grid

Current issue: this section tries to do too much too early. Source: `/Users/clement/projects/rift/app/home-content.tsx:569-640`.

It mixes:

- data flow
- privacy
- current-truth ranking
- token budgeting
- MCP tool inventory
- import flow

That is a system diagram spread across six mini-cards. A cold visitor needs outcome, not architecture.

#### Cell 1: "One memory, every tool"

Problem: the visual shows sources and clients, but the copy does not clearly distinguish import sources from connected MCP clients. `+ any` is vague and risky.

Fix: label it as:

> Capture from here. Recall over there.

Show two rails:

- Captured/imported: Claude Code, Codex CLI, ChatGPT export, Claude export, Gemini export, Grok export, files.
- Connected today: Claude Desktop, Claude Code, Cursor, Codex.

#### Cell 2: "Local-first, nothing leaves silently"

Problem: the visual says "embeddings only - text never sent." That does not match the privacy contract. Search query text and content snippets go to Voyage for embeddings, and triage/metadata/digests use Codex CLI by default. Source: `/Users/clement/projects/second-brain/docs/feedback/PRIVACY.md:16-27`, `/Users/clement/projects/second-brain/docs/feedback/PRIVACY.md:96-118`.

Fix copy:

> Stored locally. Network calls explicit.

Visual should show:

- Local: transcripts, raw exports, vector index, results.
- Voyage: snippets + semantic search query for embeddings.
- Codex CLI: triage and metadata under your own account.
- Rift/Clem: no content by default.

This is more complex, but it is the truth. For privacy-sensitive software, precision is conversion.

#### Cell 3: "Current truth, not just recent"

This is the best bento cell. It shows judgment instead of storage.

Problem: the example uses pricing and `Flat €19/month`, but launch docs mention `€29/mo` in an older product plan. If pricing is not locked publicly, do not put a price inside demo UI. Source conflict: `/Users/clement/projects/second-brain/LAUNCH.md:89-101` vs homepage demo at `/Users/clement/projects/rift/app/home-content.tsx:336`.

Fix: use a non-pricing example:

> AUTH.md says Redis token bucket. Old chat suggested express-rate-limit. Rift chooses the live file and marks the chat superseded.

#### Cell 4: "Token-aware, compact by default"

Good underlying point, weak phrasing.

Technical translation: tokens are the chunks of text an AI model can read. Smaller context means the model has less irrelevant text to wade through.

Better heading:

> Context without transcript bloat.

Better copy:

> Rift gives the agent a compact brief: decisions, constraints, examples, and sources. Not a raw chat dump.

#### Cell 5: "Five tools, one MCP surface"

This is developer-facing. It should not be in the main bento for beta visitors.

Fix: demote to docs or replace with:

> Agents can ask mid-task.

Copy:

> Claude Code, Codex, Cursor, and Claude Desktop can ask Rift for context while you work, instead of waiting for you to paste history.

#### Cell 6: "Import in bulk, straight from the app"

Problem: this over-promises. The verified docs say historical backfill is separate, paid, audited, and tuned. The runbook has daily/weekly processing limits. Source: `/Users/clement/projects/second-brain/README.md:135-154`, `/Users/clement/projects/second-brain/docs/historical-import-runbook.md:86-99`.

Fix:

> Backfill old archives when they are worth it.

Copy:

> Start with forward capture. For large archives, Rift can run a guided backfill: import, audit, triage, and validation so junk does not poison memory.

### LLM-Wiki Editorial Block

Current issue: too inside-baseball and too long. Source: `/Users/clement/projects/rift/app/home-content.tsx:642-658`.

The "map and territory" line is clever, but it reads like essay copy in the middle of a conversion page.

Recommendation:

- Move later.
- Cut by 60 percent.
- Make it about the buyer, not Karpathy.

Replacement:

> Your wiki holds what you chose to write down. Rift remembers the working trail: decisions, dead ends, implementation details, and constraints buried in real sessions.

### Terminal Proof

This is the clearest product moment.

Move it above the bento.

Current issue: the proof uses a dark terminal card, which visually stands apart from the otherwise quiet page. That can work, but the page needs to frame it as the key product moment, not an afterthought.

Recommended proof structure:

1. User asks a normal task.
2. Agent calls `rift_context_pack`.
3. Rift returns one prior decision and one source.
4. Agent changes code based on that memory.
5. Short caption: "No re-explaining. No transcript dump."

### CTA

Current CTA says `free while in beta - macOS` and `Download for macOS`. Source: `/Users/clement/projects/rift/app/home-content.tsx:793-823`.

Problem: a raw download CTA increases unqualified support load. The product is private beta, depends on Mac, Node/Codex/Voyage setup, and has a nuanced privacy model.

Recommendation:

- Primary: `Request private beta access`
- Secondary: `Read setup requirements`
- Include "macOS only" and "opening new seats soon."

Better final CTA:

> Bring your AI history with you.

Subcopy:

> Opening private beta seats for Mac users who already work across Claude, Codex, Cursor, or large AI chat archives. Start with forward capture. Backfill history when it is worth doing properly.

## Copy System

Use one narrative spine everywhere:

1. Work happened.
2. AI tools forget it or trap it.
3. Rift captures/imports it.
4. Rift stores it locally.
5. Connected agents retrieve the useful slice.
6. The next task starts with prior decisions, not a blank slate.

Avoid these phrases:

- unlimited context
- local memory layer
- smarter every session
- sharper with each session
- right slice
- one MCP surface
- AI tools
- never leaves your machine, unless scoped
- any tool, unless it is actually supported

Preferred vocabulary:

- remembered work
- prior decisions
- source-grounded context
- compact brief
- private memory on your Mac
- connected agents
- import sources
- supported clients
- explicit network calls
- forward capture
- guided backfill

## Concrete Copy Replacements

### Hero

Eyebrow:

> Private beta for Mac AI power users

H1:

> Stop re-explaining your work to every AI tool.

Subhead:

> Rift turns your chats, code sessions, and project decisions into private memory on your Mac. Connected agents pull compact, source-grounded context when they need it.

CTA:

> Request private beta access

Secondary:

> See it remember a decision

### Proof Section

Headline:

> Your agent remembers the decision behind the task.

Subcopy:

> Ask normally. Rift finds the relevant past decision, the reason behind it, and the source it came from, then gives your agent enough context to act.

### How It Works

Headline:

> How Rift turns past AI work into usable memory.

Steps:

1. `Capture and import`  
   New Claude Code and Codex sessions are captured automatically. ChatGPT, Claude, Gemini, and Grok exports can be imported when you choose.

2. `Index locally`  
   Rift stores transcripts, metadata, and the search index on your Mac, with explicit network calls for embeddings and triage.

3. `Recall mid-task`  
   Claude, Codex, Cursor, and Claude Desktop ask Rift for compact context instead of making you paste old conversations.

### Privacy

Headline:

> Local by default. Honest about the exceptions.

Subcopy:

> Your stored transcripts and search index stay on your Mac. Semantic search uses Voyage AI for embeddings. Triage uses your authenticated Codex CLI by default. Rift does not receive your content telemetry.

### Backfill

Headline:

> Old archives need triage, not blind import.

Subcopy:

> Forward capture starts after install. If you want past AI work indexed too, Rift can backfill historical exports through a guided process: import, audit, triage tuning, and review of what should be remembered.

### Final CTA

Headline:

> Bring your AI history with you.

Subcopy:

> Opening private beta seats for Mac users who already work across multiple AI tools. Connect your agents now; backfill the archive when it is worth doing right.

## Visual Direction

The current visual direction is close, but too templated:

- white page
- black text
- emerald accent
- pill CTAs
- dot grid
- bento grid
- fake app screenshots
- terminal proof

That is not bad. It is just recognizable as "AI SaaS landing page."

Recommended direction: quiet, technical, proof-heavy, almost 1Password/Raycast for AI memory. Fewer decorative modules, more believable product artifacts.

### Keep

- The black diamond wordmark.
- The restrained monochrome base.
- The terminal proof as product evidence.
- The "current truth" idea.

### Change

- Replace generic dot-grid atmosphere with a more product-specific memory/provenance motif.
- Use fewer pills.
- Use real source/provenance UI instead of fake SaaS chrome.
- Make screenshots feel like evidence, not illustration.
- Reduce repeated green dots and badges.

## Responsive and Front-End Issues

This is not just a copy review. The mobile layout currently breaks.

Observed:

- The bento rows remain horizontal three-column flex rows on mobile. Source: `/Users/clement/projects/rift/app/home-content.tsx:584`, `/Users/clement/projects/rift/app/home-content.tsx:614`.
- Many bento visuals are fixed at `width: 300`, so they overflow narrow columns.
- The hero H1 is fixed at `66px` without responsive sizing. Source: `/Users/clement/projects/rift/app/home-content.tsx:83`.
- Carousel slides have fixed desktop-like dimensions. Source examples: `/Users/clement/projects/rift/app/carousel.tsx:28`, `/Users/clement/projects/rift/app/carousel.tsx:314`, `/Users/clement/projects/rift/app/carousel.tsx:511`.
- Visual QA screenshot at 390px wide shows the bento text squeezed into narrow vertical columns and visuals cropped. Screenshot generated locally: `/tmp/rift-how-mobile.png`.

Recommendation:

- Stack bento cells on mobile.
- Replace fixed `width: 300` visuals with `width: min(100%, 300px)`.
- Use responsive heading sizing with `clamp`.
- On mobile, replace the carousel with one static proof or a swipe-native component.
- Ensure every visual module can stand alone at 320px width.

Automated detector result:

- `npx impeccable --json app/home-content.tsx app/carousel.tsx` found one warning: layout property animation at `/Users/clement/projects/rift/app/carousel.tsx:838`, where dot indicator width transitions. In plain English: animating width makes the browser recalculate layout. Use transform/opacity or a fixed-size indicator instead.

## LLM-ish Polish List

Fix these before opening more seats:

1. Non-clickable nav labels  
   Source: `/Users/clement/projects/rift/app/home-content.tsx:44-52`. Make them links or remove them.

2. Hero eyebrow  
   "the local memory layer for AI tools" sounds generated. Replace with beta/audience framing.

3. "Unlimited context"  
   Replace everywhere, including metadata. Source: `/Users/clement/projects/rift/app/layout.tsx:23`, `/Users/clement/projects/rift/app/home-content.tsx:85`.

4. "Read the docs" linking to `#how`  
   If it is not docs, do not call it docs. Use "See how it works."

5. Repeated "smarter/sharper each session"  
   Vague. Replace with the concrete mechanism: "Every useful recall shortens the next task."

6. "Right slice"  
   Explain once as "compact context pack: decisions, constraints, examples, and sources." Then stop repeating "slice."

7. Privacy overclaims  
   Replace "never leaves your machine" with scoped language: stored data stays local; embeddings/search queries and triage have named network paths.

8. Fake-looking pricing artifacts  
   Avoid `Flat €19/month` unless public pricing is locked and consistent across docs. It distracts from the product proof.

9. Decorative breadcrumbs  
   Breadcrumbs like `src > routes > checkout.ts` are fine inside a real editor screenshot, but they should support provenance. Better: show "Source: api-gateway decision, Mar 3, superseded by AUTH.md" when the product claim is memory provenance.

10. Terminal/browser chrome overload  
    Too many fake UI shells dilute the proof. Use one excellent proof instead of four plausible mockups.

## Private Beta Framing

The page can and should look like a serious private beta, not a $10M ARR enterprise site.

That means:

- Be honest about Mac-only.
- Be honest that backfill is guided/paid.
- Make the CTA request/seat-based, not mass-download-first.
- Show one real workflow instead of many generic feature claims.
- Name the setup requirements earlier: macOS, Node/Codex/Voyage beta key if still required.

Recommended beta banner:

> Private beta. Opening new Mac seats soon.

Support copy:

> Best for people already using Claude Code, Codex, Cursor, or large AI chat archives.

## Priority Action Plan

### P0 - Fix before opening more seats

1. Replace hero positioning: kill "unlimited context."
2. Move terminal proof directly under hero.
3. Fix mobile bento/carousel responsiveness.
4. Remove fake nav items or make them real links.
5. Correct privacy language to match the privacy contract.
6. Replace "Download" CTA with "Request private beta access" if the beta is seat-gated.

### P1 - Strong conversion lift

1. Add a 3-step "How Rift works" section.
2. Split compatibility into "imports from" and "serves to."
3. Turn historical import into a guided-backfill story.
4. Rewrite bento cells as outcomes, not architecture.
5. Use one consistent demo storyline across hero, bento, and proof.

### P2 - Polish

1. Reduce pills and labels.
2. Remove or shorten the Karpathy/wiki block.
3. Replace decorative breadcrumbs with provenance cues.
4. Fix the carousel indicator layout animation.
5. Align metadata with the new positioning.

## Recommended New Page Outline

1. Nav: Rift, How it works, Privacy, Request access
2. Hero: "Stop re-explaining your work to every AI tool."
3. Proof: agent recalls a real prior decision and applies it
4. How it works: capture/import -> index locally -> recall mid-task
5. Compatibility: imports from vs connected clients
6. Trust: stored locally, named network calls
7. Historical backfill: forward capture now, guided archive import when worth it
8. Capabilities grid: six outcome-driven cards
9. Optional philosophy: wiki + working trail
10. Final CTA: private beta seats opening soon

## Final PMM Take

Rift should not sound like an AI memory gadget. It should sound like defensive infrastructure for people whose work now happens across AI tools.

The enemy is not "lack of context." The enemy is evaporation: decisions trapped in old chats, memory trapped in one vendor, and agents starting from zero even though the work already happened.

That is the homepage.

