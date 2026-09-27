// @vitest-environment happy-dom

import { expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toHaveAttribute } from "./to-have-attribute.js";

expect.extend({ toHaveAttribute });

it(".toHaveAttribute", () => {
    const { queryByTestId } = render(`
    <button data-testid="ok-button" type="submit" disabled>
      OK
    </button>
    <svg data-testid="svg-element" width="12"></svg>
  `);

    expect(queryByTestId("ok-button")).toHaveAttribute("disabled");
    expect(queryByTestId("ok-button")).toHaveAttribute("type");
    expect(queryByTestId("ok-button")).not.toHaveAttribute("class");
    expect(queryByTestId("ok-button")).toHaveAttribute("type", "submit");
    expect(queryByTestId("ok-button")).not.toHaveAttribute("type", "button");
    expect(queryByTestId("svg-element")).toHaveAttribute("width");
    expect(queryByTestId("svg-element")).toHaveAttribute("width", "12");
    expect(queryByTestId("ok-button")).not.toHaveAttribute("height");

    expect(() => expect(queryByTestId("ok-button")).not.toHaveAttribute("disabled")).toThrow(
        'expect(element).not.toHaveAttribute("disabled")',
    );
    expect(() => expect(queryByTestId("ok-button")).not.toHaveAttribute("type")).toThrow(
        'expect(element).not.toHaveAttribute("type")',
    );
    expect(() => expect(queryByTestId("ok-button")).toHaveAttribute("class")).toThrow(
        'expect(element).toHaveAttribute("class")',
    );
    expect(() => expect(queryByTestId("ok-button")).not.toHaveAttribute("type", "submit")).toThrow(
        'expect(element).not.toHaveAttribute("type", "submit")',
    );
    expect(() => expect(queryByTestId("ok-button")).toHaveAttribute("type", "button")).toThrow(
        'expect(element).toHaveAttribute("type", "button")',
    );
    expect(() => expect(queryByTestId("svg-element")).not.toHaveAttribute("width")).toThrow(
        'expect(element).not.toHaveAttribute("width")',
    );
    expect(() => expect(queryByTestId("svg-element")).not.toHaveAttribute("width", "12")).toThrow(
        'expect(element).not.toHaveAttribute("width", "12")',
    );
    // @ts-expect-error: testing a missing argument
    expect(() => expect({ thisIsNot: "an html element" }).not.toHaveAttribute()).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );

    // Asymmetric matchers
    expect(queryByTestId("ok-button")).toHaveAttribute("type", expect.stringContaining("sub"));
    expect(queryByTestId("ok-button")).toHaveAttribute("type", expect.stringMatching(/sub*/));
    expect(queryByTestId("ok-button")).toHaveAttribute("type", expect.anything());

    expect(() =>
        expect(queryByTestId("ok-button")).toHaveAttribute("type", expect.not.stringContaining("sub")),
    ).toThrow("Expected the element to have attribute");
});
