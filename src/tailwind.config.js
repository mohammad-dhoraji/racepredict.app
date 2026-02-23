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
      },
      keyframes: {
        loadingBar: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
      },
      animation: {
        loadingBar: "loadingBar 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
