import type { ExpectStatic } from "vitest";

export interface IMatcherResult {
    pass: boolean;
    message(): string;
    actual?: unknown;
    expected?: unknown;
}

export type ExpectationResult = IMatcherResult | Promise<IMatcherResult>;

export interface IMatcherFn<State extends MatcherState> {
    (this: State, received: any, expected: any, options?: any): ExpectationResult;
}

export type MatcherState = ReturnType<ExpectStatic["getState"]>;
