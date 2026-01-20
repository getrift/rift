/**
 * Icon stub generator for icon libraries (Lucide, Heroicons, etc.)
 * Provides placeholder components that render when icon imports are stripped
 */

/**
 * Generate a stub icon component
 * Returns a React component that renders a small placeholder
 */
export const iconStubTemplate = `
function createIconStub(iconName) {
  return function IconStub(props) {
    const size = props.size || 24;
    const className = props.className || '';
    const color = props.color || 'currentColor';

    // Create a simple SVG placeholder
    return React.createElement(
      'svg',
      {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: color,
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: 'lucide lucide-stub ' + className,
        style: props.style,
        ...props
      },
      // Draw a simple "?" icon as placeholder
      React.createElement('circle', { cx: 12, cy: 12, r: 10 }),
      React.createElement('path', { d: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' }),
      React.createElement('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 })
    );
  };
}
`.trim();

/**
 * Get icon stub script for a list of icon names
 */
export function getIconStubScript(iconNames: string[]): string {
  if (iconNames.length === 0) {
    return '';
  }

  const scripts: string[] = [];

  // Add the stub template function
  scripts.push(iconStubTemplate);

  // Create global variables for each icon
  for (const iconName of iconNames) {
    const safeName = JSON.stringify(iconName);
    scripts.push(`window[${safeName}] = createIconStub(${safeName});`);
  }

  return scripts.join('\n\n');
}
