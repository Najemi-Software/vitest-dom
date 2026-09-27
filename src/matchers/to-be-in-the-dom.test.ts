// @vitest-environment happy-dom

import { expect, it, vi } from "vitest";

import { render } from "./render.test.utils.js";
import { toBeInTheDOM } from "./to-be-in-the-dom.js";

expect.extend({ toBeInTheDOM });

it(".toBeInTheDOM", () => {
    // @deprecated intentionally hiding warnings for test clarity
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const { queryByTestId } = render(`
    <span data-testid="count-container">
      <span data-testid="count-value"></span>
      <svg data-testid="svg-element"></svg>
    </span>`);

    const containerElement = queryByTestId<HTMLElement>("count-container")!;
    const valueElement = queryByTestId<HTMLElement>("count-value")!;
    const nonExistantElement = queryByTestId<HTMLElement>("not-exists");
    const svgElement = queryByTestId<SVGElement>("svg-element");
    const fakeElement = { thisIsNot: "an html element" };

    // Testing toBeInTheDOM without container
    expect(valueElement).toBeInTheDOM();
    expect(svgElement).toBeInTheDOM();
    expect(nonExistantElement).not.toBeInTheDOM();

    // negative test cases wrapped in throwError assertions for coverage.
    expect(() => expect(valueElement).not.toBeInTheDOM()).toThrow("expect(element).not.toBeInTheDOM()");

    expect(() => expect(svgElement).not.toBeInTheDOM()).toThrow("expect(element).not.toBeInTheDOM()");

    expect(() => expect(nonExistantElement).toBeInTheDOM()).toThrow("expect(element).toBeInTheDOM()");

    expect(() => expect(fakeElement).toBeInTheDOM()).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );

    // Testing toBeInTheDOM with container
    expect(valueElement).toBeInTheDOM(containerElement);
    expect(svgElement).toBeInTheDOM(containerElement);
    expect(containerElement).not.toBeInTheDOM(valueElement);

    expect(() => expect(valueElement).not.toBeInTheDOM(containerElement)).toThrow(
        "expect(element).not.toBeInTheDOM()",
    );

    expect(() => expect(svgElement).not.toBeInTheDOM(containerElement)).toThrow(
        "expect(element).not.toBeInTheDOM()",
    );

    expect(() => expect(nonExistantElement).toBeInTheDOM(containerElement)).toThrow(
        "expect(element).toBeInTheDOM()",
    );

    expect(() => expect(fakeElement).toBeInTheDOM(containerElement)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );

    expect(() => {
        // @ts-expect-error: testing a non-element argument
        expect(valueElement).toBeInTheDOM(fakeElement);
    }).toThrow("received value must be an HTMLElement or an SVGElement");

    spy.mockRestore();
});
