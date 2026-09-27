import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

function getNormalizedHtml(container: Element, htmlText: string) {
    const div = container.ownerDocument.createElement("div");
    div.innerHTML = htmlText;
    return div.innerHTML;
}

/**
 * @description
 * Assert whether a string representing a HTML element is contained in another element.
 * @example
 * <span data-testid="parent"><span data-testid="child"></span></span>
 *
 * expect(getByTestId('parent')).toContainHTML('<span data-testid="child"></span>')
 * @see
 * [testing-library/jest-dom#tocontainhtml](https://github.com/testing-library/jest-dom#tocontainhtml)
 */
export function toContainHTML(this: MatcherState, container: Element, htmlText: string): MatcherResult {
    checkHtmlElement(container, toContainHTML, this);

    if (typeof htmlText !== "string") {
        throw new Error(`.toContainHTML() expects a string value, got ${htmlText}`);
    }

    return {
        pass: container.outerHTML.includes(getNormalizedHtml(container, htmlText)),
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toContainHTML`, "element", ""),
                "Expected:",
                `  ${this.utils.EXPECTED_COLOR(htmlText)}`,
                "Received:",
                `  ${this.utils.printReceived(container.cloneNode(true))}`,
            ].join("\n");
        },
    };
}
