import { computeAccessibleDescription } from "dom-accessibility-api";
import type { expect } from "vitest";

import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils/element-checks.js";
import { getMessage } from "./utils/messages.js";

/**
 * This allows to assert that an element has the expected [accessible description](https://w3c.github.io/accname/).
 *
 * You can pass the exact string of the expected accessible description, or you can make a
 * partial match passing a regular expression, or by using either
 * [expect.stringContaining](https://jestjs.io/docs/en/expect.html#expectnotstringcontainingstring)
 * or [expect.stringMatching](https://jestjs.io/docs/en/expect.html#expectstringmatchingstring-regexp).
 * @example
 * <a data-testid="link" href="/" aria-label="Home page" title="A link to start over">Start</a>
 * <a data-testid="extra-link" href="/about" aria-label="About page">About</a>
 * <img src="avatar.jpg" data-testid="avatar" alt="User profile pic" />
 * <img src="logo.jpg" data-testid="logo" alt="Company logo" aria-describedby="t1" />
 * <span id="t1" role="presentation">The logo of Our Company</span>
 *
 * expect(getByTestId('link')).toHaveAccessibleDescription()
 * expect(getByTestId('link')).toHaveAccessibleDescription('A link to start over')
 * expect(getByTestId('link')).not.toHaveAccessibleDescription('Home page')
 * expect(getByTestId('extra-link')).not.toHaveAccessibleDescription()
 * expect(getByTestId('avatar')).not.toHaveAccessibleDescription()
 * expect(getByTestId('logo')).not.toHaveAccessibleDescription('Company logo')
 * expect(getByTestId('logo')).toHaveAccessibleDescription('The logo of Our Company')
 * @see
 * [testing-library/jest-dom#tohaveaccessibledescription](https://github.com/testing-library/jest-dom#tohaveaccessibledescription)
 *
 * @public
 */
export function toHaveAccessibleDescription(
    this: MatcherState,
    htmlElement: Element,
    expectedAccessibleDescription?: string | RegExp | typeof expect.stringContaining,
): IMatcherResult {
    checkHtmlElement(htmlElement, toHaveAccessibleDescription, this);
    const actualAccessibleDescription = computeAccessibleDescription(htmlElement);
    const missingExpectedValue = arguments.length === 1;

    let pass: boolean;
    if (missingExpectedValue) {
        // When called without an expected value we only want to validate that the element has an
        // accessible description, whatever it may be.
        pass = actualAccessibleDescription !== "";
    } else {
        pass =
            expectedAccessibleDescription instanceof RegExp
                ? expectedAccessibleDescription.test(actualAccessibleDescription)
                : this.equals(actualAccessibleDescription, expectedAccessibleDescription);
    }

    return {
        pass,

        message: () => {
            const to = this.isNot ? "not to" : "to";
            return getMessage(
                this,
                this.utils.matcherHint(
                    `${this.isNot ? ".not" : ""}.${toHaveAccessibleDescription.name}`,
                    "element",
                    "",
                ),
                `Expected element ${to} have accessible description`,
                expectedAccessibleDescription,
                "Received",
                actualAccessibleDescription,
            );
        },
    };
}
