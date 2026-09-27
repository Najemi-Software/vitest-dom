import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, deprecate } from "./utils.js";

/**
 * @deprecated
 * since v1.9.0
 * @description
 * Assert whether a value is a DOM element, or not. Contrary to what its name
 * implies, this matcher only checks that you passed to it a valid DOM
 * element.
 *
 * It does not have a clear definition of what "the DOM" is. Therefore, it
 * does not check whether that element is contained anywhere.
 * @see [testing-library/jest-dom#toBeInTheDom](https://github.com/testing-library/jest-dom#toBeInTheDom)
 */
export function toBeInTheDOM(
    this: MatcherState,
    element: Element,
    container?: HTMLElement | SVGElement,
): MatcherResult {
    deprecate(
        "toBeInTheDOM",
        "Please use toBeInTheDocument for searching the entire document and toContainElement for searching a specific container.",
    );

    if (element) {
        checkHtmlElement(element, toBeInTheDOM, this);
    }

    if (container) {
        checkHtmlElement(container, toBeInTheDOM, this);
    }

    return {
        pass: container ? container.contains(element) : !!element,
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeInTheDOM`, "element", ""),
                "",
                "Received:",
                `  ${this.utils.printReceived(element ? element.cloneNode(false) : element)}`,
            ].join("\n");
        },
    };
}
