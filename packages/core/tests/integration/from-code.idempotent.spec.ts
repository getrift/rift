import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { inferDesignRulesFromCode } from '../../../../apps/cli/src/lib/fromCodeRegex.js';
import {
  copyFixtureToTemp,
  readDesignRulesFromProject,
  writeDesignRulesToProject,
  normalizeInferredFromCode,
} from './test-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturePath = join(__dirname, '../fixtures/from-code-basic');

describe('from-code idempotency', () => {
  it('produces identical results when run twice', async () => {
    const tempRoot = copyFixtureToTemp(fixturePath);
    const initialRules = await readDesignRulesFromProject(tempRoot);

    // First run
    const first = await inferDesignRulesFromCode(tempRoot, initialRules);

    // Write first result back to designrules.yaml
    await writeDesignRulesToProject(tempRoot, first.updatedRules);

    // Read rules again
    const rulesAfterFirst = await readDesignRulesFromProject(tempRoot);

    // Second run
    const second = await inferDesignRulesFromCode(tempRoot, rulesAfterFirst);

    // Assert lengths are equal
    expect(second.updatedRules.inferred_from_code.length).toBe(
      first.updatedRules.inferred_from_code.length,
    );

    // Assert arrays are deeply equal after normalization
    const normalizedFirst = normalizeInferredFromCode(first.updatedRules.inferred_from_code);
    const normalizedSecond = normalizeInferredFromCode(second.updatedRules.inferred_from_code);
    expect(normalizedSecond).toEqual(normalizedFirst);
  });
});

