import { describe, expect, it } from 'vitest';
import {
  createDefaultConfig,
  createDefaultDesignRules,
  createDefaultTokens,
  createDefaultTypography,
} from '../src/defaults';

describe('@rift/core defaults', () => {
  it('produces the dark palette tokens', () => {
    const tokens = createDefaultTokens();
    expect(tokens.colors.background).toBe('#0D0D0D');
    expect(tokens.colors.accent).toBe('#00FF99');
    expect(tokens.spacing).toContain(32);
    expect(tokens.radius.md).toBe('6px');
  });

  it('provides the typography scale entries', () => {
    const typography = createDefaultTypography();
    expect(typography.base).toEqual({ fontSize: '14px', lineHeight: '20px' });
    expect(typography['3xl']).toEqual({ fontSize: '30px', lineHeight: '36px' });
  });

  it('builds design rules with semantic slots', () => {
    const rules = createDefaultDesignRules();
    expect(rules.color.primary.action.className).toContain('bg-accent');
    expect(rules.typography.heading.scale).toBe('3xl');
    expect(rules.inferred_from_code).toEqual([]);
  });

  it('creates a base config stub', () => {
    const config = createDefaultConfig();
    expect(config.version).toBeDefined();
    expect(config.source).toBe('core');
  });
});
