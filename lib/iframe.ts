export type IframeMode = 'card' | 'preview';

export interface IframeContentOptions {
  compiledCode: string;
  polyfillScript?: string;
  iconStubScript?: string;
  missingStubScript?: string;
  componentId?: string;
  mode: IframeMode;
}

function toJsStringLiteral(value: string): string {
  return JSON.stringify(value).replace(/<\/script>/gi, '<\\/script>');
}

function buildMessageHelper(componentId?: string): string {
  const meta = componentId
    ? `{ componentId: ${JSON.stringify(componentId)} }`
    : '{}';

  return `
const MESSAGE_META = ${meta};
function postToParent(type, payload) {
  window.parent.postMessage({ type, ...MESSAGE_META, ...(payload || {}) }, '*');
}
  `.trim();
}

function buildBaseStyles(mode: IframeMode): string {
  const overflow = mode === 'card' ? ';overflow:hidden' : '';
  const rootPadding = mode === 'card' ? ';padding:8px' : '';
  const cursor = mode === 'preview' ? '*{cursor:pointer}' : '';

  return [
    `html,body{margin:0;height:100%;background:transparent${overflow}}`,
    `#root{height:100%;display:flex;align-items:center;justify-content:center${rootPadding}}`,
    cursor,
  ]
    .filter(Boolean)
    .join('');
}

function buildPreviewInteractionScript(): string {
  return `
// Selection state
let selectedEl = null;
let hoveredEl = null;

// Style overrides state
let currentOverrides = {};

// Get DOM path from element to root
function getDomPath(el) {
  const path = [];
  let current = el;
  while (current && current.parentElement && current.id !== 'root') {
    const parent = current.parentElement;
    const index = Array.from(parent.children).indexOf(current);
    path.unshift(index);
    current = parent;
  }
  return path;
}

// Get element from DOM path
function getElFromPath(path) {
  let el = document.getElementById('root');
  for (const index of path) {
    if (!el) return null;
    el = el.children[index];
  }
  return el;
}

// Highlight hovered element
function updateHover(el) {
  if (hoveredEl && hoveredEl !== selectedEl) {
    hoveredEl.style.outline = '';
    hoveredEl.style.outlineOffset = '';
  }
  hoveredEl = el;
  if (el && el !== selectedEl) {
    el.style.outline = '1px dashed rgba(59, 130, 246, 0.5)';
    el.style.outlineOffset = '2px';
  }
}

// Highlight selected element
function updateSelection(el) {
  if (selectedEl) {
    selectedEl.style.outline = '';
    selectedEl.style.outlineOffset = '';
  }
  if (hoveredEl) {
    hoveredEl.style.outline = '';
    hoveredEl.style.outlineOffset = '';
  }
  selectedEl = el;
  hoveredEl = null;
  if (el) {
    el.style.outline = '2px solid rgb(59, 130, 246)';
    el.style.outlineOffset = '2px';
  }
}

// Compile shadows to CSS box-shadow string
function compileShadowsInIframe(layers) {
  return layers
    .filter(l => l.enabled)
    .map(l => {
      const r = parseInt(l.color.slice(1, 3), 16);
      const g = parseInt(l.color.slice(3, 5), 16);
      const b = parseInt(l.color.slice(5, 7), 16);
      const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (l.opacity / 100) + ')';
      const inset = l.type === 'inner' ? 'inset ' : '';
      return inset + l.x + 'px ' + l.y + 'px ' + l.blur + 'px ' + l.spread + 'px ' + rgba;
    })
    .join(', ');
}

// Helper to apply color with opacity
function applyColorWithOpacity(hex, opacity) {
  if (opacity === undefined || opacity === 100) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (opacity / 100) + ')';
}

// Apply style overrides
function applyOverrides() {
  // First clear all previously applied styles
  document.querySelectorAll('[data-rift-styled]').forEach(el => {
    el.style.padding = '';
    el.style.paddingTop = '';
    el.style.paddingRight = '';
    el.style.paddingBottom = '';
    el.style.paddingLeft = '';
    el.style.gap = '';
    el.style.borderRadius = '';
    el.style.borderTopLeftRadius = '';
    el.style.borderTopRightRadius = '';
    el.style.borderBottomRightRadius = '';
    el.style.borderBottomLeftRadius = '';
    el.style.fontSize = '';
    el.style.lineHeight = '';
    el.style.color = '';
    el.style.backgroundColor = '';
    el.style.boxShadow = '';
    el.removeAttribute('data-rift-styled');
  });
  // Apply current overrides
  for (const [pathKey, styles] of Object.entries(currentOverrides)) {
    const path = JSON.parse(pathKey);
    const el = getElFromPath(path);
    if (!el) continue;
    el.setAttribute('data-rift-styled', 'true');
    
    // Handle padding - individual or uniform
    if (styles.paddingLinked === false) {
      if (styles.paddingTop !== undefined) el.style.paddingTop = styles.paddingTop + 'px';
      if (styles.paddingRight !== undefined) el.style.paddingRight = styles.paddingRight + 'px';
      if (styles.paddingBottom !== undefined) el.style.paddingBottom = styles.paddingBottom + 'px';
      if (styles.paddingLeft !== undefined) el.style.paddingLeft = styles.paddingLeft + 'px';
    } else if (styles.padding !== undefined) {
      el.style.padding = styles.padding + 'px';
    }
    
    if (styles.gap !== undefined) el.style.gap = styles.gap + 'px';
    
    // Handle border radius - individual or uniform
    if (styles.borderRadiusLinked === false) {
      if (styles.borderRadiusTopLeft !== undefined) el.style.borderTopLeftRadius = styles.borderRadiusTopLeft + 'px';
      if (styles.borderRadiusTopRight !== undefined) el.style.borderTopRightRadius = styles.borderRadiusTopRight + 'px';
      if (styles.borderRadiusBottomRight !== undefined) el.style.borderBottomRightRadius = styles.borderRadiusBottomRight + 'px';
      if (styles.borderRadiusBottomLeft !== undefined) el.style.borderBottomLeftRadius = styles.borderRadiusBottomLeft + 'px';
    } else if (styles.borderRadius !== undefined) {
      el.style.borderRadius = styles.borderRadius + 'px';
    }
    
    if (styles.fontSize !== undefined) el.style.fontSize = styles.fontSize + 'px';
    if (styles.lineHeight !== undefined) el.style.lineHeight = styles.lineHeight.toString();
    
    // Handle colors with opacity
    if (styles.color !== undefined) {
      el.style.color = applyColorWithOpacity(styles.color, styles.colorOpacity);
    }
    if (styles.backgroundColor !== undefined) {
      el.style.backgroundColor = applyColorWithOpacity(styles.backgroundColor, styles.backgroundOpacity);
    }
    
    if (styles.shadows && styles.shadows.length > 0) {
      el.style.boxShadow = compileShadowsInIframe(styles.shadows);
    }
  }
}

// Get computed styles for an element
function getComputedStylesForElement(el) {
  const computed = window.getComputedStyle(el);
  return {
    color: computed.color,
    backgroundColor: computed.backgroundColor,
    borderRadius: computed.borderRadius,
    borderTopLeftRadius: computed.borderTopLeftRadius,
    borderTopRightRadius: computed.borderTopRightRadius,
    borderBottomRightRadius: computed.borderBottomRightRadius,
    borderBottomLeftRadius: computed.borderBottomLeftRadius,
    padding: computed.padding,
    paddingTop: computed.paddingTop,
    paddingRight: computed.paddingRight,
    paddingBottom: computed.paddingBottom,
    paddingLeft: computed.paddingLeft,
    gap: computed.gap,
    fontSize: computed.fontSize,
    lineHeight: computed.lineHeight,
  };
}

// Click handler (on document, delegated)
document.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  
  // Clicking on root/body = deselect
  if (target.id === 'root' || target === document.body) {
    updateSelection(null);
    postToParent('element-deselected', {});
    return;
  }
  
  const path = getDomPath(target);
  updateSelection(target);
  const computedStyles = getComputedStylesForElement(target);
  postToParent('element-selected', { path, computedStyles });
}, true);

// Hover handlers for element boundaries
document.addEventListener('mouseover', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.id === 'root') return;
  updateHover(target);
}, true);

document.addEventListener('mouseout', (e) => {
  const target = e.target;
  if (target === hoveredEl) {
    updateHover(null);
  }
}, true);

// Listen for messages from parent
window.addEventListener('message', (e) => {
  if (MESSAGE_META.componentId && e.data?.componentId && e.data.componentId !== MESSAGE_META.componentId) {
    return;
  }
  if (e.data?.type === 'select-element') {
    const el = getElFromPath(e.data.path);
    updateSelection(el);
  } else if (e.data?.type === 'apply-overrides') {
    currentOverrides = e.data.overrides || {};
    applyOverrides();
  }
});
  `.trim();
}

