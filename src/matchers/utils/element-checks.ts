import { type IMatcherFn } from "../../types.js";
import type { MatcherState } from "../types.js";

import { HtmlElementTypeError, NodeTypeError } from "./type-errors.js";

type ElementWithWindow = HTMLElement & {
    ownerDocument: Document & { defaultView: Window };
};

function checkHasWindow<State extends MatcherState>(
    htmlElement: Element | DocumentFragment | Text,
    ErrorClass: typeof HtmlElementTypeError<State> | typeof NodeTypeError<State>,
    matcherFn: IMatcherFn<State>,
    context: State,
): asserts htmlElement is ElementWithWindow {
    if (!(htmlElement as Element | null | undefined)?.ownerDocument?.defaultView) {
        throw new ErrorClass(htmlElement, matcherFn, context);
    }
}

export function checkNode<State extends MatcherState>(
    node: Element | DocumentFragment | Text,
    matcherFn: IMatcherFn<State>,
    context: State,
): asserts node is ElementWithWindow {
    checkHasWindow(node, NodeTypeError, matcherFn, context);
    const window = node.ownerDocument.defaultView;
    if (!(node instanceof window!.Node)) {
        throw new NodeTypeError(node, matcherFn, context);
    }
}

export function checkHtmlElement<State extends MatcherState>(
    htmlElement: Element | DocumentFragment | Text,
    matcher: IMatcherFn<State>,
    context: State,
): asserts htmlElement is ElementWithWindow {
    checkHasWindow(htmlElement, HtmlElementTypeError, matcher, context);
    const window = htmlElement.ownerDocument.defaultView;

    if (
        !(htmlElement instanceof window.HTMLElement) &&
        // @ts-expect-error htmlElement is narrowed to `never` here, but it may be an SVGElement at runtime
        !(htmlElement instanceof window.SVGElement)
    ) {
        throw new HtmlElementTypeError(htmlElement, matcher, context);
    }
}
