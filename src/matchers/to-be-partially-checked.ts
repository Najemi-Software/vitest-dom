import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

export function toBePartiallyChecked(this: MatcherState, element: Element): MatcherResult {
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
