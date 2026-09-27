// @vitest-environment happy-dom

import { expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toBeEmptyDOMElement } from "./to-be-empty-dom-element.js";

expect.extend({ toBeEmptyDOMElement });

it(".toBeEmptyDOMElement", () => {
    const { queryByTestId } = render(`
    <span data-testid="not-empty">
        <span data-testid="empty"></span>
        <svg data-testid="svg-empty"></svg>
    </span>
    <span data-testid="with-comment"><!-- This Comment --></span>
    <span data-testid="with-multiple-comments"><!-- Comment1 --><!-- Comment2 --></span>
    <span data-testid="with-element"><span></span></span>
    <span data-testid="with-element-and-comment"><!--Comment--><span></span></span>
    <span data-testid="with-whitespace"> </span>
    <span data-testid="with-text">Text</span>`);

    const empty = queryByTestId("empty");
    const notEmpty = queryByTestId("not-empty");
    const svgEmpty = queryByTestId("svg-empty");
    const withComment = queryByTestId("with-comment");
    const withMultipleComments = queryByTestId("with-multiple-comments");
    const withElement = queryByTestId("with-element");
    const withElementAndComment = queryByTestId("with-element-and-comment");
    const withWhitespace = queryByTestId("with-whitespace");
    const withText = queryByTestId("with-whitespace");
    const nonExistantElement = queryByTestId("not-exists");
    const fakeElement = { thisIsNot: "an html element" };

    expect(empty).toBeEmptyDOMElement();
    expect(svgEmpty).toBeEmptyDOMElement();
    expect(notEmpty).not.toBeEmptyDOMElement();
    expect(withComment).toBeEmptyDOMElement();
    expect(withMultipleComments).toBeEmptyDOMElement();
    expect(withElement).not.toBeEmptyDOMElement();
    expect(withElementAndComment).not.toBeEmptyDOMElement();
    expect(withWhitespace).not.toBeEmptyDOMElement();
    expect(withText).not.toBeEmptyDOMElement();

    // negative test cases wrapped in throwError assertions for coverage.
    expect(() => expect(empty).not.toBeEmptyDOMElement()).toThrow(
        "expect(element).not.toBeEmptyDOMElement()",
    );

    expect(() => expect(svgEmpty).not.toBeEmptyDOMElement()).toThrow(
        "expect(element).not.toBeEmptyDOMElement()",
    );

    expect(() => expect(notEmpty).toBeEmptyDOMElement()).toThrow("expect(element).toBeEmptyDOMElement()");

    expect(() => expect(withComment).not.toBeEmptyDOMElement()).toThrow(
        "expect(element).not.toBeEmptyDOMElement()",
    );

    expect(() => expect(withMultipleComments).not.toBeEmptyDOMElement()).toThrow(
        "expect(element).not.toBeEmptyDOMElement()",
    );

    expect(() => expect(withElement).toBeEmptyDOMElement()).toThrow("expect(element).toBeEmptyDOMElement()");

    expect(() => expect(withElementAndComment).toBeEmptyDOMElement()).toThrow(
        "expect(element).toBeEmptyDOMElement()",
    );

    expect(() => expect(withWhitespace).toBeEmptyDOMElement()).toThrow(
        "expect(element).toBeEmptyDOMElement()",
    );

    expect(() => expect(withText).toBeEmptyDOMElement()).toThrow("expect(element).toBeEmptyDOMElement()");

    expect(() => expect(fakeElement).toBeEmptyDOMElement()).toThrow(
        "received value must be an HTMLElement or an SVGElement",
    );

    expect(() => {
        expect(nonExistantElement).toBeEmptyDOMElement();
    }).toThrow("received value must be an HTMLElement or an SVGElement");
});
