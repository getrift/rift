'use client';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const PRESETS = [
  '#ffffff',
  '#f5f5f5',
  '#e5e5e5',
  '#a3a3a3',
  '#737373',
  '#525252',
  '#262626',
  '#171717',
  '#000000',
];

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm">{label}</span>
        <div
          className="w-4 h-4 rounded border border-border-muted cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => {
            // Optional: trigger native color picker
            const input = document.createElement('input');
            input.type = 'color';
            input.value = value;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              onChange(target.value);
            };
            input.click();
          }}
        />
      </div>
      <div className="flex gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            className={`w-5 h-5 rounded cursor-pointer border border-border-subtle ${
              value === preset
                ? 'ring-1 ring-white ring-offset-1 ring-offset-bg-panel'
                : ''
            }`}
            style={{ backgroundColor: preset }}
            onClick={() => onChange(preset)}
            aria-label={`Select color ${preset}`}
          />
        ))}
      </div>
    </div>
  );
}
