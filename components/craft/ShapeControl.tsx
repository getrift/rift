'use client';

import { useStore, StyleOverrides } from '@/lib/store';
import ScrubbableValue from './ScrubbableValue';

// Parse CSS value like "4px" or "0.25rem" to number (in px)
function parseCssSize(value: string | undefined): number {
  if (!value) return 0;
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  if (value.endsWith('rem')) return num * 16;
  return num;
}

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

interface ShapeControlProps {
  controlId?: string;
}

export default function ShapeControl({ controlId }: ShapeControlProps) {
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
  
  // Check if radius is linked (default true)
  const isLinked = current.borderRadiusLinked !== false;
  
  // Get computed values for individual corners
  const computedTopLeft = parseCssSize(computedStyles?.borderTopLeftRadius);
  const computedTopRight = parseCssSize(computedStyles?.borderTopRightRadius);
  const computedBottomRight = parseCssSize(computedStyles?.borderBottomRightRadius);
  const computedBottomLeft = parseCssSize(computedStyles?.borderBottomLeftRadius);
  
  // Use override if set, otherwise use computed value
  const topLeft = current.borderRadiusTopLeft ?? computedTopLeft;
  const topRight = current.borderRadiusTopRight ?? computedTopRight;
  const bottomRight = current.borderRadiusBottomRight ?? computedBottomRight;
  const bottomLeft = current.borderRadiusBottomLeft ?? computedBottomLeft;
  const uniformRadius = current.borderRadius ?? parseCssSize(computedStyles?.borderRadius);
  const gap = current.gap ?? parseCssSize(computedStyles?.gap);

  const toggleLinked = () => {
    if (!activeComponentId) return;
    const newOverrides = { ...styleOverrides };
    const currentStyle = newOverrides[pathKey] || {};
    
    if (isLinked) {
      // Switching to unlinked - initialize individual values from uniform
      const val = currentStyle.borderRadius ?? uniformRadius;
      newOverrides[pathKey] = {
        ...currentStyle,
        borderRadiusLinked: false,
        borderRadiusTopLeft: val,
        borderRadiusTopRight: val,
        borderRadiusBottomRight: val,
        borderRadiusBottomLeft: val,
      };
    } else {
      // Switching to linked - use average or top-left value
      const avg = Math.round((topLeft + topRight + bottomRight + bottomLeft) / 4);
      newOverrides[pathKey] = {
        ...currentStyle,
        borderRadiusLinked: true,
        borderRadius: avg,
      };
    }
    setComponentStyleOverrides(activeComponentId, newOverrides);
  };

  const handleUniformRadiusChange = (value: number) => {
    setStyleOverride(selectedPath, 'borderRadius', value);
  };

  const handleIndividualRadiusChange = (corner: keyof StyleOverrides, value: number) => {
    setStyleOverride(selectedPath, corner, value);
  };

  return (
    <div className="space-y-0">
      <ScrubbableValue
        label="Gap"
        value={gap}
        min={0}
        max={48}
        onChange={(value) => setStyleOverride(selectedPath, 'gap', value)}
        controlId={controlId}
      />
      {isLinked ? (
        <div className="flex items-center h-7 px-1 rounded hover:bg-bg-hover cursor-ew-resize">
          <span className="text-text-label font-medium text-[11px]">Radius</span>
          <button
            onClick={(e) => { e.stopPropagation(); toggleLinked(); }}
            className="p-0.5 ml-1 text-text-muted hover:text-text-primary transition-colors"
            title="Unlink corner radii"
          >
            <UnlinkCornersIcon className="w-3 h-3" />
          </button>
          <div className="flex-1 flex justify-end">
            <ScrubbableValue
              label=""
              value={uniformRadius}
              min={0}
              max={48}
              onChange={handleUniformRadiusChange}
              controlId={controlId}
              inline
            />
          </div>
        </div>
      ) : (
        <div className="space-y-0">
          <div className="flex items-center h-7 px-1">
            <span className="text-text-label font-medium text-[11px]">Radius</span>
            <button
              onClick={toggleLinked}
              className="p-0.5 ml-1 text-text-primary transition-colors"
              title="Link corner radii"
            >
              <UnlinkCornersIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-1">
            <ScrubbableValue
              label="TL"
              value={topLeft}
              min={0}
              max={48}
              onChange={(v) => handleIndividualRadiusChange('borderRadiusTopLeft', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="TR"
              value={topRight}
              min={0}
              max={48}
              onChange={(v) => handleIndividualRadiusChange('borderRadiusTopRight', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="BL"
              value={bottomLeft}
              min={0}
              max={48}
              onChange={(v) => handleIndividualRadiusChange('borderRadiusBottomLeft', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="BR"
              value={bottomRight}
              min={0}
              max={48}
              onChange={(v) => handleIndividualRadiusChange('borderRadiusBottomRight', v)}
              controlId={controlId}
              inline
            />
          </div>
        </div>
      )}
    </div>
  );
}
