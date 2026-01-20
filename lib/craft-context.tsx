'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CraftContextValue {
  activeControlId: string | null;
  setActiveControlId: (id: string | null) => void;
}

const CraftContext = createContext<CraftContextValue | null>(null);

export function CraftProvider({ children }: { children: ReactNode }) {
  const [activeControlId, setActiveControlId] = useState<string | null>(null);

  return (
    <CraftContext.Provider value={{ activeControlId, setActiveControlId }}>
      {children}
    </CraftContext.Provider>
  );
}

export function useCraft() {
  const context = useContext(CraftContext);
  if (!context) {
    throw new Error('useCraft must be used within a CraftProvider');
  }
  return context;
}

export function useCraftOptional() {
  return useContext(CraftContext);
}
