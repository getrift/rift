import { dirname, join, parse, resolve } from 'node:path';
import { pathExists, ensureDir } from './fs.js';

export async function findProjectRoot(startDir: string): Promise<string> {
  let current = resolve(startDir);
  const { root } = parse(current);

  while (true) {
    if (await pathExists(join(current, 'package.json'))) {
      return current;
    }

    if (current === root) {
      throw new Error('Unable to locate project root (missing package.json).');
    }

    current = dirname(current);
  }
}

export function getRiftDir(projectRoot: string): string {
  return join(projectRoot, '.rift');
}

export async function ensureRiftDir(projectRoot: string): Promise<string> {
  const dir = getRiftDir(projectRoot);
  await ensureDir(dir);
  return dir;
}

export function tokensPath(projectRoot: string): string {
  return join(getRiftDir(projectRoot), 'tokens.json');
}

export function typographyPath(projectRoot: string): string {
  return join(getRiftDir(projectRoot), 'typography.json');
}

export function configPath(projectRoot: string): string {
  return join(getRiftDir(projectRoot), 'config.json');
}

export function designRulesPath(projectRoot: string): string {
  return join(getRiftDir(projectRoot), 'designrules.yaml');
}
