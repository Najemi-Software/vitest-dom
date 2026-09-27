import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, getTag } from "./utils.js";

// form elements that support 'disabled'
const FORM_TAGS = ["fieldset", "input", "select", "optgroup", "option", "button", "textarea"];

/*
 * According to specification:
 * If <fieldset> is disabled, the form controls that are its descendants,
 * except descendants of its first optional <legend> element, are disabled
 *
 * https://html.spec.whatwg.org/multipage/form-elements.html#concept-fieldset-disabled
 *
 * This method tests whether element is first legend child of fieldset parent
 */
function isFirstLegendChildOfFieldset(element: Element, parent: Element) {
    return (
        getTag(element) === "legend" &&
        getTag(parent) === "fieldset" &&
        element.isSameNode(Array.from(parent.children).find((child) => getTag(child) === "legend") ?? null)
    );
}

function isElementDisabledByParent(element: Element, parent: Element) {
    return isElementDisabled(parent) && !isFirstLegendChildOfFieldset(element, parent);
}

function isCustomElement(tag: string) {
    return tag.includes("-");
}

/*
 * Only certain form elements and custom elements can actually be disabled:
 * https://html.spec.whatwg.org/multipage/semantics-other.html#disabled-elements
 */
function canElementBeDisabled(element: Element) {
    const tag = getTag(element);
    return FORM_TAGS.includes(tag) || isCustomElement(tag);
}

function isElementDisabled(element: Element) {
    return canElementBeDisabled(element) && element.hasAttribute("disabled");
}

function isAncestorDisabled(element: Element): boolean {
    const parent = element.parentElement;
    return parent !== null && (isElementDisabledByParent(element, parent) || isAncestorDisabled(parent));
}

function isElementOrAncestorDisabled(element: Element) {
    return canElementBeDisabled(element) && (isElementDisabled(element) || isAncestorDisabled(element));
}

/**
 * @description
 * Allows you to check whether an element is disabled from the user's perspective.
 *
 * Matches if the element is a form control and the `disabled` attribute is specified on this element or the
 * element is a descendant of a form element with a `disabled` attribute.
 * @example
 * <button
 *   data-testid="button"
 *   type="submit"
 *   disabled
 * >
 *   submit
 * </button>
 *
 * expect(getByTestId('button')).toBeDisabled()
 * @see
 * [testing-library/jest-dom#tobedisabled](https://github.com/testing-library/jest-dom#tobedisabled)
 */
export function toBeDisabled(this: MatcherState, element: Element): MatcherResult {
    checkHtmlElement(element, toBeDisabled, this);

    const isDisabled = isElementOrAncestorDisabled(element);

    return {
        pass: isDisabled,
        message: () => {
            const is = isDisabled ? "is" : "is not";
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeDisabled`, "element", ""),
                "",
                `Received element ${is} disabled:`,
                `  ${this.utils.printReceived(element.cloneNode(false))}`,
            ].join("\n");
        },
    };
}

/**
 * @description
 * Allows you to check whether an element is not disabled from the user's perspective.
 *
 * Works like `not.toBeDisabled()`.
 *
 * Use this matcher to avoid double negation in your tests.
 * @example
 * <button
 *   data-testid="button"
 *   type="submit"
 * >
 *   submit
 * </button>
 *
 * expect(getByTestId('button')).toBeEnabled()
 * @see
 * [testing-library/jest-dom#tobeenabled](https://github.com/testing-library/jest-dom#tobeenabled)
 */
export function toBeEnabled(this: MatcherState, element: Element): MatcherResult {
    checkHtmlElement(element, toBeEnabled, this);

    const isEnabled = !isElementOrAncestorDisabled(element);

    return {
        pass: isEnabled,
        message: () => {
            const is = isEnabled ? "is" : "is not";
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeEnabled`, "element", ""),
                "",
                `Received element ${is} enabled:`,
                `  ${this.utils.printReceived(element.cloneNode(false))}`,
            ].join("\n");
        },
    };
}
