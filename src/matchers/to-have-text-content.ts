import type { IMatcherResult, MatcherState } from "./types.js";
import { checkNode } from "./utils/element-checks.js";
import { getMessage } from "./utils/messages.js";
import { matches, normalize } from "./utils/text.js";

/**
 * Check whether the given element has a text content or not.
 *
 * When a string argument is passed through, it will perform a partial case-sensitive match to the element
 * content.
 *
 * To perform a case-insensitive match, you can use a RegExp with the `/i` modifier.
 *
 * If you want to match the whole content, you can use a RegExp to do it.
 * @example
 * <span data-testid="text-content">Text Content</span>
 *
 * const element = getByTestId('text-content')
 * expect(element).toHaveTextContent('Content')
 * // to match the whole content
 * expect(element).toHaveTextContent(/^Text Content$/)
 * // to use case-insentive match
 * expect(element).toHaveTextContent(/content$/i)
 * expect(element).not.toHaveTextContent('content')
 * @see
 * [testing-library/jest-dom#tohavetextcontent](https://github.com/testing-library/jest-dom#tohavetextcontent)
 *
 * @public
 */
export function toHaveTextContent(
    this: MatcherState,
    node: Element,
    checkWith: string | RegExp,
    options: { normalizeWhitespace: boolean } = { normalizeWhitespace: true },
): IMatcherResult {
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
