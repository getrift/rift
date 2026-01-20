'use client';

import { ShadowLayer as ShadowLayerType } from '@/lib/store';
import ScrubbableValue from './ScrubbableValue';
import ColorPicker from './ColorPicker';

interface ShadowLayerProps {
  layer: ShadowLayerType;
  onChange: (updated: ShadowLayerType) => void;
  onDelete: () => void;
  controlId?: string;
}

export default function ShadowLayerComponent({ layer, onChange, onDelete, controlId }: ShadowLayerProps) {
  const updateLayer = (updates: Partial<ShadowLayerType>) => {
    onChange({ ...layer, ...updates });
  };

  return (
    <div className="bg-bg-surface border border-border-hairline rounded-md p-2 space-y-1">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={layer.enabled}
            onChange={(e) => updateLayer({ enabled: e.target.checked })}
            className="w-3 h-3 cursor-pointer accent-white"
          />
          <button
            type="button"
            onClick={() => updateLayer({ type: layer.type === 'drop' ? 'inner' : 'drop' })}
            className="text-[10px] px-1.5 py-0.5 rounded hover:bg-bg-hover text-text-label hover:text-text-primary transition-colors"
          >
            {layer.type === 'drop' ? 'Drop' : 'Inner'}
          </button>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-text-muted hover:text-text-primary text-sm px-0.5 transition-colors leading-none"
          aria-label="Delete shadow layer"
        >
          ×
        </button>
      </div>

      {/* Controls */}
      <div className="space-y-0">
        <div className="flex gap-1">
          <ScrubbableValue
            label="X"
            value={layer.x}
            min={-32}
            max={32}
            onChange={(value) => updateLayer({ x: value })}
            controlId={controlId}
            inline
          />
          <ScrubbableValue
            label="Y"
            value={layer.y}
            min={-32}
            max={32}
            onChange={(value) => updateLayer({ y: value })}
            controlId={controlId}
            inline
          />
        </div>
        <div className="flex gap-1">
          <ScrubbableValue
            label="Blur"
            value={layer.blur}
            min={0}
            max={64}
            onChange={(value) => updateLayer({ blur: value })}
            controlId={controlId}
            inline
          />
          <ScrubbableValue
            label="Spread"
            value={layer.spread}
            min={-20}
            max={32}
            onChange={(value) => updateLayer({ spread: value })}
            controlId={controlId}
            inline
          />
        </div>
        <div className="flex items-center gap-1">
          <ColorPicker
            label="Color"
            value={layer.color}
            onChange={(value) => updateLayer({ color: value })}
          />
          <ScrubbableValue
            label="Opacity"
            value={layer.opacity}
            min={0}
            max={100}
            unit="%"
            onChange={(value) => updateLayer({ opacity: value })}
            controlId={controlId}
            inline
          />
        </div>
      </div>
    </div>
  );
}
