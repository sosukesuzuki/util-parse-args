import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: [
      "./tests/unit-tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],
  },
});
