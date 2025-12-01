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

    // Assert it contains bg-accent (from Button)
    const hasBgAccent = updatedRules.inferred_from_code.some((entry) =>
      entry.className.includes('bg-accent'),
    );
    expect(hasBgAccent).toBe(true);

    // Assert it contains bg-surface (from Card)
    const hasBgSurface = updatedRules.inferred_from_code.some((entry) =>
      entry.className.includes('bg-surface'),
    );
    expect(hasBgSurface).toBe(true);

    // Optional snapshot of normalized inferred_from_code
    const normalized = normalizeInferredFromCode(updatedRules.inferred_from_code);
    expect(normalized).toMatchSnapshot();
  });
});

