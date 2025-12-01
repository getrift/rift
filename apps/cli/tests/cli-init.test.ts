import { describe, expect, it, afterAll, vi } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInit } from '../src/commands/init.js';

const tempDirs: string[] = [];

async function createTempProject(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'rift-init-'));
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

describe('runInit', () => {
  it('creates the .rift spec files based on defaults', async () => {
    const projectRoot = await createTempProject();
    const nested = join(projectRoot, 'nested');
    await mkdir(nested);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    let firstLogs: string[] = [];
    try {
      await runInit(nested);
      firstLogs = logSpy.mock.calls.map((call) => call.join(' '));
    } finally {
      logSpy.mockRestore();
    }

    expect(firstLogs).toContain('Created .rift/tokens.json');
    expect(firstLogs).toContain('Created .rift/designrules.yaml');
    expect(firstLogs[firstLogs.length - 1]).toBe('Done.');

    const tokensRaw = await readFile(join(projectRoot, '.rift', 'tokens.json'), 'utf8');
    const tokens = JSON.parse(tokensRaw) as { colors: Record<string, string> };
    expect(tokens.colors.background).toBe('#0D0D0D');

    const typographyRaw = await readFile(join(projectRoot, '.rift', 'typography.json'), 'utf8');
    const typography = JSON.parse(typographyRaw) as Record<string, { fontSize: string }>;
    expect(typography.base.fontSize).toBe('14px');

    const secondSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    let secondLogs: string[] = [];
    try {
      await runInit(nested);
      secondLogs = secondSpy.mock.calls.map((call) => call.join(' '));
    } finally {
      secondSpy.mockRestore();
    }

    expect(secondLogs).toContain('Found existing .rift/tokens.json');
    expect(secondLogs[secondLogs.length - 1]).toBe('Nothing to do.');
  });
});
