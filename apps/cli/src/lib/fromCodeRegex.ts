import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { DesignRules, DesignRuleSlot } from '@rift/core';

export interface SlotInference {
  slot: string;
  className: string;
  confidence: number;
  sampleFiles: string[];
}

export interface FromCodeResult {
  updatedRules: DesignRules;
  changes: SlotInference[];
  filesScanned: number;
}

type FamilyKey = 'bg' | 'text' | 'rounded';
interface FrequencyEntry {
  count: number;
  files: Set<string>;
}

type FrequencyMap = Map<string, FrequencyEntry>;

const CLASSNAME_REGEX = /className\s*=\s*(?:"([^"]+)"|\{['"]([^'"]+)['"]\})/g;

export async function inferDesignRulesFromCode(
  projectRoot: string,
  currentRules: DesignRules,
  providedPath?: string,
): Promise<FromCodeResult> {
  const searchRoots = await determineSearchRoots(projectRoot, providedPath);
  const files = await collectTargetFiles(searchRoots);

  if (files.length === 0) {
    throw new Error('No .tsx or .jsx files found in the provided search paths.');
  }

  const { changes, totalFrequency } = await buildInferences(projectRoot, files);

  if (changes.length === 0 || totalFrequency === 0) {
    throw new Error('No relevant Tailwind classes were found for inference.');
  }

  const updatedRules = applyInferences(currentRules, changes);
  return { updatedRules, changes, filesScanned: files.length };
}

async function determineSearchRoots(projectRoot: string, providedPath?: string): Promise<string[]> {
  if (providedPath) {
    const resolved = providedPath.startsWith('/')
      ? resolve(providedPath)
      : resolve(projectRoot, providedPath);
    const stats = await stat(resolved);
    if (stats.isDirectory() || stats.isFile()) {
      return [resolved];
    }
    throw new Error('Provided path is neither a directory nor a file.');
  }

  const defaultDirs = ['src', 'app', 'components'].map((dir) => join(projectRoot, dir));

  const roots: string[] = [];
  for (const dir of defaultDirs) {
    try {
      const stats = await stat(dir);
      if (stats.isDirectory()) {
        roots.push(dir);
      }
    } catch {
      // ignore missing directories
    }
  }

  if (roots.length === 0) {
    throw new Error('No default search directories (src/app/components) were found.');
  }

  return roots;
}

async function collectTargetFiles(roots: string[]): Promise<string[]> {
  const targets: string[] = [];
  for (const root of roots) {
    const info = await stat(root);
    if (info.isDirectory()) {
      await walk(root, targets);
    } else if (info.isFile() && isCodeFile(root)) {
      targets.push(root);
    }
  }
  return targets;
}

async function walk(current: string, targets: string[]): Promise<void> {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
      continue;
    }

    const fullPath = join(current, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, targets);
    } else if (entry.isFile() && isCodeFile(entry.name)) {
      targets.push(fullPath);
    }
  }
}

function isCodeFile(fileName: string): boolean {
  return /\.(t|j)sx$/.test(fileName);
}

async function buildInferences(projectRoot: string, files: string[]) {
  const frequency: Record<FamilyKey, FrequencyMap> = {
    bg: new Map(),
    text: new Map(),
    rounded: new Map(),
  };
  const totals: Record<FamilyKey, number> = { bg: 0, text: 0, rounded: 0 };

  for (const file of files) {
    const relPath = relative(projectRoot, file);
    const content = await readFile(file, 'utf8');
    let match: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    while ((match = CLASSNAME_REGEX.exec(content))) {
      const raw = (match[1] ?? match[2] ?? '').trim();
      if (!raw) continue;
      const classes = raw.split(/\s+/).filter(Boolean);
      for (const className of classes) {
        if (isBackgroundClass(className)) {
          trackClass('bg', className, relPath, frequency, totals);
        }
        if (isTextClass(className)) {
          trackClass('text', className, relPath, frequency, totals);
        }
        if (isRadiusClass(className)) {
          trackClass('rounded', className, relPath, frequency, totals);
        }
      }
    }
  }

  const selections = buildSlotSelections(frequency, totals);
  const totalCounts = totals.bg + totals.text + totals.rounded;

  return { changes: selections, totalFrequency: totalCounts };
}

function isBackgroundClass(value: string): boolean {
  return value.startsWith('bg-') || value.startsWith('bg[');
}

function isTextClass(value: string): boolean {
  return value.startsWith('text-') || value.startsWith('text[');
}

function isRadiusClass(value: string): boolean {
  return value.startsWith('rounded');
}

function trackClass(
  family: FamilyKey,
  className: string,
  file: string,
  frequency: Record<FamilyKey, FrequencyMap>,
  totals: Record<FamilyKey, number>,
): void {
  const map = frequency[family];
  const existing = map.get(className) ?? { count: 0, files: new Set<string>() };
  existing.count += 1;
  if (existing.files.size < 3) {
    existing.files.add(file);
  }
  map.set(className, existing);
  totals[family] += 1;
}

