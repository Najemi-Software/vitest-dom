import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, getMessage } from "./utils.js";

export function toHaveDisplayValue(
    this: MatcherState,
    htmlElement: Element,
    expectedValue: string | RegExp | Array<string | RegExp>,
): MatcherResult {
    checkHtmlElement(htmlElement, toHaveDisplayValue, this);
    const tagName = htmlElement.tagName.toLowerCase();

    if (!["select", "input", "textarea"].includes(tagName)) {
        throw new Error(
            ".toHaveDisplayValue() currently supports only input, textarea or select elements, try with another matcher instead.",
        );
    }

    if (tagName === "input" && ["radio", "checkbox"].includes((htmlElement as HTMLInputElement).type)) {
        throw new Error(
            `.toHaveDisplayValue() currently does not support input[type="${(htmlElement as HTMLInputElement).type}"], try with another matcher instead.`,
        );
    }

    const values = getValues(tagName, htmlElement);
    const expectedValues = getExpectedValues(expectedValue);
    const numberOfMatchesWithValues = expectedValues.filter((expected) =>
        values.some((value) =>
            expected instanceof RegExp ? expected.test(value) : this.equals(value, String(expected)),
        ),
    ).length;

    const matchedWithAllValues = numberOfMatchesWithValues === values.length;
    const matchedWithAllExpectedValues = numberOfMatchesWithValues === expectedValues.length;

    return {
        pass: matchedWithAllValues && matchedWithAllExpectedValues,
        message: () =>
            getMessage(
                this,
                this.utils.matcherHint(`${this.isNot ? ".not" : ""}.toHaveDisplayValue`, "element", ""),
                `Expected element ${this.isNot ? "not " : ""}to have display value`,
                expectedValue,
                "Received",
                values,
            ),
    };
}

function getValues(tagName: string, htmlElement: Element): string[] {
    return tagName === "select"
        ? Array.from((htmlElement as HTMLSelectElement).options)
              .filter((option) => option.selected)
              .map((option) => option.textContent ?? "")
        : [(htmlElement as HTMLInputElement | HTMLTextAreaElement).value];
}

function getExpectedValues(expectedValue: string | RegExp | Array<string | RegExp>): Array<string | RegExp> {
    return expectedValue instanceof Array ? expectedValue : [expectedValue];
}
