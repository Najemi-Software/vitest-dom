// oxlint-disable no-barrel-files/no-barrel-files eslint-js/no-restricted-syntax no-restricted-imports @typescript-eslint/no-empty-object-type @typescript-eslint/no-explicit-any
/* eslint-disable @typescript-eslint/naming-convention */

import type { TestingLibraryMatchers, WithoutIndexSignature } from "../types.js";

// Type augmentation for vitest v3, where custom matchers are declared on
// `Matchers`, which both `Assertion` and `ExpectStatic` extend.

declare module "vitest" {
    interface Matchers<T = any> extends WithoutIndexSignature<TestingLibraryMatchers<T>> {}
}

export { matchers } from "../matchers.js";
export { extendExpect } from "../extend-expect.js";
