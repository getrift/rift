import SpacingControl from '@/components/craft/SpacingControl';
import ShapeControl from '@/components/craft/ShapeControl';
import TypographyControl from '@/components/craft/TypographyControl';
import ColorControl from '@/components/craft/ColorControl';
import ShadowControl from '@/components/craft/ShadowControl';

export default function RightPanel() {
  return (
    <div className="w-[320px] bg-bg-panel border-l border-border-subtle h-screen flex flex-col">
      <div className="p-4 border-b border-border-subtle">
        <h2 className="text-text-secondary">Craft</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <h3 className="text-text-muted text-xs uppercase mb-3">Spacing</h3>
          <SpacingControl />
        </section>
        <section>
          <h3 className="text-text-muted text-xs uppercase mb-3">Shape</h3>
          <ShapeControl />
        </section>
        <section>
          <h3 className="text-text-muted text-xs uppercase mb-3">Typography</h3>
          <TypographyControl />
        </section>
        <section>
          <h3 className="text-text-muted text-xs uppercase mb-3">Color</h3>
          <ColorControl />
        </section>
        <section>
          <h3 className="text-text-muted text-xs uppercase mb-3">Shadows</h3>
          <ShadowControl />
        </section>
      </div>
    </div>
  );
}
