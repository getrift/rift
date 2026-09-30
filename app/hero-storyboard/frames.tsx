import { ProviderMark, type MarkId } from "../provider-icons";

/* Locked hero frames — single source of truth for the static storyboard
   (/hero-storyboard) AND the motion animatic (/hero-motion). Pure presentational
   (no hooks, no server-only) so both a server and a client component can import it.
   Spine (locked): power → conversation creates value → tool switch drops the thread
   → markdown helps then loses nuance → human becomes the memory bus → Rift makes the
   work reusable across agents. Static visuals only — motion lives in /hero-motion. */

export const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
export const ink = "var(--ink)";
export const sub = "var(--ink-subtle)";
export const faint = "var(--ink-faint)";
export const muted = "var(--ink-muted)";
const border = "var(--border)";
const borderS = "var(--border-strong)";
const ORANGE = "#d97757";
export const BLUE = "#8aa0ff";
export const RED = "#f08a82";
export const GREEN = "#7fd1c0";
const PURPLE = "#c58ae0";
const TYPE = "#e2a26a";
const SELBG = "rgba(138,160,255,0.22)";

const TOOLS: Record<string, { name: string; accent: string; mark: MarkId }> = {
  claude: { name: "Claude Code", accent: ORANGE, mark: "claude" },
  cursor: { name: "Cursor", accent: "#cfd3da", mark: "cursor" },
  codex: { name: "Codex CLI", accent: BLUE, mark: "chatgpt" },
  chat: { name: "Claude", accent: ORANGE, mark: "claude" },
};
const abs = (s: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...s });

