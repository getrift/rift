## **PRD — Rift (V1)**

*A visual "craft debugger" for AI-generated React components.* Rift lets a **1/10 technical** builder paste an AI-generated React/Tailwind component, **see it instantly**, **select an element**, tweak key craft values with **immediate visual feedback**, then **copy the refined code** back into their repo (and optionally remap to their design system later via Cursor).

---

# **1) Context & Problem**

AI can generate 80% of a UI component quickly. The last 20%—spacing, radius, typography, shadows, contrast—is where craft lives, and where prompt-based iteration becomes vague and inefficient.

Today's failure mode:

* You can *see* the component is "meh"
* But you can't precisely *name* what's off
* And changing code without immediate feedback is slow

Rift replaces "make it more Vercel" prompts with a simple loop:  
**see → select → tweak → copy.**

---

# **2) Target User**

* Product designers / indie hackers / builders using LLMs (Cursor/Claude/v0/Bolt)
* Technical comfort: **1/10**
  * Can copy/paste code
  * Doesn't want to learn bundlers, ASTs, Tailwind internals
* Goal: ship high-craft UI faster, learn by iteration (without "being taught")

---

# **3) Goals (V1)**

1. **Instant visual preview** of pasted React/Tailwind component
2. **Element selection** in the preview (click-to-select)
3. **Right-panel craft controls** that update the preview immediately
4. **High-craft shadow editing**, including **multiple shadows** (drop + inner)
5. **Export refined component code** (single "Copy code" action)
6. Work even if the user doesn't understand the code (Rift is allowed to be "magical")

---

# **4) Non-Goals (V1)**

* No multi-file projects, assets, or dependency graphs
* No full DevTools inspector
* No hover/focus/active state simulation
* No automatic design-system remapping (handled later by Cursor)
* No perfect bidirectional "no-code ↔ arbitrary code" sync beyond what Rift controls apply

---

# **5) Product UI Layout (matches reference style)**

**Three-panel layout:**

* **Left sidebar:** paste/edit component code
* **Center:** visual playground (rendered component)
* **Right sidebar:** tweak design values

**Style requirements (from reference image):**

* Dark side panels with soft contrast
* Large rounded corners, subtle inner borders
* Calm, minimal typography
* Floating/stacked controls feel (Framer-like)
* High legibility, low visual noise
* One obvious primary action: **Copy code**

---

# **6) Core Flow (V1)**

1. User pastes TSX into the **left panel**
2. Rift compiles and renders it in the **center canvas**
3. User **clicks an element** to select it (required)
4. Right panel shows **craft controls** for the selected element
5. User tweaks sliders/pickers → **instant visual update**
6. User clicks **Copy refined component** → pastes into repo

---

# **7) Supported Input (V1 Constraints)**

**Supported:**

* Single React component in TSX
* Tailwind classes allowed
* Inline styles allowed

**Runtime constraint (to keep V1 small and reliable):**

* **React + Tailwind only** (no external UI libs required)
* If imports or unsupported dependencies are detected, Rift fails fast with a clear message:
  * "Unsupported dependency in V1. Please paste a React + Tailwind component only."

---

# **8) Interaction Model**

### **8.1 Click-to-select (mandatory)**

* Clicking an element in the preview selects it
* Selection is visually indicated (subtle outline)
* Right panel edits apply **only** to the selected node

### **8.2 How tweaks apply (V1 decision)**

**Allowed approach:** inline style overrides and/or class injection  
Given your answers:

* **Inline overrides are acceptable** (B6: yes)
* Rift can apply changes even if user doesn't understand code (B7: yes)

**Practical V1 rule:**

* Apply changes as **inline styles** to guarantee correctness
* Optionally, also attempt class injection for a few safe primitives later (V1.5+)

---

# **9) Craft Controls (V1)**

Controls appear in the **right sidebar** when an element is selected.

### **9.1 Spacing**

* **Padding** (slider)
  * Controls: 0 → 64 (px), step 1 (or 2)
  * Applies to: `padding`

