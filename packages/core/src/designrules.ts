import { dirname } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { parse, stringify } from 'yaml';
import { DesignRules } from './types.js';

export async function readDesignRules(filePath: string): Promise<DesignRules> {
  const raw = await readFile(filePath, 'utf8');
  return parse(raw) as DesignRules;
}

export async function writeDesignRules(filePath: string, designRules: DesignRules): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  const yaml = stringify(designRules, { indent: 2 });
  await writeFile(filePath, yaml, 'utf8');
}
