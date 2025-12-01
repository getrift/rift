import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./pages/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--rift-border) / <alpha-value>)",
        input: "hsl(var(--rift-border) / <alpha-value>)",
        ring: "hsl(var(--rift-ring) / <alpha-value>)",
        background: "hsl(var(--rift-background) / <alpha-value>)",
        foreground: "hsl(var(--rift-foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--rift-card) / <alpha-value>)",
          foreground: "hsl(var(--rift-card-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "hsl(var(--rift-muted) / <alpha-value>)",
          foreground: "hsl(var(--rift-muted-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "hsl(var(--rift-accent) / <alpha-value>)",
          foreground: "hsl(var(--rift-accent-foreground) / <alpha-value>)"
        },
        primary: {
          DEFAULT: "hsl(var(--rift-primary) / <alpha-value>)",
          foreground: "hsl(var(--rift-primary-foreground) / <alpha-value>)"
        },
        secondary: {
          DEFAULT: "hsl(var(--rift-secondary, var(--rift-muted)) / <alpha-value>)",
          foreground: "hsl(var(--rift-secondary-foreground) / <alpha-value>)"
        },
        destructive: {
          DEFAULT: "hsl(var(--rift-destructive) / <alpha-value>)",
          foreground: "hsl(var(--rift-destructive-foreground) / <alpha-value>)"
        }
      },
      borderRadius: {
        sm: "var(--rift-radius-sm)",
        md: "var(--rift-radius-md)",
        lg: "var(--rift-radius-lg)",
        xl: "var(--rift-radius-xl)"
      },
      fontFamily: {
        sans: ["var(--rift-font-sans)", "system-ui"]
      },
      fontSize: {
        xs: "var(--rift-text-xs)",
        sm: "var(--rift-text-sm)",
        base: "var(--rift-text-base)",
        lg: "var(--rift-text-lg)",
        xl: "var(--rift-text-xl)",
        "2xl": "var(--rift-text-2xl)",
        "3xl": "var(--rift-text-3xl)"
      }
    }
  },
  plugins: []
};

export default config;
