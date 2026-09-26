import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

export function toBeEmptyDOMElement(this: MatcherState, element: Element): MatcherResult {
    checkHtmlElement(element, toBeEmptyDOMElement, this);

    return {
        pass: isEmptyElement(element),
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toBeEmptyDOMElement`, "element", ""),
                "",
                "Received:",
                `  ${this.utils.printReceived(element.innerHTML)}`,
            ].join("\n");
        },
    };
}

/**
 * Identifies if an element doesn't contain child nodes (excluding comments)
 * ℹ The literal 8 is Node.COMMENT_NODE. It is used directly instead of the
 * Node constant so the matcher doesn't depend on a global Node existing in
 * the consumer's test environment (this project tests with happy-dom, but
 * consumers may run any environment; historically this guarded against
 * https://github.com/jsdom/jsdom/issues/2220 under jsdom).
 *
 * @param {*} element an HtmlElement or SVGElement
 * @return {*} true if the element only contains comments or none
 */
function isEmptyElement(element: Element) {
    const nonCommentChildNodes = Array.from(element.childNodes).filter((node) => node.nodeType !== 8);
    return nonCommentChildNodes.length === 0;
}
