// oxlint-disable no-barrel-files/no-barrel-files eslint-js/no-restricted-syntax

import * as matchers from "./matchers/index.js";
import type {
    ExpectationResult,
    IMatcherFn,
    IMatcherResult,
    MatcherArgs,
    MatcherState,
} from "./matchers/types.js";

/**
 * @public
 */
export type TestingLibraryMatchers<R> = {
    [K in keyof typeof matchers]: (...args: MatcherArgs<(typeof matchers)[K]>) => R;
};

/**
 * Removes the `string` and `number` index signatures from `T`, keeping only its known keys.
 *
 * @remarks
 * `Matchers` also types `expect.extend()`, so it must not inherit the index
 * signature of `TestingLibraryMatchers` (`Record<string, any>`): that would
 * require every extended matcher to accept arguments of type `unknown`.
 *
 * @public
 */
export type WithoutIndexSignature<T> = {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};

// matchers
export * from "./matchers/index.js";
export { matchers };

export { type ExpectationResult, type IMatcherFn, type IMatcherResult, type MatcherArgs, type MatcherState };

// matcher-related
export type { IToHaveClassOptions } from "./matchers/to-have-class.js";
