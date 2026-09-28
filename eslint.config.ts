import configurations from "@gooddata/eslint-config/oxlint-esm-vitest";
import { type Config, defineConfig } from "eslint/config";

// TODO: remove the `as Config[]` casting once typings are fixed in `@gooddata/eslint-config`
export default defineConfig(...(configurations as Config[]), {
    ignores: [
        "src/extend-expect/v0.ts",
        "src/extend-expect/v1.ts",
        "src/extend-expect/v2.ts",
        "src/extend-expect/v3.ts",
        "src/extend-expect/v4.ts",
    ],
});
