import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: {
            matchers: "./src/matchers.ts",
            "extend-expect": "./src/extend-expect.ts",
        },
        format: "esm",
        sourcemap: true,
        dts: {
            // The d.ts must import "vitest" for the `declare module "vitest"`
            // augmentation to merge in consumers; rollup-plugin-dts strips
            // side-effect imports, so inject it as a banner.
            banner: 'import "vitest";',
        },
        outDir: "dist",
    },
]);
