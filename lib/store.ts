import { create } from "zustand";

export interface ShadowLayer {
  id: string;           // unique id for React key
  type: 'drop' | 'inner';
  x: number;            // px
  y: number;            // px
  blur: number;         // px
  spread: number;       // px
  color: string;        // hex
  opacity: number;      // 0-100
  enabled: boolean;
}

export interface StyleOverrides {
  padding?: number;
  gap?: number;
  borderRadius?: number;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  shadows?: ShadowLayer[];
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function compileShadows(layers: ShadowLayer[]): string {
  return layers
    .filter(l => l.enabled)
    .map(l => {
      const rgba = hexToRgba(l.color, l.opacity / 100);
      const inset = l.type === 'inner' ? 'inset ' : '';
      return `${inset}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${rgba}`;
    })
    .join(', ');
}

interface Store {
  code: string;
  setCode: (code: string) => void;
  runtimeError: string | null;
  setRuntimeError: (error: string | null) => void;
  selectedPath: number[] | null;
  setSelectedPath: (path: number[] | null) => void;
  styleOverrides: Record<string, StyleOverrides>;
  setStyleOverride: (path: number[], property: keyof StyleOverrides, value: number | string) => void;
  setShadows: (path: number[], shadows: ShadowLayer[]) => void;
}

export const useStore = create<Store>((set) => ({
  code: `export default function Button() {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      Click me
    </button>
  );
}`,
  setCode: (code: string) => set({ code }),
  runtimeError: null,
  setRuntimeError: (error: string | null) => set({ runtimeError: error }),
  selectedPath: null,
  setSelectedPath: (path: number[] | null) => set({ selectedPath: path }),
  styleOverrides: {},
  setStyleOverride: (path: number[], property: keyof StyleOverrides, value: number | string) =>
    set((state) => {
      const key = JSON.stringify(path);
      const current = state.styleOverrides[key] || {};
      return {
        styleOverrides: {
          ...state.styleOverrides,
          [key]: {
            ...current,
            [property]: value,
          },
        },
      };
    }),
  setShadows: (path: number[], shadows: ShadowLayer[]) =>
    set((state) => {
      const key = JSON.stringify(path);
      const current = state.styleOverrides[key] || {};
      return {
        styleOverrides: {
          ...state.styleOverrides,
          [key]: {
            ...current,
            shadows,
          },
        },
      };
    }),
}));
