// @vitest-environment happy-dom

import { expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toBeDisabled, toBeEnabled } from "./to-be-disabled.js";

expect.extend({ toBeDisabled, toBeEnabled });

window.customElements.define("custom-element", class extends window.HTMLElement {});

it(".toBeDisabled", () => {
    const { queryByTestId } = render(`
    <div>
      <button disabled={true} data-testid="button-element">x</button>
      <textarea disabled={true} data-testid="textarea-element"></textarea>
      <input type="checkbox" disabled={true} data-testid="input-element" />

      <fieldset disabled={true} data-testid="fieldset-element">
        <button data-testid="fieldset-child-element">x</button>
      </fieldset>

      <div disabled={true} data-testid="div-element">
        <button data-testid="div-child-element">x</button>
      </div>

      <fieldset disabled={true}>
        <div>
          <button data-testid="nested-form-element">x</button>

          <select data-testid="deep-select-element">
            <optgroup data-testid="deep-optgroup-element">
              <option data-testid="deep-option-element">x</option>
            </optgroup>
          </select>
        </div>
        <a href="http://github.com" data-testid="deep-a-element">x</a>
      </fieldset>

      <a href="http://github.com" disabled={true} data-testid="a-element">x</a>
    </div>
    `);

    expect(queryByTestId("button-element")).toBeDisabled();
    expect(() => expect(queryByTestId("button-element")).not.toBeDisabled()).toThrow(
        "Received element is disabled",
    );
    expect(queryByTestId("textarea-element")).toBeDisabled();
    expect(queryByTestId("input-element")).toBeDisabled();

    expect(queryByTestId("fieldset-element")).toBeDisabled();
    expect(queryByTestId("fieldset-child-element")).toBeDisabled();

    expect(queryByTestId("div-element")).not.toBeDisabled();
    expect(queryByTestId("div-child-element")).not.toBeDisabled();

    expect(queryByTestId("nested-form-element")).toBeDisabled();
    expect(queryByTestId("deep-select-element")).toBeDisabled();
    expect(queryByTestId("deep-optgroup-element")).toBeDisabled();
    expect(queryByTestId("deep-option-element")).toBeDisabled();

    expect(queryByTestId("a-element")).not.toBeDisabled();
    expect(queryByTestId("deep-a-element")).not.toBeDisabled();
    expect(() => expect(queryByTestId("a-element")).toBeDisabled()).toThrow(
        "Received element is not disabled",
    );
    expect(() => expect(queryByTestId("deep-a-element")).toBeDisabled()).toThrow(
        "Received element is not disabled",
    );
});

it(".toBeDisabled fieldset>legend", () => {
    const { queryByTestId } = render(`
    <div>
      <fieldset disabled={true}>
        <button data-testid="inherited-element">x</button>
      </fieldset>

      <fieldset disabled={true}>
        <legend>
          <button data-testid="inside-legend-element">x</button>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <legend>
          <div>
            <button data-testid="nested-inside-legend-element">x</button>
          </div>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <div></div>
        <legend>
          <button data-testid="first-legend-element">x</button>
        </legend>
        <legend>
          <button data-testid="second-legend-element">x</button>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <fieldset>
          <legend>
            <button data-testid="outer-fieldset-element">x</button>
          </legend>
        </fieldset>
      </fieldset>
    </div>
    `);

    expect(queryByTestId("inherited-element")).toBeDisabled();
    expect(queryByTestId("inside-legend-element")).not.toBeDisabled();
    expect(queryByTestId("nested-inside-legend-element")).not.toBeDisabled();

    expect(queryByTestId("first-legend-element")).not.toBeDisabled();
    expect(queryByTestId("second-legend-element")).toBeDisabled();

    expect(queryByTestId("outer-fieldset-element")).toBeDisabled();
});

it(".toBeDisabled custom element", () => {
    const { queryByTestId } = render(`
    <custom-element data-testid="disabled-custom-element" disabled=""></custom-element>
    <custom-element data-testid="enabled-custom-element"></custom-element>
  `);

    expect(queryByTestId("disabled-custom-element")).toBeDisabled();
    expect(() => {
        expect(queryByTestId("disabled-custom-element")).not.toBeDisabled();
    }).toThrow("element is disabled");

    expect(queryByTestId("enabled-custom-element")).not.toBeDisabled();
    expect(() => {
        expect(queryByTestId("enabled-custom-element")).toBeDisabled();
    }).toThrow("element is not disabled");
});

