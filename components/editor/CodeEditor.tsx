'use client';

import { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { useStore } from '@/lib/store';

export default function CodeEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { code, setCode } = useStore();

  useEffect(() => {
    if (!editorRef.current) return;

    const initialCode = code;
    const state = EditorState.create({
      doc: initialCode,
      extensions: [
        javascript({ jsx: true, typescript: true }),
        oneDark,
        EditorView.theme({
          '&': {
            backgroundColor: 'transparent',
          },
          '.cm-gutters': {
            backgroundColor: 'transparent',
          },
          '.cm-focused .cm-selectionBackground': {
            backgroundColor: '#333',
          },
          '.cm-selectionBackground': {
            backgroundColor: '#333',
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newCode = update.state.doc.toString();
            setCode(newCode);
          }
        }),
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

  // Sync external code changes to editor
  useEffect(() => {
    if (viewRef.current && code !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: code,
        },
      });
    }
  }, [code]);

  return <div ref={editorRef} className="h-full overflow-hidden" />;
}
