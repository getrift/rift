import { dirname } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { RiftConfig } from './types.js';

export async function readConfig(filePath: string): Promise<RiftConfig> {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as RiftConfig;
}

export async function writeConfig(filePath: string, config: RiftConfig): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(config, null, 2) + '\n', 'utf8');
}
