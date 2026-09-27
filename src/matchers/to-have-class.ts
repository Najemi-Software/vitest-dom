import type { IMatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, getMessage } from "./utils.js";

interface IToHaveClassOptions {
    exact: boolean;
}

function getExpectedClassNamesAndOptions(params: Array<string | IToHaveClassOptions | undefined>) {
    const lastParam = params.pop();
    let expectedClassNames: Array<string | undefined>, options: IToHaveClassOptions;

    if (typeof lastParam === "object") {
        expectedClassNames = params as string[];
        options = lastParam;
    } else {
        expectedClassNames = (params as string[]).concat(lastParam as string);
        options = { exact: false };
    }
    return { expectedClassNames, options };
}

function splitClassNames(str: string | null | undefined): string[] {
    if (!str) {
        return [];
    }
    return str.split(/\s+/).filter((s) => s.length > 0);
}

function isSubset(subset: string[], superset: string[]) {
    return subset.every((item) => superset.includes(item));
}

/**
 * @description
 * Check whether the given element has certain classes within its `class` attribute.
 *
 * You must provide at least one class, unless you are asserting that an element does not have any classes.
 * @example
 * <button
 *   data-testid="delete-button"
 *   class="btn xs btn-danger"
 * >
 *   delete item
 * </button>
 *
 * <div data-testid="no-classes">no classes</div>
 *
 * const deleteButton = getByTestId('delete-button')
 * const noClasses = getByTestId('no-classes')
 * expect(deleteButton).toHaveClass('btn')
 * expect(deleteButton).toHaveClass('btn-danger xs')
 * expect(deleteButton).toHaveClass('btn xs btn-danger', {exact: true})
 * expect(deleteButton).not.toHaveClass('btn xs btn-danger', {exact: true})
 * expect(noClasses).not.toHaveClass()
 * @see
 * [testing-library/jest-dom#tohaveclass](https://github.com/testing-library/jest-dom#tohaveclass)
 */
export function toHaveClass(
    this: MatcherState,
    htmlElement: Element,
    ...params:
        | string[]
        | [classNames: string, options?: IToHaveClassOptions]
        | [...classNames: string[], options: IToHaveClassOptions]
): IMatcherResult {
    checkHtmlElement(htmlElement, toHaveClass, this);
    const { expectedClassNames, options } = getExpectedClassNamesAndOptions(params);

    const received = splitClassNames(htmlElement.getAttribute("class"));
    const expected = expectedClassNames.reduce(
        (acc: string[], className) => acc.concat(splitClassNames(className)),
        [],
    );

    if (options.exact) {
        return {
            pass: isSubset(expected, received) && expected.length === received.length,
            message: () => {
                const to = this.isNot ? "not to" : "to";
                return getMessage(
                    this,
                    this.utils.matcherHint(
                        `${this.isNot ? ".not" : ""}.toHaveClass`,
                        "element",
                        this.utils.printExpected(expected.join(" ")),
                    ),
                    `Expected the element ${to} have EXACTLY defined classes`,
                    expected.join(" "),
                    "Received",
                    received.join(" "),
                );
            },
        };
    }

    return expected.length > 0
        ? {
              pass: isSubset(expected, received),
              message: () => {
                  const to = this.isNot ? "not to" : "to";
                  return getMessage(
                      this,
                      this.utils.matcherHint(
                          `${this.isNot ? ".not" : ""}.toHaveClass`,
                          "element",
                          this.utils.printExpected(expected.join(" ")),
                      ),
                      `Expected the element ${to} have class`,
                      expected.join(" "),
                      "Received",
                      received.join(" "),
                  );
              },
          }
        : {
              pass: this.isNot ? received.length > 0 : false,
              message: () =>
                  this.isNot
                      ? getMessage(
                            this,
                            this.utils.matcherHint(".not.toHaveClass", "element", ""),
                            "Expected the element to have classes",
                            "(none)",
                            "Received",
                            received.join(" "),
                        )
                      : [
                            this.utils.matcherHint(`.toHaveClass`, "element"),
                            "At least one expected class must be provided.",
                        ].join("\n"),
          };
}
