import { isEqualWith } from "lodash-es";

import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, compareArraysAsSet, getMessage, getSingleElementValue } from "./utils.js";

/**
 * @description
 * Check whether the given form element has the specified value.
 *
 * Accepts `<input>`, `<select>`, and `<textarea>` elements with the exception of `<input type="checkbox">` and
 * `<input type="radiobox">`, which can be matched only using
 * [toBeChecked](https://github.com/testing-library/jest-dom#tobechecked) or
 * [toHaveFormValues](https://github.com/testing-library/jest-dom#tohaveformvalues).
 * @example
 * <input
 *   type="number"
 *   value="5"
 *   data-testid="input-number" />
 *
 * const numberInput = getByTestId('input-number')
 * expect(numberInput).toHaveValue(5)
 * @see
 * [testing-library/jest-dom#tohavevalue](https://github.com/testing-library/jest-dom#tohavevalue)
 */
export function toHaveValue(
    this: MatcherState,
    htmlElement: Element,
    expectedValue?: string | string[] | number | null,
): IMatcherResult {
    checkHtmlElement(htmlElement, toHaveValue, this);

    if (
        htmlElement.tagName.toLowerCase() === "input" &&
        ["checkbox", "radio"].includes((htmlElement as HTMLInputElement).type)
    ) {
        throw new Error(
            "input with type=checkbox or type=radio cannot be used with .toHaveValue(). Use .toBeChecked() for type=checkbox or .toHaveFormValues() instead",
        );
    }

    const receivedValue = getSingleElementValue(htmlElement);
    const expectsValue = expectedValue !== undefined;

    let expectedTypedValue = expectedValue;
    let receivedTypedValue = receivedValue;
    if (expectedValue == receivedValue && expectedValue !== receivedValue) {
        expectedTypedValue = `${expectedValue} (${typeof expectedValue})`;
        receivedTypedValue = `${receivedValue} (${typeof receivedValue})`;
    }

    return {
        pass: expectsValue
            ? isEqualWith(receivedValue, expectedValue, compareArraysAsSet)
            : Boolean(receivedValue),
        message: () => {
            const to = this.isNot ? "not to" : "to";
            const matcher = this.utils.matcherHint(
                `${this.isNot ? ".not" : ""}.toHaveValue`,
                "element",
                expectedValue === undefined ? undefined : String(expectedValue),
            );
            return getMessage(
                this,
                matcher,
                `Expected the element ${to} have value`,
                expectsValue ? expectedTypedValue : "(any)",
                "Received",
                receivedTypedValue,
            );
        },
    };
}
