/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
  fontFamily: {
        f1: ["FormulaOne", "sans-serif"],
        display: ["FormulaOne", "sans-serif"],
      },
      keyframes: {
        gridlockFadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        gridlockFadeIn: "gridlockFadeIn 420ms ease-out both",
      },
    },
  },
  plugins: [],
};
