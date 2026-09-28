import configurations from "@gooddata/eslint-config/oxlint-esm-vitest";
import { type Config, defineConfig } from "eslint/config";

// TODO: remove the `as Config[]` casting once typings are fixed in `@gooddata/eslint-config`
export default defineConfig(...(configurations as Config[]), {
    ignores: [
        "src/extend-expect/public/v0.ts",
        "src/extend-expect/public/v1.ts",
        "src/extend-expect/public/v2.ts",
        "src/extend-expect/public/v3.ts",
    ],
});
