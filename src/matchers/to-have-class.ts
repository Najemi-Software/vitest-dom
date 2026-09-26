import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, getMessage } from "./utils.js";

interface ToHaveClassOptions {
    exact: boolean;
}

function getExpectedClassNamesAndOptions(params: Array<string | ToHaveClassOptions>) {
    const lastParam = params.pop();
    let expectedClassNames: Array<string | undefined>, options: ToHaveClassOptions;

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

export function toHaveClass(this: MatcherState, htmlElement: Element, ...params: string[]): MatcherResult {
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
