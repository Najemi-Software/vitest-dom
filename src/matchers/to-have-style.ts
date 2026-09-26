import chalk from "chalk";

import type { MatcherResult, MatcherState } from "./types.js";
import { checkHtmlElement, parseCSS } from "./utils.js";

type Styles = Record<string, unknown>;

// CSSStyleDeclaration is only typed for known properties; styles are looked up
// by arbitrary (camelCase, custom or unknown) names, so view it as a record.
function asRecord(style: CSSStyleDeclaration): Styles {
    return style as unknown as Styles;
}

function getStyleDeclaration(document: Document, css: Styles) {
    const styles: Styles = {};

    // The next block is necessary to normalize colors
    const copy = document.createElement("div");
    const copyStyle = asRecord(copy.style);
    Object.keys(css).forEach((property) => {
        copyStyle[property] = css[property];
        // Number values default to px. jsdom's CSSOM did this coercion
        // itself; happy-dom rejects bare numbers, so retry with px appended.
        if (copyStyle[property] === "" && typeof css[property] === "number") {
            copyStyle[property] = `${css[property]}px`;
        }
        // Fall back to the raw value for properties the style declaration
        // swallows instead of echoing back (happy-dom does this for unknown
        // and custom properties); otherwise expected `undefined` would
        // spuriously match any element missing that property.
        styles[property] = copyStyle[property] || css[property];
    });

    return styles;
}

function isSubset(styles: Styles, computedStyle: CSSStyleDeclaration) {
    return (
        !!Object.keys(styles).length &&
        Object.entries(styles).every(
            ([prop, value]) =>
                asRecord(computedStyle)[prop] === value ||
                computedStyle.getPropertyValue(prop.toLowerCase()) === value,
        )
    );
}

function printoutStyles(styles: Styles) {
    return Object.keys(styles)
        .sort()
        .map((prop) => `${prop}: ${styles[prop]};`)
        .join("\n");
}

// Highlights only style rules that were expected but were not found in the
// received computed styles
function expectedDiff(
    diffFn: MatcherState["utils"]["diff"],
    expected: Styles,
    computedStyles: CSSStyleDeclaration,
) {
    const received = Array.from(computedStyles)
        .filter((prop) => expected[prop] !== undefined)
        .reduce<Styles>(
            (obj, prop) => Object.assign(obj, { [prop]: computedStyles.getPropertyValue(prop) }),
            {},
        );
    const diffOutput = diffFn(printoutStyles(expected), printoutStyles(received));
    // Remove the "+ Received" annotation because this is a one-way diff
    return (diffOutput ?? "").replace(`${chalk.red("+ Received")}\n`, "");
}

export function toHaveStyle(
    this: MatcherState,
    htmlElement: Element,
    css: string | Record<string, unknown>,
): MatcherResult {
    checkHtmlElement(htmlElement, toHaveStyle, this);
    const parsedCSS = typeof css === "object" ? css : parseCSS(css, toHaveStyle, this);
    const { getComputedStyle } = htmlElement.ownerDocument.defaultView;

    const expected = getStyleDeclaration(htmlElement.ownerDocument, parsedCSS);
    const received = getComputedStyle(htmlElement);

    return {
        pass: isSubset(expected, received),
        message: () => {
            const matcher = `${this.isNot ? ".not" : ""}.toHaveStyle`;
            return [
                this.utils.matcherHint(matcher, "element", ""),
                expectedDiff(this.utils.diff, expected, received),
            ].join("\n\n");
        },
    };
}
