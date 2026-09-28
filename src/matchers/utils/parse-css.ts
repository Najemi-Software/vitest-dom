import { cssParse } from "../../css-parse/css-parse.js";
import type { IDeclaration, IRule } from "../../css-parse/nodes.js";
import { type IMatcherFn } from "../../types.js";
import type { MatcherState } from "../types.js";

import { isNonEmptyArray } from "./arrays.js";

class InvalidCSSError<State extends MatcherState> extends Error {
    constructor(
        received: {
            message: string;
            css: string;
        },
        matcherFn: IMatcherFn<State>,
        context: State,
    ) {
        super();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, matcherFn);
        }
        this.message = [
            received.message,
            "",
            context.utils.RECEIVED_COLOR(`Failing css:`),
            context.utils.RECEIVED_COLOR(`${received.css}`),
        ].join("\n");
    }
}

export function parseCSS<State extends MatcherState>(
    css: string,
    matcherFn: IMatcherFn<State>,
    context: State,
) {
    const ast = cssParse(`selector { ${css} }`, { silent: true }).stylesheet;

    if (isNonEmptyArray(ast.parsingErrors)) {
        const { reason, line } = ast.parsingErrors[0];

        throw new InvalidCSSError(
            {
                css,
                message: `Syntax error parsing expected css: ${reason} on line: ${line}`,
            },
            matcherFn,
            context,
        );
    }

    // The parsed css is always a single `selector { ... }` rule.
    return ((ast.rules[0] as IRule).declarations ?? [])
        .filter((d): d is IDeclaration => d.type === "declaration")
        .reduce<Record<string, string>>(
            (obj, { property, value }) => Object.assign(obj, { [property]: value }),
            {},
        );
}
