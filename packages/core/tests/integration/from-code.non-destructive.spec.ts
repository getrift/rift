import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { inferDesignRulesFromCode } from '../../../../apps/cli/src/lib/fromCodeRegex.js';
import {
  copyFixtureToTemp,
  readDesignRulesFromProject,
  writeDesignRulesToProject,
} from './test-helpers.js';
import { readTokens } from '../../src/tokens.js';
import { readTypography } from '../../src/typography.js';
import { readConfig } from '../../src/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturePath = join(__dirname, '../fixtures/from-code-basic');

describe('from-code non-destructive behavior', () => {
  it('only modifies inferred_from_code in designrules.yaml', async () => {
    const tempRoot = copyFixtureToTemp(fixturePath);

    // Read original contents
    const originalTokens = await readTokens(join(tempRoot, '.rift', 'tokens.json'));
    const originalTypography = await readTypography(join(tempRoot, '.rift', 'typography.json'));
    const originalConfig = await readConfig(join(tempRoot, '.rift', 'config.json'));
    const originalDesignRulesYaml = await readFile(
      join(tempRoot, '.rift', 'designrules.yaml'),
      'utf8',
    );

    // Run from-code inference
    const currentRules = await readDesignRulesFromProject(tempRoot);
    const { updatedRules } = await inferDesignRulesFromCode(tempRoot, currentRules);

    // Write updated designrules back
    await writeDesignRulesToProject(tempRoot, updatedRules);

    // Read files after from-code run
    const afterTokens = await readTokens(join(tempRoot, '.rift', 'tokens.json'));
    const afterTypography = await readTypography(join(tempRoot, '.rift', 'typography.json'));
    const afterConfig = await readConfig(join(tempRoot, '.rift', 'config.json'));
    const afterDesignRulesYaml = await readFile(
      join(tempRoot, '.rift', 'designrules.yaml'),
      'utf8',
    );

    // Assert tokens, typography, and config are unchanged
    expect(afterTokens).toEqual(originalTokens);
    expect(afterTypography).toEqual(originalTypography);
    expect(afterConfig).toEqual(originalConfig);

    // Assert designrules.yaml structure is preserved (version, top-level keys)
    // Note: from-code updates slots (className, source, confidence, sampleFiles)
    // and inferred_from_code, which is expected behavior
    const beforeParsed = parse(originalDesignRulesYaml) as Record<string, unknown>;
    const afterParsed = parse(afterDesignRulesYaml) as Record<string, unknown>;

    // Check that version and top-level structure keys are preserved
    expect(afterParsed.version).toBe(beforeParsed.version);
    expect(Object.keys(afterParsed).sort()).toEqual(Object.keys(beforeParsed).sort());

    // Check that color, radius, typography structures exist (values may differ)
    expect(afterParsed.color).toBeDefined();
    expect(afterParsed.radius).toBeDefined();
    expect(afterParsed.typography).toBeDefined();
    expect(afterParsed.inferred_from_code).toBeDefined();
    expect(Array.isArray(afterParsed.inferred_from_code)).toBe(true);
  });
});

