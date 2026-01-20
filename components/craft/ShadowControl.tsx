'use client';

import { useStore, ShadowLayer } from '@/lib/store';
import ShadowLayerComponent from './ShadowLayer';

const PRESETS = {
  soft: { type: 'drop' as const, x: 0, y: 4, blur: 12, spread: 0, color: '#000000', opacity: 15 },
  crisp: { type: 'drop' as const, x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 25 },
  inner: { type: 'inner' as const, x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 20 },
};

interface ShadowControlProps {
  controlId?: string;
}

export default function ShadowControl({ controlId }: ShadowControlProps) {
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);
  
  const selectedPath = activeComponent?.selectedPath || null;
  const styleOverrides = activeComponent?.styleOverrides || {};
  const setShadows = useStore((state) => state.setShadows);

  if (!selectedPath) return null;

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
    <div className="space-y-2">
      {/* Presets row */}
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => handlePresetAdd('soft')}
          className="text-[10px] px-2 py-0.5 rounded hover:bg-bg-hover text-text-label hover:text-text-primary transition-colors"
        >
          Soft
        </button>
        <button
          type="button"
          onClick={() => handlePresetAdd('crisp')}
          className="text-[10px] px-2 py-0.5 rounded hover:bg-bg-hover text-text-label hover:text-text-primary transition-colors"
        >
          Crisp
        </button>
        <button
          type="button"
          onClick={() => handlePresetAdd('inner')}
          className="text-[10px] px-2 py-0.5 rounded hover:bg-bg-hover text-text-label hover:text-text-primary transition-colors"
        >
          Inner
        </button>
      </div>

      {/* Layer list */}
      <div className="space-y-1.5">
        {shadows.map((layer, index) => (
          <ShadowLayerComponent
            key={layer.id}
            layer={layer}
            onChange={(updated) => handleLayerChange(index, updated)}
            onDelete={() => handleLayerDelete(index)}
            controlId={controlId}
          />
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={handleAddLayer}
        className="w-full text-[10px] px-2 py-1 rounded border border-border-hairline border-dashed bg-transparent hover:bg-bg-hover text-text-muted hover:text-text-secondary transition-colors"
      >
        + Add Shadow
      </button>
    </div>
  );
}
