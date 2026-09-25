import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["vitest.setup.ts"],
        watch: false,
        coverage: {
            include: ["**/__tests__/**/*.{ts,js}"],
            exclude: [...configDefaults.exclude, "**/__tests__/helpers/"],
        },
    },
});
