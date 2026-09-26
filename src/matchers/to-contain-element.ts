import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils.js";

export function toContainElement(
    this: MatcherState,
    container: Element,
    element: HTMLElement | SVGElement | null,
): MatcherResult {
    checkHtmlElement(container, toContainElement, this);

    if (element !== null) {
        checkHtmlElement(element, toContainElement, this);
    }

    return {
        pass: container.contains(element),
        message: () => {
            return [
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toContainElement`, "element", "element"),
                "",
                this.utils.RECEIVED_COLOR(`${this.utils.stringify(container.cloneNode(false))} ${
                    this.isNot ? "contains:" : "does not contain:"
                } ${this.utils.stringify(element ? element.cloneNode(false) : element)}
        `),
            ].join("\n");
        },
    };
}
