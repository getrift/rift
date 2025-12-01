export type RiftSource = 'core' | 'figma' | 'code' | 'mixed';

export interface Tokens {
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    accent: string;
    accentHover: string;
    error: string;
  };
  spacing: number[];
  radius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
  };
}

export interface TypographyEntry {
  fontSize: string;
  lineHeight: string;
}

export type TypographyScale = Record<string, TypographyEntry>;

export interface DesignRuleSlot {
  className: string;
  source: RiftSource;
  description?: string;
  confidence?: number;
  scale?: string;
  sampleFiles?: string[];
}

export interface InferredFromCodeEntry {
  slot: string;
  className: string;
  confidence: number;
  sampleFiles: string[];
}

export interface DesignRules {
  version: string;
  source: RiftSource;
  color: {
    primary: {
      action: DesignRuleSlot;
      surface: DesignRuleSlot;
    };
  };
  radius: {
    button: DesignRuleSlot;
    card: DesignRuleSlot;
  };
  typography: {
    body: DesignRuleSlot;
    heading: DesignRuleSlot;
  };
  inferred_from_code: InferredFromCodeEntry[];
  figma_styles?: string[];
}

export interface RiftConfig {
  version: string;
  source: RiftSource;
  figmaFileId?: string;
  lastSyncedAt?: string;
}
