// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toBeInvalid, toBeValid } from "./to-be-invalid.js";

expect.extend({ toBeInvalid, toBeValid });

// A required field without a value is invalid
const invalidInputHtml = `<input required>`;

document.body.innerHTML = invalidInputHtml;
const invalidInputNode = document.querySelector("input");

// A form is invalid if it contains an invalid input
const invalidFormHtml = `<form>${invalidInputHtml}</form>`;

document.body.innerHTML = invalidFormHtml;
const invalidFormNode = document.querySelector("form");

describe(".toBeInvalid", () => {
    it("handles <input/>", () => {
        const { queryByTestId } = render(`
      <div>
        <input data-testid="no-aria-invalid">
        <input data-testid="aria-invalid" aria-invalid>
        <input data-testid="aria-invalid-value" aria-invalid="true">
        <input data-testid="aria-invalid-false" aria-invalid="false">
      </div>
      `);

        expect(queryByTestId("no-aria-invalid")).not.toBeInvalid();
        expect(queryByTestId("aria-invalid")).toBeInvalid();
        expect(queryByTestId("aria-invalid-value")).toBeInvalid();
        expect(queryByTestId("aria-invalid-false")).not.toBeInvalid();
        expect(invalidInputNode).toBeInvalid();

        // negative test cases wrapped in throwError assertions for coverage.
        expect(() => expect(queryByTestId("no-aria-invalid")).toBeInvalid()).toThrow(
            "Received element is not currently invalid",
        );
        expect(() => expect(queryByTestId("aria-invalid")).not.toBeInvalid()).toThrow(
            "Received element is currently invalid",
        );
        expect(() => expect(queryByTestId("aria-invalid-value")).not.toBeInvalid()).toThrow(
            "Received element is currently invalid",
        );
        expect(() => expect(queryByTestId("aria-invalid-false")).toBeInvalid()).toThrow(
            "Received element is not currently invalid",
        );
        expect(() => expect(invalidInputNode).not.toBeInvalid()).toThrow(
            "Received element is currently invalid",
        );
    });

    it("handles <form/>", () => {
        const { queryByTestId } = render(`
      <form data-testid="valid">
        <input>
      </form>
      `);

        expect(queryByTestId("valid")).not.toBeInvalid();
        expect(invalidFormNode).toBeInvalid();

        // negative test cases wrapped in throwError assertions for coverage.
        expect(() => expect(queryByTestId("valid")).toBeInvalid()).toThrow(
            "Received element is not currently invalid",
        );
        expect(() => expect(invalidFormNode).not.toBeInvalid()).toThrow(
            "Received element is currently invalid",
        );
    });

    it("handles any element", () => {
        const { queryByTestId } = render(`
      <ol data-testid="valid">
        <li data-testid="no-aria-invalid" > </li>
        <li data-testid="aria-invalid" aria-invalid>  </li>
        <li data-testid="aria-invalid-value" aria-invalid="true">  </li>
        <li data-testid="aria-invalid-false" aria-invalid="false">  </li>
      </ol>
      `);

        expect(queryByTestId("valid")).not.toBeInvalid();
        expect(queryByTestId("no-aria-invalid")).not.toBeInvalid();
        expect(queryByTestId("aria-invalid")).toBeInvalid();
        expect(queryByTestId("aria-invalid-value")).toBeInvalid();
        expect(queryByTestId("aria-invalid-false")).not.toBeInvalid();

        // negative test cases wrapped in throwError assertions for coverage.
        expect(() => expect(queryByTestId("valid")).toBeInvalid()).toThrow(
            /Received element is not currently invalid/,
        );
        expect(() => expect(queryByTestId("no-aria-invalid")).toBeInvalid()).toThrow(
            /Received element is not currently invalid/,
        );
        expect(() => expect(queryByTestId("aria-invalid")).not.toBeInvalid()).toThrow(
            /Received element is currently invalid/,
        );
        expect(() => expect(queryByTestId("aria-invalid-value")).not.toBeInvalid()).toThrow(
            /Received element is currently invalid/,
        );
        expect(() => expect(queryByTestId("aria-invalid-false")).toBeInvalid()).toThrow(
            /Received element is not currently invalid/,
        );
    });
});

describe(".toBeValid", () => {
    it("handles <input/>", () => {
        const { queryByTestId } = render(`
      <div>
        <input data-testid="no-aria-invalid">
        <input data-testid="aria-invalid" aria-invalid>
        <input data-testid="aria-invalid-value" aria-invalid="true">
        <input data-testid="aria-invalid-false" aria-invalid="false">
      </div>
      `);

        expect(queryByTestId("no-aria-invalid")).toBeValid();
        expect(queryByTestId("aria-invalid")).not.toBeValid();
        expect(queryByTestId("aria-invalid-value")).not.toBeValid();
        expect(queryByTestId("aria-invalid-false")).toBeValid();
        expect(invalidInputNode).not.toBeValid();

        // negative test cases wrapped in throwError assertions for coverage.
        expect(() => expect(queryByTestId("no-aria-invalid")).not.toBeValid()).toThrow(
            /Received element is currently valid/,
        );
        expect(() => expect(queryByTestId("aria-invalid")).toBeValid()).toThrow(
            /Received element is not currently valid/,
        );
        expect(() => expect(queryByTestId("aria-invalid-value")).toBeValid()).toThrow(
            /Received element is not currently valid/,
        );
        expect(() => expect(queryByTestId("aria-invalid-false")).not.toBeValid()).toThrow(
            /Received element is currently valid/,
        );
        expect(() => expect(invalidInputNode).toBeValid()).toThrow(/Received element is not currently valid/);
    });

    it("handles <form/>", () => {
        const { queryByTestId } = render(`
      <form data-testid="valid">
        <input>
      </form>
      `);

        expect(queryByTestId("valid")).toBeValid();
        expect(invalidFormNode).not.toBeValid();

        // negative test cases wrapped in throwError assertions for coverage.
        expect(() => expect(queryByTestId("valid")).not.toBeValid()).toThrow(
            /Received element is currently valid/,
        );
        expect(() => expect(invalidFormNode).toBeValid()).toThrow(/Received element is not currently valid/);
    });

    it("handles any element", () => {
        const { queryByTestId } = render(`
      <ol data-testid="valid">
        <li data-testid="no-aria-invalid" > </li>
        <li data-testid="aria-invalid" aria-invalid>  </li>
        <li data-testid="aria-invalid-value" aria-invalid="true">  </li>
        <li data-testid="aria-invalid-false" aria-invalid="false">  </li>
      </ol>
      `);

        expect(queryByTestId("valid")).toBeValid();
        expect(queryByTestId("no-aria-invalid")).toBeValid();
        expect(queryByTestId("aria-invalid")).not.toBeValid();
        expect(queryByTestId("aria-invalid-value")).not.toBeValid();
        expect(queryByTestId("aria-invalid-false")).toBeValid();

        // negative test cases wrapped in throwError assertions for coverage.
        expect(() => expect(queryByTestId("valid")).not.toBeValid()).toThrow(
            /Received element is currently valid/,
        );
        expect(() => expect(queryByTestId("no-aria-invalid")).not.toBeValid()).toThrow(
            /Received element is currently valid/,
        );
        expect(() => expect(queryByTestId("aria-invalid")).toBeValid()).toThrow(
            /Received element is not currently valid/,
        );
        expect(() => expect(queryByTestId("aria-invalid-value")).toBeValid()).toThrow(
            /Received element is not currently valid/,
        );
        expect(() => expect(queryByTestId("aria-invalid-false")).not.toBeValid()).toThrow(
            /Received element is currently valid/,
        );
    });
});
