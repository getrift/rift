import Link from "next/link";

const ITEMS = [
  { href: "/eval/retrieval", n: "01", title: "Retrieval", desc: "Cursor is the query — fragments gather into a luminous swarm, then disperse." },
  { href: "/eval/current", n: "02", title: "Current", desc: "Two-octave curl dust. Drag to stir swirls and a wake. Organic, abstract." },
  { href: "/eval/lattice", n: "03", title: "Lattice", desc: "Drifting fragments ignite transient hairline links. Cursor-reactive." },
  { href: "/eval/rift", n: "04", title: "The Rift", desc: "Capture in, serve out — the loop as a luminous seam." },
];

export default function EvalIndex() {
  return (
    <main className="min-h-[100svh] bg-canvas px-6 py-20 font-sans text-ink antialiased sm:px-10">
      <div className="mx-auto max-w-[640px]">
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">Rift · particle studies</p>
        <h1 className="mt-3 text-[26px] font-medium tracking-[-0.02em] text-ink">Four directions for the hero field</h1>
        <p className="mt-3 max-w-[520px] text-[14px] leading-[22px] text-ink-subtle">
          Canvas2D prototypes — pure particles, monochrome, to lock the feel before any WebGL. Each takes a
          different stance on how literal it is about what Rift does.
        </p>
        <ul className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {ITEMS.map((it) => (
            <li key={it.href}>
              <Link href={it.href} className="group flex items-baseline gap-4 py-5 transition-colors hover:bg-white/[0.02]">
                <span className="w-7 text-[12px] tabular-nums text-ink-faint">{it.n}</span>
                <span className="flex-1">
                  <span className="text-[15px] font-medium text-ink-muted group-hover:text-ink">{it.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-[19px] text-ink-faint">{it.desc}</span>
                </span>
                <span className="text-ink-faint transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
