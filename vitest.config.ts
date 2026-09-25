import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["__tests__/**/*.test.ts"],
        setupFiles: ["vitest.setup.ts"],
        clearMocks: true,
        restoreMocks: true,
    },
});
