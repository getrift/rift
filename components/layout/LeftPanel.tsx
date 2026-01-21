'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';
import CodeEditor from '@/components/editor/CodeEditor';
import { useStore } from '@/lib/store';
import { exportWithOverrides } from '@/lib/exportCode';
import { Check, Copy } from 'lucide-react';
import Button from '@/components/ui/Button';

// Snap points for panel width
const SNAP_POINTS = [280, 320, 360, 400];
const SNAP_THRESHOLD = 16;
const MIN_WIDTH = 260;
const MAX_WIDTH = 500;

export default function LeftPanel() {
  const storeWidth = useStore((state) => state.leftPanelWidth);
  const setStoreWidth = useStore((state) => state.setLeftPanelWidth);

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

  // Read active component's code and styleOverrides
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);

  const code = activeComponent?.code || '';
  const styleOverrides = activeComponent?.styleOverrides || {};

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const exported = exportWithOverrides(code, styleOverrides);
    await navigator.clipboard.writeText(exported);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    const delta = e.clientX - startXRef.current;
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
    setStoreWidth(320);
    springWidth.set(320);
  }, [setStoreWidth, springWidth]);

  return (
    <motion.div
      className="relative bg-bg-panel border-r border-border-subtle h-screen flex flex-col"
      style={{ width: springWidth }}
    >
      {/* Resize handle */}
      <div
        className="absolute right-0 top-0 h-full w-3 -mr-1.5 cursor-col-resize z-10 group"
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
          className="absolute right-1.5 top-0 h-full w-[1px]"
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
          className="absolute right-0 top-0 h-full w-3 pointer-events-none"
          initial={false}
          animate={{
            background: isHovering || isResizing
              ? 'linear-gradient(to left, rgba(255,255,255,0.04), transparent)'
              : 'transparent',
          }}
          transition={{ duration: 0.15 }}
        />
      </div>

      <div className="px-4 py-3 border-b border-border-subtle">
        <h2 className="text-text-heading text-[13px] font-medium">Code</h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <CodeEditor />
      </div>

      <div className="p-4 border-t border-border-subtle">
        <Button
          onClick={handleCopy}
          variant={copied ? 'secondary' : 'primary'}
          size="md"
          className="w-full"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                Copy refined code
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </motion.div>
  );
}
