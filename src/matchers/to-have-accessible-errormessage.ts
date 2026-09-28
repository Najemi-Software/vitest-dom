import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement } from "./utils/element-checks.js";
import { getMessage } from "./utils/messages.js";
import { normalize } from "./utils/text.js";

const ariaInvalidName = "aria-invalid";
const validStates = ["false"];

// See `aria-errormessage` spec at https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage
/**
 * This allows you to assert that an element has the expected
 * [accessible error message](https://w3c.github.io/aria/#aria-errormessage).
 *
 * You can pass the exact string of the expected accessible error message.
 * Alternatively, you can perform a partial match by passing a regular expression
 * or by using either
 * [expect.stringContaining](https://jestjs.io/docs/en/expect.html#expectnotstringcontainingstring)
 * or [expect.stringMatching](https://jestjs.io/docs/en/expect.html#expectstringmatchingstring-regexp).
 *
 * @example
 * ```html
 * <input aria-label="Has Error" aria-invalid="true" aria-errormessage="error-message" />
 * <div id="error-message" role="alert">This field is invalid</div>
 *
 * <input aria-label="No Error Attributes" />
 * <input aria-label="Not Invalid" aria-invalid="false" aria-errormessage="error-message" />
 * ```
 *
 * ```ts
 * // Inputs with Valid Error Messages
 * expect(getByRole('textbox', {name: 'Has Error'})).toHaveAccessibleErrorMessage()
 * expect(getByRole('textbox', {name: 'Has Error'})).toHaveAccessibleErrorMessage('This field is invalid')
 * expect(getByRole('textbox', {name: 'Has Error'})).toHaveAccessibleErrorMessage(/invalid/i)
 * expect(
 *   getByRole('textbox', {name: 'Has Error'}),
 * ).not.toHaveAccessibleErrorMessage('This field is absolutely correct!')
 *
 * // Inputs without Valid Error Messages
 * expect(
 *   getByRole('textbox', {name: 'No Error Attributes'}),
 * ).not.toHaveAccessibleErrorMessage()
 *
 * expect(
 *   getByRole('textbox', {name: 'Not Invalid'}),
 * ).not.toHaveAccessibleErrorMessage()
 * ```
 *
 * @see
 * [testing-library/jest-dom#tohaveaccessibleerrormessage](https://github.com/testing-library/jest-dom#tohaveaccessibleerrormessage)
 *
 * @public
 */
export function toHaveAccessibleErrorMessage<State extends MatcherState>(
    this: State,
    htmlElement: Element,
    expectedAccessibleErrorMessage?: string | RegExp | State,
): IMatcherResult {
    checkHtmlElement(htmlElement, toHaveAccessibleErrorMessage, this);
    const to = this.isNot ? "not to" : "to";
    const method = this.isNot ? ".not.toHaveAccessibleErrorMessage" : ".toHaveAccessibleErrorMessage";

    // Enforce Valid Id
    const errormessageId = htmlElement.getAttribute("aria-errormessage");
    const errormessageIdInvalid = !!errormessageId && /\s+/.test(errormessageId);

    if (errormessageIdInvalid) {
        return {
            pass: false,
            message: () => {
                return getMessage(
                    this,
                    this.utils.matcherHint(method, "element"),
                    "Expected element's `aria-errormessage` attribute to be empty or a single, valid ID",
                    "",
                    "Received",
                    `aria-errormessage="${errormessageId}"`,
                );
            },
        };
    }

    // See `aria-invalid` spec at https://www.w3.org/TR/wai-aria-1.2/#aria-invalid
    const ariaInvalidVal = htmlElement.getAttribute(ariaInvalidName);
    const fieldValid = !htmlElement.hasAttribute(ariaInvalidName) || validStates.includes(ariaInvalidVal!);

    // Enforce Valid `aria-invalid` Attribute
    if (fieldValid) {
        return {
            pass: false,
            message: () => {
                return getMessage(
                    this,
                    this.utils.matcherHint(method, "element"),
                    "Expected element to be marked as invalid with attribute",
                    `${ariaInvalidName}="${String(true)}"`,
                    "Received",
                    htmlElement.hasAttribute("aria-invalid")
                        ? `${ariaInvalidName}="${htmlElement.getAttribute(ariaInvalidName)}`
                        : null,
                );
            },
        };
    }

    const error = normalize(
        errormessageId == null
            ? ""
            : (htmlElement.ownerDocument.getElementById(errormessageId)?.textContent ?? ""),
    );

    return {
        pass:
            expectedAccessibleErrorMessage === undefined
                ? Boolean(error)
                : expectedAccessibleErrorMessage instanceof RegExp
                  ? expectedAccessibleErrorMessage.test(error)
                  : this.equals(error, expectedAccessibleErrorMessage),

        message: () => {
            return getMessage(
                this,
                this.utils.matcherHint(method, "element"),
                `Expected element ${to} have accessible error message`,
                expectedAccessibleErrorMessage ?? "",
                "Received",
                error,
            );
        },
    };
}
