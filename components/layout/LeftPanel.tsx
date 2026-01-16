import CodeEditor from '@/components/editor/CodeEditor';

export default function LeftPanel() {
  return (
    <div className="w-[280px] bg-panel border-r border-border-subtle h-screen flex flex-col">
      <div className="p-4">
        <h2 className="text-secondary">Code</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeEditor />
      </div>
    </div>
  );
}
