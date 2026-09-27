// @vitest-environment happy-dom

import { expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toHaveFocus } from "./to-have-focus.js";

expect.extend({ toHaveFocus });

it(".toHaveFocus", () => {
    const { container } = render(`
      <div>
        <label for="focused">test</label>
        <input id="focused" type="text" />
        <button type="submit" id="not-focused">Not Focused</button>
      </div>`);

    const focused = container.querySelector<HTMLInputElement>("#focused")!;
    const notFocused = container.querySelector("#not-focused");

    document.body.appendChild(container);
    focused.focus();

    expect(focused).toHaveFocus();
    expect(notFocused).not.toHaveFocus();

    expect(() => expect(focused).not.toHaveFocus()).toThrowError();
    expect(() => expect(notFocused).toHaveFocus()).toThrowError();
});
