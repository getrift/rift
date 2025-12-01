import { dirname } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { TypographyScale } from './types.js';

export async function readTypography(filePath: string): Promise<TypographyScale> {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as TypographyScale;
}

export async function writeTypography(filePath: string, typography: TypographyScale): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(typography, null, 2) + '\n', 'utf8');
}