it(".toBeEnabled", () => {
    const { queryByTestId } = render(`
    <div>
      <button disabled={true} data-testid="button-element">x</button>
      <textarea disabled={true} data-testid="textarea-element"></textarea>
      <input type="checkbox" disabled={true} data-testid="input-element" />

      <fieldset disabled={true} data-testid="fieldset-element">
        <button data-testid="fieldset-child-element">x</button>
      </fieldset>

      <div disabled={true} data-testid="div-element">
        <button data-testid="div-child-element">x</button>
      </div>

      <fieldset disabled={true}>
        <div>
          <button data-testid="nested-form-element">x</button>

          <select data-testid="deep-select-element">
            <optgroup data-testid="deep-optgroup-element">
              <option data-testid="deep-option-element">x</option>
            </optgroup>
          </select>
        </div>
        <a href="http://github.com" data-testid="deep-a-element">x</a>
      </fieldset>

      <a href="http://github.com" disabled={true} data-testid="a-element">x</a>
    </div>
    `);

    expect(() => {
        expect(queryByTestId("button-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");
    expect(queryByTestId("button-element")).not.toBeEnabled();
    expect(() => {
        expect(queryByTestId("textarea-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");
    expect(() => {
        expect(queryByTestId("input-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");

    expect(() => {
        expect(queryByTestId("fieldset-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");
    expect(() => {
        expect(queryByTestId("fieldset-child-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");

    expect(queryByTestId("div-element")).toBeEnabled();
    expect(queryByTestId("div-child-element")).toBeEnabled();

    expect(() => {
        expect(queryByTestId("nested-form-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");
    expect(() => {
        expect(queryByTestId("deep-select-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");
    expect(() => {
        expect(queryByTestId("deep-optgroup-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");
    expect(() => {
        expect(queryByTestId("deep-option-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");

    expect(queryByTestId("a-element")).toBeEnabled();
    expect(() => expect(queryByTestId("a-element")).not.toBeEnabled()).toThrow("Received element is enabled");
    expect(queryByTestId("deep-a-element")).toBeEnabled();
    expect(() => expect(queryByTestId("deep-a-element")).not.toBeEnabled()).toThrow(
        "Received element is enabled",
    );
});

it(".toBeEnabled fieldset>legend", () => {
    const { queryByTestId } = render(`
    <div>
      <fieldset disabled={true}>
        <button data-testid="inherited-element">x</button>
      </fieldset>

      <fieldset disabled={true}>
        <legend>
          <button data-testid="inside-legend-element">x</button>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <legend>
          <div>
            <button data-testid="nested-inside-legend-element">x</button>
          </div>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <div></div>
        <legend>
          <button data-testid="first-legend-element">x</button>
        </legend>
        <legend>
          <button data-testid="second-legend-element">x</button>
        </legend>
      </fieldset>

      <fieldset disabled={true}>
        <fieldset>
          <legend>
            <button data-testid="outer-fieldset-element">x</button>
          </legend>
        </fieldset>
      </fieldset>
    </div>
    `);

    expect(() => {
        expect(queryByTestId("inherited-element")).toBeEnabled();
    }).toThrow("Received element is not enabled");
    expect(queryByTestId("inside-legend-element")).toBeEnabled();
    expect(queryByTestId("nested-inside-legend-element")).toBeEnabled();

    expect(queryByTestId("first-legend-element")).toBeEnabled();
    expect(() => {
        expect(queryByTestId("second-legend-element")).toBeEnabled();
    }).toThrow("element is not enabled");

    expect(() => {
        expect(queryByTestId("outer-fieldset-element")).toBeEnabled();
    }).toThrow("element is not enabled");
});

it(".toBeEnabled custom element", () => {
    const { queryByTestId } = render(`
    <custom-element data-testid="disabled-custom-element" disabled=""></custom-element>
    <custom-element data-testid="enabled-custom-element"></custom-element>
  `);

    expect(queryByTestId("disabled-custom-element")).not.toBeEnabled();
    expect(() => {
        expect(queryByTestId("disabled-custom-element")).toBeEnabled();
    }).toThrow("element is not enabled");

    expect(queryByTestId("enabled-custom-element")).toBeEnabled();
    expect(() => {
        expect(queryByTestId("enabled-custom-element")).not.toBeEnabled();
    }).toThrow("element is enabled");
});
