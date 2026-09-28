import type { ExpectStatic } from "vitest";

export interface IMatcherResult {
    pass: boolean;
    message(): string;
    actual?: unknown;
    expected?: unknown;
    meta?: object;
}

export type ExpectationResult = IMatcherResult | Promise<IMatcherResult>;

export interface IMatcherFn<State extends MatcherState> {
    (this: State, received: any, expected: any, options?: any): ExpectationResult;
}

export type MatcherState = ReturnType<ExpectStatic["getState"]>;

export interface IMatcherFn<State extends MatcherState, Args extends unknown[] = any[]> {
    (this: State, received: any, ...args: Args): ExpectationResult;
}

export type MatcherArgs<F> = F extends IMatcherFn<MatcherState, infer Args> ? Args : never;
