import { cpSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readDesignRules, writeDesignRules, DesignRules, InferredFromCodeEntry } from '../../src/index.js';

/**
 * Copies a fixture directory to a temporary directory for testing.
 * Returns the path to the temporary directory.
 */
export function copyFixtureToTemp(fixturePath: string): string {
  const tempDir = mkdtempSync(join(tmpdir(), 'rift-test-'));
  cpSync(fixturePath, tempDir, { recursive: true });
  return tempDir;
}

/**
 * Normalizes an inferred_from_code array for comparison by extracting
 * only stable fields (slot, className) and sorting.
 */
export function normalizeInferredFromCode(
  entries: InferredFromCodeEntry[],
): Array<{ slot: string; className: string; usageCount?: number; files?: string[] }> {
  return entries
    .map((entry) => ({
      slot: entry.slot,
      className: entry.className,
      usageCount: entry.usageCount,
      files: entry.files ? [...entry.files].sort() : undefined,
    }))
    .sort((a, b) => (a.slot + a.className).localeCompare(b.slot + b.className));
}

/**
 * Helper to read designrules.yaml from a project root.
 */
export async function readDesignRulesFromProject(projectRoot: string): Promise<DesignRules> {
  const designRulesPath = join(projectRoot, '.rift', 'designrules.yaml');
  return await readDesignRules(designRulesPath);
}

/**
 * Helper to write designrules.yaml to a project root.
 */
export async function writeDesignRulesToProject(
  projectRoot: string,
  designRules: DesignRules,
): Promise<void> {
  const designRulesPath = join(projectRoot, '.rift', 'designrules.yaml');
  return await writeDesignRules(designRulesPath, designRules);
}
