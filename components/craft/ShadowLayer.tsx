'use client';

import { ShadowLayer as ShadowLayerType } from '@/lib/store';
import Slider from './Slider';
import ColorPicker from './ColorPicker';

interface ShadowLayerProps {
  layer: ShadowLayerType;
  onChange: (updated: ShadowLayerType) => void;
  onDelete: () => void;
}

export default function ShadowLayerComponent({ layer, onChange, onDelete }: ShadowLayerProps) {
  const updateLayer = (updates: Partial<ShadowLayerType>) => {
    onChange({ ...layer, ...updates });
  };

  return (
    <div className="border border-border-subtle rounded-md p-2 space-y-2 bg-bg-surface">
      {/* Header row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={layer.enabled}
            onChange={(e) => updateLayer({ enabled: e.target.checked })}
            className="w-3 h-3 cursor-pointer"
          />
          <button
            type="button"
            onClick={() => updateLayer({ type: layer.type === 'drop' ? 'inner' : 'drop' })}
            className="text-xs px-2 py-0.5 rounded border border-border-muted bg-bg-hover hover:bg-bg-hover/80 text-text-secondary hover:text-text-primary transition-colors"
          >
            {layer.type === 'drop' ? 'Drop' : 'Inner'}
          </button>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="text-text-muted hover:text-text-primary text-xs px-1 transition-colors"
          aria-label="Delete shadow layer"
        >
          ×
        </button>
      </div>

      {/* Expanded content */}
      <div className="space-y-2 pt-1">
        <div className="grid grid-cols-2 gap-2">
          <Slider
            label="X"
            value={layer.x}
            min={-20}
            max={20}
            onChange={(value) => updateLayer({ x: value })}
          />
          <Slider
            label="Y"
            value={layer.y}
            min={-20}
            max={20}
            onChange={(value) => updateLayer({ y: value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Slider
            label="Blur"
            value={layer.blur}
            min={0}
            max={40}
            onChange={(value) => updateLayer({ blur: value })}
          />
          <Slider
            label="Spread"
            value={layer.spread}
            min={-10}
            max={20}
            onChange={(value) => updateLayer({ spread: value })}
          />
        </div>
        <ColorPicker
          label="Color"
          value={layer.color}
          onChange={(value) => updateLayer({ color: value })}
        />
        <Slider
          label="Opacity"
          value={layer.opacity}
          min={0}
          max={100}
          unit="%"
          onChange={(value) => updateLayer({ opacity: value })}
        />
      </div>
    </div>
  );
}
