// oxlint-disable no-barrel-files/no-barrel-files eslint-js/no-restricted-syntax no-restricted-imports @typescript-eslint/no-empty-object-type @typescript-eslint/no-explicit-any
/* eslint-disable @typescript-eslint/naming-convention */

import { type TestingLibraryMatchers, type WithoutIndexSignature, matchers } from "../../index.js";

// Type augmentation for vitest v4, where custom matchers are declared on
// `Matchers`, which both `Assertion` and `ExpectStatic` extend.

declare module "vitest" {
    interface Matchers<T = any> extends WithoutIndexSignature<TestingLibraryMatchers<T>> {}
}

export { matchers };
export { extendExpect } from "../extend-expect.js";
