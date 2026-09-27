import type { expect } from "vitest";

import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, deprecate, getMessage, normalize } from "./utils.js";

// See algoritm: https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_description
/**
 * @deprecated
 * since v5.14.1
 * @description
 * Check the accessible description for an element.
 * This allows you to check whether the given element has a description or not.
 *
 * An element gets its description via the
 * [`aria-describedby` attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute).
 * Set this to the `id` of one or more other elements. These elements may be nested
 * inside, be outside, or a sibling of the passed in element.
 *
 * Whitespace is normalized. Using multiple ids will
 * [join the referenced elements’ text content separated by a space](https://www.w3.org/TR/accname-1.1/#mapping_additional_nd_description).
 *
 * When a `string` argument is passed through, it will perform a whole
 * case-sensitive match to the description text.
 *
 * To perform a case-insensitive match, you can use a `RegExp` with the `/i`
 * modifier.
 *
 * To perform a partial match, you can pass a `RegExp` or use
 * `expect.stringContaining("partial string")`.
 *
 * @example
 * <button aria-label="Close" aria-describedby="description-close">
 *   X
 * </button>
 * <div id="description-close">
 *   Closing will discard any changes
 * </div>
 *
 * <button>Delete</button>
 *
 * const closeButton = getByRole('button', {name: 'Close'})
 *
 * expect(closeButton).toHaveDescription('Closing will discard any changes')
 * expect(closeButton).toHaveDescription(/will discard/) // to partially match
 * expect(closeButton).toHaveDescription(expect.stringContaining('will discard')) // to partially match
 * expect(closeButton).toHaveDescription(/^closing/i) // to use case-insensitive match
 * expect(closeButton).not.toHaveDescription('Other description')
 *
 * const deleteButton = getByRole('button', {name: 'Delete'})
 * expect(deleteButton).not.toHaveDescription()
 * expect(deleteButton).toHaveDescription('') // Missing or empty description always becomes a blank string
 * @see
 * [testing-library/jest-dom#tohavedescription](https://github.com/testing-library/jest-dom#tohavedescription)
 */
export function toHaveDescription(
    this: MatcherState,
    htmlElement: Element,
    checkWith?: string | RegExp | typeof expect.stringContaining,
): IMatcherResult {
    deprecate("toHaveDescription", "Please use toHaveAccessibleDescription.");

    checkHtmlElement(htmlElement, toHaveDescription, this);

    const expectsDescription = checkWith !== undefined;

    const descriptionIDRaw = htmlElement.getAttribute("aria-describedby") || "";
    const descriptionIDs = descriptionIDRaw.split(/\s+/).filter(Boolean);
    let description = "";
    if (descriptionIDs.length > 0) {
        const document = htmlElement.ownerDocument;
        const descriptionEls = descriptionIDs
            .map((descriptionID) => document.getElementById(descriptionID))
            .filter((el): el is HTMLElement => el !== null);
        description = normalize(descriptionEls.map((el) => el.textContent).join(" "));
    }

    return {
        pass: expectsDescription
            ? checkWith instanceof RegExp
                ? checkWith.test(description)
                : this.equals(description, checkWith)
            : Boolean(description),
        message: () => {
            const to = this.isNot ? "not to" : "to";
            return getMessage(
                this,
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toHaveDescription`, "element", ""),
                `Expected the element ${to} have description`,
                this.utils.printExpected(checkWith),
                "Received",
                this.utils.printReceived(description),
            );
        },
    };
}
