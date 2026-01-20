'use client';

import { useEffect, useRef, useMemo } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { useStore } from '@/lib/store';
import type { StyleOverrides } from '@/lib/store';
import { exportWithOverrides } from '@/lib/exportCode';
import { findPathAtPosition } from '@/lib/jsx-path-mapper';

const EMPTY_STYLE_OVERRIDES: Record<string, StyleOverrides> = Object.freeze({});

interface CodeEditorProps {
  readOnly?: boolean;
}

export default function CodeEditor({ readOnly = false }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  
  // Get active component's code and style overrides
  const activeComponentId = useStore((state) => state.activeComponentId);
  const components = useStore((state) => state.components);
  const activeComponent = components.find((c) => c.id === activeComponentId);
  const code = activeComponent?.code || '';
  const styleOverrides = activeComponent?.styleOverrides || EMPTY_STYLE_OVERRIDES;
  const setCode = useStore((state) => state.setCode);
  const setSelectedPath = useStore((state) => state.setSelectedPath);
  
  // Compute refined code with style overrides applied
  const refinedCode = useMemo(() => {
    if (Object.keys(styleOverrides).length === 0) {
      return code;
    }
    return exportWithOverrides(code, styleOverrides);
  }, [code, styleOverrides]);

  // Track if we're programmatically updating the editor
  const isInternalUpdate = useRef(false);

  // Stable reference to setSelectedPath for the extension
  const setSelectedPathRef = useRef(setSelectedPath);
  setSelectedPathRef.current = setSelectedPath;

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: refinedCode,
      extensions: [
        javascript({ jsx: true, typescript: true }),
        oneDark,
        // Click to select element in preview (Option+Click on Mac)
        EditorView.domEventHandlers({
          mousedown: (event, view) => {
            // Option key on Mac (altKey)
            if (event.altKey) {
              const pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
              if (pos !== null) {
                const code = view.state.doc.toString();
                const path = findPathAtPosition(code, pos);
                if (path) {
                  event.preventDefault();
                  event.stopPropagation();
                  setSelectedPathRef.current(path);
                  return true;
                }
              }
            }
            return false;
          },
        }),
        EditorView.theme({
            '&': {
              backgroundColor: 'transparent',
              fontSize: '11px',
              lineHeight: '1.35',
            },
            '.cm-gutters': {
              backgroundColor: 'transparent',
              fontSize: '11px',
            },
            '.cm-content': {
              padding: '8px 10px',
            },
            '.cm-focused .cm-selectionBackground': {
              backgroundColor: '#333',
            },
            '.cm-selectionBackground': {
              backgroundColor: '#333',
            },
          }),
        EditorView.editable.of(!readOnly),
        ...(readOnly ? [] : [
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !isInternalUpdate.current) {
              const newCode = update.state.doc.toString();
              // When user manually edits, save the new code and clear style overrides
              // (they're now "baked" into the code)
              setCode(newCode);

              const state = useStore.getState();
              const activeId = state.activeComponentId;
              const currentOverrides = state.styleOverrides;

              if (activeId && Object.keys(currentOverrides).length > 0) {
                state.setComponentStyleOverrides(activeId, {});
              }
            }
          }),
        ]),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Sync refined code changes to editor
  useEffect(() => {
    if (viewRef.current && refinedCode !== viewRef.current.state.doc.toString()) {
      isInternalUpdate.current = true;
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: refinedCode,
        },
      });
      isInternalUpdate.current = false;
    }
  }, [refinedCode]);

  return <div ref={editorRef} className="h-full overflow-hidden" />;
}
