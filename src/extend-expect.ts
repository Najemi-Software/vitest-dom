import { expect } from "vitest";

import * as matchers from "./matchers.js";
import type { TestingLibraryMatchers } from "./matchers.js";

expect.extend(matchers);

declare module "vitest" {
    interface Assertion<T = any> extends TestingLibraryMatchers<(expected: string) => any, T> {}
    interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown, unknown> {}
}
