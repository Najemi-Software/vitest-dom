import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, getMessage } from "./utils.js";

function printAttribute(stringify: (value: unknown) => string, name: string, value: unknown) {
    return value === undefined ? name : `${name}=${stringify(value)}`;
}

function getAttributeComment(stringify: (value: unknown) => string, name: string, value: unknown) {
    return value === undefined
        ? `element.hasAttribute(${stringify(name)})`
        : `element.getAttribute(${stringify(name)}) === ${stringify(value)}`;
}

export function toHaveAttribute(
    this: MatcherState,
    htmlElement: Element,
    name: string,
    expectedValue?: unknown,
): MatcherResult {
    checkHtmlElement(htmlElement, toHaveAttribute, this);
    const isExpectedValuePresent = expectedValue !== undefined;
    const hasAttribute = htmlElement.hasAttribute(name);
    const receivedValue = htmlElement.getAttribute(name);
    return {
        pass: isExpectedValuePresent
            ? hasAttribute && this.equals(receivedValue, expectedValue)
            : hasAttribute,
        message: () => {
            const to = this.isNot ? "not to" : "to";
            const receivedAttribute = hasAttribute
                ? printAttribute(this.utils.stringify, name, receivedValue)
                : null;
            const matcher = this.utils.matcherHint(
                `${this.isNot ? ".not" : ""}.toHaveAttribute`,
                "element",
                this.utils.printExpected(name),
                {
                    secondArgument: isExpectedValuePresent
                        ? this.utils.printExpected(expectedValue)
                        : undefined,
                    comment: getAttributeComment(this.utils.stringify, name, expectedValue),
                },
            );
            return getMessage(
                this,
                matcher,
                `Expected the element ${to} have attribute`,
                printAttribute(this.utils.stringify, name, expectedValue),
                "Received",
                receivedAttribute,
            );
        },
    };
}
