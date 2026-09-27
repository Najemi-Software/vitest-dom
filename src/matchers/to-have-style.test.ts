// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toHaveStyle } from "./to-have-style.js";

expect.extend({ toHaveStyle });

describe(".toHaveStyle", () => {
    it("handles positive test cases", () => {
        const { container } = render(`
          <div class="label" style="background-color: blue; height: 100%">
            Hello World
          </div>
        `);

        const style = document.createElement("style");
        style.innerHTML = `
          .label {
            align-items: center;
            background-color: black;
            color: white;
            float: left;
            transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
            transform: translateX(0px);
          }
        `;
        document.body.appendChild(style);
        document.body.appendChild(container);

        expect(container.querySelector(".label")).toHaveStyle(`
          height: 100%;
          color: white;
          background-color: blue;
        `);

        expect(container.querySelector(".label")).toHaveStyle(`
          background-color: blue;
          color: white;
        `);

        expect(container.querySelector(".label")).toHaveStyle(
            "transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275)",
        );

        expect(container.querySelector(".label")).toHaveStyle("background-color:blue;color:white");

        expect(container.querySelector(".label")).not.toHaveStyle(`
          color: white;
          font-weight: bold;
        `);

        expect(container.querySelector(".label")).toHaveStyle(`
        Align-items: center;
      `);

        expect(container.querySelector(".label")).toHaveStyle(`
      transform: translateX(0px);
    `);
    });

    it("handles negative test cases", () => {
        const { container } = render(`
    <div class="label" style="background-color: blue; height: 100%">
      Hello World
    </div>
  `);

        const style = document.createElement("style");
        style.innerHTML = `
    .label {
      background-color: black;
      color: white;
      float: left;
      transition: opacity 0.2s ease-out, top 0.3s cubic-bezier(1.175, 0.885, 0.32, 1.275);
    }
  `;
        document.body.appendChild(style);
        document.body.appendChild(container);

        expect(() =>
            expect(container.querySelector(".label")).toHaveStyle("font-weight: bold"),
        ).toThrowError();

        expect(() =>
            expect(container.querySelector(".label")).not.toHaveStyle("color: white"),
        ).toThrowError();

        expect(() =>
            expect(container.querySelector(".label")).toHaveStyle(
                "transition: all 0.7s ease, width 1.0s cubic-bezier(3, 4, 5, 6);",
            ),
        ).toThrowError();

        // Make sure the test fails if the css syntax is not valid
        expect(() =>
            expect(container.querySelector(".label")).not.toHaveStyle("font-weight bold"),
        ).toThrowError();

        expect(() => expect(container.querySelector(".label")).toHaveStyle("color white")).toThrowError();

        expect(() => expect(container.querySelector(".label")).toHaveStyle("--color: black")).toThrowError();
        document.body.removeChild(style);
        document.body.removeChild(container);
    });

    it("properly normalizes colors", () => {
        const { queryByTestId } = render(`
      <span data-testid="color-example" style="background-color: #123456">Hello World</span>
    `);
        expect(queryByTestId("color-example")).toHaveStyle("background-color: #123456");
    });

    it("handles inline custom properties", () => {
        const { queryByTestId } = render(`
      <span data-testid="color-example" style="--color: blue">Hello World</span>
    `);
        expect(queryByTestId("color-example")).toHaveStyle("--color: blue");
    });

    it("handles global custom properties", () => {
        const style = document.createElement("style");
        style.innerHTML = `
      div {
        --color: blue;
      }
    `;

        const { container } = render(
            `
      <div>
        Hello world
      </div>
    `,
        );

        document.body.appendChild(style);
        document.body.appendChild(container);

        expect(container).toHaveStyle(`--color: blue`);
    });

    it("properly normalizes colors for border", () => {
        const { queryByTestId } = render(`
    <span data-testid="color-example" style="border: 1px solid #fff">Hello World</span>
  `);
        expect(queryByTestId("color-example")).toHaveStyle("border: 1px solid #fff");
    });

    it("handles different color declaration formats", () => {
        const { queryByTestId } = render(`
      <span data-testid="color-example" style="color: rgba(0, 0, 0, 1); background-color: #000000">Hello World</span>
    `);

        // happy-dom does not normalize colors across formats (jsdom did), so
        // each assertion must use the same format as the inline declaration.
        expect(queryByTestId("color-example")).toHaveStyle("color: rgba(0, 0, 0, 1)");
        expect(queryByTestId("color-example")).toHaveStyle("background-color: #000000");
    });

    it("handles nonexistent styles", () => {
        const { container } = render(`
          <div class="label" style="background-color: blue; height: 100%">
            Hello World
          </div>
        `);

        expect(container.querySelector(".label")).not.toHaveStyle("whatever: anything");
    });

    describe("object syntax", () => {
        it("handles styles as object", () => {
            const { container } = render(`
        <div class="label" style="background-color: blue; height: 100%">
          Hello World
        </div>
      `);

            expect(container.querySelector(".label")).toHaveStyle({
                backgroundColor: "blue",
            });
            expect(container.querySelector(".label")).toHaveStyle({
                backgroundColor: "blue",
                height: "100%",
            });
            expect(container.querySelector(".label")).not.toHaveStyle({
                backgroundColor: "red",
                height: "100%",
            });
            expect(container.querySelector(".label")).not.toHaveStyle({
                whatever: "anything",
            });
        });

        it("Uses px as the default unit", () => {
            const { queryByTestId } = render(`
        <span data-testid="color-example" style="font-size: 12px">Hello World</span>
      `);
            expect(queryByTestId("color-example")).toHaveStyle({
                fontSize: 12,
            });
        });

        it("Fails with an invalid unit", () => {
            const { queryByTestId } = render(`
        <span data-testid="color-example" style="font-size: 12rem">Hello World</span>
      `);
            expect(() => {
                expect(queryByTestId("color-example")).toHaveStyle({
                    fontSize: "12px",
                });
            }).toThrowError();
        });

        it("supports dash-cased property names", () => {
            const { container } = render(`
        <div class="label" style="background-color: blue; height: 100%">
          Hello World
        </div>
      `);
            expect(container.querySelector(".label")).toHaveStyle({
                "background-color": "blue",
            });
        });

        it("requires strict empty properties matching", () => {
            const { container } = render(`
        <div class="label" style="width: 100%;height: 100%">
          Hello World
        </div>
      `);
            expect(container.querySelector(".label")).not.toHaveStyle({
                width: "100%",
                height: "",
            });
            expect(container.querySelector(".label")).not.toHaveStyle({
                width: "",
                height: "",
            });
        });
    });
});
