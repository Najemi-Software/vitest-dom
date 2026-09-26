import type { MatcherResult, MatcherState } from "./types.js";
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

export function toBeVisible(this: MatcherState, element: Element): MatcherResult {
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
