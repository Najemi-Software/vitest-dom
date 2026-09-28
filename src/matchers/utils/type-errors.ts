import isFunction from "lodash-es/isFunction.js";

import { type IMatcherFn } from "../../types.js";
import type { MatcherState } from "../types.js";

import { printWithType as printWithTypeFn } from "./print-with-type.js";

class GenericTypeError<State extends MatcherState> extends Error {
    constructor(
        expectedString: string,
        received: Element | DocumentFragment | Text,
        matcherFn: IMatcherFn<State>,
        context: State,
    ) {
        super();

        const printWithType =
            "printWithType" in context.utils && isFunction(context.utils.printWithType)
                ? context.utils.printWithType
                : printWithTypeFn;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, matcherFn);
        }
        let withType = "";
        try {
            withType = printWithType("Received", received, context.utils.printReceived);
        } catch {
            // Can throw for Document:
            // https://github.com/jsdom/jsdom/issues/2304
        }
        this.message = [
            context.utils.matcherHint(`${context.isNot ? ".not" : ""}.${matcherFn.name}`, "received", ""),
            "",
            `${context.utils.RECEIVED_COLOR("received")} value must ${expectedString}.`,
            withType,
        ].join("\n");
    }
}

export class HtmlElementTypeError<State extends MatcherState> extends GenericTypeError<State> {
    constructor(element: Element | DocumentFragment | Text, matcherFn: IMatcherFn<State>, context: State) {
        super("be an HTMLElement or an SVGElement", element, matcherFn, context);
    }
}

export class NodeTypeError<State extends MatcherState> extends GenericTypeError<State> {
    constructor(element: Element | DocumentFragment | Text, matcherFn: IMatcherFn<State>, context: State) {
        super("be a Node", element, matcherFn, context);
    }
}
