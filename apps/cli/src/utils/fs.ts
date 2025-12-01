import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname } from 'node:path';
import { parse, stringify } from 'yaml';

export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function readJson<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw) as T;
}

export async function writeJson(filePath: string, data: unknown): Promise<void> {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export async function readYaml<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, 'utf8');
  return parse(raw) as T;
}

export async function writeYaml(filePath: string, data: unknown): Promise<void> {
  await ensureDir(dirname(filePath));
  const yaml = stringify(data, { indent: 2 });
  await writeFile(filePath, yaml, 'utf8');
}
