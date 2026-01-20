import { transform } from 'sucrase';
import { analyzeImports, ImportAnalysis } from './import-analyzer';

type CompileResult =
  | { 
      success: true; 
      output: string;
      imports: ImportAnalysis;
    }
  | { success: false; error: string };

export async function compileCode(code: string): Promise<CompileResult> {
  try {
    // Step 1: Analyze imports
    const { imports, analysis } = await analyzeImports(code);

    // Step 2: Remove imports by slicing (work backwards to preserve positions)
    let processedCode = code;
    const sortedImports = [...imports].sort((a, b) => b.statementStart - a.statementStart);
    
    for (const imp of sortedImports) {
      // Slice out the entire import statement, preserve newline structure
      // Check if there's a newline after the import statement
      const afterImport = code[imp.statementEnd];
      const replacement = (afterImport === '\n' || afterImport === '\r') ? '' : '\n';
      
      processedCode = 
        processedCode.slice(0, imp.statementStart) + 
        replacement +
        processedCode.slice(imp.statementEnd);
    }

    // Step 3: Verify default export exists
    const hasDefaultExport = /^export\s+default\s+/m.test(processedCode);
    
    if (!hasDefaultExport) {
      return {
        success: false,
        error: 'No default export found.',
      };
    }

    // Step 4: Compile with Sucrase (keeping export default)
    const result = transform(processedCode, {
      transforms: ['typescript', 'jsx'],
      jsxRuntime: 'classic',
    });

    return {
      success: true,
      output: result.code,
      imports: analysis,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown compilation error',
    };
  }
}
