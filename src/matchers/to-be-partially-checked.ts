import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

/**
 * This allows you to check whether the given element is partially checked.
 * It accepts an input of type checkbox and elements with a role of checkbox
 * with a aria-checked="mixed", or input of type checkbox with indeterminate
 * set to true
 *
 * @example
 * ```html
 * <input type="checkbox" aria-checked="mixed" data-testid="aria-checkbox-mixed" />
 * <input type="checkbox" checked data-testid="input-checkbox-checked" />
 * <input type="checkbox" data-testid="input-checkbox-unchecked" />
 * <div role="checkbox" aria-checked="true" data-testid="aria-checkbox-checked" />
 * <div
 *   role="checkbox"
 *   aria-checked="false"
 *   data-testid="aria-checkbox-unchecked"
 * />
 * <input type="checkbox" data-testid="input-checkbox-indeterminate" />
 * ```
 *
 * ```ts
 * const ariaCheckboxMixed = getByTestId('aria-checkbox-mixed')
 * const inputCheckboxChecked = getByTestId('input-checkbox-checked')
 * const inputCheckboxUnchecked = getByTestId('input-checkbox-unchecked')
 * const ariaCheckboxChecked = getByTestId('aria-checkbox-checked')
 * const ariaCheckboxUnchecked = getByTestId('aria-checkbox-unchecked')
 * const inputCheckboxIndeterminate = getByTestId('input-checkbox-indeterminate')
 *
 * expect(ariaCheckboxMixed).toBePartiallyChecked()
 * expect(inputCheckboxChecked).not.toBePartiallyChecked()
 * expect(inputCheckboxUnchecked).not.toBePartiallyChecked()
 * expect(ariaCheckboxChecked).not.toBePartiallyChecked()
 * expect(ariaCheckboxUnchecked).not.toBePartiallyChecked()
 *
 * inputCheckboxIndeterminate.indeterminate = true
 * expect(inputCheckboxIndeterminate).toBePartiallyChecked()
 * ```
 *
 * @see
 * [testing-library/jest-dom#tobepartiallychecked](https://github.com/testing-library/jest-dom#tobepartiallychecked)
 *
 * @public
 */
export function toBePartiallyChecked(this: MatcherState, element: Element): IMatcherResult {
    checkHtmlElement(element, toBePartiallyChecked, this);

    const isValidInput = () => {
        return element.tagName.toLowerCase() === "input" && (element as HTMLInputElement).type === "checkbox";
    };

    const isValidAriaElement = () => {
        return element.getAttribute("role") === "checkbox";
    };

    if (!isValidInput() && !isValidAriaElement()) {
        return {
            pass: false,
            message: () =>
                'only inputs with type="checkbox" or elements with role="checkbox" and a valid aria-checked attribute can be used with .toBePartiallyChecked(). Use .toHaveValue() instead',
        };
    }

    const isPartiallyChecked = () => {
        const isAriaMixed = element.getAttribute("aria-checked") === "mixed";

        if (isValidInput()) {
            return (element as HTMLInputElement).indeterminate || isAriaMixed;
        }

        return isAriaMixed;
    };

    return {
        pass: isPartiallyChecked(),
        message: () => {
            const is = isPartiallyChecked() ? "is" : "is not";
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBePartiallyChecked`, "element", ""),
                "",
                `Received element ${is} partially checked:`,
                `  ${this.utils.printReceived(element.cloneNode(false))}`,
            ].join("\n");
        },
    };
}
