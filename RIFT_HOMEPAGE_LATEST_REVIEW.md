# Rift Homepage Latest Review - PMM + Front-End Design

Date: 2026-05-29  
Scope: latest current worktree in `/Users/clement/projects/rift`  
Reviewed against: `/Users/clement/projects/rift/app/home-content.tsx`, `/Users/clement/projects/rift/app/start/page.tsx`, `/Users/clement/projects/rift/app/layout.tsx`, `/Users/clement/projects/rift/app/page.tsx`, rendered desktop/mobile screenshots, and product truth in `/Users/clement/projects/second-brain`.

## Executive Verdict

The latest version is materially better than the previous homepage.

The page is now intentionally lean for private beta: hero, proof, how-it-works, CTA. That is the right strategic direction. The old overloaded carousel and six-cell bento are hidden behind `SHOW_FULL_PAGE = false`, so the live page no longer asks visitors to digest the whole architecture before seeing value.

The remaining problem is not visual bloat anymore. The problem is precision.

The page still uses broad language like "every model", "any tool that speaks MCP", and "every model you use" while the product truth is more specific: Rift auto-captures Claude Code and Codex CLI, imports selected web archives, and serves memory to Claude Desktop, Claude Code, Cursor, and Codex through MCP. That is strong enough. It does not need over-broad wording.

My CTO recommendation: keep the lean structure, fix the broken `#how` anchor, tighten "model" into "tools you actually use", and make the proof section carry more of the product outcome in plain language.

## What Changed For The Better

### The Page Is Now Private-Beta Shaped

Current source has:

```ts
const SHOW_FULL_PAGE = false;
```

Source: `/Users/clement/projects/rift/app/home-content.tsx:12-15`.

This means the visible homepage is:

1. Nav
2. Hero
3. Proof terminal
4. How it works
5. Final CTA
6. Footer

Source: `/Users/clement/projects/rift/app/home-content.tsx:824-834`.

This is a better sequence for a private beta. It feels less like a public SaaS page trying to sell every feature at once.

### Fake Nav Is Mostly Gone

The previous nav had fake spans for Product, Docs, Pricing, and Sign in. The latest nav has real links: How it works and Privacy, plus Get started. Source: `/Users/clement/projects/rift/app/home-content.tsx:49-63`.

This is a major trust improvement. Non-clickable nav items make a page feel AI-generated. The latest page mostly avoids that.

### The Worst Mobile Bento Failure Is Gone From The Live Page

The old bento grid was three columns on mobile and became unreadable. The hidden feature grid now stacks on mobile with `flex-col` and switches at `md:flex-row`. Source: `/Users/clement/projects/rift/app/home-content.tsx:425`, `/Users/clement/projects/rift/app/home-content.tsx:455`.

Since `SHOW_FULL_PAGE = false`, the bento is not currently rendered anyway. Good.

### Privacy Copy Is More Honest

The hidden local-first visual now names the two outgoing paths:

- Voyage AI: embeddings, snippets, and query.
- Codex CLI: triage under the user's OpenAI account.

Source: `/Users/clement/projects/rift/app/home-content.tsx:180-216`.

That matches the privacy contract much better than the previous "text never sent" phrasing. Product truth: `/Users/clement/projects/second-brain/docs/feedback/PRIVACY.md:16-27` and `/Users/clement/projects/second-brain/docs/feedback/PRIVACY.md:96-118`.

## P0 Issues

### P0.1 - "See how it works" Is Broken

The live CTAs point to `#how`:

- Nav: `/Users/clement/projects/rift/app/home-content.tsx:50`
- Hero secondary CTA: `/Users/clement/projects/rift/app/home-content.tsx:107`
- Final CTA secondary CTA: `/Users/clement/projects/rift/app/home-content.tsx:792`
- Start page "Read how Rift works": `/Users/clement/projects/rift/app/start/page.tsx:135`

But the visible `HowItWorks` section does not have `id="how"`. Source: `/Users/clement/projects/rift/app/home-content.tsx:647-674`.

There is an `id="how"` on the hidden `Features` section, but that section is not rendered because `SHOW_FULL_PAGE = false`. Source: `/Users/clement/projects/rift/app/home-content.tsx:410-412` and `/Users/clement/projects/rift/app/home-content.tsx:831-832`.

What this means in plain English: the secondary CTA looks like it will scroll the user to the explanation, but it stays at the top. That breaks the main "still researching" path.

Fix:

```tsx
function HowItWorks() {
  return (
    <section id="how" className="border-t border-[#ededed]">
      ...
    </section>
  );
}
```

Then retest:

