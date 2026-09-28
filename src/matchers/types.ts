import type { ExpectStatic } from "vitest";

/**
 * @public
 */
export interface IMatcherResult {
    pass: boolean;
    message(): string;
    actual?: unknown;
    expected?: unknown;
    meta?: object;
}

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
export type MatcherState = ReturnType<ExpectStatic["getState"]>;

/**
 * @public
 */
export type MatcherArgs<F> = F extends IMatcherFn<MatcherState, infer Args> ? Args : never;
