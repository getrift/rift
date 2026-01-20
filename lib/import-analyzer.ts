/**
 * Represents a parsed import statement
 */
export interface ImportInfo {
  source: string; // e.g., 'react', '@/lib/utils', './InfoTooltip'
  specifiers: string[]; // Local names used in code (default, namespace, named)
  start: number; // specifier start position
  end: number; // specifier end position
  statementStart: number; // full import statement start (ss)
  statementEnd: number; // full import statement end (se)
}

/**
 * Import category for handling strategy
 */
export type ImportCategory =
  | 'react' // React ecosystem - rewrite to CDN
  | 'polyfill' // Utils like cn, clsx - inject polyfill
  | 'icon' // Icon libraries - stub
  | 'local' // Relative imports - needs user input
  | 'external' // External npm packages - try CDN or stub
  | 'unknown'; // Unknown - stub with warning

/**
 * Result of import analysis
 */
export interface ImportAnalysis {
  resolved: string[]; // React imports rewritten to CDN
  polyfilled: string[]; // Imports that need polyfill injection
  stubbed: string[]; // Imports that are stubbed (icon libraries)
  iconNames: string[]; // Local icon names used in code
  missing: string[]; // Local imports that are missing (sources)
  missingComponents: string[]; // Local component names used in code
  external: string[]; // External packages attempted
}

/**
 * Categorize an import source
 */
export function categorizeImport(source: string): ImportCategory {
  // React ecosystem
  if (
    source === 'react' ||
    source === 'react-dom' ||
    source === 'react-dom/client' ||
    source === 'react/jsx-runtime' ||
    source.startsWith('react/')
  ) {
    return 'react';
  }

  // Polyfill candidates (utils, class name helpers)
  if (
    source === '@/lib/utils' ||
    source === 'clsx' ||
    source === 'class-variance-authority' ||
    source === 'tailwind-merge'
  ) {
    return 'polyfill';
  }

  // Icon libraries
  if (
    source === 'lucide-react' ||
    source.startsWith('@heroicons/') ||
    source.startsWith('react-icons/')
  ) {
    return 'icon';
  }

  // Local imports
  if (source.startsWith('./') || source.startsWith('../') || source.startsWith('@/')) {
    return 'local';
  }

  // External npm packages
  if (
    source.startsWith('@') || // scoped packages
    !source.includes('/') || // simple package names
    source.includes('node_modules')
  ) {
    return 'external';
  }

  return 'unknown';
}

function splitTopLevelCommas(input: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === '{') depth += 1;
    if (ch === '}') depth = Math.max(0, depth - 1);

    if (ch === ',' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) parts.push(trimmed);
      current = '';
      continue;
    }

    current += ch;
  }

  const tail = current.trim();
  if (tail) parts.push(tail);
  return parts;
}

function normalizeNamedSpecifier(spec: string): string | null {
  const trimmed = spec.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('type ')) return null;

  const parts = trimmed.split(/\s+as\s+/);
  const localName = (parts[1] || parts[0]).trim();
  return localName || null;
}

function parseNamedSpecifiers(part: string): string[] {
  const trimmed = part.trim();
  if (!trimmed.startsWith('{')) return [];

  const inner = trimmed.replace(/^\{\s*/, '').replace(/\s*\}$/, '');
  if (!inner) return [];

  return inner
    .split(',')
    .map((spec) => normalizeNamedSpecifier(spec))
    .filter((spec): spec is string => Boolean(spec));
}

function parseImportClause(clause: string): string[] {
  const parts = splitTopLevelCommas(clause);
  const specifiers: string[] = [];

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('{')) {
      specifiers.push(...parseNamedSpecifiers(part));
      continue;
    }

    if (part.startsWith('*')) {
      const match = part.match(/\*\s+as\s+([A-Za-z0-9_$]+)/);
      if (match?.[1]) {
        specifiers.push(match[1]);
      }
      continue;
    }

    const name = part.trim();
    if (name && !name.startsWith('type ')) {
      specifiers.push(name);
    }
  }

  return specifiers;
}

/**
 * Extract all imports from code using regex (works with JSX)
 * We use regex instead of es-module-lexer because lexer fails on JSX syntax
 */
export async function extractImports(code: string): Promise<ImportInfo[]> {
  const results: ImportInfo[] = [];

  // Match import statements, including default + named imports
  const importRegex =
    /import\s+(type\s+)?([\s\S]*?)\s+from\s+['"]([^'"]+)['"]\s*;?|import\s+['"]([^'"]+)['"]\s*;?/g;

  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(code)) !== null) {
    const [fullMatch] = match;
    const isTypeOnly = Boolean(match[1]);
    const clause = match[2];
    const source = match[3] || match[4];
    if (!source) continue;

    const specifiers = !isTypeOnly && clause ? parseImportClause(clause) : [];

    const statementStart = match.index;
    const statementEnd = match.index + fullMatch.length;

    results.push({
      source,
      specifiers,
      start: statementStart,
      end: statementEnd,
      statementStart,
      statementEnd,
    });
  }

  return results;
}

/**
 * Analyze imports and categorize them
 */
export async function analyzeImports(code: string): Promise<{
  imports: ImportInfo[];
  analysis: ImportAnalysis;
}> {
  const imports = await extractImports(code);

  const analysis: ImportAnalysis = {
    resolved: [],
    polyfilled: [],
    stubbed: [],
    iconNames: [],
    missing: [],
    missingComponents: [],
    external: [],
  };

  for (const imp of imports) {
    const category = categorizeImport(imp.source);

    switch (category) {
      case 'react':
        if (!analysis.resolved.includes(imp.source)) {
          analysis.resolved.push(imp.source);
        }
        break;
      case 'polyfill':
        if (!analysis.polyfilled.includes(imp.source)) {
          analysis.polyfilled.push(imp.source);
        }
        break;
      case 'icon':
        if (!analysis.stubbed.includes(imp.source)) {
          analysis.stubbed.push(imp.source);
        }
        for (const spec of imp.specifiers) {
          if (!analysis.iconNames.includes(spec)) {
            analysis.iconNames.push(spec);
          }
        }
        break;
      case 'local':
        if (!analysis.missing.includes(imp.source)) {
          analysis.missing.push(imp.source);
        }
        for (const spec of imp.specifiers) {
          if (!analysis.missingComponents.includes(spec)) {
            analysis.missingComponents.push(spec);
          }
        }
        break;
      case 'external':
      case 'unknown':
        if (!analysis.external.includes(imp.source)) {
          analysis.external.push(imp.source);
        }
        break;
    }
  }

  return { imports, analysis };
}
