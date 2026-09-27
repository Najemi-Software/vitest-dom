import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, getMessage } from "./utils.js";

/**
 * @description
 * This allows you to check whether the given form element has the specified displayed value (the one the
 * end user will see). It accepts <input>, <select> and <textarea> elements with the exception of <input type="checkbox">
 * and <input type="radio">, which can be meaningfully matched only using toBeChecked or toHaveFormValues.
 * @example
 * <label for="input-example">First name</label>
 * <input type="text" id="input-example" value="Luca" />
 *
 * <label for="textarea-example">Description</label>
 * <textarea id="textarea-example">An example description here.</textarea>
 *
 * <label for="single-select-example">Fruit</label>
 * <select id="single-select-example">
 *   <option value="">Select a fruit...</option>
 *   <option value="banana">Banana</option>
 *   <option value="ananas">Ananas</option>
 *   <option value="avocado">Avocado</option>
 * </select>
 *
 * <label for="mutiple-select-example">Fruits</label>
 * <select id="multiple-select-example" multiple>
 *   <option value="">Select a fruit...</option>
 *   <option value="banana" selected>Banana</option>
 *   <option value="ananas">Ananas</option>
 *   <option value="avocado" selected>Avocado</option>
 * </select>
 *
 * const input = screen.getByLabelText('First name')
 * const textarea = screen.getByLabelText('Description')
 * const selectSingle = screen.getByLabelText('Fruit')
 * const selectMultiple = screen.getByLabelText('Fruits')
 *
 * expect(input).toHaveDisplayValue('Luca')
 * expect(textarea).toHaveDisplayValue('An example description here.')
 * expect(selectSingle).toHaveDisplayValue('Select a fruit...')
 * expect(selectMultiple).toHaveDisplayValue(['Banana', 'Avocado'])
 *
 * @see
 * [testing-library/jest-dom#tohavedisplayvalue](https://github.com/testing-library/jest-dom#tohavedisplayvalue)
 */
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
