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

      {/* Controls - 4 column grid: label, value, label, value */}
      <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-1 gap-y-0.5 items-center">
        <span className="text-text-label text-[10px] font-medium">X</span>
        <ScrubbableValue
          label=""
          value={layer.x}
          min={-32}
          max={32}
          onChange={(value) => updateLayer({ x: value })}
          controlId={controlId}
          inline
        />
        <span className="text-text-label text-[10px] font-medium pl-1">Y</span>
        <ScrubbableValue
          label=""
          value={layer.y}
          min={-32}
          max={32}
          onChange={(value) => updateLayer({ y: value })}
          controlId={controlId}
          inline
        />
        <span className="text-text-label text-[10px] font-medium">Blur</span>
        <ScrubbableValue
          label=""
          value={layer.blur}
          min={0}
          max={64}
          onChange={(value) => updateLayer({ blur: value })}
          controlId={controlId}
          inline
        />
        <span className="text-text-label text-[10px] font-medium pl-1">Spread</span>
        <ScrubbableValue
          label=""
          value={layer.spread}
          min={-20}
          max={32}
          onChange={(value) => updateLayer({ spread: value })}
          controlId={controlId}
          inline
        />
        <span className="text-text-label text-[10px] font-medium">Color</span>
        <div className="col-span-3">
          <ColorPicker
            label=""
            value={layer.color}
            opacity={layer.opacity}
            onChange={(value) => updateLayer({ color: value })}
            onOpacityChange={(value) => updateLayer({ opacity: value })}
          />
        </div>
      </div>
    </div>
  );
}
