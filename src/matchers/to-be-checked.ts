import type { MatcherResult } from "./types.js";
import { checkHtmlElement, toSentence } from "./utils.js";

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

export function toBeChecked(element: Element): MatcherResult {
    checkHtmlElement(element, toBeChecked, this);

    const isValidInput = () => {
        return element.tagName.toLowerCase() === "input" && ["checkbox", "radio"].includes(element.type);
    };

    const isValidAriaElement = () => {
        return (
            roleSupportsChecked(element.getAttribute("role")) &&
            ["true", "false"].includes(element.getAttribute("aria-checked"))
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
        if (isValidInput()) return element.checked;
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

function roleSupportsChecked(role) {
    return ROLES_SUPPORTING_CHECKED.includes(role);
}
