import { readDesignRules, writeDesignRules } from '@rift/core';
import { inferDesignRulesFromCode } from '../lib/fromCodeRegex.js';
import { designRulesPath, findProjectRoot, getRiftDir } from '../utils/paths.js';
import { pathExists } from '../utils/fs.js';
import { logInfo, $, logPath } from '../utils/logger.js';

interface FromCodeOptions {
  path?: string;
}

export async function runFromCode(cwd: string, options: FromCodeOptions = {}): Promise<void> {
  const projectRoot = await findProjectRoot(cwd);
  const riftDir = getRiftDir(projectRoot);
  if (!(await pathExists(riftDir))) {
    throw new Error('Run rift init first');
  }

  const currentRules = await readDesignRules(designRulesPath(projectRoot));
  const { updatedRules, changes } = await inferDesignRulesFromCode(
    projectRoot,
    currentRules,
    options.path,
  );

  if (!changes.length) {
    throw new Error('No classes were inferred from the provided code.');
  }

  await writeDesignRules(designRulesPath(projectRoot), updatedRules);

  for (const change of changes) {
    logInfo(`${change.slot} → ${change.className} (confidence ${change.confidence.toFixed(2)})`);
    if (change.sampleFiles.length) {
      const samples = change.sampleFiles
        .slice(0, 3)
        .map((file: string) => $.dim(`  sample: ${file}`));
      for (const sample of samples) {
        logInfo(sample);
      }
    }
  }

  logPath(riftDir);
}
