import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils/element-checks.js";
import { getMessage } from "./utils/messages.js";

function printAttribute(stringify: (value: unknown) => string, name: string, value: unknown) {
    return value === undefined ? name : `${name}=${stringify(value)}`;
}

function getAttributeComment(stringify: (value: unknown) => string, name: string, value: unknown) {
    return value === undefined
        ? `element.hasAttribute(${stringify(name)})`
        : `element.getAttribute(${stringify(name)}) === ${stringify(value)}`;
}

/**
 * Allows you to check if a given element has an attribute or not.
 *
 * You can also optionally check that the attribute has a specific expected value or partial match using
 * [expect.stringContaining](https://jestjs.io/docs/en/expect.html#expectnotstringcontainingstring) or
 * [expect.stringMatching](https://jestjs.io/docs/en/expect.html#expectstringmatchingstring-regexp).
 *
 * @example
 * ```html
 * <button
 *   data-testid="ok-button"
 *   type="submit"
 *   disabled
 * >
 *   ok
 * </button>
 * ```
 *
 * ```ts
 * expect(button).toHaveAttribute('disabled')
 * expect(button).toHaveAttribute('type', 'submit')
 * expect(button).not.toHaveAttribute('type', 'button')
 * ```
 *
 * @see
 * [testing-library/jest-dom#tohaveattribute](https://github.com/testing-library/jest-dom#tohaveattribute)
 *
 * @public
 */
export function toHaveAttribute(
    this: MatcherState,
    htmlElement: Element,
    name: string,
    expectedValue?: unknown,
): IMatcherResult {
    checkHtmlElement(htmlElement, toHaveAttribute, this);
    const isExpectedValuePresent = expectedValue !== undefined;
    const hasAttribute = htmlElement.hasAttribute(name);
    const receivedValue = htmlElement.getAttribute(name);
    return {
        pass: isExpectedValuePresent
            ? hasAttribute && this.equals(receivedValue, expectedValue)
            : hasAttribute,
        message: () => {
            const to = this.isNot ? "not to" : "to";
            const receivedAttribute = hasAttribute
                ? printAttribute(this.utils.stringify, name, receivedValue)
                : null;
            const matcher = this.utils.matcherHint(
                `${this.isNot ? ".not" : ""}.toHaveAttribute`,
                "element",
                this.utils.printExpected(name),
                {
                    secondArgument: isExpectedValuePresent
                        ? this.utils.printExpected(expectedValue)
                        : undefined,
                    comment: getAttributeComment(this.utils.stringify, name, expectedValue),
                },
            );
            return getMessage(
                this,
                matcher,
                `Expected the element ${to} have attribute`,
                printAttribute(this.utils.stringify, name, expectedValue),
                "Received",
                receivedAttribute,
            );
        },
    };
}
