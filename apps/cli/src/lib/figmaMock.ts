import {
  Tokens,
  TypographyScale,
  createDefaultTokens,
  createDefaultTypography,
} from '@rift/core';

type MockStyleNames = string[];

export function getMockTokens(): Tokens {
  const defaults = createDefaultTokens();
  return {
    ...defaults,
    colors: {
      ...defaults.colors,
      accent: '#00EE88',
      accentHover: '#00BB66',
      surfaceHover: '#2F2F2F',
    },
  };
}

export function getMockTypography(): TypographyScale {
  const defaults = createDefaultTypography();
  return {
    ...defaults,
    heading: defaults['3xl'] ?? defaults.xl,
    display: { fontSize: '36px', lineHeight: '40px' },
  } as TypographyScale;
}

export function getMockStyleNames(): MockStyleNames {
  return ['Neon/Accent', 'Surface/Base', 'Typography/Body', 'Typography/Heading'];
}
