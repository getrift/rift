"use client";

import Link from "next/link";
import ParticleCanvas, { type Init } from "./particle-canvas";

/* Thin chrome shared by the four eval pages: full-viewport canvas + a quiet
   overlay (back link, concept title, one-line stance). */
export default function EvalShell({ init, title, note }: { init: Init; title: string; note: string }) {
  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-canvas font-sans text-ink antialiased">
      <ParticleCanvas init={init} />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <Link
            href="/eval"
            className="pointer-events-auto text-[12px] text-ink-faint transition-colors hover:text-ink-muted"
          >
            ← eval
          </Link>
          <span className="text-[10px] uppercase tracking-[0.16em] text-ink-faint">Rift · particle study</span>
        </div>
        <div className="max-w-[460px]">
          <h1 className="text-[15px] font-medium text-ink-muted">{title}</h1>
          <p className="mt-1.5 text-[12.5px] leading-[19px] text-ink-faint">{note}</p>
        </div>
      </div>
    </main>
  );
}
