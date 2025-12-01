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
import { logInfo } from '../utils/logger.js';
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
  await ensureRiftDir(projectRoot);

  const tasks = [
    {
      label: '.rift/tokens.json',
      path: tokensPath(projectRoot),
      write: () => writeTokens(tokensPath(projectRoot), createDefaultTokens()),
    },
    {
      label: '.rift/typography.json',
      path: typographyPath(projectRoot),
      write: () => writeTypography(typographyPath(projectRoot), createDefaultTypography()),
    },
    {
      label: '.rift/config.json',
      path: configPath(projectRoot),
      write: () => writeConfig(configPath(projectRoot), createDefaultConfig()),
    },
    {
      label: '.rift/designrules.yaml',
      path: designRulesPath(projectRoot),
      write: () => writeDesignRules(designRulesPath(projectRoot), createDefaultDesignRules()),
    },
  ];

  let writes = 0;

  for (const task of tasks) {
    const exists = await pathExists(task.path);
    if (exists && !options.force) {
      logInfo(`Found existing ${task.label}`);
      continue;
    }

    await task.write();
    logInfo(`${exists ? 'Overwrote' : 'Created'} ${task.label}`);
    writes += 1;
  }

  if (writes === 0) {
    logInfo('Nothing to do.');
  } else {
    logInfo('Done.');
  }
}
