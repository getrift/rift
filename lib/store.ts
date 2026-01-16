import { create } from "zustand";

export interface StyleOverrides {
  padding?: number;
  gap?: number;
  borderRadius?: number;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  boxShadow?: string;
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
}));
