// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toHaveTextContent } from "./to-have-text-content.js";

expect.extend({ toHaveTextContent });

describe(".toHaveTextContent", () => {
    it("handles positive test cases", () => {
        const { queryByTestId } = render(`<span data-testid="count-value">2</span>`);

        expect(queryByTestId("count-value")).toHaveTextContent("2");
        // @ts-expect-error: numbers are stringified at runtime but not allowed by the types
        expect(queryByTestId("count-value")).toHaveTextContent(2);
        expect(queryByTestId("count-value")).toHaveTextContent(/2/);
        expect(queryByTestId("count-value")).not.toHaveTextContent("21");
    });

    it("handles text nodes", () => {
        const { container } = render(`<span>example</span>`);

        expect(container.querySelector("span")!.firstChild).toHaveTextContent("example");
    });

    it("handles fragments", () => {
        const { asFragment } = render(`<span>example</span>`);

        expect(asFragment()).toHaveTextContent("example");
    });

    it("handles negative test cases", () => {
        const { queryByTestId } = render(`<span data-testid="count-value">2</span>`);

        expect(() => expect(queryByTestId("count-value2")).toHaveTextContent("2")).toThrow(
            "received value must be a Node",
        );

        expect(() => expect(queryByTestId("count-value")).toHaveTextContent("3")).toThrow(
            "Expected element to have text content",
        );
        expect(() => expect(queryByTestId("count-value")).not.toHaveTextContent("2")).toThrow(
            "Expected element not to have text content",
        );
    });

    it("normalizes whitespace by default", () => {
        const { container } = render(`
      <span>
        Step
          1
            of
              4
      </span>
    `);

        expect(container.querySelector("span")).toHaveTextContent("Step 1 of 4");
    });

    it("allows whitespace normalization to be turned off", () => {
        const { container } = render(`<span>&nbsp;&nbsp;Step 1 of 4</span>`);

        expect(container.querySelector("span")).toHaveTextContent("  Step 1 of 4", {
            normalizeWhitespace: false,
        });
    });

    it("can handle multiple levels", () => {
        const { container } = render(`<span id="parent"><span>Step 1

    of 4</span></span>`);

        expect(container.querySelector("#parent")).toHaveTextContent("Step 1 of 4");
    });

    it("can handle multiple levels with content spread across decendants", () => {
        const { container } = render(`
        <span id="parent">
            <span>Step</span>
            <span>      1</span>
            <span><span>of</span></span>


            4</span>
        </span>
    `);

        expect(container.querySelector("#parent")).toHaveTextContent("Step 1 of 4");
    });

    it("does not throw error with empty content", () => {
        const { container } = render(`<span></span>`);
        expect(container.querySelector("span")).toHaveTextContent("");
    });

    it("is case-sensitive", () => {
        const { container } = render("<span>Sensitive text</span>");

        expect(container.querySelector("span")).toHaveTextContent("Sensitive text");
        expect(container.querySelector("span")).not.toHaveTextContent("sensitive text");
    });

    it("when matching with empty string and element with content, suggest using toBeEmptyDOMElement instead", () => {
        // https://github.com/testing-library/jest-dom/issues/104
        const { container } = render("<span>not empty</span>");

        expect(() => expect(container.querySelector("span")).toHaveTextContent("")).toThrow(
            /toBeEmptyDOMElement\(\)/,
        );
    });
});
