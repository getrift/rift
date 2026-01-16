import { create } from "zustand";

interface Store {
  code: string;
  setCode: (code: string) => void;
}

export const useStore = create<Store>((set) => ({
  code: "",
  setCode: (code: string) => set({ code }),
}));
