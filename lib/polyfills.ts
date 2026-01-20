/**
 * Polyfill implementations for common utility functions
 * These are injected into the iframe to replace stripped imports
 */

/**
 * cn - Combines clsx functionality (shadcn pattern)
 * This is the most common pattern in shadcn components
 * Assigned to window so it's accessible from blob module imports
 */
export const cnPolyfill = `
window.cn = function cn(...args) {
  const classes = [];
  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      classes.push(window.cn(...arg));
    } else if (typeof arg === 'object') {
      for (const [key, value] of Object.entries(arg)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(' ');
};
`.trim();

/**
 * cva - Class Variance Authority pattern
 * Simplified implementation supporting variants and defaults
 * Assigned to window so it's accessible from blob module imports
 */
export const cvaPolyfill = `
window.cva = function cva(base, config) {
  return function(props) {
    let classes = base || '';

    if (!config) return classes;

    const variants = config.variants || {};
    const defaultVariants = config.defaultVariants || {};
    const compoundVariants = config.compoundVariants || [];

    // Apply variants from props
    if (props) {
      for (const [variantKey, variantValue] of Object.entries(props)) {
        if (variantKey === 'class' || variantKey === 'className') continue;
        if (variants[variantKey] && variants[variantKey][variantValue]) {
          classes += ' ' + variants[variantKey][variantValue];
        }
      }
    }

    // Apply default variants for keys not in props
    for (const [variantKey, variantValue] of Object.entries(defaultVariants)) {
      if (!props || !(variantKey in props)) {
        if (variants[variantKey] && variants[variantKey][variantValue]) {
          classes += ' ' + variants[variantKey][variantValue];
        }
      }
    }

    // Apply compound variants (if all conditions match)
    for (const compound of compoundVariants) {
      let matches = true;
      for (const [key, value] of Object.entries(compound)) {
        if (key === 'class' || key === 'className') continue;
        const propValue = props?.[key] ?? defaultVariants[key];
        if (propValue !== value) {
          matches = false;
          break;
        }
      }
      if (matches && compound.class) {
        classes += ' ' + compound.class;
      }
      if (matches && compound.className) {
        classes += ' ' + compound.className;
      }
    }

    // Append custom className if provided
    if (props?.class) classes += ' ' + props.class;
    if (props?.className) classes += ' ' + props.className;

    return classes.trim();
  };
};
`.trim();

/**
 * twMerge - Simplified Tailwind class merging
 * This is a basic implementation that handles common cases
 * Assigned to window so it's accessible from blob module imports
 */
export const twMergePolyfill = `
window.twMerge = function twMerge(...args) {
  const classes = window.cn(...args).split(' ').filter(Boolean);
  const merged = {};

  // Common Tailwind class prefixes that should override each other
  const prefixes = [
    'p-', 'px-', 'py-', 'pt-', 'pr-', 'pb-', 'pl-',
    'm-', 'mx-', 'my-', 'mt-', 'mr-', 'mb-', 'ml-',
    'w-', 'h-', 'min-w-', 'min-h-', 'max-w-', 'max-h-',
    'text-', 'bg-', 'border-', 'rounded-',
    'flex-', 'grid-', 'gap-', 'space-x-', 'space-y-',
    'opacity-', 'shadow-', 'z-'
  ];

  for (const cls of classes) {
    let key = cls;

    // Find matching prefix
    for (const prefix of prefixes) {
      if (cls.startsWith(prefix)) {
        key = prefix;
        break;
      }
    }

    // Later classes override earlier ones with same prefix
    merged[key] = cls;
  }

  return Object.values(merged).join(' ');
};
`.trim();

/**
 * Get polyfill script based on what's needed
 * This runs in the iframe's global scope to set up window.cn, etc.
 */
export function getPolyfillScript(polyfills: string[]): string {
  const scripts: string[] = [];

  // Check what polyfills are needed
  const needsCn = polyfills.includes('@/lib/utils');
  const needsClsx = polyfills.includes('clsx') || needsCn;
  const needsCva = polyfills.includes('class-variance-authority');
  const needsTwMerge = polyfills.includes('tailwind-merge');

  // Inject in dependency order
  if (needsClsx || needsCn || needsTwMerge) {
    scripts.push(cnPolyfill); // cn is our unified implementation
  }

  if (needsClsx) {
    scripts.push('window.clsx = window.cn;'); // alias clsx to cn
  }

  if (needsTwMerge) {
    scripts.push(twMergePolyfill);
  }

  if (needsCva) {
    scripts.push(cvaPolyfill);
  }

  return scripts.join('\n\n');
}

/**
 * Get polyfill declarations to prepend to compiled code
 * This makes polyfills available as local variables inside the ES module blob
 */
export function getPolyfillDeclarations(polyfills: string[]): string {
  const declarations: string[] = [];

  const needsCn = polyfills.includes('@/lib/utils');
  const needsClsx = polyfills.includes('clsx') || needsCn;
  const needsCva = polyfills.includes('class-variance-authority');
  const needsTwMerge = polyfills.includes('tailwind-merge');

  if (needsClsx || needsCn || needsTwMerge) {
    declarations.push('const cn = window.cn;');
  }

  if (needsClsx) {
    declarations.push('const clsx = window.clsx;');
  }

  if (needsTwMerge) {
    declarations.push('const twMerge = window.twMerge;');
  }

  if (needsCva) {
    declarations.push('const cva = window.cva;');
  }

  return declarations.join('\n');
}
