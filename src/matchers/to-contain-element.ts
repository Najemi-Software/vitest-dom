import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

/**
 * @description
 * Allows you to assert whether an element contains another element as a descendant or not.
 * @example
 * <span data-testid="ancestor">
 *   <span data-testid="descendant"></span>
 * </span>
 *
 * const ancestor = getByTestId('ancestor')
 * const descendant = getByTestId('descendant')
 * const nonExistantElement = getByTestId('does-not-exist')
 * expect(ancestor).toContainElement(descendant)
 * expect(descendant).not.toContainElement(ancestor)
 * expect(ancestor).not.toContainElement(nonExistantElement)
 * @see
 * [testing-library/jest-dom#tocontainelement](https://github.com/testing-library/jest-dom#tocontainelement)
 */
export function toContainElement(
    this: MatcherState,
    container: Element,
    element: HTMLElement | SVGElement | null,
): MatcherResult {
    checkHtmlElement(container, toContainElement, this);

    if (element !== null) {
        checkHtmlElement(element, toContainElement, this);
    }

    return {
        pass: container.contains(element),
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toContainElement`, "element", "element"),
                "",
                this.utils.RECEIVED_COLOR(`${this.utils.stringify(container.cloneNode(false))} ${
                    this.isNot ? "contains:" : "does not contain:"
                } ${this.utils.stringify(element ? element.cloneNode(false) : element)}
        `),
            ].join("\n");
        },
    };
}
