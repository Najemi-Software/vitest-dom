import { expect, it, vi } from "vitest";

import { deprecate } from "./deprecate.js";

it("deprecate", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const name = "test";
    const replacement = "test";
    const message = `Warning: ${name} has been deprecated and will be removed in future updates.`;

    deprecate(name, replacement);
    expect(spy).toHaveBeenCalledWith(message, replacement);

    deprecate(name);
    expect(spy).toHaveBeenCalledWith(message, undefined);

    spy.mockRestore();
});
