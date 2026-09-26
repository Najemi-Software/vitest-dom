import type { MatcherResult, MatcherState } from "./types.js";
import { getMessage, checkNode, matches, normalize } from "./utils.js";

export function toHaveTextContent(
    this: MatcherState,
    node: Element,
    checkWith: string | RegExp,
    options: { normalizeWhitespace: boolean } = { normalizeWhitespace: true },
): MatcherResult {
    checkNode(node, toHaveTextContent, this);

    const textContent = options.normalizeWhitespace
        ? normalize(node.textContent)
        : node.textContent.replace(/\u00a0/g, " "); // Replace &nbsp; with normal spaces

    const checkingWithEmptyString = textContent !== "" && checkWith === "";

    return {
        pass: !checkingWithEmptyString && matches(textContent, checkWith),
        message: () => {
            const to = this.isNot ? "not to" : "to";
            return getMessage(
                this,
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toHaveTextContent`, "element", ""),
                checkingWithEmptyString
                    ? `Checking with empty string will always match, use .toBeEmptyDOMElement() instead`
                    : `Expected element ${to} have text content`,
                checkWith,
                "Received",
                textContent,
            );
        },
    };
}
