'use client';

import { useStore, StyleOverrides } from '@/lib/store';
import ScrubbableValue from './ScrubbableValue';

// Icon for unlinked/detached corners
function UnlinkCornersIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 12 12" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      {/* Top-left corner */}
      <path d="M1 4V2a1 1 0 011-1h2" />
      {/* Top-right corner */}
      <path d="M8 1h2a1 1 0 011 1v2" />
      {/* Bottom-right corner */}
      <path d="M11 8v2a1 1 0 01-1 1h-2" />
      {/* Bottom-left corner */}
      <path d="M4 11H2a1 1 0 01-1-1V8" />
    </svg>
  );
}

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
        <div className="flex items-center h-7 px-1 rounded hover:bg-bg-hover cursor-ew-resize">
          <span className="text-text-label font-medium text-[11px]">Padding</span>
          <button
            onClick={(e) => { e.stopPropagation(); toggleLinked(); }}
            className="p-0.5 ml-1 text-text-muted hover:text-text-primary transition-colors"
            title="Unlink padding sides"
          >
            <UnlinkCornersIcon className="w-3 h-3" />
          </button>
          <div className="flex-1 flex justify-end">
            <ScrubbableValue
              label=""
              value={uniformPadding}
              min={0}
              max={64}
              onChange={handleUniformPaddingChange}
              controlId={controlId}
              inline
            />
          </div>
        </div>
      ) : (
        <div className="space-y-0">
          <div className="flex items-center h-7 px-1">
            <span className="text-text-label font-medium text-[11px]">Padding</span>
            <button
              onClick={toggleLinked}
              className="p-0.5 ml-1 text-text-primary transition-colors"
              title="Link padding sides"
            >
              <UnlinkCornersIcon className="w-3 h-3" />
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
    </div>
  );
}
