import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

export function toHaveFocus(this: MatcherState, element: Element): MatcherResult {
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