* **Gap** (slider) — **must-have**
  * Controls: 0 → 48 (px), step 1/2
  * Applies to: `gap` (only meaningful for flex/grid containers)
  * If the selected node isn't a layout container, show disabled with hint:
    * "Gap applies to flex/grid containers."

### **9.2 Shape**

* **Radius** (slider)
  * Controls: 0 → 32 (px)
  * Applies to: `borderRadius`

### **9.3 Typography — must-have**

* **Font size** (slider)
  * Controls: 12 → 32 (px)
  * Applies to: `fontSize`

### **9.4 Color**

* **Text color** (picker + presets)
  * Applies to: `color`
  * Presets should bias toward a "calm pro UI" range (grays + near-whites)

* **Background color** (picker)
  * Applies to: `backgroundColor`

### **9.5 Shadows (core craft feature)**

**Requirement:** multiple shadows, both **drop** and **inner**.

**Shadow Editor UI (right panel section):**

* A list of shadow layers
* Each row:
  * Type: `Drop` / `Inner`
  * Toggle on/off
  * Drag handle (reorder)
  * Expand/collapse
  * Delete

* "+ Add shadow" button

**Shadow layer fields (expanded):**

* X (px)
* Y (px)
* Blur (px)
* Spread (px)
* Color (with opacity)
* Quick presets (optional but high leverage):
  * "Soft elevation"
  * "Crisp elevation"
  * "Inner hairline"
  * "Inner depth"

**CSS output mapping:**

* Drop shadow → `box-shadow: x y blur spread rgba(...)`
* Inner shadow → `box-shadow: inset x y blur spread rgba(...)`
* Multiple layers → comma-separated `box-shadow`

This is the "craft differentiator" of V1.

---

# **10) Export (V1)**

Single action:

* **Copy refined component**

What it copies:

* Full component code with Rift-applied overrides included in a deterministic way

Minimum acceptable output strategy:

* Insert/merge a `style={{ ... }}` object on the selected node(s) you changed
* If multiple nodes were edited, apply per-node changes safely

**No diff patch. No multi-export.**

---

# **11) Error Handling (V1)**

* Compilation/render errors must be obvious and readable
* Show:
  * "Can't render this component"
  * Simplified error message
  * "This V1 supports React + Tailwind only."

---

# **12) Open Decision (your "B8: your call")**

### **Should V1 refuse components without a clear wrapper/root?**

Recommendation for minimalism + reliability:

* **Require a single root element** (no fragment `<>...</>`) in V1
* If a fragment is pasted, show:
  * "V1 requires a single root element. Wrap your component in a <div>."  
    This avoids edge cases in selection + style injection.

(You can relax this later.)

---

# **13) Success Criteria (V1)**

A V1 session is successful if a user can:

* Paste a basic Button/Card/Input component
* Select a node
* Make it noticeably "more pro" using:
  * padding + radius + font size + text/bg + multi-shadow
* Copy code into repo
* Do it in **under 3 minutes**

Suggested metrics:

* Time-to-preview < 30s
* Export rate > 60% of sessions
* "Would use weekly" qualitative signal from testers

---

# **14) External Challenge Questions (scope-killers)**

Ask reviewers to challenge only **Relevance** and **Minimalism**.

### **Relevance**

1. Is "AI last-mile craft" a recurring pain, or just occasional annoyance?
2. For a 1/10 technical user, what's the real blocker: diagnosis or execution?
3. Would you actually paste components into a separate tool, or do you stay in Cursor no matter what?

### **Minimalism**

4. If we shipped V1 with **only**:
   * padding, gap, radius, font size, text color, bg color, multi-shadows  
     would that already be "weekly useful"?

5. Is click-to-select essential, or could V1 tweak only the root element?
6. Is supporting only React+Tailwind acceptable, or does that kill adoption?
7. Do multiple shadows justify their complexity, or is one shadow "good enough"?
