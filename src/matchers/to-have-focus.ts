import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

/**
 * @description
 * Assert whether an element has focus or not.
 * @example
 * <div>
 *   <input type="text" data-testid="element-to-focus" />
 * </div>
 *
 * const input = getByTestId('element-to-focus')
 * input.focus()
 * expect(input).toHaveFocus()
 * input.blur()
 * expect(input).not.toHaveFocus()
 * @see
 * [testing-library/jest-dom#tohavefocus](https://github.com/testing-library/jest-dom#tohavefocus)
 */
export function toHaveFocus(this: MatcherState, element: Element): IMatcherResult {
    checkHtmlElement(element, toHaveFocus, this);

    return {
        pass: element.ownerDocument.activeElement === element,
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toHaveFocus`, "element", ""),
                "",
                ...(this.isNot
                    ? ["Received element is focused:", `  ${this.utils.printReceived(element)}`]
                    : [
                          "Expected element with focus:",
                          `  ${this.utils.printExpected(element)}`,
                          "Received element with focus:",
                          `  ${this.utils.printReceived(element.ownerDocument.activeElement)}`,
                      ]),
            ].join("\n");
        },
    };
}
