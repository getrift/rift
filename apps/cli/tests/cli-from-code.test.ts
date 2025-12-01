import { describe, expect, it, afterAll } from 'vitest';
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
    await runInit(projectRoot, { force: true });

    const srcDir = join(projectRoot, 'src');
    await mkdir(srcDir, { recursive: true });
    await writeFile(
      join(srcDir, 'Button.tsx'),
      `export const Button = () => (
        <div className="bg-accent text-base rounded-md">
          <span className={"bg-surface text-xl rounded-lg"}>Click</span>
        </div>
      );
    `,
      'utf8',
    );

    await runFromCode(projectRoot, {});

    const rules = await readDesignRules(join(projectRoot, '.rift', 'designrules.yaml'));
    expect(rules.color.primary.action.className).toContain('bg-accent');
    expect(rules.typography.heading.className).toContain('text-xl');
    expect(rules.inferred_from_code.length).toBeGreaterThan(0);
  });
});
