import { dirname } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { Tokens } from './types.js';

export async function readTokens(filePath: string): Promise<Tokens> {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as Tokens;
}

export async function writeTokens(filePath: string, tokens: Tokens): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(tokens, null, 2) + '\n', 'utf8');
}
