"use strict";

// TS 7 moved the compiler API to typescript/unstable/*; require("typescript") now returns only
// { version, versionMajorMinor }. Everything that consumes the API needs the classic package, so the
// lint stack gets its own pinned TS 6 copy while the projects keep typescript 7.x for tsc.
// This MUST stay one exact version: the parser hands ts.Type objects to the plugins, and pnpm only
// shares a module instance between packages resolved to the identical version.
const lintTypescriptVersion = "6.0.3";

const lintTypescriptConsumers = [
    "eslint-plugin-sonarjs",
    "ts-api-utils",
    "typescript-eslint",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "@typescript-eslint/project-service",
    "@typescript-eslint/tsconfig-utils",
    "@typescript-eslint/type-utils",
    "@typescript-eslint/typescript-estree",
    "@typescript-eslint/utils",
];

function readPackage(packageJson, _context) {
    // linter-related TypeScript overrides
    if (lintTypescriptConsumers.includes(packageJson.name)) {
        // Pin the lint toolchain to the classic TypeScript API. typescript is a peer on every one of
        // these except eslint-plugin-sonarjs, so it is converted into a real dependency — a widened peer
        // range would still resolve to the consuming project's typescript 7.x. Peer resolution cascades,
        // so children (ts-api-utils, typescript-estree, ...) re-key onto the same TS 6 instance.

        // tsconfig-utils and ts-api-utils ship no dependencies field at all.
        packageJson.dependencies = {
            ...packageJson.dependencies,
            typescript: lintTypescriptVersion,
        };

        if (packageJson.peerDependencies) {
            delete packageJson.peerDependencies["typescript"];
        }
        if (packageJson.peerDependenciesMeta) {
            delete packageJson.peerDependenciesMeta["typescript"];
        }
    }

    return packageJson;
}

export const hooks = {
    readPackage,
};
