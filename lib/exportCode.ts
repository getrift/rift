import { StyleOverrides, compileShadows } from './store';

interface ElementInfo {
  path: number[];
  startIndex: number;
  endIndex: number;
  hasStyleProp: boolean;
  isSelfClosing: boolean;
}

export function exportWithOverrides(
  code: string,
  styleOverrides: Record<string, StyleOverrides>
): string {
  // Step 1: Parse JSX elements and build path mapping
  const elements: ElementInfo[] = [];
  const stack: Array<{ tag: string; path: number[]; siblingCount: number }> = [];
  const siblingCounts: Record<string, number> = {}; // depth -> count

  // Regex to match JSX tags: <tag>, </tag>, <tag />, <tag ... />
  const tagRegex = /<(\/?)([A-Za-z][A-Za-z0-9]*|[a-z][a-z0-9-]*)(\s[^>]*)?(\/?)?>/g;
  let match;

  while ((match = tagRegex.exec(code)) !== null) {
    const [fullMatch, isClosing, tagName, attributes, isSelfClosing] = match;
    const startIndex = match.index;
    const endIndex = startIndex + fullMatch.length;
    const depth = stack.length;

    if (isClosing) {
      // Closing tag: pop from stack
      if (stack.length > 0 && stack[stack.length - 1].tag === tagName) {
        stack.pop();
      }
    } else if (isSelfClosing || fullMatch.endsWith('/>')) {
      // Self-closing tag
      const path = [...stack.map(s => s.path[s.path.length - 1]), 0];
      const hasStyleProp = /style\s*=/.test(attributes || '');
      
      elements.push({
        path,
        startIndex,
        endIndex,
        hasStyleProp,
        isSelfClosing: true,
      });
    } else {
      // Opening tag
      const depthKey = depth.toString();
      const siblingIndex = siblingCounts[depthKey] || 0;
      siblingCounts[depthKey] = siblingIndex + 1;

      const path = stack.length > 0
        ? [...stack[stack.length - 1].path, siblingIndex]
        : [siblingIndex];

      const hasStyleProp = /style\s*=/.test(attributes || '');

      elements.push({
        path,
        startIndex,
        endIndex,
        hasStyleProp,
        isSelfClosing: false,
      });

      // Push to stack
      stack.push({
        tag: tagName,
        path,
        siblingCount: siblingIndex,
      });
    }
  }

  // Step 2: Match paths to overrides
  const injections: Array<{ index: number; styleString: string }> = [];

  for (const [pathKey, overrides] of Object.entries(styleOverrides)) {
    const path = JSON.parse(pathKey) as number[];
    
    // Find matching element
    const element = elements.find(e => {
      if (e.path.length !== path.length) return false;
      return e.path.every((p, i) => p === path[i]);
    });

    if (!element || element.hasStyleProp) {
      if (element?.hasStyleProp) {
        console.warn(`Skipping element at path ${pathKey}: already has style prop`);
      }
      continue;
    }

    // Step 3: Generate style object string
    const styleString = styleOverridesToString(overrides);

    // Determine injection point
    let injectionIndex: number;
    if (element.isSelfClosing) {
      // For self-closing tags, inject before />
      injectionIndex = element.endIndex - 2; // Before />
    } else {
      // For opening tags, inject before >
      injectionIndex = element.endIndex - 1; // Before >
    }

    injections.push({ index: injectionIndex, styleString });
  }

  // Step 4: Inject styles into code (sort descending to avoid offset shifts)
  injections.sort((a, b) => b.index - a.index);

  let result = code;
  for (const { index, styleString } of injections) {
    result = result.slice(0, index) + ` style={${styleString}}` + result.slice(index);
  }

  return result;
}

// Helper to convert hex + opacity to rgba string
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

function styleOverridesToString(overrides: StyleOverrides): string {
  const props: string[] = [];
  
  // Handle padding - individual or uniform
  if (overrides.paddingLinked === false) {
    // Individual padding values
    if (overrides.paddingTop !== undefined) {
      props.push(`paddingTop: '${overrides.paddingTop}px'`);
    }
    if (overrides.paddingRight !== undefined) {
      props.push(`paddingRight: '${overrides.paddingRight}px'`);
    }
    if (overrides.paddingBottom !== undefined) {
      props.push(`paddingBottom: '${overrides.paddingBottom}px'`);
    }
    if (overrides.paddingLeft !== undefined) {
      props.push(`paddingLeft: '${overrides.paddingLeft}px'`);
    }
  } else if (overrides.padding !== undefined) {
    props.push(`padding: '${overrides.padding}px'`);
  }
  
  if (overrides.gap !== undefined) {
    props.push(`gap: '${overrides.gap}px'`);
  }
  
  // Handle border radius - individual or uniform
  if (overrides.borderRadiusLinked === false) {
    // Individual corner values
    if (overrides.borderRadiusTopLeft !== undefined) {
      props.push(`borderTopLeftRadius: '${overrides.borderRadiusTopLeft}px'`);
    }
    if (overrides.borderRadiusTopRight !== undefined) {
      props.push(`borderTopRightRadius: '${overrides.borderRadiusTopRight}px'`);
    }
    if (overrides.borderRadiusBottomRight !== undefined) {
      props.push(`borderBottomRightRadius: '${overrides.borderRadiusBottomRight}px'`);
    }
    if (overrides.borderRadiusBottomLeft !== undefined) {
      props.push(`borderBottomLeftRadius: '${overrides.borderRadiusBottomLeft}px'`);
    }
  } else if (overrides.borderRadius !== undefined) {
    props.push(`borderRadius: '${overrides.borderRadius}px'`);
  }
  
  if (overrides.fontSize !== undefined) {
    props.push(`fontSize: '${overrides.fontSize}px'`);
  }
  if (overrides.lineHeight !== undefined) {
    props.push(`lineHeight: ${overrides.lineHeight}`);
  }
  
  // Handle colors with opacity
  if (overrides.color !== undefined) {
    if (overrides.colorOpacity !== undefined && overrides.colorOpacity !== 100) {
      props.push(`color: '${hexToRgba(overrides.color, overrides.colorOpacity)}'`);
    } else {
      props.push(`color: '${overrides.color}'`);
    }
  }
  if (overrides.backgroundColor !== undefined) {
    if (overrides.backgroundOpacity !== undefined && overrides.backgroundOpacity !== 100) {
      props.push(`backgroundColor: '${hexToRgba(overrides.backgroundColor, overrides.backgroundOpacity)}'`);
    } else {
      props.push(`backgroundColor: '${overrides.backgroundColor}'`);
    }
  }
  
  if (overrides.shadows && overrides.shadows.length > 0) {
    const shadow = compileShadows(overrides.shadows);
    props.push(`boxShadow: '${shadow}'`);
  }

  return `{ ${props.join(', ')} }`;
}
