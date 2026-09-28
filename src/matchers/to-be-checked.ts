import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils/element-checks.js";
import { toSentence } from "./utils/text.js";

// WAI-ARIA roles supporting the aria-checked state
// (https://www.w3.org/TR/wai-aria-1.2/#aria-checked).
const ROLES_SUPPORTING_CHECKED = [
    "checkbox",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "radio",
    "switch",
    "treeitem",
];

/**
 * Assert whether the given element is checked.
 *
 * It accepts an `input` of type `checkbox` or `radio` and elements with a `role` of `radio` with a valid
 * `aria-checked` attribute of "true" or "false".
 *
 * @example
 * ```html
 * <input
 *   type="checkbox"
 *   checked
 *   data-testid="input-checkbox" />
 * <input
 *   type="radio"
 *   value="foo"
 *   data-testid="input-radio" />
 * ```
 *
 * ```ts
 * const inputCheckbox = getByTestId('input-checkbox')
 * const inputRadio = getByTestId('input-radio')
 * expect(inputCheckbox).toBeChecked()
 * expect(inputRadio).not.toBeChecked()
 * ```
 *
 * @see
 * [testing-library/jest-dom#tobechecked](https://github.com/testing-library/jest-dom#tobechecked)
 *
 * @public
 */
export function toBeChecked(this: MatcherState, element: Element): IMatcherResult {
    checkHtmlElement(element, toBeChecked, this);

    const isValidInput = () => {
        return (
            element.tagName.toLowerCase() === "input" &&
            ["checkbox", "radio"].includes((element as HTMLInputElement).type)
        );
    };

    const isValidAriaElement = () => {
        return (
            roleSupportsChecked(element.getAttribute("role")) &&
            ["true", "false"].includes(element.getAttribute("aria-checked") ?? "")
        );
    };

    if (!isValidInput() && !isValidAriaElement()) {
        return {
            pass: false,
            message: () =>
                `only inputs with type="checkbox" or type="radio" or elements with ${supportedRolesSentence()} and a valid aria-checked attribute can be used with .toBeChecked(). Use .toHaveValue() instead`,
        };
    }

    const isChecked = () => {
        if (isValidInput()) return (element as HTMLInputElement).checked;
        return element.getAttribute("aria-checked") === "true";
    };

    return {
        pass: isChecked(),
        message: () => {
            const is = isChecked() ? "is" : "is not";
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeChecked`, "element", ""),
                "",
                `Received element ${is} checked:`,
                `  ${this.utils.printReceived(element.cloneNode(false))}`,
            ].join("\n");
        },
    };
}

function supportedRolesSentence() {
    return toSentence(
        ROLES_SUPPORTING_CHECKED.map((role) => `role="${role}"`),
        { lastWordConnector: " or " },
    );
}

function roleSupportsChecked(role: string | null) {
    return role !== null && ROLES_SUPPORTING_CHECKED.includes(role);
}
