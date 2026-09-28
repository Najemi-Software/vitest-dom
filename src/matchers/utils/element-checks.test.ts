// @vitest-environment happy-dom

import { beforeAll, describe, expect, it } from "vitest";

import type { IMatcherFn } from "../../types.js";
import type { MatcherState } from "../types.js";

import { checkHtmlElement, checkNode } from "./element-checks.js";
import { HtmlElementTypeError, NodeTypeError } from "./type-errors.js";

const noopMatcher: IMatcherFn<MatcherState> = () => ({ pass: true, message: () => "" });

describe("checkHtmlElement", () => {
    let assertionContext: MatcherState;
    beforeAll(() => {
        expect.extend({
            fakeMatcher() {
                assertionContext = { ...this };

                return { pass: true, message: () => "" };
            },
        });

        // TODO: Remove the '@ts-expect-error' directive once the matcher context can be captured through a typed matcher
        // @ts-expect-error fakeMatcher is registered above via expect.extend() for this test only, so it is not part of vitest's typed matchers

        // Not an assertion — invokes fakeMatcher to capture its MatcherState
        // oxlint-disable-next-line vitest/no-standalone-expect
        expect(true).fakeMatcher(true);
    });
    it("does not throw an error for correct html element", () => {
        expect(() => {
            const element = document.createElement("p");
            checkHtmlElement(element, noopMatcher, assertionContext);
        }).not.toThrow();
    });

    it("does not throw an error for correct svg element", () => {
        expect(() => {
            const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            checkHtmlElement(element, noopMatcher, assertionContext);
        }).not.toThrow();
    });

    it("does not throw for body", () => {
        expect(() => {
            checkHtmlElement(document.body, noopMatcher, assertionContext);
        }).not.toThrow();
    });

    it("throws for undefined", () => {
        expect(() => {
            // @ts-expect-error: testing a non-element argument
            checkHtmlElement(undefined, noopMatcher, assertionContext);
        }).toThrow(HtmlElementTypeError);
    });

    it("throws for document", () => {
        expect(() => {
            // @ts-expect-error: testing a non-element argument
            checkHtmlElement(document, noopMatcher, assertionContext);
        }).toThrow(HtmlElementTypeError);
    });

    it("throws for function", () => {
        expect(() => {
            // @ts-expect-error: testing a non-element argument
            checkHtmlElement(() => {}, noopMatcher, assertionContext);
        }).toThrow(HtmlElementTypeError);
    });

    it("throws for almost element-like objects", () => {
        class FakeObject {}
        expect(() => {
            checkHtmlElement(
                {
                    ownerDocument: {
                        // @ts-expect-error: testing a non-element argument
                        defaultView: { HTMLElement: FakeObject, SVGElement: FakeObject },
                    },
                },
                noopMatcher,
                assertionContext,
            );
        }).toThrow(HtmlElementTypeError);
    });
});

describe("checkNode", () => {
    let assertionContext: MatcherState;
    beforeAll(() => {
        expect.extend({
            fakeMatcher() {
                assertionContext = { ...this };

                return { pass: true, message: () => "" };
            },
        });

        // TODO: Remove the '@ts-expect-error' directive once the matcher context can be captured through a typed matcher
        // @ts-expect-error fakeMatcher is registered above via expect.extend() for this test only, so it is not part of vitest's typed matchers

        // Not an assertion — invokes fakeMatcher to capture its MatcherState
        // oxlint-disable-next-line vitest/no-standalone-expect
        expect(true).fakeMatcher(true);
    });
    it("does not throw an error for correct html element", () => {
        expect(() => {
            const element = document.createElement("p");
            checkNode(element, noopMatcher, assertionContext);
        }).not.toThrow();
    });

    it("does not throw an error for correct svg element", () => {
        expect(() => {
            const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            checkNode(element, noopMatcher, assertionContext);
        }).not.toThrow();
    });

    it("does not throw an error for Document fragments", () => {
        expect(() => {
            const fragment = document.createDocumentFragment();
            checkNode(fragment, noopMatcher, assertionContext);
        }).not.toThrow();
    });

    it("does not throw an error for text nodes", () => {
        expect(() => {
            const text = document.createTextNode("foo");
            checkNode(text, noopMatcher, assertionContext);
        }).not.toThrow();
    });

    it("does not throw for body", () => {
        expect(() => {
            checkNode(document.body, noopMatcher, assertionContext);
        }).not.toThrow();
    });

    it("throws for undefined", () => {
        expect(() => {
            // @ts-expect-error: testing a non-node argument
            checkNode(undefined, noopMatcher, assertionContext);
        }).toThrow(NodeTypeError);
    });

    it("throws for document", () => {
        expect(() => {
            // @ts-expect-error: testing a non-element argument
            checkNode(document, noopMatcher, assertionContext);
        }).toThrow(NodeTypeError);
    });

    it("throws for function", () => {
        expect(() => {
            // @ts-expect-error: testing a non-node argument
            checkNode(() => {}, noopMatcher, assertionContext);
        }).toThrow(NodeTypeError);
    });

    it("throws for almost element-like objects", () => {
        class FakeObject {}
        expect(() => {
            checkNode(
                {
                    ownerDocument: {
                        // @ts-expect-error: testing a non-node argument
                        defaultView: { Node: FakeObject, SVGElement: FakeObject },
                    },
                },
                noopMatcher,
                assertionContext,
            );
        }).toThrow(NodeTypeError);
    });
});
