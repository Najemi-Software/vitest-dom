import { defineConfig } from "vitest/config";

// Matcher messages are colored when running in a terminal, which would make
// the inline snapshots of those messages environment-dependent.
process.env.NO_COLOR = "1";

export default defineConfig({
    test: {
        include: ["__tests__/**/*.test.ts"],
        setupFiles: ["vitest.setup.ts"],
        clearMocks: true,
        restoreMocks: true,
    },
});