function buildSlotSelections(
  frequency: Record<FamilyKey, FrequencyMap>,
  totals: Record<FamilyKey, number>,
): SlotInference[] {
  const selections: SlotInference[] = [];

  const slotPlan: Array<{ slot: string; family: FamilyKey; order: number }> = [
    { slot: 'color.primary.action', family: 'bg', order: 0 },
    { slot: 'color.primary.surface', family: 'bg', order: 1 },
    { slot: 'radius.button', family: 'rounded', order: 0 },
    { slot: 'radius.card', family: 'rounded', order: 1 },
    { slot: 'typography.body', family: 'text', order: 0 },
    { slot: 'typography.heading', family: 'text', order: 1 },
  ];

  const familySelections: Record<FamilyKey, Array<SlotInference>> = {
    bg: selectTopClasses(frequency.bg, totals.bg),
    rounded: selectTopClasses(frequency.rounded, totals.rounded),
    text: selectTopClasses(frequency.text, totals.text),
  };

  for (const slot of slotPlan) {
    const options = familySelections[slot.family];
    if (options.length === 0) {
      continue;
    }
    const selection = options[Math.min(slot.order, options.length - 1)];
    selections.push({ ...selection, slot: slot.slot });
  }

  return selections;
}

function selectTopClasses(map: FrequencyMap, total: number): SlotInference[] {
  const entries = Array.from(map.entries()).sort((a, b) => b[1].count - a[1].count);
  if (entries.length === 0 || total === 0) {
    return [];
  }

  const needed = 2;
  const selections: SlotInference[] = [];
  for (let i = 0; i < needed; i += 1) {
    const entry = entries[i] ?? entries[0];
    if (!entry) break;
    const [className, data] = entry;
    selections.push({
      slot: '',
      className,
      confidence: Number((data.count / total).toFixed(2)),
      sampleFiles: Array.from(data.files).slice(0, 3),
    });
  }
  return selections;
}

function applyInferences(current: DesignRules, changes: SlotInference[]): DesignRules {
  const next: DesignRules = {
    ...current,
    color: {
      ...current.color,
      primary: { ...current.color.primary },
    },
    radius: { ...current.radius },
    typography: { ...current.typography },
    inferred_from_code: [...current.inferred_from_code],
  };

  for (const change of changes) {
    updateSlot(next, change);
    upsertInference(next, change);
  }

  next.source = deriveSource(current.source);
  return next;
}

function updateSlot(rules: DesignRules, change: SlotInference): void {
  const entry: DesignRuleSlot = {
    className: change.className,
    source: deriveSourceSlot(getSlotSource(rules, change.slot)),
    confidence: change.confidence,
    sampleFiles: change.sampleFiles,
  };

  switch (change.slot) {
    case 'color.primary.action':
      rules.color.primary.action = { ...rules.color.primary.action, ...entry };
      break;
    case 'color.primary.surface':
      rules.color.primary.surface = { ...rules.color.primary.surface, ...entry };
      break;
    case 'radius.button':
      rules.radius.button = { ...rules.radius.button, ...entry };
      break;
    case 'radius.card':
      rules.radius.card = { ...rules.radius.card, ...entry };
      break;
    case 'typography.body':
      rules.typography.body = { ...rules.typography.body, ...entry };
      break;
    case 'typography.heading':
      rules.typography.heading = { ...rules.typography.heading, ...entry };
      break;
    default:
      break;
  }
}

function deriveSourceSlot(previous?: string): 'code' | 'mixed' {
  if (!previous || previous === 'core') return 'code';
  if (previous === 'code') return 'code';
  return 'mixed';
}

function deriveSource(currentSource?: string): 'code' | 'mixed' {
  if (!currentSource || currentSource === 'core') return 'code';
  if (currentSource === 'code') return 'code';
  return 'mixed';
}

function upsertInference(rules: DesignRules, change: SlotInference): void {
  const existingIndex = rules.inferred_from_code.findIndex((item) => item.slot === change.slot);
  const payload = {
    slot: change.slot,
    className: change.className,
    confidence: change.confidence,
    sampleFiles: change.sampleFiles,
  };

  if (existingIndex >= 0) {
    rules.inferred_from_code[existingIndex] = payload;
  } else {
    rules.inferred_from_code.push(payload);
  }
}

function getSlotSource(rules: DesignRules, slot: string): string | undefined {
  switch (slot) {
    case 'color.primary.action':
      return rules.color.primary.action.source;
    case 'color.primary.surface':
      return rules.color.primary.surface.source;
    case 'radius.button':
      return rules.radius.button.source;
    case 'radius.card':
      return rules.radius.card.source;
    case 'typography.body':
      return rules.typography.body.source;
    case 'typography.heading':
      return rules.typography.heading.source;
    default:
      return undefined;
  }
}
