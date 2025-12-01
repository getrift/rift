import {
  createDefaultConfig,
  createDefaultDesignRules,
  createDefaultTokens,
  createDefaultTypography,
  writeConfig,
  writeDesignRules,
  writeTokens,
  writeTypography,
} from '@rift/core';
import { logInfo, logPath, $ } from '../utils/logger.js';
import {
  ensureRiftDir,
  findProjectRoot,
  tokensPath,
  typographyPath,
  configPath,
  designRulesPath,
} from '../utils/paths.js';
import { pathExists } from '../utils/fs.js';

interface InitOptions {
  force?: boolean;
}

export async function runInit(cwd: string, options: InitOptions = {}): Promise<void> {
  const projectRoot = await findProjectRoot(cwd);
  const riftDir = await ensureRiftDir(projectRoot);

  const tasks = [
    {
      label: 'tokens.json',
      path: tokensPath(projectRoot),
      write: () => writeTokens(tokensPath(projectRoot), createDefaultTokens()),
    },
    {
      label: 'typography.json',
      path: typographyPath(projectRoot),
      write: () => writeTypography(typographyPath(projectRoot), createDefaultTypography()),
    },
    {
      label: 'config.json',
      path: configPath(projectRoot),
      write: () => writeConfig(configPath(projectRoot), createDefaultConfig()),
    },
    {
      label: 'designrules.yaml',
      path: designRulesPath(projectRoot),
      write: () => writeDesignRules(designRulesPath(projectRoot), createDefaultDesignRules()),
    },
  ];

  for (const task of tasks) {
    const exists = await pathExists(task.path);
    if (exists && !options.force) {
      logInfo($.dim(`Skipped ${task.label} (already exists)`));
      continue;
    }

    await task.write();
    logInfo(`Wrote ${task.label}`);
  }

  logPath(riftDir);
}
