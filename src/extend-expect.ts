import { expect } from "vitest";

import { matchers } from "./index.js";

export function extendExpect(matchersToExtend: Partial<typeof matchers> = matchers) {
    expect.extend(matchersToExtend);
}
