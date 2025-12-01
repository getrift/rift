import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { DesignRules, DesignRuleSlot } from '@rift/core';

export interface SlotInference {
  slot: string;
  className: string;
  confidence: number;
  sampleFiles: string[];
  usageCount?: number;
  files?: string[];
}

export interface FromCodeResult {
  updatedRules: DesignRules;
  changes: SlotInference[];
  filesScanned: number;
}

type FamilyKey = 'bg' | 'rounded';
type SlotKey = 'typography.body' | 'typography.heading';

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
  const backgrounds: { map: FrequencyMap; total: number } = { map: new Map(), total: 0 };
  const radii: { map: FrequencyMap; total: number } = { map: new Map(), total: 0 };
  const typography: Record<SlotKey, { map: FrequencyMap; total: number }> = {
    'typography.body': { map: new Map(), total: 0 },
    'typography.heading': { map: new Map(), total: 0 },
  };

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
          trackClass(className, relPath, backgrounds);
        }
        if (isRadiusClass(className)) {
          trackClass(className, relPath, radii);
        }
        const typographySlot = mapTypographySlot(className);
        if (typographySlot) {
          trackClass(className, relPath, typography[typographySlot]);
        }
      }
    }
  }

  const selections = buildSlotSelections(backgrounds, radii, typography);
  const totalCounts = backgrounds.total + radii.total + typography['typography.body'].total + typography['typography.heading'].total;

  return { changes: selections, totalFrequency: totalCounts };
}

function isBackgroundClass(value: string): boolean {
  return value.startsWith('bg-') || value.startsWith('bg[');
}

function isRadiusClass(value: string): boolean {
  return value.startsWith('rounded');
}

const TYPOGRAPHY_WEIGHTS: Record<string, number> = {
  'text-xs': 0,
  'text-sm': 1,
  'text-base': 2,
  'text-lg': 3,
  'text-xl': 4,
  'text-2xl': 5,
  'text-3xl': 6,
  'text-4xl': 7,
  'text-5xl': 8,
  'text-6xl': 9,
};
const TYPOGRAPHY_HEADING_MIN = 4; // text-xl and above map to heading

function isTypographySizeClass(value: string): boolean {
  return value in TYPOGRAPHY_WEIGHTS;
}

function mapTypographySlot(value: string): SlotKey | null {
  if (!isTypographySizeClass(value)) return null;
  return TYPOGRAPHY_WEIGHTS[value] >= TYPOGRAPHY_HEADING_MIN
    ? 'typography.heading'
    : 'typography.body';
}

function trackClass(
  className: string,
  file: string,
  bucket: { map: FrequencyMap; total: number },
): void {
  const existing = bucket.map.get(className) ?? { count: 0, files: new Set<string>() };
  existing.count += 1;
  existing.files.add(file);
  bucket.map.set(className, existing);
  bucket.total += 1;
}

function buildSlotSelections(
  backgrounds: { map: FrequencyMap; total: number },
  radii: { map: FrequencyMap; total: number },
  typography: Record<SlotKey, { map: FrequencyMap; total: number }>,
): SlotInference[] {
  const selections: SlotInference[] = [];

  selections.push(
    ...assignSlots(
      ['color.primary.action', 'color.primary.surface'],
      backgrounds.map,
      backgrounds.total,
    ),
  );

  selections.push(
    ...assignSlots(['radius.button', 'radius.card'], radii.map, radii.total),
  );

  selections.push(
    ...assignSlots(['typography.body'], typography['typography.body'].map, typography['typography.body'].total),
  );
  selections.push(
    ...assignSlots(['typography.heading'], typography['typography.heading'].map, typography['typography.heading'].total),
  );

  return selections;
}

function assignSlots(
  slots: string[],
  map: FrequencyMap,
  total: number,
): SlotInference[] {
  const picks = selectTopClasses(map, total, slots.length);
  return picks.map((pick, index) => ({
    ...pick,
    slot: slots[Math.min(index, slots.length - 1)],
  }));
}

function selectTopClasses(map: FrequencyMap, total: number, needed: number): SlotInference[] {
  const entries = Array.from(map.entries()).sort((a, b) => {
    if (b[1].count !== a[1].count) return b[1].count - a[1].count;
    return a[0].localeCompare(b[0]);
  });

  if (entries.length === 0 || total === 0 || needed === 0) {
    return [];
  }

  const selections: SlotInference[] = [];
  for (let i = 0; i < needed; i += 1) {
    const entry = entries[i] ?? entries[0];
    if (!entry) break;
    const [className, data] = entry;
    const files = Array.from(data.files).sort().slice(0, 10);
    selections.push({
      slot: '',
      className,
      confidence: Number((data.count / total).toFixed(2)),
      sampleFiles: files.slice(0, 3),
      usageCount: data.count,
      files,
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

  next.inferred_from_code = sortInferences(next.inferred_from_code);
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
  const existingIndex = rules.inferred_from_code.findIndex(
    (item) => item.slot === change.slot && item.className === change.className,
  );
  const payload = {
    slot: change.slot,
    className: change.className,
    confidence: change.confidence,
    sampleFiles: change.sampleFiles,
    usageCount: change.usageCount,
    files: change.files,
  };

  if (existingIndex >= 0) {
    rules.inferred_from_code[existingIndex] = payload;
  } else {
    rules.inferred_from_code.push(payload);
  }
}

function sortInferences(entries: DesignRules['inferred_from_code']) {
  return [...entries].sort((a, b) => {
    if (a.slot === b.slot) return a.className.localeCompare(b.className);
    return a.slot.localeCompare(b.slot);
  });
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