- `/`
- `/#how`
- `/start` -> `Read how Rift works`
- Hero `See how it works`
- Final CTA `See how it works`

### P0.2 - Hero Overclaims With "Every Model"

Current H1:

> One memory for every model you use.

Source: `/Users/clement/projects/rift/app/home-content.tsx:90`.

Problem: the product connects tools and clients, not "models" directly. "Model" means the underlying AI engine, like Claude, GPT, Gemini, or Grok. "Tool" means the app or client the user works in, like Claude Code, Cursor, Codex, or Claude Desktop.

The visible compatibility pills say:

- Claude Code
- Cursor
- Codex
- Claude Desktop

Source: `/Users/clement/projects/rift/app/home-content.tsx:130-137`.

Those are tools, not models. The copy and the UI disagree.

Recommendation:

Use tool/work language instead of model language.

Best H1:

> One private memory for the AI tools you actually use.

Sharper H1:

> Stop starting from zero when you switch AI tools.

Most PMM-driven H1:

> Your AI work should survive the tool switch.

Recommended subcopy:

> Rift captures your Claude Code and Codex sessions, imports the archives worth keeping, and gives Claude, Cursor, and Codex compact context while you work.

That is less grandiose and more believable.

### P0.3 - "Any Tool That Speaks MCP" Is Too Broad For First-Viewport Copy

Current hero body:

> serves it to any tool that speaks MCP

Source: `/Users/clement/projects/rift/app/home-content.tsx:92-95`.

Technical translation: MCP is the connector standard that lets an AI app call a local tool like Rift.

Problem: "any tool that speaks MCP" is a developer-facing claim. It is also a support burden. A visitor may assume any AI app they use will just work. The repo-supported installation list is more concrete: Claude Desktop, Claude Code, Cursor, and Codex. Source: `/Users/clement/projects/second-brain/README.md:76-91`.

Fix:

> ...and gives Claude Desktop, Claude Code, Cursor, and Codex the context they need over MCP.

Then later, in a compatibility section or docs:

> Other MCP-capable clients can connect manually.

That preserves the extensibility without making it the hero promise.

### P0.4 - CTA Strategy Still Does Not Match "Opening New Seats Soon"

The current CTA is `Get started`, linking to `/start`. Source: `/Users/clement/projects/rift/app/home-content.tsx:58-63`, `/Users/clement/projects/rift/app/home-content.tsx:97-105`, `/Users/clement/projects/rift/app/home-content.tsx:782-790`.

The `/start` page is honest about private beta prerequisites: macOS 12.3+, Node 20+, signed-in Codex CLI, and an embedding key from Clem. Source: `/Users/clement/projects/rift/app/start/page.tsx:86-110`.

The question is strategic:

- If new seats are manually controlled, "Get started" is too open. Use "Request access" or "Join private beta."
- If the install is intentionally open to invited users who already have the link, "Get started" is acceptable, but the hero should say "Private beta setup" or "Start setup" to set expectations.

My recommendation for the current project context:

Primary CTA:

> Join private beta

Secondary:

> See how it works

If you keep direct install:

> Start private beta setup

This avoids attracting unqualified users who are not ready for Terminal, Node, Codex CLI, and beta keys.

## P1 Issues

### P1.1 - The Proof Section Is Correctly Placed, But Undersold

The proof now appears immediately after the hero. Good.

Current headline:

> You don't ask Rift. Your agent does - mid-task.

Source: `/Users/clement/projects/rift/app/home-content.tsx:522-528`.

Problem: this explains the mechanism, not the outcome. A non-developer may not care who "asks Rift." They care that the agent remembers the prior decision and acts correctly.

Better headline:

> Your agent finds the decision before it edits.

Better subcopy:

> Ask normally. Rift finds the prior decision, the reason behind it, and the source it came from, then gives your agent enough context to act.

Even better if the terminal caption explicitly says:

> No re-explaining. No transcript dump. The agent gets the one decision that matters.

### P1.2 - The Proof Visual Is Dense For The One Thing It Needs To Prove

The terminal visual is the strongest proof, but it is still coded like a full terminal transcript. Source: `/Users/clement/projects/rift/app/home-content.tsx:531-621`.

The useful story is:

1. User asks for rate limiting.
2. Agent calls `rift_context_pack`.
3. Rift returns a prior Redis token-bucket decision.
4. Agent updates checkout accordingly.

Everything else is secondary.

Recommendation:

Make those four beats visually obvious. Today the terminal requires reading small mono text and inferring the value. On a marketing homepage, the product proof should be legible in three seconds.

Concrete changes:

