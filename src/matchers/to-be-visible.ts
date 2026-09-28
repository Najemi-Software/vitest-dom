import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

function isStyleVisible(element: Element) {
    const { getComputedStyle } = element.ownerDocument.defaultView!;

    const { display, visibility, opacity } = getComputedStyle(element);
    return display !== "none" && visibility !== "hidden" && visibility !== "collapse" && opacity !== "0";
}

function isAttributeVisible(element: Element, previousElement?: Element) {
    let detailsVisibility: boolean;

    if (previousElement) {
        detailsVisibility =
            element.nodeName === "DETAILS" && previousElement.nodeName !== "SUMMARY"
                ? element.hasAttribute("open")
                : true;
    } else {
        detailsVisibility = element.nodeName === "DETAILS" ? element.hasAttribute("open") : true;
    }

    return !element.hasAttribute("hidden") && detailsVisibility;
}

function isElementVisible(element: Element, previousElement?: Element): boolean {
    return (
        isStyleVisible(element) &&
        isAttributeVisible(element, previousElement) &&
        (!element.parentElement || isElementVisible(element.parentElement, element))
    );
}

/**
 * This allows you to check if an element is currently visible to the user.
 *
 * An element is visible if **all** the following conditions are met:
 * * it does not have its css property display set to none
 * * it does not have its css property visibility set to either hidden or collapse
 * * it does not have its css property opacity set to 0
 * * its parent element is also visible (and so on up to the top of the DOM tree)
 * * it does not have the hidden attribute
 * * if `<details />` it has the open attribute
 * @example
 * <div
 *   data-testid="zero-opacity"
 *   style="opacity: 0"
 * >
 *   Zero Opacity
 * </div>
 *
 * <div data-testid="visible">Visible Example</div>
 *
 * expect(getByTestId('zero-opacity')).not.toBeVisible()
 * expect(getByTestId('visible')).toBeVisible()
 * @see
 * [testing-library/jest-dom#tobevisible](https://github.com/testing-library/jest-dom#tobevisible)
 *
 * @public
 */
export function toBeVisible(this: MatcherState, element: Element): IMatcherResult {
    checkHtmlElement(element, toBeVisible, this);
    const isInDocument = element.ownerDocument === element.getRootNode({ composed: true });
    const isVisible = isInDocument && isElementVisible(element);
    return {
        pass: isVisible,
        message: () => {
            const is = isVisible ? "is" : "is not";
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeVisible`, "element", ""),
                "",
                `Received element ${is} visible${isInDocument ? "" : " (element is not in the document)"}:`,
                `  ${this.utils.printReceived(element.cloneNode(false))}`,
            ].join("\n");
        },
    };
}
