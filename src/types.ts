import type { matchers } from "./matchers.js";
import type { IMatcherResult, MatcherState } from "./matchers/types.js";

/**
 * @public
 */
export type TestingLibraryMatchers<R> = {
    [K in keyof typeof matchers]: (...args: MatcherArgs<(typeof matchers)[K]>) => R;
};

/**
 * @public
 */
export type ExpectationResult = IMatcherResult | Promise<IMatcherResult>;

/**
 * @public
 */
export interface IMatcherFn<State extends MatcherState, Args extends unknown[] = any[]> {
    (this: State, received: any, ...args: Args): ExpectationResult;
}

/**
 * @public
 */
export type MatcherArgs<F> = F extends IMatcherFn<MatcherState, infer Args> ? Args : never;

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
