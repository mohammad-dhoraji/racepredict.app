import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { boneyardPlugin } from "boneyard-js/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    boneyardPlugin({
      out: "./src/bones",
      wait: 800,
      routes: [
        "/",
        "/calendar",
        "/home",
        "/home/drivers",
        "/home/groups",
        "/home/profile",
        "/home/predict",
        "/home/leaderboard",
        "/home/groups/__boneyard__",
      ],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