// ---- chrome / panes ----
function Bar({ tool, tab, right }: { tool: keyof typeof TOOLS; tab?: string; right?: React.ReactNode }) {
  const m = TOOLS[tool];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", borderBottom: `1px solid ${border}`, background: "#101113" }}>
      <span style={{ display: "inline-flex", gap: 5 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
      </span>
      <span style={{ marginLeft: 4, display: "inline-flex", alignItems: "center", gap: 6, color: sub, fontSize: 10.5, fontWeight: 600 }}>
        <span style={{ color: m.accent, display: "inline-flex" }}>
          <ProviderMark id={m.mark} size={11} />
        </span>
        {m.name}
      </span>
      {tab && <span style={{ marginLeft: 8, fontFamily: mono, fontSize: 9.5, color: faint }}>{tab}</span>}
      {right && <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 9.5, color: faint }}>{right}</span>}
    </div>
  );
}
function Pane({ tool, tab, right, children, style, dim, className }: { tool: keyof typeof TOOLS; tab?: string; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties; dim?: boolean; className?: string }) {
  return (
    <div className={className} style={{ borderRadius: 9, border: `1px solid ${border}`, background: "#0a0b0d", overflow: "hidden", boxShadow: "0 26px 70px rgba(0,0,0,0.55)", opacity: dim ? 0.42 : 1, ...style }}>
      <Bar tool={tool} tab={tab} right={right} />
      {children}
    </div>
  );
}
function Tree({ items }: { items: { f: string; on?: boolean; tone?: string }[] }) {
  return (
    <div style={{ borderRight: `1px solid ${border}`, padding: "8px 6px", fontFamily: mono, fontSize: 10, minWidth: 104 }}>
      <div style={{ color: faint, marginBottom: 4 }}>▾ src</div>
      {items.map((it) => (
        <div key={it.f} style={{ padding: "1.5px 6px", marginLeft: 6, borderRadius: 4, color: it.tone || (it.on ? "#cfd6ff" : sub), background: it.on ? "rgba(138,160,255,0.12)" : undefined, whiteSpace: "nowrap" }}>
          {it.f}
        </div>
      ))}
    </div>
  );
}
function Editor({ tab, tree, children, chat, style, dim, right, className }: { tab: string; tree: { f: string; on?: boolean; tone?: string }[]; children: React.ReactNode; chat?: React.ReactNode; style?: React.CSSProperties; dim?: boolean; right?: React.ReactNode; className?: string }) {
  return (
    <Pane tool="cursor" tab={tab} right={right} style={style} dim={dim} className={className}>
      <div style={{ display: "grid", gridTemplateColumns: chat ? "auto 1fr 232px" : "auto 1fr", minHeight: 150 }}>
        <Tree items={tree} />
        <div style={{ padding: "9px 4px 9px 0", fontFamily: mono, fontSize: 11, lineHeight: 1.65 }}>{children}</div>
        {chat && <div style={{ borderLeft: `1px solid ${border}`, padding: "9px 10px", background: "rgba(255,255,255,0.012)" }}>{chat}</div>}
      </div>
    </Pane>
  );
}
// code line with gutter; segs = array of [text, color]
function Ln({ n, segs, bg, className }: { n?: number; segs: [string, string?][]; bg?: string; className?: string }) {
  return (
    <div className={className} style={{ display: "flex", background: bg, padding: "0 8px" }}>
      <span style={{ width: 18, color: faint, opacity: 0.6, userSelect: "none", textAlign: "right", marginRight: 10, flexShrink: 0 }}>{n ?? ""}</span>
      <span style={{ whiteSpace: "pre", color: muted }}>
        {segs.map(([t, c], i) => (
          <span key={i} style={c ? { color: c } : undefined}>{t}</span>
        ))}
      </span>
    </div>
  );
}
function Term({ tool, lines, style, dim, label, className }: { tool: keyof typeof TOOLS; lines: React.ReactNode[]; style?: React.CSSProperties; dim?: boolean; label?: string; className?: string }) {
  return (
    <Pane tool={tool} tab={label} style={style} dim={dim} className={className}>
      <div style={{ padding: "10px 12px", fontFamily: mono, fontSize: 11, lineHeight: 1.75, color: muted }}>
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </Pane>
  );
}
function Bubble({ role, children, state, className, lg }: { role: "you" | "agent"; children: React.ReactNode; state?: "dim" | "hl"; className?: string; lg?: boolean }) {
  const agent = role === "agent";
  // opacity left unset when not dim so the motion page's reveal CSS/JS can drive it.
  // `lg` = thesis weight: bigger, brighter (ink, not muted), stronger glow — for the
  // resolved line that the whole film returns to as the F15 poster.
  return (
    <div className={className} style={{ alignSelf: agent ? "flex-start" : "flex-end", maxWidth: lg ? "94%" : "86%", ...(state === "dim" ? { opacity: 0.45 } : null) }}>
      <div style={{ fontFamily: mono, fontSize: 8.5, color: faint, marginBottom: 3, textAlign: agent ? "left" : "right" }}>{agent ? "Claude" : "you"}</div>
      <div
        style={{
          borderRadius: 9,
          padding: lg ? "10px 14px" : "7px 10px",
          fontSize: lg ? 14.5 : 11.5,
          lineHeight: lg ? 1.4 : 1.45,
          fontWeight: lg ? 600 : undefined,
          letterSpacing: lg ? "-0.01em" : undefined,
          color: agent && !lg ? muted : ink,
          background: agent ? "rgba(255,255,255,0.03)" : "rgba(247,248,248,0.07)",
          border: `1px solid ${state === "hl" ? GREEN + "66" : border}`,
          boxShadow: state === "hl" ? `0 0 ${lg ? 32 : 22}px ${GREEN}${lg ? "3a" : "22"}` : undefined,
          textDecoration: state === "dim" ? "line-through" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
function You({ children }: { children: React.ReactNode }) {
  return (
    <span>
      <span style={{ color: GREEN }}>you ▸</span> {children}
    </span>
  );
}
function Agent({ children }: { children: React.ReactNode }) {
  return (
    <span>
      <span style={{ color: faint }}>agent ▸</span> {children}
    </span>
  );
}
function RiftChip({ className }: { className?: string }) {
  return <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "0 6px", borderRadius: 5, border: `1px solid ${BLUE}66`, background: "rgba(138,160,255,0.12)", color: "#cfd6ff", fontSize: 10.5 }}>◆ rift</span>;
}
function MenuBar({ active }: { active?: boolean }) {
  return (
    <div style={abs({ top: 0, left: 0, right: 0, height: 20, background: "rgba(255,255,255,0.025)", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 13, paddingRight: 46, fontFamily: mono, fontSize: 9, color: faint, zIndex: 3 })}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: active ? BLUE : faint }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: active ? GREEN : faint, boxShadow: active ? `0 0 5px ${GREEN}` : undefined }} />◆ Rift
      </span>
      <span>9:41</span>
    </div>
  );
}
export function Stage({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden", border: `1px solid ${border}`, background: "radial-gradient(130% 130% at 50% 8%, #0e0f12, #08090a 80%)", ...style }}>{children}</div>;
}

export type FrameDef = { n: string; title: string; ts: string; camera: string; feeling: string; takeaway: string; risk: string; visual: React.ReactNode };

export const FRAMES: FrameDef[] = [
  {
    n: "01",
    title: "Agents feel like a superpower",
    ts: "0:00",
    camera: "Slow push-in on the diff landing + the green test pass.",
    feeling: "Momentum — a real person shipping with agents.",
    takeaway: "AI work is real work — and it feels great.",
    risk: "Real session (typing, diff, test pass), one dominant pane bleeding off-frame — not a hero card.",
    visual: (
      <>
        <Editor
          tab="onboarding/route.ts ●"
          style={abs({ left: "4%", top: "12%", width: "70%" })}
          tree={[{ f: "route.ts", on: true }, { f: "layout.tsx" }, { f: "steps/" }, { f: "welcome.ts" }]}
          chat={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="life l01-c1" style={{ fontSize: 11, color: ink }}>
                <You>build the onboarding flow</You>
              </div>
              <div className="life l01-c2" style={{ fontSize: 11, color: muted }}>
                <Agent>done — wiring it now</Agent> <span style={{ color: GREEN }}>✓</span>
              </div>
            </div>
          }
        >
          <Ln n={11} segs={[["export async function ", PURPLE], ["onboard", BLUE], ["(req) {"]]} />
          <Ln n={12} segs={[["  const step = ", muted], ["await ", PURPLE], ["nextStep", BLUE], ["(req)"]]} bg="rgba(127,209,192,0.1)" />
          <Ln className="life l01-d1" n={13} segs={[["+   await track(", GREEN], ["'onboard_start'", GREEN], [")", GREEN]]} bg="rgba(127,209,192,0.12)" />
          <Ln className="life l01-d2" n={14} segs={[["+   return render(step)", GREEN]]} bg="rgba(127,209,192,0.12)" />
          <Ln n={15} segs={[["}"]]} />
        </Editor>
        <Term tool="codex" label="zsh" style={abs({ right: "-3%", bottom: "3%", width: "34%" })} lines={[<span key="0"><span style={{ color: GREEN }}>$</span> pnpm test</span>, <span key="1" className="life l01-pass" style={{ color: GREEN }}>✓ 142 passing</span>]} />
      </>
    ),
  },
  {
    n: "02",
    title: "One person, many domains",
    ts: "0:02",
    camera: "Quick pans between surfaces; menu-bar clock advancing across the day.",
    feeling: "Range — agents are the whole workday.",
    takeaway: "Agents are becoming the surface for all your work.",
    risk: "Must read as one continuous day (time advancing), not a feature montage.",
    visual: (
      <>
        <MenuBar />
        <Pane tool="chat" tab="positioning" style={abs({ left: "3%", top: "13%", width: "40%" })} right="09:14">
          <div style={{ padding: "9px 11px", fontSize: 11, color: muted }}>“founder-led, not enterprise…”</div>
        </Pane>
        <Editor tab="checkout.ts" style={abs({ right: "2%", top: "9%", width: "44%" })} tree={[{ f: "checkout.ts", on: true }, { f: "limiter.ts" }]} right="11:40">
          <Ln n={8} segs={[["app.post(", muted], ["'/checkout'", GREEN], [", …)"]]} />
          <Ln n={9} segs={[["+   limit(req)", GREEN]]} bg="rgba(127,209,192,0.1)" />
        </Editor>
        <Pane tool="cursor" tab="pricing.md" style={abs({ left: "12%", bottom: "-4%", width: "34%" })} right="15:02">
          <div style={{ padding: "9px 11px", fontFamily: mono, fontSize: 10.5, color: muted }}>3 tiers · usage-based</div>
        </Pane>
        <Term tool="codex" label="deploy" style={abs({ right: "5%", bottom: "8%", width: "33%" })} lines={[<span key="0"><span style={{ color: BLUE }}>$</span> deploy staging <span style={{ color: GREEN }}>✓</span></span>]} />
        <span style={abs({ left: "50%", bottom: "2%", transform: "translateX(-50%)", fontFamily: mono, fontSize: 10, color: faint })}>· one day · 17:20 ·</span>
      </>
    ),
  },
  {
    n: "03",
    title: "The value is in the back-and-forth",
    ts: "0:04",
    camera: "Zoom into each correction; the final line settles, bright.",
    feeling: "Recognition — the taste lives in the conversation.",
    takeaway: "The conversation holds the corrections & intent — that's the memory worth keeping.",
    risk: "Before→after must visibly improve. This corrected line returns as the F15 poster.",
    visual: (
      <Pane tool="chat" tab="positioning" style={abs({ left: "14%", right: "14%", top: "8%" })}>
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          <Bubble role="agent" state="dim">“Enterprise-grade AI memory infrastructure.”</Bubble>
          <Bubble role="you" className="life l03-u1">too enterprise</Bubble>
          <Bubble role="you" className="life l03-u2">keep it founder-led</Bubble>
          <Bubble role="agent" state="hl" lg className="life l03-final">“Every agent gets the context you already created.”</Bubble>
        </div>
      </Pane>
    ),
  },
  {
    n: "04",
    title: "Same project, new tool",
    ts: "0:06",
    camera: "Pan from the Claude chat (pushed back) to a fresh Cursor pane.",
    feeling: "A small drop — the thread is gone.",
    takeaway: "The reasoning didn't come with you.",
    risk: "Must obviously be the same project; the pan sells continuity → loss.",
    visual: (
      <>
        <Pane tool="chat" tab="positioning · the thread" style={abs({ left: "2%", top: "11%", width: "43%", opacity: 0.9 })}>
          <div style={{ padding: "10px 11px", display: "flex", flexDirection: "column", gap: 6 }}>
            <Bubble role="you">token bucket, not fixed-window</Bubble>
            <Bubble role="you">keep it founder-led</Bubble>
            <Bubble role="agent">…and Baptiste is CEO. got it.</Bubble>
          </div>
        </Pane>
        <div style={abs({ left: "43%", top: 0, bottom: 0, width: "12%", background: "linear-gradient(90deg, transparent, var(--canvas))", zIndex: 2 })} />
        <span style={abs({ left: "6%", bottom: "8%", fontFamily: mono, fontSize: 10.5, color: faint })}>↑ all of this stays in the chat</span>
        <span style={abs({ left: "47%", top: "44%", fontSize: 22, color: faint, zIndex: 3 })}>→</span>
        <Editor
          tab="checkout-service · new session"
          style={abs({ right: "3%", top: "18%", width: "44%" })}
          tree={[{ f: "checkout.ts", on: true }, { f: "limiter.ts" }, { f: "decisions.md" }]}
          chat={<Bubble role="agent">fresh start — what are we building?</Bubble>}
        >
          <Ln segs={[["// same repo", faint]]} />
          <Ln segs={[["// no history, no thread", faint]]} />
        </Editor>
        <span style={abs({ right: "9%", bottom: "8%", fontFamily: mono, fontSize: 11, color: RED })}>context didn’t come along</span>
      </>
    ),
  },
  {
    n: "05",
    title: "Competent, but missing the thread",
    ts: "0:08",
    camera: "Hold on the agent's hesitation — it has the code, not the why.",
    feeling: "Friction — good, just context-less.",
    takeaway: "It has the repo, not the prior reasoning.",
    risk: "Keep the agent competent (hedging, not failing). NOT 'AI is dumb.'",
    visual: (
      <Editor
        tab="limiter.ts"
        style={abs({ left: "8%", right: "8%", top: "14%" })}
        tree={[{ f: "checkout.ts" }, { f: "limiter.ts", on: true }]}
        chat={
          <Bubble role="agent">I’ll use <b style={{ color: ink }}>fixed-window</b>… unless there’s a reason not to?</Bubble>
        }
      >
        <Ln n={3} segs={[["export function ", PURPLE], ["limit", BLUE], ["(req) {"]]} />
        <Ln n={4} segs={[["  // strategy: ", faint], ["?", RED]]} />
        <Ln n={5} segs={[["}"]]} />
      </Editor>
    ),
  },
  {
    n: "06",
    title: "Markdown — the smart patch",
    ts: "0:10",
    camera: "Zoom into the note line; the pointer is selected as it's typed.",
    feeling: "Diligent — capture it for next time.",
    takeaway: "The note keeps the decision and a pointer — not the reasoning itself.",
    risk: "Read as a smart, normal habit; the note pointing elsewhere is the realistic part.",
    visual: (
      <Editor tab="decisions.md ●" style={abs({ left: "9%", right: "9%", top: "16%" })} tree={[{ f: "decisions.md", on: true }, { f: "AGENTS.md" }, { f: "CLAUDE.md" }]}>
        <Ln n={1} segs={[["# Decisions", faint]]} />
        <Ln n={3} segs={[["## Rate limiting", PURPLE]]} />
        <Ln
          n={4}
          segs={[["use token bucket · 100/min · "], ["see old Claude thread for why", BLUE]]}
          bg={SELBG}
        />
        <Ln n={5} segs={[["▍", BLUE]]} />
      </Editor>
    ),
  },
  {
    n: "07",
    title: "Markdown works",
    ts: "0:12",
    camera: "Small push on the ✓ — a real win for the note.",
    feeling: "Fair — credit where due.",
    takeaway: "When the note's in reach, the decision works.",
    risk: "Must genuinely credit markdown before the turn.",
    visual: (
      <Term
        tool="claude"
        label="~/checkout-service"
        style={abs({ left: "10%", right: "10%", top: "15%" })}
        lines={[
          <span key="0">
            <span style={{ color: ORANGE }}>⏺</span> read <span style={{ color: PURPLE }}>decisions.md</span> → <b style={{ color: ink }}>token bucket</b> · 100/min
          </span>,
          <span key="1" style={{ color: faint }}>⎿ limiter.ts</span>,
          <span key="2" style={{ display: "block", padding: "0 4px", background: "rgba(240,138,130,0.08)", color: RED }}>{"-   // TODO: pick a rate limiter"}</span>,
          <span key="3" style={{ display: "block", padding: "0 4px", background: "rgba(127,209,192,0.12)", color: GREEN }}>{"+   const bucket = tokenBucket({ rate: 100 })"}</span>,
          <span key="4" style={{ color: GREEN }}>✓ 18 tests passing</span>,
          <span key="5">
            <span style={{ color: ORANGE }}>⏺</span> done — checkout rate-limited <span style={{ color: GREEN }}>✓</span>
          </span>,
        ]}
      />
    ),
  },
  {
    n: "08",
    title: "But the pointer doesn't carry",
    ts: "0:14",
    camera: "Zoom on the dead-end pointer — the same note from F06, now stuck.",
    feeling: "Unease — the note flattened the work.",
    takeaway: "The note points at the reasoning — it doesn't carry it. So the agent still can't reason.",
    risk: "The miss must clearly depend on F06's pointer, not feel like a new problem.",
    visual: (
      <Editor
        tab="limiter.ts"
        style={abs({ left: "8%", right: "8%", top: "13%" })}
        tree={[{ f: "decisions.md" }, { f: "limiter.ts", on: true }]}
        chat={
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Bubble role="agent">
              token bucket <span style={{ color: GREEN }}>✓</span> — but for burst retries the “why” is in a thread I can’t open.
            </Bubble>
            <div style={{ fontFamily: mono, fontSize: 9.5, color: RED, paddingLeft: 2 }}>↳ see old Claude thread for why ✗</div>
          </div>
        }
      >
        <Ln n={4} segs={[["  // edge: retry bursts?", faint]]} />
        <Ln n={5} segs={[["  // need the reasoning →", muted], [" decisions.md", PURPLE]]} bg={SELBG} />
        <Ln n={6} segs={[["  // …points to a thread I can't read", RED]]} />
      </Editor>
    ),
  },
  {
    n: "09",
    title: "It was in the conversation all along",
    ts: "0:16",
    camera: "Cut to the raw Claude thread; the reason line highlights.",
    feeling: "Recognition + mild frustration — “right there.”",
    takeaway: "The reasoning was in the conversation — just not reachable.",
    risk: "Credibility beat, not the hero. One crisp cut; no forensics rabbit-hole.",
    visual: (
      <Pane tool="chat" tab="archive · Apr 28" style={abs({ left: "12%", right: "12%", top: "12%" })}>
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          <Bubble role="you">why not fixed-window?</Bubble>
          <Bubble role="agent" state="hl">fixed windows broke under Stripe bursts during checkout retries — token bucket absorbs the spikes.</Bubble>
        </div>
      </Pane>
    ),
  },
  {
    n: "10",
    title: "You are the memory bus",
    ts: "0:18",
    camera: "Rapid, frustrated cuts of the same relay; everything cluttered.",
    feeling: "The emotional low — “I'm doing the system's job.”",
    takeaway: "Today, you hand-carry reasoning between agents.",
    risk: "Must feel annoying, human, repetitive. Tokens are one small corner detail, never the headline.",
    visual: (
      <>
        <Editor className="life l10-wrong" tab="handoff.md ✗" dim style={abs({ left: "1%", top: "7%", width: "35%", transform: "rotate(-2deg)" })} tree={[{ f: "handoff.md", on: true, tone: RED }]}>
          <Ln segs={[["wrong file", RED]]} />
        </Editor>
        <Pane className="life l10-search" tool="chat" tab="🔍 search old chats…" style={abs({ right: "2%", top: "5%", width: "39%", transform: "rotate(2deg)" })}>
          <div className="l10-search-text" style={{ padding: "8px 11px", fontFamily: mono, fontSize: 10, color: faint }}>“stripe burst rate limit” — 41 results…</div>
        </Pane>
        {/* focal action — fully in-frame, the "I am the memory bus" beat */}
        <Pane className="life l10-paste" tool="cursor" tab="checkout · paste #4" style={abs({ left: "16%", right: "16%", top: "40%" })}>
          <div style={{ padding: "10px 12px", fontFamily: mono, fontSize: 11, color: muted }}>
            <div className="l10-paste-line">
              <You>paste:</You> “fixed windows broke under Stripe bursts…”
            </div>
            <div style={{ marginTop: 6, color: faint }}>
              ↳ run again <span className="l10-caret" style={{ display: "inline-block", width: 6, height: 12, background: "#cfd3da", verticalAlign: "-2px" }} />
            </div>
          </div>
        </Pane>
        <span className="life l10-status" style={abs({ left: 0, right: 0, bottom: "8%", textAlign: "center", fontFamily: mono, fontSize: 12.5, color: RED })}>wrong file → search → paste → try again ↻</span>
        <span style={abs({ right: "4%", bottom: "3%", fontFamily: mono, fontSize: 9, color: faint })}>↑ tokens</span>
      </>
    ),
  },
  {
    n: "11",
    title: "Rift, inside the workflow",
    ts: "0:20",
    camera: "Snap back to a calm Cursor pane — the inline call, mid-task.",
    feeling: "Relief begins — quiet, in-context.",
    takeaway: "The agent reaches for memory itself — no app to open.",
    risk: "Ambient, in-flow. `MCP` orbits the actual call. Relief, not a product demo.",
    visual: (
      <>
        <MenuBar active />
        <Editor
          tab="limiter.ts"
          style={abs({ left: "10%", right: "10%", top: "16%" })}
          tree={[{ f: "checkout.ts" }, { f: "limiter.ts", on: true }]}
          chat={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Bubble role="you">add rate limiting to checkout</Bubble>
              <div className="life l11-asks" style={{ fontFamily: mono, fontSize: 10.5, color: faint }}>
                <Agent>one sec —</Agent> asks <RiftChip className="l11-chip" /> <span style={{ opacity: 0.7 }}>· MCP</span>
              </div>
            </div>
          }
        >
          <Ln n={3} segs={[["export function ", PURPLE], ["limit", BLUE], ["(req) {"]]} />
          <Ln n={4} segs={[["  // checking prior decisions…", faint]]} />
        </Editor>
      </>
    ),
  },
  {
    n: "12",
    title: "Decision, why, and source",
    ts: "0:21",
    camera: "Hold on the three returned lines, in the agent's flow.",
    feeling: "Trust — it brought the reasoning, and where it's from.",
    takeaway: "It returns the decision, the why, and where it's from — doc or conversation.",
    risk: "Payoff to 08/09. Keep the simplified hierarchy — a returned result in-flow, not a dashboard.",
    visual: (
      <Editor
        tab="limiter.ts"
        style={abs({ left: "10%", right: "10%", top: "15%" })}
        tree={[{ f: "limiter.ts", on: true }]}
        chat={
          <div className="life l12-card" style={{ borderRadius: 8, border: `1px solid ${BLUE}55`, background: "rgba(138,160,255,0.06)", padding: "9px 11px", fontFamily: mono, fontSize: 11, lineHeight: 1.7 }}>
            <div className="l12-chip" style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <RiftChip />
            </div>
            <div className="l12-decision" style={{ color: ink, fontWeight: 600 }}>token bucket</div>
            <div className="l12-why" style={{ color: muted }}>
              <span style={{ color: faint }}>why:</span> Stripe bursts broke fixed windows
            </div>
            <div className="l12-source" style={{ color: faint }}>sources: Claude chat · rate-limits.md</div>
          </div>
        }
      >
        <Ln n={3} segs={[["  const bucket = ", muted], ["tokenBucket", BLUE], ["({ rate: ", muted], ["100", TYPE], [" })"]]} bg="rgba(127,209,192,0.1)" />
        <Ln n={4} segs={[["+   // handles Stripe retry bursts", GREEN]]} bg="rgba(127,209,192,0.12)" />
      </Editor>
    ),
  },
  {
    n: "13",
    title: "It captures after work, too",
    ts: "0:23",
    camera: "A beat on the capture confirmation in the menu bar.",
    feeling: "Calm — it's keeping the good stuff for me.",
    takeaway: "The work you do now becomes memory future agents can use.",
    risk: "Auto-capture shown only on a truly auto-captured source — Claude Code (NOT Cursor, which is served-only).",
    visual: (
      <>
        <MenuBar active />
        <Term
          tool="claude"
          style={abs({ left: "8%", top: "20%", width: "58%" })}
          lines={[
            <span key="0" style={{ color: faint }}>⏺ session complete · checkout limiter</span>,
            <span key="1">
              <span style={{ color: BLUE }}>◆ rift</span> <span style={{ color: faint }}>auto-captured</span> · token bucket <span style={{ color: faint }}>+ why</span>
            </span>,
          ]}
        />
        <div style={abs({ top: 24, right: 40, width: 214, borderRadius: 8, border: `1px solid ${borderS}`, background: "rgba(16,18,20,0.97)", boxShadow: "0 18px 50px rgba(0,0,0,0.6)", overflow: "hidden", fontFamily: mono, fontSize: 10.5 })}>
          <div style={{ padding: "7px 11px", display: "flex", alignItems: "center", gap: 7, borderBottom: `1px solid ${border}`, color: ink }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: GREEN, boxShadow: `0 0 6px ${GREEN}` }} />◆ Rift · running
          </div>
          <div style={{ padding: "6px 11px", color: muted }}>Capture: just now · 1 saved</div>
          <div style={{ padding: "6px 11px", color: muted, borderTop: `1px solid ${border}` }}>Source: Claude Code</div>
        </div>
        <div style={abs({ left: "8%", bottom: "11%", fontFamily: mono, fontSize: 11, color: sub })}>stored on your Mac</div>
      </>
    ),
  },
  {
    n: "14",
    title: "Same memory, every tool",
    ts: "0:25",
    camera: "Days later — the entry surfaces unprompted inside a different tool.",
    feeling: "Compounding — past work paying forward.",
    takeaway: "A decision captured in one tool makes every later agent better. The hero value.",
    risk: "Concrete cross-tool reuse, no manual attach. Copy: 'already has', not 'already knows'.",
    visual: (
      <>
        {/* the memory captured back in F13 resurfaces — source continuity */}
        <Pane className="l14-source" tool="claude" style={abs({ left: "5%", top: "10%", width: "33%", opacity: 0.66, transform: "rotate(-2deg)" })}>
          <div style={{ padding: "8px 11px", fontFamily: mono, fontSize: 9.5, color: sub }}>
            captured May 3<br />token bucket + why
          </div>
        </Pane>
        <span className="l14-arrow" style={abs({ left: "31%", top: "41%", fontSize: 26, color: BLUE, opacity: 0.58, zIndex: 0 })}>↘</span>
        <Term
          className="l14-target"
          tool="codex"
          label="resume · checkout-#418 · days later"
          style={abs({ left: "23%", right: "6%", top: "28%" })}
          lines={[
            <span key="0">
              <span style={{ color: BLUE }}>›</span> add rate limiting to the new endpoint
            </span>,
            <span key="1" style={{ color: faint }}>
              ⏺ asks <span style={{ color: BLUE }}>◆ rift</span> · <span style={{ color: GREEN }}>no files attached</span>
            </span>,
            <span key="2" className="life l14-has">
              <span style={{ color: faint }}>›</span> already has: <b style={{ color: ink }}>token bucket</b> <span style={{ color: faint }}>(why: Stripe bursts)</span>
            </span>,
            <span key="3" className="life l14-reused" style={{ color: faint }}>
              ↳ from your Claude Code session · May 3 · <span style={{ color: GREEN }}>reused ✓</span>
            </span>,
          ]}
        />
      </>
    ),
  },
  {
    n: "15",
    title: "Outro",
    ts: "0:27",
    camera: "Settle on the calm product mark; the F03 line returns as the poster.",
    feeling: "Calm confidence. Invitation.",
    takeaway: "This exists now.",
    risk: "Earned and quiet. `for MCP-capable tools` stays small proof copy. (Motion noted, not built.)",
    visual: (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 8%" }}>
        <div style={{ fontSize: "clamp(20px,2.9vw,40px)", fontWeight: 600, letterSpacing: "-0.025em", color: ink, textAlign: "center", maxWidth: 660 }}>Every agent gets the context you already created.</div>
        <div style={{ fontSize: "clamp(26px,3.4vw,46px)", fontWeight: 700, letterSpacing: "-0.03em", color: ink, marginTop: 4 }}>Rift</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <span style={{ padding: "9px 18px", borderRadius: 9, background: "var(--accent)", color: "var(--accent-ink)", fontSize: 14, fontWeight: 600 }}>Get the beta</span>
          <span style={{ fontFamily: mono, fontSize: 12, color: BLUE }}>Open Beta · getrift.dev</span>
        </div>
        <div style={{ fontFamily: mono, fontSize: 10.5, color: faint, marginTop: 2 }}>for MCP-capable tools</div>
      </div>
    ),
  },
];
