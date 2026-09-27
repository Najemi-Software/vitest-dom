// oxlint-disable eslint-js/no-restricted-syntax no-restricted-imports @typescript-eslint/no-empty-object-type
/* eslint-disable @typescript-eslint/naming-convention */

import { expect } from "vitest";

import * as matchers from "./matchers.js";
import type { TestingLibraryMatchers } from "./matchers.js";

expect.extend(matchers);

declare module "vitest" {
    interface Assertion<T = any> extends TestingLibraryMatchers<(expected: string) => any, T> {}
    interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown, unknown> {}
}
