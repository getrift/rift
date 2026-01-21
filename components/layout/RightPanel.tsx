'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { CraftProvider, useCraft } from '@/lib/craft-context';
import { useStore } from '@/lib/store';
import SpacingControl from '@/components/craft/SpacingControl';
import ShapeControl from '@/components/craft/ShapeControl';
import TypographyControl from '@/components/craft/TypographyControl';
import ColorControl from '@/components/craft/ColorControl';
import ShadowControl from '@/components/craft/ShadowControl';
import Section from '@/components/craft/Section';
import { Diamond } from 'lucide-react';

// Snap points for panel width
const SNAP_POINTS = [240, 280, 320, 360];
const SNAP_THRESHOLD = 16;
const MIN_WIDTH = 220;
const MAX_WIDTH = 400;

function RightPanelContent() {
  const { activeControlId } = useCraft();
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);
  const selectedPath = activeComponent?.selectedPaths?.[0] || null;

  const isDimmed = (controlId: string) => {
    return activeControlId !== null && activeControlId !== controlId;
  };

  if (!selectedPath) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <Diamond className="w-6 h-6 text-text-muted/40 mb-2" strokeWidth={1} />
        <p className="text-text-secondary text-[12px]">Select an element</p>
        <p className="text-text-muted text-[11px] mt-0.5">to start crafting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
      <Section title="Spacing" isDimmed={isDimmed('spacing')}>
        <SpacingControl controlId="spacing" />
      </Section>
      <Section title="Shape" isDimmed={isDimmed('shape')}>
        <ShapeControl controlId="shape" />
      </Section>
      <Section title="Typography" isDimmed={isDimmed('typography')}>
        <TypographyControl controlId="typography" />
      </Section>
      <Section title="Background" isDimmed={isDimmed('background')}>
        <ColorControl />
      </Section>
      <Section title="Shadows" isDimmed={isDimmed('shadows')}>
        <ShadowControl controlId="shadows" />
      </Section>
    </div>
  );
}

export default function RightPanel() {
  const storeWidth = useStore((state) => state.rightPanelWidth);
  const setStoreWidth = useStore((state) => state.setRightPanelWidth);

  const [isResizing, setIsResizing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Spring-animated width for smooth snapping
  const springWidth = useSpring(storeWidth, {
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  });

  // Sync spring with store when not resizing
  useEffect(() => {
    if (!isResizing) {
      springWidth.set(storeWidth);
    }
  }, [storeWidth, isResizing, springWidth]);

  const findNearestSnap = useCallback((width: number) => {
    let nearest = width;
    let minDistance = Infinity;
    
    for (const point of SNAP_POINTS) {
      const distance = Math.abs(point - width);
      if (distance < minDistance && distance < SNAP_THRESHOLD) {
        minDistance = distance;
        nearest = point;
      }
    }
    
    return nearest;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isResizingRef.current = true;
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = storeWidth;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [storeWidth]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isResizingRef.current) return;
    const delta = startXRef.current - e.clientX;
    const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidthRef.current + delta));
    setStoreWidth(newWidth);
    springWidth.set(newWidth);
  }, [setStoreWidth, springWidth]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isResizingRef.current) return;
    
    isResizingRef.current = false;
    setIsResizing(false);
    
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    // Snap to nearest point with spring animation
    const snappedWidth = findNearestSnap(storeWidth);
    if (snappedWidth !== storeWidth) {
      setStoreWidth(snappedWidth);
      springWidth.set(snappedWidth);
    }
  }, [storeWidth, setStoreWidth, springWidth, findNearestSnap]);

  const handleDoubleClick = useCallback(() => {
    setStoreWidth(260);
    springWidth.set(260);
  }, [setStoreWidth, springWidth]);

  return (
    <CraftProvider>
      <motion.div
        className="relative bg-bg-panel border-l border-border-subtle h-screen flex flex-col"
        style={{ width: springWidth }}
      >
        {/* Resize handle */}
        <div
          className="absolute left-0 top-0 h-full w-3 -ml-1.5 cursor-col-resize z-10 group"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          title="Drag to resize, double-click to reset"
        >
          {/* Visual indicator line */}
          <motion.div
            className="absolute left-1.5 top-0 h-full w-[1px]"
            initial={false}
            animate={{
              backgroundColor: isResizing 
                ? 'rgba(255, 255, 255, 0.4)' 
                : isHovering 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.08)',
              boxShadow: isResizing
                ? '0 0 8px rgba(255, 255, 255, 0.2)'
                : 'none',
            }}
            transition={{ duration: 0.15 }}
          />
          
          {/* Hover glow area */}
          <motion.div
            className="absolute left-0 top-0 h-full w-3 pointer-events-none"
            initial={false}
            animate={{
              background: isHovering || isResizing
                ? 'linear-gradient(to right, rgba(255,255,255,0.04), transparent)'
                : 'transparent',
            }}
            transition={{ duration: 0.15 }}
          />
        </div>

        <div className="px-3 py-2.5 border-b border-border-subtle">
          <h2 className="text-text-heading text-[12px] font-medium">
            Inspector
          </h2>
        </div>
        <RightPanelContent />
      </motion.div>
    </CraftProvider>
  );
}
