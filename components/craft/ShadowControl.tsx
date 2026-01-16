'use client';

import { useStore, ShadowLayer } from '@/lib/store';
import ShadowLayerComponent from './ShadowLayer';

const PRESETS = {
  soft: { type: 'drop' as const, x: 0, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 15 },
  crisp: { type: 'drop' as const, x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 25 },
  inner: { type: 'inner' as const, x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 20 },
};

export default function ShadowControl() {
  const selectedPath = useStore((state) => state.selectedPath);
  const styleOverrides = useStore((state) => state.styleOverrides);
  const setShadows = useStore((state) => state.setShadows);

  if (!selectedPath) {
    return <p className="text-text-muted text-sm">Select an element</p>;
  }

  const current = styleOverrides[JSON.stringify(selectedPath)] || {};
  const shadows = current.shadows || [];

  const handleLayerChange = (index: number, updated: ShadowLayer) => {
    const newShadows = [...shadows];
    newShadows[index] = updated;
    setShadows(selectedPath, newShadows);
  };

  const handleLayerDelete = (index: number) => {
    const newShadows = shadows.filter((_, i) => i !== index);
    setShadows(selectedPath, newShadows);
  };

  const handleAddLayer = () => {
    const newLayer: ShadowLayer = {
      id: Date.now().toString(),
      type: 'drop',
      x: 0,
      y: 4,
      blur: 8,
      spread: 0,
      color: '#000000',
      opacity: 20,
      enabled: true,
    };
    setShadows(selectedPath, [...shadows, newLayer]);
  };

  const handlePresetAdd = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    const newLayer: ShadowLayer = {
      id: Date.now().toString(),
      ...preset,
      enabled: true,
    };
    setShadows(selectedPath, [...shadows, newLayer]);
  };

  return (
    <div className="space-y-3">
      {/* Presets row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handlePresetAdd('soft')}
          className="text-xs px-2 py-1 rounded border border-border-muted bg-bg-hover hover:bg-bg-hover/80 text-text-secondary hover:text-text-primary transition-colors"
        >
          Soft
        </button>
        <button
          type="button"
          onClick={() => handlePresetAdd('crisp')}
          className="text-xs px-2 py-1 rounded border border-border-muted bg-bg-hover hover:bg-bg-hover/80 text-text-secondary hover:text-text-primary transition-colors"
        >
          Crisp
        </button>
        <button
          type="button"
          onClick={() => handlePresetAdd('inner')}
          className="text-xs px-2 py-1 rounded border border-border-muted bg-bg-hover hover:bg-bg-hover/80 text-text-secondary hover:text-text-primary transition-colors"
        >
          Inner
        </button>
      </div>

      {/* Layer list */}
      <div className="space-y-2">
        {shadows.map((layer, index) => (
          <ShadowLayerComponent
            key={layer.id}
            layer={layer}
            onChange={(updated) => handleLayerChange(index, updated)}
            onDelete={() => handleLayerDelete(index)}
          />
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={handleAddLayer}
        className="w-full text-xs px-3 py-2 rounded border border-border-muted bg-bg-hover hover:bg-bg-hover/80 text-text-secondary hover:text-text-primary transition-colors"
      >
        + Add Shadow
      </button>
    </div>
  );
}
