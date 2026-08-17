import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        line: "var(--line)",
        "line-soft": "var(--line-soft)",
        brick: "var(--brick)",
        "brick-deep": "var(--brick-deep)",
        stud: "var(--stud)",
        sun: "var(--sun)",
        leaf: "var(--leaf)",
        "leaf-soft": "var(--leaf-soft)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,29,36,.06), 0 8px 24px rgba(27,29,36,.06)",
        lg2: "0 24px 60px rgba(27,29,36,.14)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
