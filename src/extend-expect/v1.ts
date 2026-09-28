// oxlint-disable no-barrel-files/no-barrel-files eslint-js/no-restricted-syntax no-restricted-imports @typescript-eslint/no-empty-object-type @typescript-eslint/no-explicit-any
/* eslint-disable @typescript-eslint/naming-convention */

import type { TestingLibraryMatchers } from "../types.js";

// Type augmentation for vitest v1, where `Assertion` extends
// `JestAssertion` and there is no `Matchers` extension point yet.

declare module "vitest" {
    interface Assertion<T = any> extends TestingLibraryMatchers<T> {}
    interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown> {}
}

export { matchers } from "../matchers.js";
export { extendExpect } from "../extend-expect.js";
