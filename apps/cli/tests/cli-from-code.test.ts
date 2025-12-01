import { describe, expect, it, afterAll, vi } from 'vitest';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInit } from '../src/commands/init.js';
import { runFromCode } from '../src/commands/fromCode.js';
import { readDesignRules } from '@rift/core';

const tempDirs: string[] = [];

async function createTempProject(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'rift-from-code-'));
  tempDirs.push(dir);
  await writeFile(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'temp-project', private: true }, null, 2),
    'utf8',
  );
  return dir;
}

afterAll(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
});

describe('runFromCode', () => {
  it('updates design rules based on className frequencies', async () => {
    const projectRoot = await createTempProject();
    await runInit(projectRoot);

    await writeSampleComponent(projectRoot);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    let logs: string[] = [];
    try {
      await runFromCode(projectRoot, {});
      logs = logSpy.mock.calls.map((call) => call.join(' '));
    } finally {
      logSpy.mockRestore();
    }

    const rules = await readDesignRules(join(projectRoot, '.rift', 'designrules.yaml'));
    expect(rules.color.primary.action.className).toContain('bg-accent');
    expect(rules.typography.heading.className).toContain('text-xl');
    expect(rules.inferred_from_code.length).toBeGreaterThan(0);

    expect(logs).toContain('Path: src, app, components');
    expect(logs).toContain('Files scanned: 1');
    expect(logs.find((line) => line.startsWith('Slots inferred:'))).toBeDefined();
    expect(logs).toContain('Changes:');
    expect(logs.some((line) => line.startsWith('color.primary.action:'))).toBe(true);
    expect(logs).toContain('Updated designrules.yaml');
    expect(logs[logs.length - 1]).toBe('Done.');
  });

  it('supports dry-run mode without writing files', async () => {
    const projectRoot = await createTempProject();
    await runInit(projectRoot);

    await writeSampleComponent(projectRoot, 'Badge.tsx');

    const rulesBefore = await readDesignRules(join(projectRoot, '.rift', 'designrules.yaml'));

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    let logs: string[] = [];
    try {
      await runFromCode(projectRoot, { dryRun: true });
      logs = logSpy.mock.calls.map((call) => call.join(' '));
    } finally {
      logSpy.mockRestore();
    }

    const rulesAfter = await readDesignRules(join(projectRoot, '.rift', 'designrules.yaml'));
    expect(rulesAfter).toEqual(rulesBefore);

    expect(logs).toContain('Mode: dry-run');
    expect(logs).toContain('Planned changes (no files written):');
    expect(logs.some((line) => line.startsWith('color.primary.action:'))).toBe(true);
    expect(logs).not.toContain('Updated designrules.yaml');
  });
});

async function writeSampleComponent(projectRoot: string, fileName = 'Button.tsx'): Promise<void> {
  const srcDir = join(projectRoot, 'src');
  await mkdir(srcDir, { recursive: true });
  await writeFile(
    join(srcDir, fileName),
    `export const Component = () => (
      <div className="bg-accent text-base rounded-md">
        <span className={"bg-surface text-xl rounded-lg"}>Click</span>
      </div>
    );
  `,
    'utf8',
  );
}
