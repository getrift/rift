import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        bg: {
          app: "#000",
          panel: "#272727",
          canvas: "#f0f0f0",
          surface: "#1e1e1e",
          card: "#2f2f2f",
          hover: "rgba(255, 255, 255, 0.06)",
          elevated: "#1e1e1e",
          well: "rgba(255, 255, 255, 0.04)",
          // Light theme for canvas components
          'component': "#ffffff",
          'component-footer': "#f8f8f8",
        },
        border: {
          subtle: "#333",
          muted: "#3a3a3a",
          inner: "#2e2e2e",
          hairline: "rgba(255, 255, 255, 0.08)",
        },
        text: {
          primary: "#fff",
          secondary: "#b0b0b0",
          muted: "#666",
          heading: "#e0e0e0",
          subheading: "#aaa",
          label: "#999",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
      },
      // Animation timing functions
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'out-expo': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      // Standardized durations
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'fade-out': 'fadeOut 150ms ease-out',
        'scale-in': 'scaleIn 150ms cubic-bezier(0.23, 1, 0.32, 1)',
        'scale-out': 'scaleOut 100ms ease-in',
        'slide-up': 'slideUp 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        'slide-down': 'slideDown 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        'spin-slow': 'spin 1s linear infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      // Enhanced shadows
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 12px -2px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 24px -4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)',
        'xl': '0 16px 48px -8px rgba(0, 0, 0, 0.25)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        // Glow effects
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-blue-strong': '0 0 30px rgba(59, 130, 246, 0.25)',
        'glow-green': '0 0 16px rgba(34, 197, 94, 0.2)',
        'glow-white': '0 0 12px rgba(255, 255, 255, 0.15)',
        // Ring shadows (for selection states)
        'ring-blue': '0 0 0 2px rgba(59, 130, 246, 0.8)',
        'ring-white': '0 0 0 2px rgba(255, 255, 255, 0.3)',
        // Inner shadows
        'inner-subtle': 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
        'inner-md': 'inset 0 2px 4px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
