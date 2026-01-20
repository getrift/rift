import { create } from "zustand";
import { deleteElement, duplicateElement } from "./jsx-path-mapper";

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
  // Padding - can be uniform or individual
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingLinked?: boolean; // true = all same, false = individual
  
  gap?: number;
  
  // Border radius - can be uniform or individual corners
  borderRadius?: number;
  borderRadiusTopLeft?: number;
  borderRadiusTopRight?: number;
  borderRadiusBottomRight?: number;
  borderRadiusBottomLeft?: number;
  borderRadiusLinked?: boolean; // true = all same, false = individual
  
  fontSize?: number;
  lineHeight?: number;
  
  // Colors with opacity
  color?: string;
  colorOpacity?: number; // 0-100, defaults to 100
  backgroundColor?: string;
  backgroundOpacity?: number; // 0-100, defaults to 100
  
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

export interface ComputedStyles {
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomRightRadius?: string;
  borderBottomLeftRadius?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  gap?: string;
  fontSize?: string;
  lineHeight?: string;
}

export interface ComponentState {
  id: string;
  name: string;
  code: string;
  selectedPaths: number[][] | null; // Array of selected DOM paths (for multi-select)
  styleOverrides: Record<string, StyleOverrides>;
  runtimeError: string | null;
  position?: { x: number; y: number }; // Optional: when set, uses absolute positioning
  size?: { width: number; height: number }; // Optional: custom size for card
}

interface Store {
  // Multi-component state
  components: ComponentState[];
  activeComponentId: string | null;
  
  // Canvas viewport state
  viewport: {
    zoom: number;      // 0.1 to 2.0
    panX: number;      // pixels
    panY: number;      // pixels
  };
  
  // Component management actions
  addComponent: (code?: string) => string;
  removeComponent: (id: string) => void;
  setActiveComponent: (id: string) => void;
  
  // Component-specific actions
  updateComponentCode: (id: string, code: string) => void;
  updateComponentName: (id: string, name: string) => void;
  setComponentSelectedPaths: (id: string, paths: number[][] | null) => void;
  addToSelection: (id: string, path: number[]) => void;
  removeFromSelection: (id: string, path: number[]) => void;
  setComponentStyleOverrides: (id: string, overrides: Record<string, StyleOverrides>) => void;
  setComponentRuntimeError: (id: string, error: string | null) => void;
  setComponentPosition: (id: string, position: { x: number; y: number } | undefined) => void;
  setComponentSize: (id: string, size: { width: number; height: number } | undefined) => void;
  
  // Canvas viewport actions
  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  setViewport: (viewport: { zoom: number; panX: number; panY: number }) => void;
  resetViewport: () => void;
  
  // Style override helpers (for active component)
  setStyleOverride: (path: number[], property: keyof StyleOverrides, value: number | string) => void;
  setShadows: (path: number[], shadows: ShadowLayer[]) => void;
  
  // Computed styles (only for active component's selection)
  computedStyles: ComputedStyles | null;
  setComputedStyles: (styles: ComputedStyles | null) => void;
  
  // UI state
  rightPanelWidth: number;
  setRightPanelWidth: (width: number) => void;

  leftPanelWidth: number;
  setLeftPanelWidth: (width: number) => void;

  // Element manipulation
  deleteSelectedElement: () => void;
  duplicateSelectedElement: () => void;
  
  // Backward compatibility getters (work on active component)
  code: string;
  setCode: (code: string) => void;
  runtimeError: string | null;
  setRuntimeError: (error: string | null) => void;
  selectedPath: number[] | null; // First selected path (for backward compat)
  selectedPaths: number[][] | null; // All selected paths
  setSelectedPath: (path: number[] | null, addToSelection?: boolean) => void;
  styleOverrides: Record<string, StyleOverrides>;
}

const DEFAULT_CODE = `export default function NotificationCard() {
  return (
    <div className="bg-white rounded-xl p-5 max-w-sm shadow-lg">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-gray-900">John Doe</span>
            <span className="text-xs text-gray-400">2m ago</span>
          </div>
          <p className="text-gray-600 text-sm mt-1 leading-relaxed">
            Hey! Just pushed the new design updates. Can you review?
          </p>
          <div className="flex gap-2 mt-3">
            <button className="bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors">
              Reply
            </button>
            <button className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`;

// Extract component name from code
function extractComponentName(code: string): string {
  // Try to find: export default function Name
  const functionMatch = code.match(/export\s+default\s+function\s+([A-Z][A-Za-z0-9]*)/);
  if (functionMatch) return functionMatch[1];
  
  // Try to find: const Name = () => 
  const arrowMatch = code.match(/const\s+([A-Z][A-Za-z0-9]*)\s*=/);
  if (arrowMatch) return arrowMatch[1];
  
  // Default fallback
  return 'Component';
}

