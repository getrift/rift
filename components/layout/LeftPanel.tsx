'use client';

import { useRef, useState } from 'react';
import CodeEditor from '@/components/editor/CodeEditor';
import { useStore } from '@/lib/store';
import { exportWithOverrides } from '@/lib/exportCode';

export default function LeftPanel() {
  const width = useStore((state) => state.leftPanelWidth);
  const setWidth = useStore((state) => state.setLeftPanelWidth);

  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

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

  return (
    <div
      className="relative bg-bg-panel border-r border-border-subtle h-screen flex flex-col"
      style={{ width }}
    >
      <div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
        onPointerDown={(e) => {
          isResizingRef.current = true;
          startXRef.current = e.clientX;
          startWidthRef.current = width;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!isResizingRef.current) return;
          const delta = e.clientX - startXRef.current;
          setWidth(startWidthRef.current + delta);
        }}
        onPointerUp={(e) => {
          isResizingRef.current = false;
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {}
        }}
        onDoubleClick={() => setWidth(300)}
        title="Drag to resize"
      />

      <div className="px-4 py-3 border-b border-border-subtle">
        <h2 className="text-text-heading text-[13px] font-medium">Code</h2>
      </div>

      <div className="flex-1 overflow-hidden">
        <CodeEditor />
      </div>

      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={handleCopy}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            copied
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {copied ? 'Copied!' : 'Copy refined code'}
        </button>
      </div>
    </div>
  );
}
