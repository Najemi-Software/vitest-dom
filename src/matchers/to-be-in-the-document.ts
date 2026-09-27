import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

/**
 * @description
 * Assert whether an element is present in the document or not.
 * @example
 * <svg data-testid="svg-element"></svg>
 *
 * expect(queryByTestId('svg-element')).toBeInTheDocument()
 * expect(queryByTestId('does-not-exist')).not.toBeInTheDocument()
 * @see
 * [testing-library/jest-dom#tobeinthedocument](https://github.com/testing-library/jest-dom#tobeinthedocument)
 */
export function toBeInTheDocument(this: MatcherState, element: Element): IMatcherResult {
    if (element !== null || !this.isNot) {
        checkHtmlElement(element, toBeInTheDocument, this);
    }

    const pass = element === null ? false : element.ownerDocument === element.getRootNode({ composed: true });

    const errorFound = () => {
        return `expected document not to contain element, found ${this.utils.stringify(
            element.cloneNode(true),
        )} instead`;
    };
    const errorNotFound = () => {
        return `element could not be found in the document`;
    };

    return {
        pass,
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeInTheDocument`, "element", ""),
                "",
                this.utils.RECEIVED_COLOR(this.isNot ? errorFound() : errorNotFound()),
            ].join("\n");
        },
    };
}
