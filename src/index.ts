// oxlint-disable no-barrel-files/no-barrel-files eslint-js/no-restricted-syntax

import * as matchers from "./matchers/index.js";
import { type MatcherArgs } from "./matchers/types.js";

export * from "./matchers/index.js";
export { matchers };

export type TestingLibraryMatchers<R> = {
    [K in keyof typeof matchers]: (...args: MatcherArgs<(typeof matchers)[K]>) => R;
};

// `Matchers` also types `expect.extend()`, so it must not inherit the index
// signature of `TestingLibraryMatchers` (`Record<string, any>`): that would
// require every extended matcher to accept arguments of type `unknown`.
export type WithoutIndexSignature<T> = {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
