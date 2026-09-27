import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, getTag } from "./utils.js";

const FORM_TAGS = ["form", "input", "select", "textarea"];

function isElementHavingAriaInvalid(element: Element) {
    return element.hasAttribute("aria-invalid") && element.getAttribute("aria-invalid") !== "false";
}

function isSupportsValidityMethod(
    element: Element,
): element is HTMLFormElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
    return FORM_TAGS.includes(getTag(element));
}

function isElementInvalid(element: Element) {
    const isHaveAriaInvalid = isElementHavingAriaInvalid(element);
    if (isSupportsValidityMethod(element)) {
        return isHaveAriaInvalid || !element.checkValidity();
    } else {
        return isHaveAriaInvalid;
    }
}

/**
 * @description
 * Check if a form element, or the entire `form`, is currently invalid.
 *
 * An `input`, `select`, `textarea`, or `form` element is invalid if it has an `aria-invalid` attribute with no
 * value or a value of "true", or if the result of `checkValidity()` is false.
 * @example
 * <input data-testid="no-aria-invalid" />
 *
 * <form data-testid="invalid-form">
 *   <input required />
 * </form>
 *
 * expect(getByTestId('no-aria-invalid')).not.toBeInvalid()
 * expect(getByTestId('invalid-form')).toBeInvalid()
 * @see
 * [testing-library/jest-dom#tobeinvalid](https://github.com/testing-library/jest-dom#tobeinvalid)
 */
export function toBeInvalid(this: MatcherState, element: Element): MatcherResult {
    checkHtmlElement(element, toBeInvalid, this);

    const isInvalid = isElementInvalid(element);

    return {
        pass: isInvalid,
        message: () => {
            const is = isInvalid ? "is" : "is not";
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeInvalid`, "element", ""),
                "",
                `Received element ${is} currently invalid:`,
                `  ${this.utils.printReceived(element.cloneNode(false))}`,
            ].join("\n");
        },
    };
}

/**
 * @description
 * Allows you to check if a form element is currently required.
 *
 * An `input`, `select`, `textarea`, or `form` element is invalid if it has an `aria-invalid` attribute with no
 * value or a value of "false", or if the result of `checkValidity()` is true.
 * @example
 * <input data-testid="aria-invalid" aria-invalid />
 *
 * <form data-testid="valid-form">
 *   <input />
 * </form>
 *
 * expect(getByTestId('no-aria-invalid')).not.toBeValid()
 * expect(getByTestId('invalid-form')).toBeInvalid()
 * @see
 * [testing-library/jest-dom#tobevalid](https://github.com/testing-library/jest-dom#tobevalid)
 */
export function toBeValid(this: MatcherState, element: Element): MatcherResult {
    checkHtmlElement(element, toBeValid, this);

    const isValid = !isElementInvalid(element);

    return {
        pass: isValid,
        message: () => {
            const is = isValid ? "is" : "is not";
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeValid`, "element", ""),
                "",
                `Received element ${is} currently valid:`,
                `  ${this.utils.printReceived(element.cloneNode(false))}`,
            ].join("\n");
        },
    };
}
