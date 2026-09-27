// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toContainHTML } from "./to-contain-html.js";

expect.extend({ toContainHTML });

describe(".toContainHTML", () => {
    it("handles positive and negative cases", () => {
        const { queryByTestId } = render(`
    <span data-testid="grandparent">
      <span data-testid="parent">
        <span data-testid="child"></span>
      </span>
      <svg data-testid="svg-element"></svg>
    </span>
    `);

        const grandparent = queryByTestId("grandparent");
        const parent = queryByTestId("parent");
        const child = queryByTestId("child");
        const nonExistantElement = queryByTestId("not-exists");
        const fakeElement = { thisIsNot: "an html element" };
        const stringChildElement = '<span data-testid="child"></span>';
        const stringChildElementSelfClosing = '<span data-testid="child" />';
        const incorrectStringHtml = '<span data-testid="child"></div>';
        const nonExistantString = "<span> Does not exists </span>";
        const svgElement = queryByTestId("svg-element");

        expect(grandparent).toContainHTML(stringChildElement);
        expect(parent).toContainHTML(stringChildElement);
        expect(child).toContainHTML(stringChildElement);
        expect(child).toContainHTML(stringChildElementSelfClosing);
        expect(grandparent).not.toContainHTML(nonExistantString);
        expect(parent).not.toContainHTML(nonExistantString);
        expect(child).not.toContainHTML(nonExistantString);
        expect(child).not.toContainHTML(nonExistantString);
        expect(grandparent).toContainHTML(incorrectStringHtml);
        expect(parent).toContainHTML(incorrectStringHtml);
        expect(child).toContainHTML(incorrectStringHtml);

        // negative test cases wrapped in throwError assertions for coverage.
        expect(() => expect(nonExistantElement).not.toContainHTML(stringChildElement)).toThrow(
            "received value must be an HTMLElement or an SVGElement",
        );
        // @ts-expect-error: testing a non-string argument
        expect(() => expect(nonExistantElement).not.toContainHTML(nonExistantElement)).toThrow(
            "received value must be an HTMLElement or an SVGElement",
        );
        // @ts-expect-error: testing a non-string argument
        expect(() => expect(stringChildElement).not.toContainHTML(fakeElement)).toThrow(
            "received value must be an HTMLElement or an SVGElement",
        );
        expect(() => expect(svgElement).toContainHTML(stringChildElement)).toThrow(
            "expect(element).toContainHTML()",
        );
        expect(() => expect(grandparent).not.toContainHTML(stringChildElement)).toThrow(
            "expect(element).not.toContainHTML()",
        );
        expect(() => expect(parent).not.toContainHTML(stringChildElement)).toThrow(
            "expect(element).not.toContainHTML()",
        );
        expect(() => expect(child).not.toContainHTML(stringChildElement)).toThrow(
            "expect(element).not.toContainHTML()",
        );
        expect(() => expect(child).not.toContainHTML(stringChildElement)).toThrow(
            "expect(element).not.toContainHTML()",
        );
        expect(() => expect(child).not.toContainHTML(stringChildElementSelfClosing)).toThrow(
            "expect(element).not.toContainHTML()",
        );
        expect(() => expect(child).toContainHTML(nonExistantString)).toThrow(
            "expect(element).toContainHTML()",
        );
        expect(() => expect(parent).toContainHTML(nonExistantString)).toThrow(
            "expect(element).toContainHTML()",
        );
        expect(() => expect(grandparent).toContainHTML(nonExistantString)).toThrow(
            "expect(element).toContainHTML()",
        );
        // @ts-expect-error: testing a non-string argument
        expect(() => expect(child).toContainHTML(nonExistantElement)).toThrow(
            ".toContainHTML() expects a string value, got null",
        );
        // @ts-expect-error: testing a non-string argument
        expect(() => expect(parent).toContainHTML(nonExistantElement)).toThrow(
            ".toContainHTML() expects a string value, got null",
        );
        // @ts-expect-error: testing a non-string argument
        expect(() => expect(grandparent).toContainHTML(nonExistantElement)).toThrow(
            ".toContainHTML() expects a string value, got null",
        );
        expect(() => expect(nonExistantElement).not.toContainHTML(incorrectStringHtml)).toThrow(
            "received value must be an HTMLElement or an SVGElement",
        );
        expect(() => expect(grandparent).not.toContainHTML(incorrectStringHtml)).toThrow(
            "expect(element).not.toContainHTML()",
        );
        expect(() => expect(child).not.toContainHTML(incorrectStringHtml)).toThrow(
            "expect(element).not.toContainHTML()",
        );
        expect(() => expect(parent).not.toContainHTML(incorrectStringHtml)).toThrow(
            "expect(element).not.toContainHTML()",
        );
    });

    it("throws with an expected text", () => {
        const { queryByTestId } = render('<span data-testid="child"></span>');
        const htmlElement = queryByTestId("child");
        const nonExistantString = "<div> non-existant element </div>";

        let errorMessage;
        try {
            expect(htmlElement).toContainHTML(nonExistantString);
        } catch (error) {
            errorMessage = (error as Error).message;
        }

        expect(errorMessage).toMatchInlineSnapshot(`
          "expect(element).toContainHTML()
          Expected:
            <div> non-existant element </div>
          Received:
            <span
            data-testid="child"
          />"
        `);
    });
});
