import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, deprecate } from "./utils.js";

/**
 * Assert whether an element has content or not.
 *
 * @deprecated
 * since v5.9.0
 *
 * @example
 * <span data-testid="not-empty">
 *   <span data-testid="empty"></span>
 * </span>
 *
 * expect(getByTestId('empty')).toBeEmpty()
 * expect(getByTestId('not-empty')).not.toBeEmpty()
 * @see
 * [testing-library/jest-dom#tobeempty](https://github.com/testing-library/jest-dom#tobeempty)
 *
 * @public
 */
export function toBeEmpty(this: MatcherState, element: Element): IMatcherResult {
    deprecate("toBeEmpty", "Please use instead toBeEmptyDOMElement for finding empty nodes in the DOM.");
    checkHtmlElement(element, toBeEmpty, this);

    return {
        pass: element.innerHTML === "",
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeEmpty`, "element", ""),
                "",
                "Received:",
                `  ${this.utils.printReceived(element.innerHTML)}`,
            ].join("\n");
        },
    };
}
