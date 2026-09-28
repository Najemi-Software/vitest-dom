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
export type MatcherState = ReturnType<ExpectStatic["getState"]>;
