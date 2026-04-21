import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b10",
        panel: "#16161f",
        panel2: "#1f1f2b",
        border: "#2a2a38",
        accent: "#8b5cf6",
        accentHover: "#a78bfa",
        muted: "#8a8a9a",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