export const useStore = create<Store>((set, get) => {
  // Initialize with one default component
  const initialComponent: ComponentState = {
    id: crypto.randomUUID(),
    name: 'NotificationCard',
    code: DEFAULT_CODE,
    selectedPaths: null,
    styleOverrides: {},
    runtimeError: null,
  };

  return {
    // Multi-component state
    components: [initialComponent],
    activeComponentId: initialComponent.id,
    
    // Canvas viewport state
    viewport: {
      zoom: 1.0,
      panX: 0,
      panY: 0,
    },
    
    // Component management actions
    addComponent: (code?: string) => {
      const id = crypto.randomUUID();
      const componentCode = code || DEFAULT_CODE;
      const newComponent: ComponentState = {
        id,
        name: extractComponentName(componentCode),
        code: componentCode,
        selectedPaths: null,
        styleOverrides: {},
        runtimeError: null,
      };
      set((state) => ({
        components: [...state.components, newComponent],
        activeComponentId: id,
      }));
      return id;
    },
    
    removeComponent: (id: string) => {
      set((state) => {
        const newComponents = state.components.filter((c) => c.id !== id);
        // If removing active component, set active to first remaining or null
        const newActiveId = state.activeComponentId === id
          ? (newComponents[0]?.id || null)
          : state.activeComponentId;
        return {
          components: newComponents,
          activeComponentId: newActiveId,
        };
      });
    },
    
    setActiveComponent: (id: string) => {
      set({ activeComponentId: id });
    },
    
    // Component-specific actions
    updateComponentCode: (id: string, code: string) => {
      set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, code, name: extractComponentName(code) } : c
        ),
      }));
    },
    
    updateComponentName: (id: string, name: string) => {
      set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, name } : c
        ),
      }));
    },
    
    setComponentSelectedPaths: (id: string, paths: number[][] | null) => {
      set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, selectedPaths: paths } : c
        ),
      }));
    },
    
    addToSelection: (id: string, path: number[]) => {
      set((state) => ({
        components: state.components.map((c) => {
          if (c.id !== id) return c;
          const pathKey = JSON.stringify(path);
          const existing = c.selectedPaths || [];
          // Check if already selected
          if (existing.some(p => JSON.stringify(p) === pathKey)) {
            return c;
          }
          return { ...c, selectedPaths: [...existing, path] };
        }),
      }));
    },
    
    removeFromSelection: (id: string, path: number[]) => {
      set((state) => ({
        components: state.components.map((c) => {
          if (c.id !== id) return c;
          const pathKey = JSON.stringify(path);
          const existing = c.selectedPaths || [];
          const filtered = existing.filter(p => JSON.stringify(p) !== pathKey);
          return { ...c, selectedPaths: filtered.length > 0 ? filtered : null };
        }),
      }));
    },
    
    setComponentStyleOverrides: (id: string, overrides: Record<string, StyleOverrides>) => {
      set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, styleOverrides: overrides } : c
        ),
      }));
    },
    
    setComponentRuntimeError: (id: string, error: string | null) => {
      set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, runtimeError: error } : c
        ),
      }));
    },
    
    setComponentPosition: (id: string, position: { x: number; y: number } | undefined) => {
      set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, position } : c
        ),
      }));
    },
    
    setComponentSize: (id: string, size: { width: number; height: number } | undefined) => {
      set((state) => ({
        components: state.components.map((c) =>
          c.id === id ? { ...c, size } : c
        ),
      }));
    },
    
    // Canvas viewport actions
    setZoom: (zoom: number) => {
      const clampedZoom = Math.max(0.1, Math.min(2.0, zoom));
      set((state) => ({
        viewport: { ...state.viewport, zoom: clampedZoom },
      }));
    },
    
    setPan: (panX: number, panY: number) => {
      set((state) => ({
        viewport: { ...state.viewport, panX, panY },
      }));
    },
    
    setViewport: (viewport: { zoom: number; panX: number; panY: number }) => {
      const clampedZoom = Math.max(0.1, Math.min(2.0, viewport.zoom));
      set({
        viewport: { ...viewport, zoom: clampedZoom },
      });
    },
    
    resetViewport: () => {
      set({
        viewport: { zoom: 1.0, panX: 0, panY: 0 },
      });
    },
    
    // Style override helpers (work on active component)
    setStyleOverride: (path: number[], property: keyof StyleOverrides, value: number | string) => {
      const state = get();
      const activeId = state.activeComponentId;
      if (!activeId) return;
      
      const component = state.components.find((c) => c.id === activeId);
      if (!component) return;
      
      const key = JSON.stringify(path);
      const current = component.styleOverrides[key] || {};
      const newOverrides = {
        ...component.styleOverrides,
        [key]: {
          ...current,
          [property]: value,
        },
      };
      
      state.setComponentStyleOverrides(activeId, newOverrides);
    },
    
    setShadows: (path: number[], shadows: ShadowLayer[]) => {
      const state = get();
      const activeId = state.activeComponentId;
      if (!activeId) return;
      
      const component = state.components.find((c) => c.id === activeId);
      if (!component) return;
      
      const key = JSON.stringify(path);
      const current = component.styleOverrides[key] || {};
      const newOverrides = {
        ...component.styleOverrides,
        [key]: {
          ...current,
          shadows,
        },
      };
      
      state.setComponentStyleOverrides(activeId, newOverrides);
    },
    
    // Computed styles (only for active component's selection)
    computedStyles: null,
    setComputedStyles: (styles: ComputedStyles | null) => set({ computedStyles: styles }),
    
    // Backward compatibility getters (work on active component)
    get code() {
      const state = get();
      const activeComponent = state.components.find((c) => c.id === state.activeComponentId);
      return activeComponent?.code || '';
    },
    
    setCode: (code: string) => {
      const state = get();
      const activeId = state.activeComponentId;
      if (activeId) {
        state.updateComponentCode(activeId, code);
      }
    },
    
    get runtimeError() {
      const state = get();
      const activeComponent = state.components.find((c) => c.id === state.activeComponentId);
      return activeComponent?.runtimeError || null;
    },
    
    setRuntimeError: (error: string | null) => {
      const state = get();
      const activeId = state.activeComponentId;
      if (activeId) {
        state.setComponentRuntimeError(activeId, error);
      }
    },
    
    get selectedPath() {
      const state = get();
      const activeComponent = state.components.find((c) => c.id === state.activeComponentId);
      // Return first selected path for backward compatibility
      return activeComponent?.selectedPaths?.[0] || null;
    },
    
    get selectedPaths() {
      const state = get();
      const activeComponent = state.components.find((c) => c.id === state.activeComponentId);
      return activeComponent?.selectedPaths || null;
    },
    
    setSelectedPath: (path: number[] | null, addToSelection = false) => {
      const state = get();
      const activeId = state.activeComponentId;
      if (!activeId) return;
      
      if (path === null) {
        state.setComponentSelectedPaths(activeId, null);
      } else if (addToSelection) {
        state.addToSelection(activeId, path);
      } else {
        state.setComponentSelectedPaths(activeId, [path]);
      }
    },
    
    get styleOverrides() {
      const state = get();
      const activeComponent = state.components.find((c) => c.id === state.activeComponentId);
      return activeComponent?.styleOverrides || {};
    },
    
    // UI state
    rightPanelWidth: 260,
    setRightPanelWidth: (width: number) => {
      const clamped = Math.max(240, Math.min(420, Math.round(width)));
      set({ rightPanelWidth: clamped });
    },

    leftPanelWidth: 300,
    setLeftPanelWidth: (width: number) => {
      const clamped = Math.max(240, Math.min(520, Math.round(width)));
      set({ leftPanelWidth: clamped });
    },
    
    // Element manipulation
    deleteSelectedElement: () => {
      const state = get();
      const activeId = state.activeComponentId;
      console.log('[DELETE] activeId:', activeId);
      if (!activeId) return;
      
      const component = state.components.find((c) => c.id === activeId);
      const selectedPath = component?.selectedPaths?.[0];
      console.log('[DELETE] selectedPath:', selectedPath);
      if (!component || !selectedPath) return;
      
      const newCode = deleteElement(component.code, selectedPath);
      console.log('[DELETE] newCode differs:', newCode !== component.code);
      if (newCode !== component.code) {
        // Clear selection and style overrides for deleted element
        const pathKey = JSON.stringify(selectedPath);
        const newOverrides = { ...component.styleOverrides };
        delete newOverrides[pathKey];
        
        set((s) => ({
          components: s.components.map((c) =>
            c.id === activeId
              ? { ...c, code: newCode, selectedPaths: null, styleOverrides: newOverrides }
              : c
          ),
        }));
        console.log('[DELETE] Done!');
      }
    },
    
    duplicateSelectedElement: () => {
      const state = get();
      const activeId = state.activeComponentId;
      if (!activeId) return;
      
      const component = state.components.find((c) => c.id === activeId);
      const selectedPath = component?.selectedPaths?.[0];
      if (!component || !selectedPath) return;
      
      const newCode = duplicateElement(component.code, selectedPath);
      if (newCode !== component.code) {
        set((s) => ({
          components: s.components.map((c) =>
            c.id === activeId ? { ...c, code: newCode } : c
          ),
        }));
      }
    },
  };
});
