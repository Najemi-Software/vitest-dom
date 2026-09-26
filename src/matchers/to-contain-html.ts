import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

function getNormalizedHtml(container: Element, htmlText: string) {
    const div = container.ownerDocument.createElement("div");
    div.innerHTML = htmlText;
    return div.innerHTML;
}

export function toContainHTML(this: MatcherState, container: Element, htmlText: string): MatcherResult {
    checkHtmlElement(container, toContainHTML, this);

    if (typeof htmlText !== "string") {
        throw new Error(`.toContainHTML() expects a string value, got ${htmlText}`);
    }

    return {
        pass: container.outerHTML.includes(getNormalizedHtml(container, htmlText)),
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toContainHTML`, "element", ""),
                "Expected:",
                `  ${this.utils.EXPECTED_COLOR(htmlText)}`,
                "Received:",
                `  ${this.utils.printReceived(container.cloneNode(true))}`,
            ].join("\n");
        },
    };
}
