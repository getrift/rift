import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { inferDesignRulesFromCode } from '../../../../apps/cli/src/lib/fromCodeRegex.js';
import {
  copyFixtureToTemp,
  readDesignRulesFromProject,
  normalizeInferredFromCode,
} from './test-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturePath = join(__dirname, '../fixtures/from-code-basic');

describe('from-code basic inference', () => {
  it('infers design rules from code and populates inferred_from_code', async () => {
    const tempRoot = copyFixtureToTemp(fixturePath);
    const currentRules = await readDesignRulesFromProject(tempRoot);

    const { updatedRules } = await inferDesignRulesFromCode(tempRoot, currentRules);

    // Assert inferred_from_code is non-empty
    expect(updatedRules.inferred_from_code.length).toBeGreaterThan(0);

    // Assert it contains bg-accent (from Button and badge) with usage stats
    const accentEntry = updatedRules.inferred_from_code.find(
      (entry) => entry.className === 'bg-accent',
    );
    expect(accentEntry?.usageCount).toBeGreaterThanOrEqual(2);
    expect(accentEntry?.files ?? []).toEqual(
      expect.arrayContaining(['app/components/Button.tsx', 'app/page.tsx']),
    );

    // Assert it contains bg-surface (from Card)
    const hasBgSurface = updatedRules.inferred_from_code.some((entry) =>
      entry.className.includes('bg-surface'),
    );
    expect(hasBgSurface).toBe(true);

    // Typography mapping should populate body/heading slots
    expect(updatedRules.typography.body.className).toContain('text-base');
    expect(updatedRules.typography.heading.className).toContain('text-xl');

    // Snapshot of normalized inferred_from_code (stable fields)
    const normalized = normalizeInferredFromCode(updatedRules.inferred_from_code);
    expect(normalized).toMatchSnapshot();
  });
});
