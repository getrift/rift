import { ProviderMark, type MarkId } from "./provider-icons";
import { RiftMark } from "./rift-logo";

/* Node-graph explainer for /about: your local agent sessions (whatever writes to
   ~/.claude + ~/.codex) are captured into one private memory on your Mac, then
   served back over MCP to every tool — including the same ones it captures.
   Stacks vertically on mobile; on md+ it breaks out wider than the prose column
   so the three nodes get room to breathe. Marks set an explicit fill via the
   parent text color, so they never depend on fragile inheritance. */

const BOX = "overflow-hidden rounded-[10px] border bg-gradient-to-b";

function IconCell({ ids }: { ids: MarkId[] }) {
  return (
    <div className="flex flex-shrink-0 items-center gap-1.5 border-r border-white/[0.08] px-2.5 text-ink-bright">
      {ids.map((id) => (
        <ProviderMark key={id} id={id} size={14} />
      ))}
    </div>
  );
}

function ChipBox({ ids, label }: { ids: MarkId[]; label: string }) {
  return (
    <div
      className={`${BOX} flex w-full items-stretch border-white/[0.1] from-[#121315] to-[#0c0d0e] md:w-auto`}
    >
      <IconCell ids={ids} />
      <div className="flex flex-1 items-center px-3.5 py-2.5 md:flex-initial">
        <span className="font-mono text-[12px] leading-[15px] text-ink-muted">{label}</span>
      </div>
    </div>
  );
}

/* Arrow: points down when the row is stacked (mobile), right when it's a row (md+). */
function Arrow() {
  return (
    <div className="flex flex-shrink-0 items-center justify-center self-center py-0.5 text-white/[0.42] md:px-2 md:py-0">
      <svg viewBox="0 0 8 30" className="h-[26px] w-2 md:hidden" fill="none">
        <line x1="4" y1="0" x2="4" y2="24" stroke="currentColor" strokeWidth="1.3" />
        <path d="M4 30 L1 23 L7 23 Z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 36 8" className="hidden h-2 w-9 md:block" fill="none">
        <line x1="0" y1="4" x2="30" y2="4" stroke="currentColor" strokeWidth="1.3" />
        <path d="M36 4 L29 1 L29 7 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function HowRiftWorks() {
  return (
    <figure className="not-prose !my-9 rounded-[14px] border border-white/[0.08] bg-white/[0.015] px-5 py-11 md:relative md:left-1/2 md:!my-14 md:w-[760px] md:max-w-[92vw] md:-translate-x-1/2 md:px-6 md:py-16">
      {/* flow row — stacks on mobile, becomes a 3-node graph on md+ */}
      <div className="flex flex-col items-stretch md:flex-row md:items-center md:justify-between">
        <ChipBox ids={["claude", "chatgpt"]} label="Your local agent sessions" />

        <Arrow />

        {/* Rift core — compact lockup: mark + wordmark on one line */}
        <div
          className={`${BOX} flex w-full flex-col items-center justify-center gap-2 border-white/[0.14] from-[#131416] to-[#0c0d0e] px-7 py-4 shadow-[0_0_44px_-14px_rgba(255,255,255,0.32)] md:w-auto md:flex-shrink-0`}
        >
          <div className="flex items-center gap-2.5 text-ink">
            <RiftMark size={40} />
            <span className="text-[22px] font-semibold tracking-tight">rift</span>
          </div>
          <span className="whitespace-nowrap font-mono text-[10px] tracking-[0.01em] text-ink-subtle">
            private · on your Mac
          </span>
        </div>

        <Arrow />

        <ChipBox ids={["claude", "cursor", "chatgpt", "gemini", "copilot"]} label="Any MCP tool" />
      </div>

      {/* feedback loop — the same tools it serves are the ones it captures */}
      <div className="relative mt-10 hidden h-4 md:block" aria-hidden>
        <div className="absolute inset-x-[12%] top-1/2 -translate-y-1/2 border-t border-dashed border-white/[0.16]" />
        <svg
          viewBox="0 0 8 8"
          className="absolute left-[12%] top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 text-white/[0.3]"
          fill="currentColor"
        >
          <path d="M4 0 L0 6 L8 6 Z" />
        </svg>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas px-3 font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-faint">
          served back to the same tools
        </span>
      </div>
      <figcaption className="mt-7 text-center font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-faint md:hidden">
        ↺ served back to the same tools
      </figcaption>
    </figure>
  );
}
