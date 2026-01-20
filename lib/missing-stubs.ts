/**
 * Missing component stub generator for local imports
 * Provides placeholder components that render when local imports are stripped
 */

/**
 * Generate a stub for a missing component
 * Returns a React component that renders a helpful placeholder
 */
export const missingStubTemplate = `
function createMissingStub(componentName) {
  return function MissingStub(props) {
    const { children, className = '', ...rest } = props || {};

    return React.createElement(
      'div',
      {
        className: 'inline-flex items-center gap-2 px-3 py-2 border-2 border-dashed border-amber-500/50 bg-amber-500/10 rounded text-amber-600 text-xs font-mono ' + className,
        title: 'This component is imported from a local file and is not available in the preview',
        ...rest
      },
      React.createElement(
        'svg',
        {
          className: 'w-4 h-4 flex-shrink-0',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          viewBox: '0 0 24 24'
        },
        React.createElement('path', {
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        })
      ),
      React.createElement('span', {}, 'Missing: ' + componentName),
      children && React.createElement('div', { className: 'ml-2 opacity-50' }, children)
    );
  };
}
`.trim();

/**
 * Get missing component stub script for a list of component names
 * This runs in the iframe's global scope to set up window.ComponentName
 */
export function getMissingStubScript(componentNames: string[]): string {
  if (componentNames.length === 0) {
    return '';
  }

  const scripts: string[] = [];

  // Add the stub template function
  scripts.push(missingStubTemplate);

  // Create global variables for each missing component
  for (const componentName of componentNames) {
    const safeName = JSON.stringify(componentName);
    scripts.push(`window[${safeName}] = createMissingStub(${safeName});`);
  }

  return scripts.join('\n\n');
}

/**
 * Get missing component declarations to prepend to compiled code
 * This makes stubs available as local variables inside the ES module blob
 */
export function getMissingDeclarations(componentNames: string[]): string {
  if (componentNames.length === 0) {
    return '';
  }

  return componentNames
    .map((name) => `const ${name} = window[${JSON.stringify(name)}];`)
    .join('\n');
}
