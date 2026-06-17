"use client";

import { useEffect, useRef } from "react";

/* Shared canvas2D runner for the particle eval pages.
   Handles DPR, resize (rebuilds the sim), rAF loop, tab-visibility pause,
   pointer tracking, and reduced-motion (renders one still frame).
   ponytail: canvas2D is the eval substrate. Ceiling ~3k particles at 60fps;
   upgrade the winning concept to a WebGL/curl-noise shader for the real hero. */

export type Pointer = { x: number; y: number; inside: boolean };
export type Frame = (ctx: CanvasRenderingContext2D, t: number, dt: number, p: Pointer) => void;
export type Init = (w: number, h: number, dpr: number, reduce: boolean) => Frame;

export default function ParticleCanvas({ init }: { init: Init }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer: Pointer = { x: -9999, y: -9999, inside: false };
    let w = 0,
      h = 0,
      frame: Frame,
      raf = 0,
      last = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frame = init(w, h, dpr, reduce);
      if (reduce) {
        ctx.clearRect(0, 0, w, h);
        frame(ctx, 0, 0, pointer); // single still frame
      }
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.inside = true;
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.x = pointer.y = -9999;
    };

    if (reduce) {
      return () => ro.disconnect();
    }

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const loop = (now: number) => {
      const t = now / 1000;
      const dt = last ? Math.min(t - last, 0.05) : 0.016;
      last = t;
      frame(ctx, t, dt, pointer);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [init]);

  return <canvas ref={ref} className="block h-full w-full bg-canvas" />;
}
