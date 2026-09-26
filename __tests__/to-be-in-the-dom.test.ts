// @vitest-environment happy-dom

import { test, expect, vi } from "vitest";

import { render } from "./helpers/test-utils.js";

test(".toBeInTheDOM", () => {
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
    expect(() => expect(valueElement).not.toBeInTheDOM()).toThrowError();

    expect(() => expect(svgElement).not.toBeInTheDOM()).toThrowError();

    expect(() => expect(nonExistantElement).toBeInTheDOM()).toThrowError();

    expect(() => expect(fakeElement).toBeInTheDOM()).toThrowError();

    // Testing toBeInTheDOM with container
    expect(valueElement).toBeInTheDOM(containerElement);
    expect(svgElement).toBeInTheDOM(containerElement);
    expect(containerElement).not.toBeInTheDOM(valueElement);

    expect(() => expect(valueElement).not.toBeInTheDOM(containerElement)).toThrowError();

    expect(() => expect(svgElement).not.toBeInTheDOM(containerElement)).toThrowError();

    expect(() => expect(nonExistantElement).toBeInTheDOM(containerElement)).toThrowError();

    expect(() => expect(fakeElement).toBeInTheDOM(containerElement)).toThrowError();

    expect(() => {
        // @ts-expect-error: testing a non-element argument
        expect(valueElement).toBeInTheDOM(fakeElement);
    }).toThrowError();

    spy.mockRestore();
});
