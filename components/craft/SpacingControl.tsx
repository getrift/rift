'use client';

import { useStore, StyleOverrides } from '@/lib/store';
import ScrubbableValue from './ScrubbableValue';
import { Link2, Unlink2 } from 'lucide-react';

// Parse CSS value like "16px" or "1rem" to number (in px)
function parseCssSize(value: string | undefined): number {
  if (!value || value === 'normal') return 0;
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  if (value.endsWith('rem')) return num * 16;
  return num;
}

interface SpacingControlProps {
  controlId?: string;
}

export default function SpacingControl({ controlId }: SpacingControlProps) {
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);
  const computedStyles = useStore((state) => state.computedStyles);
  
  const selectedPath = activeComponent?.selectedPath || null;
  const styleOverrides = activeComponent?.styleOverrides || {};
  const setStyleOverride = useStore((state) => state.setStyleOverride);
  const setComponentStyleOverrides = useStore((state) => state.setComponentStyleOverrides);

  if (!selectedPath) return null;

  const pathKey = JSON.stringify(selectedPath);
  const current = styleOverrides[pathKey] || {};
  
  // Check if padding is linked (default true)
  const isLinked = current.paddingLinked !== false;
  
  // Get computed values for individual padding
  const computedTop = parseCssSize(computedStyles?.paddingTop);
  const computedRight = parseCssSize(computedStyles?.paddingRight);
  const computedBottom = parseCssSize(computedStyles?.paddingBottom);
  const computedLeft = parseCssSize(computedStyles?.paddingLeft);
  
  // Use override if set, otherwise use computed value
  const paddingTop = current.paddingTop ?? computedTop;
  const paddingRight = current.paddingRight ?? computedRight;
  const paddingBottom = current.paddingBottom ?? computedBottom;
  const paddingLeft = current.paddingLeft ?? computedLeft;
  const uniformPadding = current.padding ?? parseCssSize(computedStyles?.padding);
  const gap = current.gap ?? parseCssSize(computedStyles?.gap);

  const toggleLinked = () => {
    if (!activeComponentId) return;
    const newOverrides = { ...styleOverrides };
    const currentStyle = newOverrides[pathKey] || {};
    
    if (isLinked) {
      // Switching to unlinked - initialize individual values from uniform
      const val = currentStyle.padding ?? uniformPadding;
      newOverrides[pathKey] = {
        ...currentStyle,
        paddingLinked: false,
        paddingTop: val,
        paddingRight: val,
        paddingBottom: val,
        paddingLeft: val,
      };
    } else {
      // Switching to linked - use average or top value
      const avg = Math.round((paddingTop + paddingRight + paddingBottom + paddingLeft) / 4);
      newOverrides[pathKey] = {
        ...currentStyle,
        paddingLinked: true,
        padding: avg,
      };
    }
    setComponentStyleOverrides(activeComponentId, newOverrides);
  };

  const handleUniformPaddingChange = (value: number) => {
    setStyleOverride(selectedPath, 'padding', value);
  };

  const handleIndividualPaddingChange = (side: keyof StyleOverrides, value: number) => {
    setStyleOverride(selectedPath, side, value);
  };

  return (
    <div className="space-y-0">
      {isLinked ? (
        <div className="flex items-center">
          <div className="flex-1">
            <ScrubbableValue
              label="Padding"
              value={uniformPadding}
              min={0}
              max={64}
              onChange={handleUniformPaddingChange}
              controlId={controlId}
            />
          </div>
          <button
            onClick={toggleLinked}
            className="p-1 text-text-muted hover:text-text-primary transition-colors"
            title="Unlink padding sides"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          <div className="flex items-center justify-between h-7">
            <span className="text-text-label text-[11px] pl-1">Padding</span>
            <button
              onClick={toggleLinked}
              className="p-1 text-text-muted hover:text-text-primary transition-colors"
              title="Link padding sides"
            >
              <Unlink2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-1">
            <ScrubbableValue
              label="Top"
              value={paddingTop}
              min={0}
              max={64}
              onChange={(v) => handleIndividualPaddingChange('paddingTop', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="Right"
              value={paddingRight}
              min={0}
              max={64}
              onChange={(v) => handleIndividualPaddingChange('paddingRight', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="Bottom"
              value={paddingBottom}
              min={0}
              max={64}
              onChange={(v) => handleIndividualPaddingChange('paddingBottom', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="Left"
              value={paddingLeft}
              min={0}
              max={64}
              onChange={(v) => handleIndividualPaddingChange('paddingLeft', v)}
              controlId={controlId}
              inline
            />
          </div>
        </div>
      )}
      <ScrubbableValue
        label="Gap"
        value={gap}
        min={0}
        max={48}
        onChange={(value) => setStyleOverride(selectedPath, 'gap', value)}
        controlId={controlId}
      />
    </div>
  );
}
