# 🧠 Rift LLM Playbook

> How to safely use AI assistants (Cursor, ChatGPT, Claude, etc.) with the Rift repo.

This document **can be committed**. It describes the workflow at a high level but does **not** expose the private instructions you use locally.

---

## 1. Files & Responsibilities

**Committed (public):**

- `docs/rift-spec.md`  
  → Formal description of the `.rift/` spec (tokens, typography, config, design rules).
- `docs/01-design-guidelines.md`  
  → Visual system and UX guidelines (density, spacing, radii, states, etc.).
- `docs/llm-playbook.md`  
  → This file. Explains how to integrate AI tools with the project.

**Local-only, gitignored:**

- `.llm/AGENTS.md`  
  → Operating instructions for authoring LLMs (how they should write/refactor code).
- `.llm/REVIEW.md`  
  → Checklist and rules for reviewer LLMs (what to approve vs reject).

The `.llm` folder contains **personal workflow metadata** and must not be committed.

---

## 2. Git Setup

To keep local AI workflows private, add this to your root `.gitignore`:

```gitignore
# Local-only LLM meta docs
.llm/
```

You are free to keep additional prompt files or scratchpads in `.llm/` as well.

---

## 3. Recommended LLM Workflow

### 3.1 Authoring Changes (Cursor / ChatGPT “builder mode”)

When you ask an AI assistant to implement changes:

1. Ensure it has access to:
   - `.llm/AGENTS.md`
   - `docs/rift-spec.md`
   - `docs/01-design-guidelines.md`
2. Start your prompt with something like:

   > You are working on the Rift repo.  
   > Read `.llm/AGENTS.md`, `docs/rift-spec.md`, and `docs/01-design-guidelines.md` first.  
   > Then, propose a plan and implement the change while respecting all constraints.

3. Ask it to include a short Self-Audit section in the final answer, following the checklist from `.llm/AGENTS.md`.

### 3.2 Reviewing Changes (Claude / ChatGPT “reviewer mode”)

For reviews, use a separate model or session:

1. Provide:
   - `.llm/REVIEW.md` contents.
   - The relevant diff or full files.
2. Prompt shape (simplified):

   > You are a senior architect reviewing a change to the Rift repo.  
   > Use the rules and checklist from `.llm/REVIEW.md`.  
   > Answer each checklist item, then give a verdict: Approved / Changes Requested / Rejected.


