// @vitest-environment happy-dom

import { expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toContainElement } from "./to-contain-element.js";

expect.extend({ toContainElement });

const { queryByTestId } = render(`
<span data-testid="grandparent">
  <span data-testid="parent">
    <span data-testid="child"></span>
  </span>
  <svg data-testid="svg-element"></svg>
</span>
`);

const grandparent = queryByTestId<HTMLElement>("grandparent");
const parent = queryByTestId<HTMLElement>("parent");
const child = queryByTestId<HTMLElement>("child");
const svgElement = queryByTestId<SVGElement>("svg-element");
const nonExistantElement = queryByTestId<HTMLElement>("not-exists");
const fakeElement = { thisIsNot: "an html element" };

it(".toContainElement positive test cases", () => {
    expect(grandparent).toContainElement(parent);
    expect(grandparent).toContainElement(child);
    expect(grandparent).toContainElement(svgElement);
    expect(parent).toContainElement(child);
    expect(parent).not.toContainElement(grandparent);
    expect(parent).not.toContainElement(svgElement);
    expect(child).not.toContainElement(parent);
    expect(child).not.toContainElement(grandparent);
    expect(child).not.toContainElement(svgElement);
    expect(grandparent).not.toContainElement(nonExistantElement);
});

it(".toContainElement negative test cases", () => {
    expect(() => expect(nonExistantElement).not.toContainElement(child)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    expect(() => expect(parent).toContainElement(grandparent)).toThrow(
        "expect(element).toContainElement(element)",
    );
    expect(() => expect(nonExistantElement).toContainElement(grandparent)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    expect(() => expect(grandparent).toContainElement(nonExistantElement)).toThrow(
        "expect(element).toContainElement(element)",
    );
    expect(() => expect(nonExistantElement).toContainElement(nonExistantElement)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    // @ts-expect-error: testing a non-element argument
    expect(() => expect(nonExistantElement).toContainElement(fakeElement)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    expect(() => expect(fakeElement).toContainElement(nonExistantElement)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    expect(() => expect(fakeElement).not.toContainElement(nonExistantElement)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    expect(() => expect(fakeElement).toContainElement(grandparent)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    // @ts-expect-error: testing a non-element argument
    expect(() => expect(grandparent).toContainElement(fakeElement)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    // @ts-expect-error: testing a non-element argument
    expect(() => expect(fakeElement).toContainElement(fakeElement)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
    expect(() => expect(grandparent).not.toContainElement(child)).toThrow(
        "expect(element).not.toContainElement(element)",
    );
    expect(() => expect(grandparent).not.toContainElement(svgElement)).toThrow(
        "expect(element).not.toContainElement(element)",
    );
    // @ts-expect-error: testing a non-element argument
    expect(() => expect(grandparent).not.toContainElement(undefined)).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );
});
