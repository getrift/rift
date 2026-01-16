import { create } from "zustand";

interface Store {
  code: string;
  setCode: (code: string) => void;
  runtimeError: string | null;
  setRuntimeError: (error: string | null) => void;
  selectedPath: number[] | null;
  setSelectedPath: (path: number[] | null) => void;
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
}));
