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
          subheading: "#999",
          label: "#777",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
};
export default config;
