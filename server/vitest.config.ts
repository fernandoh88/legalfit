import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: { LEGAL_CLASSIFIER: "mock" }
  }
});
