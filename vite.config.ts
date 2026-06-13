import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig({
  plugins: [
    react(),
    analyzer({
      analyzerMode: "static",
      openAnalyzer: true,
    }),
  ],

  build: {
    minify: "oxc",
    target: "esnext",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react-router-dom")) {
            return "router";
          }

          if (id.includes("react") || id.includes("react-dom")) {
            return "vendor";
          }
        },
      },
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
  },
});
