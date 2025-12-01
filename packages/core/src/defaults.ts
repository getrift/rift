import { DesignRules, RiftConfig, Tokens, TypographyScale } from './types.js';

const COLOR_PALETTE = {
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceHover: '#262626',
  border: '#333333',
  text: '#FFFFFF',
  textMuted: '#A3A3A3',
  textSubtle: '#737373',
  accent: '#00FF99',
  accentHover: '#00CC77',
  error: '#FF3333',
} as const;

const TYPOGRAPHY_SCALE: TypographyScale = {
  xs: { fontSize: '11px', lineHeight: '16px' },
  sm: { fontSize: '12px', lineHeight: '18px' },
  base: { fontSize: '14px', lineHeight: '20px' },
  lg: { fontSize: '16px', lineHeight: '24px' },
  xl: { fontSize: '20px', lineHeight: '28px' },
  '2xl': { fontSize: '24px', lineHeight: '32px' },
  '3xl': { fontSize: '30px', lineHeight: '36px' },
};

const SPACING_SCALE = [4, 8, 12, 16, 20, 24, 32, 48, 64];

const RADIUS_SCALE = {
  none: '0px',
  sm: '2px',
  md: '6px',
  lg: '8px',
} as const;

export const RIFT_VERSION = '0.0.1';

export function createDefaultTokens(): Tokens {
  return {
    colors: { ...COLOR_PALETTE },
    spacing: [...SPACING_SCALE],
    radius: { ...RADIUS_SCALE },
  };
}

export function createDefaultTypography(): TypographyScale {
  return { ...TYPOGRAPHY_SCALE };
}

export function createDefaultDesignRules(): DesignRules {
  return {
    version: RIFT_VERSION,
    source: 'core',
    color: {
      primary: {
        action: {
          className: 'bg-accent text-black',
          source: 'core',
          description: 'Primary action buttons use the neon accent on dark backgrounds.',
        },
        surface: {
          className: 'bg-surface text-text',
          source: 'core',
          description: 'Primary surfaces contrast against the background.',
        },
      },
    },
    radius: {
      button: {
        className: 'rounded-md',
        source: 'core',
        description: 'Default button radius (6px).',
      },
      card: {
        className: 'rounded-lg',
        source: 'core',
        description: 'Card radius (8px) for panels.',
      },
    },
    typography: {
      body: {
        className: 'text-base text-text',
        source: 'core',
        description: 'Default body copy derived from base scale.',
        scale: 'base',
      },
      heading: {
        className: 'text-3xl text-text',
        source: 'core',
        description: 'Hero/heading style anchored to the 3xl size.',
        scale: '3xl',
      },
    },
    inferred_from_code: [],
    figma_styles: [],
  };
}

export function createDefaultConfig(): RiftConfig {
  return {
    version: RIFT_VERSION,
    source: 'core',
  };
}