export function buildIframeContent(options: IframeContentOptions): string {
  const {
    compiledCode,
    polyfillScript,
    iconStubScript,
    missingStubScript,
    componentId,
    mode,
  } = options;

  const styles = buildBaseStyles(mode);
  const messageHelper = buildMessageHelper(componentId);
  const interactionScript = mode === 'preview' ? buildPreviewInteractionScript() : '';

  const polyfills = polyfillScript?.trim() ? polyfillScript : '// No polyfills needed';
  const iconStubs = iconStubScript?.trim() ? iconStubScript : '// No icon stubs needed';
  const missingStubs = missingStubScript?.trim() ? missingStubScript : '// No missing components';

  const codeLiteral = toJsStringLiteral(compiledCode);

  return `<!DOCTYPE html>
<html>
<head>
  <script src='https://cdn.tailwindcss.com'></script>
  <style>${styles}</style>
</head>
<body>
  <div id='root'></div>
  <script type='module'>
    ${messageHelper}
    ${interactionScript}

    window.onerror = (msg) => {
      postToParent('runtime-error', { error: msg });
      return true;
    };
    window.addEventListener('unhandledrejection', (e) => {
      postToParent('runtime-error', { error: e.reason?.message || 'Promise rejected' });
    });
    (async () => {
      try {
        // Step 1: Load React globally
        const React = await import('https://esm.sh/react@18');
        const {createRoot} = await import('https://esm.sh/react-dom@18/client');
        window.React = React.default || React;

        // Step 1.5: Inject polyfills if needed
        ${polyfills}

        // Step 1.6: Inject icon stubs if needed
        ${iconStubs}

        // Step 1.7: Inject missing component stubs if needed
        ${missingStubs}

        // Step 2: Create blob URL from compiled code
        const code = ${codeLiteral};
        const blob = new Blob([code], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);

        // Step 3: Dynamically import the module
        let mod;
        try {
          mod = await import(blobUrl);
        } finally {
          URL.revokeObjectURL(blobUrl);
        }

        // Step 4: Render the component
        createRoot(document.getElementById('root')).render(
          React.createElement(mod.default)
        );

        // Signal ready after render
        setTimeout(() => {
          postToParent('iframe-ready');
        }, 50);
      } catch (e) {
        postToParent('runtime-error', { error: e.message });
      }
    })();
  </script>
</body>
</html>`;
}
