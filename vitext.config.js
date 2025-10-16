import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["test/setup.js"], // changed from .ts to .js
    isolate: false,
    testTimeout: 60000,
    hookTimeout: 60000,
  },
})
