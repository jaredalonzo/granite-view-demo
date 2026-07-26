/** @type {import('tailwindcss').Config} */

// Colors are semantic tokens backed by CSS custom properties (see src/index.css).
// Each site sets the --color-* / --font-* values via a [data-site="..."] block, so a
// single build re-themes at runtime (locked builds and the switcher build alike).

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        "alt-a": "rgb(var(--color-alt-a) / <alpha-value>)",
        "alt-b": "rgb(var(--color-alt-b) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        white: "#ffffff",
        gray: {
          light: "#8e8e8e",
          DEFAULT: "#3b3b3b",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "Arial", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}