- Add a small side label or caption: `Prior decision recalled`.
- Highlight only the recalled decision and resulting edit.
- Reduce low-value terminal chrome.
- On mobile, collapse the terminal into a simplified "prompt -> recalled decision -> edit" panel rather than a miniature terminal.

### P1.3 - The Page Now Has Too Little Compatibility Detail

The visible page has a small "works in" pill row. Source: `/Users/clement/projects/rift/app/home-content.tsx:122-138`.

That is clean, but it hides an important distinction:

- Rift imports from ChatGPT, Claude, Grok, Gemini, files, Claude Code, Codex CLI.
- Rift serves to Claude Desktop, Claude Code, Cursor, and Codex.

The hidden Compatibility component explains this well. Source: `/Users/clement/projects/rift/app/home-content.tsx:677-759`.

Recommendation:

For private beta, do not render the full compatibility section if you want to stay lean. But add one compact line near the works-in row:

> Imports old ChatGPT, Claude, Grok, and Gemini exports. Connects today to Claude Desktop, Claude Code, Cursor, and Codex.

This prevents confusion and reduces support questions.

Accuracy note: the hidden `IMPORT_FROM` list currently omits Gemini even though the product parser list supports `gemini_web`. Source: `/Users/clement/projects/rift/app/home-content.tsx:679-686` vs `/Users/clement/projects/second-brain/src/ingestion/parsers/types.ts:28-43`.

Either add Gemini to the homepage or deliberately remove it from the product claim if it is not ready for beta users.

### P1.4 - The How-It-Works Section Exists, But The Live Page Does Not Make It Easy To Reach

The section is good in concept:

- Capture and import
- Index on your Mac
- Recall mid-task

Source: `/Users/clement/projects/rift/app/home-content.tsx:629-674`.

Problems:

- It lacks the `id="how"` anchor, covered above.
- The H2 is generic: "From scattered AI work to memory your agents can use."
- The third step says "Any MCP client" and "five tools", which pulls the visitor back into technical surface area too early.

Better H2:

> How Rift turns past AI work into reusable context.

Better step 3:

> Connected tools ask Rift for a compact brief: decisions, constraints, and sources. You keep working instead of pasting old chats.

### P1.5 - Metadata Still Has Split Positioning

Homepage metadata in `app/page.tsx`:

> Rift - Local-first memory for AI tools

Source: `/Users/clement/projects/rift/app/page.tsx:4-6`.

Global metadata in `app/layout.tsx`:

> Rift - Private, local memory for your AI tools

Source: `/Users/clement/projects/rift/app/layout.tsx:21-25`.

Not fatal, but this should become one canonical phrase.

Recommended canonical metadata:

Title:

> Rift - Private memory for your AI tools

Description:

> Rift captures Claude Code and Codex sessions, imports AI chat archives, and gives Claude, Cursor, and Codex compact context from memory stored on your Mac.

Avoid "every", "any", and "model" in metadata until all of those claims are strictly true.

## P2 Issues

### P2.1 - Footer Label Regresses To "Download"

Footer link says `Download`, while every visible primary CTA says `Get started`. Source: `/Users/clement/projects/rift/app/home-content.tsx:814-816`.

Fix:

Use `Get started` or `Start setup`.

### P2.2 - The Final CTA Is Clear But Generic

Current:

> Give your AI a memory that's actually yours.

Source: `/Users/clement/projects/rift/app/home-content.tsx:772-779`.

This is understandable, but it is still common AI-memory phrasing. It does not carry the stronger wedge: your work should not be trapped in a vendor app.

Better final CTA:

> Take your AI work with you.

or:

> Keep the memory when you switch tools.

Subcopy:

> Private beta on macOS. New Claude Code and Codex sessions start compounding immediately. Historical archives can be imported when they are worth doing properly.

### P2.3 - Hidden Bento Is Much Better, But Still Not Ready For Public Mode

The hidden bento is no longer the main issue because it is not rendered. If `SHOW_FULL_PAGE` becomes `true`, review these before launch:

- `TokenViz` still uses specific numbers: `48 KB`, `12k tokens`, `3.8 KB`, `950 tokens`, `-92%`. Source: `/Users/clement/projects/rift/app/home-content.tsx:291-303`. If those are not benchmarked, make them illustrative or remove numbers.
- `FlowDiagram` only shows ChatGPT as an import source and omits Claude/Grok/Gemini. Source: `/Users/clement/projects/rift/app/home-content.tsx:153-170`.
- `McpToolsViz` says "also: search - history - save - status". Source: `/Users/clement/projects/rift/app/home-content.tsx:309-327`. This is implementation detail. Keep it in docs, not in the main page.
- The LLM-wiki section is improved but still insider. Source: `/Users/clement/projects/rift/app/home-content.tsx:483-499`. Keep it hidden unless the traffic source is specifically from AI-power-user content.

