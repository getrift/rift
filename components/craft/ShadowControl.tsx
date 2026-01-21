'use client';

import { motion } from 'framer-motion';
import { useStore, ShadowLayer } from '@/lib/store';
import ShadowLayerComponent from './ShadowLayer';
import Button from '@/components/ui/Button';

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
  
  const selectedPath = activeComponent?.selectedPaths?.[0] || null;
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
      <div className="flex gap-1">
        {(['soft', 'crisp', 'inner'] as const).map((preset) => (
          <Button
            key={preset}
            variant="ghost"
            size="sm"
            onClick={() => handlePresetAdd(preset)}
            className="capitalize flex-1 h-6 text-[10px]"
          >
            {preset}
          </Button>
        ))}
      </div>

      {/* Layer list */}
      <div className="space-y-1.5">
        {shadows.map((layer, index) => (
          <motion.div
            key={layer.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <ShadowLayerComponent
              layer={layer}
              onChange={(updated) => handleLayerChange(index, updated)}
              onDelete={() => handleLayerDelete(index)}
              controlId={controlId}
            />
          </motion.div>
        ))}
      </div>

      {/* Add button */}
      <motion.button
        type="button"
        onClick={handleAddLayer}
        className="w-full text-[10px] px-2 py-1.5 rounded-[5px] border border-dashed border-border-hairline bg-transparent hover:bg-bg-hover hover:border-white/20 text-text-muted hover:text-text-secondary transition-all duration-150"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        + Add Shadow
      </motion.button>
    </div>
  );
}
