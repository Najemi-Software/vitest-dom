// oxlint-disable no-barrel-files/no-barrel-files eslint-js/no-restricted-syntax

// matchers
export * from "./matchers/index.js";
export { matchers } from "./matchers.js";

// matcher-related
export type { IToHaveClassOptions } from "./matchers/to-have-class.js";

// types
export type {
    ExpectationResult,
    IMatcherFn,
    MatcherArgs,
    TestingLibraryMatchers,
    WithoutIndexSignature,
} from "./types.js";

// matcher types
export type { IMatcherResult, MatcherState } from "./matchers/types.js";
