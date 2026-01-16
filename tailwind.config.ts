import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          app: "#000",
          panel: "#1a1a1a",
          canvas: "#f5f5f5",
          surface: "#262626",
          hover: "#333",
        },
        border: {
          subtle: "#2a2a2a",
          muted: "#3a3a3a",
        },
        text: {
          primary: "#fff",
          secondary: "#a0a0a0",
          muted: "#666",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
      },
    },
  },
  plugins: [],
};
export default config;
