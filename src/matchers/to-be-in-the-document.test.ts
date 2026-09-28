// @vitest-environment happy-dom

import { expect, it } from "vitest";

import { toBeInTheDocument } from "./to-be-in-the-document.js";
import { HtmlElementTypeError } from "./utils/type-errors.js";

expect.extend({ toBeInTheDocument });

const HTMLElement = window.HTMLElement;

it(".toBeInTheDocument", () => {
    window.customElements.define(
        "custom-element",
        class extends HTMLElement {
            constructor() {
                super();
                this.attachShadow({ mode: "open" }).innerHTML =
                    '<div data-testid="custom-element-child"></div>';
            }
        },
    );

    document.body.innerHTML = `
    <span data-testid="html-element"><span>Html Element</span></span>
    <svg data-testid="svg-element"></svg>
    <custom-element data-testid="custom-element"></custom-element>`;

    const htmlElement = document.querySelector('[data-testid="html-element"]');
    const svgElement = document.querySelector('[data-testid="svg-element"]');
    const customElementChild = document
        .querySelector('[data-testid="custom-element"]')
        ?.shadowRoot?.querySelector('[data-testid="custom-element-child"]');
    const detachedElement = document.createElement("div");
    const fakeElement = { thisIsNot: "an html element" };
    const undefinedElement = undefined;
    const nullElement = null;

    expect(htmlElement).toBeInTheDocument();
    expect(svgElement).toBeInTheDocument();
    expect(customElementChild).toBeInTheDocument();
    expect(detachedElement).not.toBeInTheDocument();
    expect(nullElement).not.toBeInTheDocument();

    // negative test cases wrapped in throwError assertions for coverage.
    const expectToBe = /expect.*\.toBeInTheDocument/;
    const expectNotToBe = /expect.*not\.toBeInTheDocument/;
    expect(() => expect(htmlElement).not.toBeInTheDocument()).toThrow(expectNotToBe);
    expect(() => expect(svgElement).not.toBeInTheDocument()).toThrow(expectNotToBe);
    expect(() => expect(detachedElement).toBeInTheDocument()).toThrow(expectToBe);
    expect(() => expect(fakeElement).toBeInTheDocument()).toThrow(HtmlElementTypeError);
    expect(() => expect(nullElement).toBeInTheDocument()).toThrow(HtmlElementTypeError);
    expect(() => expect(undefinedElement).toBeInTheDocument()).toThrow(HtmlElementTypeError);
    expect(() => expect(undefinedElement).not.toBeInTheDocument()).toThrow(HtmlElementTypeError);
});
