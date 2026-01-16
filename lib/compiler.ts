import { transform } from 'sucrase';

type CompileResult =
  | { success: true; output: string; componentName: string }
  | { success: false; error: string };

export function compileCode(code: string): CompileResult {
  try {
    // Step 1: Handle imports - rewrite allowed imports to CDN specifiers
    let processedCode = code;
    
    // Rewrite React-related imports to CDN URLs
    const importRewrites: Array<[RegExp, string]> = [
      [/from\s+['"]react\/jsx-runtime['"]/g, "from 'https://esm.sh/react@18/jsx-runtime'"],
      [/from\s+['"]react-dom\/client['"]/g, "from 'https://esm.sh/react-dom@18/client'"],
      [/from\s+['"]react-dom['"]/g, "from 'https://esm.sh/react-dom@18'"],
      [/from\s+['"]react['"]/g, "from 'https://esm.sh/react@18'"],
    ];

    for (const [pattern, replacement] of importRewrites) {
      processedCode = processedCode.replace(pattern, replacement);
    }

    // Check for any remaining unsupported imports
    const unsupportedImportMatch = processedCode.match(/^import\s+.*\s+from\s+['"](?!https:\/\/)[^'"]+['"]/m);
    if (unsupportedImportMatch) {
      const moduleName = unsupportedImportMatch[0].match(/from\s+['"]([^'"]+)['"]/)?.[1];
      return {
        success: false,
        error: `Unsupported import: ${moduleName}. V1 supports React + Tailwind only.`,
      };
    }

    // Step 2: Extract and transform default export
    let componentName = 'Component';
    let hasDefaultExport = false;

    // Handle: export default function Name()
    const namedFunctionMatch = processedCode.match(/^export\s+default\s+function\s+(\w+)\s*\(/m);
    if (namedFunctionMatch) {
      componentName = namedFunctionMatch[1];
      processedCode = processedCode.replace(/^export\s+default\s+function\s+(\w+)\s*\(/m, 'function $1(');
      hasDefaultExport = true;
    }
    // Handle: export default function()
    else if (/^export\s+default\s+function\s*\(/m.test(processedCode)) {
      processedCode = processedCode.replace(/^export\s+default\s+function\s*\(/m, 'const Component = function(');
      hasDefaultExport = true;
    }
    // Handle: export default class Name
    else if (/^export\s+default\s+class\s+(\w+)/m.test(processedCode)) {
      const classMatch = processedCode.match(/^export\s+default\s+class\s+(\w+)/m);
      if (classMatch) {
        componentName = classMatch[1];
        processedCode = processedCode.replace(/^export\s+default\s+class\s+(\w+)/m, 'class $1');
        hasDefaultExport = true;
      }
    }
    // Handle: export default arrow functions (with or without params)
    else if (/^export\s+default\s+\([^)]*\)\s*=>/m.test(processedCode)) {
      processedCode = processedCode.replace(/^export\s+default\s+\(([^)]*)\)\s*=>/m, 'const Component = ($1) =>');
      hasDefaultExport = true;
    }
    // Handle: export default single param arrow function (no parens)
    else if (/^export\s+default\s+(\w+)\s*=>/m.test(processedCode)) {
      const paramMatch = processedCode.match(/^export\s+default\s+(\w+)\s*=>/m);
      if (paramMatch) {
        const param = paramMatch[1];
        processedCode = processedCode.replace(/^export\s+default\s+(\w+)\s*=>/m, `const Component = (${param}) =>`);
        hasDefaultExport = true;
      }
    }
    // Handle: export default SomeVar (variable export)
    else {
      const variableExportMatch = processedCode.match(/^export\s+default\s+(\w+)\s*;?\s*$/m);
      if (variableExportMatch) {
        componentName = variableExportMatch[1];
        processedCode = processedCode.replace(/^export\s+default\s+\w+\s*;?\s*$/m, '');
        hasDefaultExport = true;
      }
    }

    if (!hasDefaultExport) {
      return {
        success: false,
        error: 'No default export found.',
      };
    }

    // Step 3: Compile with Sucrase
    const result = transform(processedCode, {
      transforms: ['typescript', 'jsx'],
      jsxRuntime: 'classic',
    });

    return {
      success: true,
      output: result.code,
      componentName,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown compilation error',
    };
  }
}
