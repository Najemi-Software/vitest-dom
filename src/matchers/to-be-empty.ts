import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, deprecate } from "./utils.js";

/** @deprecated */
export function toBeEmpty(this: MatcherState, element: Element): MatcherResult {
    deprecate("toBeEmpty", "Please use instead toBeEmptyDOMElement for finding empty nodes in the DOM.");
    checkHtmlElement(element, toBeEmpty, this);

    return {
        pass: element.innerHTML === "",
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeEmpty`, "element", ""),
                "",
                "Received:",
                `  ${this.utils.printReceived(element.innerHTML)}`,
            ].join("\n");
        },
    };
}
