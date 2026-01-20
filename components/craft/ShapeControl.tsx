'use client';

import { useStore, StyleOverrides } from '@/lib/store';
import ScrubbableValue from './ScrubbableValue';
import { Link2, Unlink2 } from 'lucide-react';

// Parse CSS value like "4px" or "0.25rem" to number (in px)
function parseCssSize(value: string | undefined): number {
  if (!value) return 0;
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  if (value.endsWith('rem')) return num * 16;
  return num;
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
      {isLinked ? (
        <div className="flex items-center">
          <div className="flex-1">
            <ScrubbableValue
              label="Radius"
              value={uniformRadius}
              min={0}
              max={48}
              onChange={handleUniformRadiusChange}
              controlId={controlId}
            />
          </div>
          <button
            onClick={toggleLinked}
            className="p-1 text-text-muted hover:text-text-primary transition-colors"
            title="Unlink corner radii"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          <div className="flex items-center justify-between h-7">
            <span className="text-text-label text-[11px] pl-1">Radius</span>
            <button
              onClick={toggleLinked}
              className="p-1 text-text-muted hover:text-text-primary transition-colors"
              title="Link corner radii"
            >
              <Unlink2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-1">
            <ScrubbableValue
              label="Top Left"
              value={topLeft}
              min={0}
              max={48}
              onChange={(v) => handleIndividualRadiusChange('borderRadiusTopLeft', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="Top Right"
              value={topRight}
              min={0}
              max={48}
              onChange={(v) => handleIndividualRadiusChange('borderRadiusTopRight', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="Bottom Left"
              value={bottomLeft}
              min={0}
              max={48}
              onChange={(v) => handleIndividualRadiusChange('borderRadiusBottomLeft', v)}
              controlId={controlId}
              inline
            />
            <ScrubbableValue
              label="Bottom Right"
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
