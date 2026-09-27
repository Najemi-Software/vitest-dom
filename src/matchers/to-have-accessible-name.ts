import { computeAccessibleName } from "dom-accessibility-api";
import type { expect } from "vitest";

import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, getMessage } from "./utils.js";

/**
 * @description
 * This allows to assert that an element has the expected [accessible name](https://w3c.github.io/accname/).
 * It is useful, for instance, to assert that form elements and buttons are properly labelled.
 *
 * You can pass the exact string of the expected accessible name, or you can make a
 * partial match passing a regular expression, or by using either
 * [expect.stringContaining](https://jestjs.io/docs/en/expect.html#expectnotstringcontainingstring)
 * or [expect.stringMatching](https://jestjs.io/docs/en/expect.html#expectstringmatchingstring-regexp).
 * @example
 * <img data-testid="img-alt" src="" alt="Test alt" />
 * <img data-testid="img-empty-alt" src="" alt="" />
 * <svg data-testid="svg-title"><title>Test title</title></svg>
 * <button data-testid="button-img-alt"><img src="" alt="Test" /></button>
 * <p><img data-testid="img-paragraph" src="" alt="" /> Test content</p>
 * <button data-testid="svg-button"><svg><title>Test</title></svg></p>
 * <div><svg data-testid="svg-without-title"></svg></div>
 * <input data-testid="input-title" title="test" />
 *
 * expect(getByTestId('img-alt')).toHaveAccessibleName('Test alt')
 * expect(getByTestId('img-empty-alt')).not.toHaveAccessibleName()
 * expect(getByTestId('svg-title')).toHaveAccessibleName('Test title')
 * expect(getByTestId('button-img-alt')).toHaveAccessibleName()
 * expect(getByTestId('img-paragraph')).not.toHaveAccessibleName()
 * expect(getByTestId('svg-button')).toHaveAccessibleName()
 * expect(getByTestId('svg-without-title')).not.toHaveAccessibleName()
 * expect(getByTestId('input-title')).toHaveAccessibleName()
 * @see
 * [testing-library/jest-dom#tohaveaccessiblename](https://github.com/testing-library/jest-dom#tohaveaccessiblename)
 */
export function toHaveAccessibleName(
    this: MatcherState,
    htmlElement: Element,
    expectedAccessibleName?: string | RegExp | typeof expect.stringContaining,
): IMatcherResult {
    checkHtmlElement(htmlElement, toHaveAccessibleName, this);
    const actualAccessibleName = computeAccessibleName(htmlElement);
    const missingExpectedValue = arguments.length === 1;

    let pass = false;
    if (missingExpectedValue) {
        // When called without an expected value we only want to validate that the element has an
        // accessible name, whatever it may be.
        pass = actualAccessibleName !== "";
    } else {
        pass =
            expectedAccessibleName instanceof RegExp
                ? expectedAccessibleName.test(actualAccessibleName)
                : this.equals(actualAccessibleName, expectedAccessibleName);
    }

    return {
        pass,

        message: () => {
            const to = this.isNot ? "not to" : "to";
            return getMessage(
                this,
                this.utils.matcherHint(
                    `${this.isNot ? ".not" : ""}.${toHaveAccessibleName.name}`,
                    "element",
                    "",
                ),
                `Expected element ${to} have accessible name`,
                expectedAccessibleName,
                "Received",
                actualAccessibleName,
            );
        },
    };
}
