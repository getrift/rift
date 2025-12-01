import {
  DesignRules,
  RiftConfig,
  Tokens,
  TypographyScale,
  readConfig,
  readDesignRules,
  readTokens,
  readTypography,
  writeConfig,
  writeDesignRules,
  writeTokens,
  writeTypography,
} from '@rift/core';
import { getMockStyleNames, getMockTokens, getMockTypography } from '../lib/figmaMock.js';
import {
  findProjectRoot,
  getRiftDir,
  tokensPath,
  typographyPath,
  configPath,
  designRulesPath,
} from '../utils/paths.js';
import { pathExists } from '../utils/fs.js';
import { logInfo, logKeyValue, logPath, $ } from '../utils/logger.js';

interface PullOptions {
  figmaFileId?: string;
  figmaToken?: string | undefined;
}

export async function runPull(cwd: string, options: PullOptions = {}): Promise<void> {
  const projectRoot = await findProjectRoot(cwd);
  const riftDir = getRiftDir(projectRoot);
  if (!(await pathExists(riftDir))) {
    throw new Error('Run rift init first');
  }

  if (!options.figmaToken) {
    logInfo($.dim('FIGMA_TOKEN is not set; running mocked pull.'));
  }

  const [tokens, typography, config, designRules] = await Promise.all([
    readTokens(tokensPath(projectRoot)),
    readTypography(typographyPath(projectRoot)),
    readConfig(configPath(projectRoot)),
    readDesignRules(designRulesPath(projectRoot)),
  ]);

  const mockTokens = getMockTokens();
  const mockTypography = getMockTypography();
  const styleNames = getMockStyleNames();

  const { mergedTokens, colorUpdates } = mergeTokens(tokens, mockTokens);
  const { mergedTypography, typographyUpdates } = mergeTypography(typography, mockTypography);
  const updatedConfig = mergeConfig(config, options.figmaFileId);
  const updatedDesignRules = mergeDesignRules(designRules, styleNames);

  await Promise.all([
    writeTokens(tokensPath(projectRoot), mergedTokens),
    writeTypography(typographyPath(projectRoot), mergedTypography),
    writeConfig(configPath(projectRoot), updatedConfig),
    writeDesignRules(designRulesPath(projectRoot), updatedDesignRules),
  ]);

  logKeyValue('color tokens merged', colorUpdates.toString());
  logKeyValue('typography styles merged', typographyUpdates.toString());
  logInfo($.dim(`Figma styles: ${styleNames.join(', ')}`));
  logInfo('Updated .rift/tokens.json');
  logInfo('Updated .rift/typography.json');
  logInfo('Updated .rift/config.json');
  logInfo('Updated .rift/designrules.yaml');
  logPath(riftDir);
}

function mergeTokens(existing: Tokens, incoming: Tokens) {
  const merged: Tokens = {
    ...existing,
    colors: { ...existing.colors },
    spacing: [...existing.spacing],
    radius: { ...existing.radius },
  };

  let updates = 0;
  for (const [key, value] of Object.entries(incoming.colors)) {
    if (merged.colors[key as keyof Tokens['colors']] !== value) {
      merged.colors[key as keyof Tokens['colors']] = value;
      updates += 1;
    }
  }
  for (const [key, value] of Object.entries(incoming.radius)) {
    merged.radius[key as keyof Tokens['radius']] = value;
  }
  if (incoming.spacing.length) {
    merged.spacing = [...incoming.spacing];
  }

  return { mergedTokens: merged, colorUpdates: updates };
}

function mergeTypography(existing: TypographyScale, incoming: TypographyScale) {
  const merged: TypographyScale = { ...existing };
  let updates = 0;

  for (const [key, value] of Object.entries(incoming)) {
    const current = merged[key];
    if (!current || current.fontSize !== value.fontSize || current.lineHeight !== value.lineHeight) {
      merged[key] = value;
      updates += 1;
    }
  }

  return { mergedTypography: merged, typographyUpdates: updates };
}

function mergeConfig(config: RiftConfig, figmaFileId?: string): RiftConfig {
  const next: RiftConfig = { ...config };
  const fileId = figmaFileId ?? config.figmaFileId ?? 'mock-file';
  next.figmaFileId = fileId;
  next.lastSyncedAt = new Date().toISOString();
  next.source = deriveConfigSource(config.source);
  return next;
}

function mergeDesignRules(designRules: DesignRules, styleNames: string[]): DesignRules {
  return {
    ...designRules,
    figma_styles: styleNames,
    source: deriveConfigSource(designRules.source),
  };
}

function deriveConfigSource(current?: string): 'figma' | 'mixed' {
  if (!current || current === 'core') return 'figma';
  if (current === 'figma') return 'figma';
  return 'mixed';
}
