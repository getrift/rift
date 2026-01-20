'use client';

import { useRef } from 'react';
import { CraftProvider, useCraft } from '@/lib/craft-context';
import { useStore } from '@/lib/store';
import SpacingControl from '@/components/craft/SpacingControl';
import ShapeControl from '@/components/craft/ShapeControl';
import TypographyControl from '@/components/craft/TypographyControl';
import ColorControl from '@/components/craft/ColorControl';
import ShadowControl from '@/components/craft/ShadowControl';
import Section from '@/components/craft/Section';
import { Diamond } from 'lucide-react';

function RightPanelContent() {
  const { activeControlId } = useCraft();
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);
  const selectedPath = activeComponent?.selectedPath || null;

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
      <Section title="Color" isDimmed={isDimmed('color')}>
        <ColorControl />
      </Section>
      <Section title="Shadows" isDimmed={isDimmed('shadows')}>
        <ShadowControl controlId="shadows" />
      </Section>
    </div>
  );
}

export default function RightPanel() {
  const width = useStore((state) => state.rightPanelWidth);
  const setWidth = useStore((state) => state.setRightPanelWidth);

  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  return (
    <CraftProvider>
      <div
        className="relative bg-bg-panel border-l border-border-subtle h-screen flex flex-col"
        style={{ width }}
      >
        <div
          className="absolute left-0 top-0 h-full w-1 cursor-col-resize"
          onPointerDown={(e) => {
            isResizingRef.current = true;
            startXRef.current = e.clientX;
            startWidthRef.current = width;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!isResizingRef.current) return;
            const delta = startXRef.current - e.clientX;
            setWidth(startWidthRef.current + delta);
          }}
          onPointerUp={(e) => {
            isResizingRef.current = false;
            try {
              (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {}
          }}
          onDoubleClick={() => setWidth(260)}
          title="Drag to resize"
        />

        <div className="px-3 py-2.5 border-b border-border-subtle">
          <h2 className="text-text-heading text-[12px] font-medium">
            Inspector
          </h2>
        </div>
        <RightPanelContent />
      </div>
    </CraftProvider>
  );
}