## Copy Recommendations

### Recommended Hero

Eyebrow:

> Private memory for AI work on your Mac

H1:

> Stop starting from zero when you switch AI tools.

Subcopy:

> Rift captures your Claude Code and Codex sessions, imports the archives worth keeping, and gives Claude, Cursor, and Codex compact context while you work.

Primary CTA:

> Join private beta

Secondary:

> See how it works

### Conservative Hero If You Want To Stay Closer To Current

Eyebrow:

> Memory for your AI tools, owned locally

H1:

> One private memory for the AI tools you use.

Subcopy:

> Rift turns your AI work into memory stored on your Mac, then gives connected tools the relevant decisions, constraints, and sources when they need them.

### Proof Section

Headline:

> Your agent finds the decision before it edits.

Subcopy:

> Ask normally. Rift retrieves the prior decision and its source, then gives your agent just enough context to act.

Terminal caption:

> Recalled: Redis token-bucket, 100 req/min. Rejected: express-rate-limit, no shared state.

### How It Works

Headline:

> How Rift turns past AI work into reusable context.

Step 1:

> Capture and import  
> New Claude Code and Codex sessions are captured as you work. Past AI archives can be imported when they are worth keeping.

Step 2:

> Index locally  
> Rift stores transcripts, metadata, and search index on your Mac, with outgoing calls named before setup.

Step 3:

> Recall mid-task  
> Claude, Cursor, and Codex ask Rift for a compact brief: decisions, constraints, examples, and sources.

### CTA

Headline:

> Keep the memory when you switch tools.

Subcopy:

> Private beta on macOS. Forward capture starts after setup. Historical archive import is optional and guided.

CTA:

> Join private beta

## Visual Review

### What Works

- The page is calmer and more focused.
- The nav is credible.
- The dark terminal creates a strong contrast moment.
- The page no longer feels like a generic full-bleed SaaS template.
- Mobile no longer has the old unreadable bento grid.

### What Still Feels LLM-Ish

- Dot-grid hero background. It is harmless, but generic.
- Pill compatibility row. Clean, but very common.
- "Give your AI a memory that's actually yours." Clear, but not proprietary.
- Dark terminal proof with tiny code text. It reads as "developer proof", not yet "buyer proof".

### Design Direction Recommendation

Keep the restrained, almost 1Password/Raycast feel. Do not add more illustration. The strongest visual language for Rift is provenance:

- recalled decision
- source
- current vs superseded
- what the agent did with it

In plain English: show the chain of evidence, not abstract memory.

## Design Health Score

| Area | Score | Notes |
|---|---:|---|
| Value proposition clarity | 3/5 | Much clearer than before, but "model" and "MCP" still blur the buyer outcome. |
| Proof strength | 3/5 | Correctly placed, but too dense and mechanism-led. |
| CTA clarity | 3/5 | Consistent `Get started`, but unclear whether this is open setup or gated beta access. |
| Trust/privacy accuracy | 4/5 | Significantly improved; still needs stronger first-page precision. |
| Visual distinction | 3/5 | Clean and restrained, but still somewhat generic. |
| Mobile | 3/5 | Old bento failure fixed, but terminal proof needs a mobile-specific treatment. |
| Information architecture | 4/5 | Lean sequence is right. Broken `#how` anchor is the main issue. |

Overall: 23/35. Strong direction, not yet sharp enough.

## Priority Action Plan

### Fix Now

1. Add `id="how"` to the visible `HowItWorks` section.
2. Replace "every model" / "any tool" with precise tool/client language.
3. Decide if CTA is open setup or request access, then make every CTA match.
4. Change footer `Download` to `Get started` or `Start setup`.
5. Align `app/page.tsx` and `app/layout.tsx` metadata.

### Next Pass

1. Make the proof section outcome-led: prior decision -> source -> edit.
2. Add one compact line explaining import sources vs connected tools.
3. Add Gemini if it is beta-supported, or remove it everywhere if not.
4. Build a mobile-specific proof panel instead of relying on a full terminal transcript.
5. Keep `SHOW_FULL_PAGE = false` for private beta unless there is a specific acquisition reason to expand.

## Final PMM Take

The latest page is no longer trying to be a giant public launch page. That is good.

But it still needs to stop saying "model" when it means "tool", stop saying "any" when it means "supported clients", and stop hiding the how-it-works section behind a broken anchor.

The best version of this homepage is not:

> One memory for every model you use.

It is:

> Stop starting from zero when you switch AI tools.

That is the buyer pain. Everything else should prove it.

