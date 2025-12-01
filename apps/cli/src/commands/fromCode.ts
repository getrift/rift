import { readDesignRules, writeDesignRules, DesignRules } from '@rift/core';
import { relative } from 'node:path';
import { inferDesignRulesFromCode, SlotInference } from '../lib/fromCodeRegex.js';
import { designRulesPath, findProjectRoot, getRiftDir } from '../utils/paths.js';
import { pathExists } from '../utils/fs.js';
import { logInfo } from '../utils/logger.js';

interface FromCodeOptions {
  path?: string;
  dryRun?: boolean;
}

export async function runFromCode(cwd: string, options: FromCodeOptions = {}): Promise<void> {
  const projectRoot = await findProjectRoot(cwd);
  const riftDir = getRiftDir(projectRoot);
  if (!(await pathExists(riftDir))) {
    throw new Error('Run rift init first');
  }

  const currentRules = await readDesignRules(designRulesPath(projectRoot));
  const { updatedRules, changes, filesScanned } = await inferDesignRulesFromCode(
    projectRoot,
    currentRules,
    options.path,
  );

  const slotsInferred = changes.length;
  const diffs = buildDiffs(currentRules, changes);
  const pathLabel = formatScanPath(projectRoot, options.path);

  logInfo(`Path: ${pathLabel}`);
  if (options.dryRun) {
    logInfo('Mode: dry-run');
  }
  logInfo(`Files scanned: ${filesScanned}`);
  logInfo(`Slots inferred: ${slotsInferred}`);

  if (diffs.length === 0) {
    logInfo(options.dryRun ? 'No changes (no files written).' : 'No changes.');
    return;
  }

  logInfo(options.dryRun ? 'Planned changes (no files written):' : 'Changes:');
  for (const diff of diffs) {
    logInfo(`${diff.slot}: ${diff.oldClass} → ${diff.newClass}`);
  }

  if (options.dryRun) {
    return;
  }

  await writeDesignRules(designRulesPath(projectRoot), updatedRules);
  logInfo('Updated designrules.yaml');
  logInfo('Done.');
}

interface SlotDiff {
  slot: string;
  oldClass: string;
  newClass: string;
}

function buildDiffs(currentRules: DesignRules, changes: SlotInference[]): SlotDiff[] {
  return changes
    .map((change) => {
      const previous = getSlotClassName(currentRules, change.slot);
      return { slot: change.slot, oldClass: previous, newClass: change.className };
    })
    .filter((diff) => diff.oldClass !== diff.newClass);
}

function getSlotClassName(rules: DesignRules, slot: string): string {
  switch (slot) {
    case 'color.primary.action':
      return rules.color.primary.action.className ?? '—';
    case 'color.primary.surface':
      return rules.color.primary.surface.className ?? '—';
    case 'radius.button':
      return rules.radius.button.className ?? '—';
    case 'radius.card':
      return rules.radius.card.className ?? '—';
    case 'typography.body':
      return rules.typography.body.className ?? '—';
    case 'typography.heading':
      return rules.typography.heading.className ?? '—';
    default:
      return '—';
  }
}

function formatScanPath(projectRoot: string, provided?: string): string {
  if (!provided) {
    return 'src, app, components';
  }
  if (provided.startsWith('./') || provided.startsWith('../')) {
    return provided;
  }
  if (provided.startsWith('/')) {
    const rel = relative(projectRoot, provided) || '.';
    return rel.startsWith('.') ? rel : `./${rel}`;
  }
  return provided.startsWith('.') ? provided : `./${provided}`;
}
