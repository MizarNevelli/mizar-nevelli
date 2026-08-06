import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    env: { TZ: "UTC" },
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});
