// oxlint-disable no-barrel-files/no-barrel-files

import { toBeChecked } from "./matchers/to-be-checked.js";
import { toBeDisabled, toBeEnabled } from "./matchers/to-be-disabled.js";
import { toBeEmptyDOMElement } from "./matchers/to-be-empty-dom-element.js";
import { toBeEmpty } from "./matchers/to-be-empty.js";
import { toBeInTheDocument } from "./matchers/to-be-in-the-document.js";
import { toBeInTheDOM } from "./matchers/to-be-in-the-dom.js";
import { toBeInvalid, toBeValid } from "./matchers/to-be-invalid.js";
import { toBePartiallyChecked } from "./matchers/to-be-partially-checked.js";
import { toBeRequired } from "./matchers/to-be-required.js";
import { toBeVisible } from "./matchers/to-be-visible.js";
import { toContainElement } from "./matchers/to-contain-element.js";
import { toContainHTML } from "./matchers/to-contain-html.js";
import { toHaveAccessibleDescription } from "./matchers/to-have-accessible-description.js";
import { toHaveAccessibleName } from "./matchers/to-have-accessible-name.js";
import { toHaveAttribute } from "./matchers/to-have-attribute.js";
import { toHaveClass } from "./matchers/to-have-class.js";
import { toHaveDescription } from "./matchers/to-have-description.js";
import { toHaveDisplayValue } from "./matchers/to-have-display-value.js";
import { toHaveErrorMessage } from "./matchers/to-have-errormessage.js";
import { toHaveFocus } from "./matchers/to-have-focus.js";
import { toHaveFormValues } from "./matchers/to-have-form-values.js";
import { toHaveStyle } from "./matchers/to-have-style.js";
import { toHaveTextContent } from "./matchers/to-have-text-content.js";
import { toHaveValue } from "./matchers/to-have-value.js";

export {
    toBeInTheDOM,
    toBeInTheDocument,
    toBeEmpty,
    toBeEmptyDOMElement,
    toContainElement,
    toContainHTML,
    toHaveTextContent,
    toHaveAccessibleDescription,
    toHaveAccessibleName,
    toHaveAttribute,
    toHaveClass,
    toHaveStyle,
    toHaveFocus,
    toHaveFormValues,
    toBeVisible,
    toBeDisabled,
    toBeEnabled,
    toBeRequired,
    toBeInvalid,
    toBeValid,
    toHaveValue,
    toHaveDisplayValue,
    toBeChecked,
    toBePartiallyChecked,
    toHaveDescription,
    toHaveErrorMessage,
};

// TODO(major, breaking change): Remove the following eslint-disable line and rename interface to ITestingLibraryMatchers
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface TestingLibraryMatchers<E, R> extends Record<string, any> {
    toBeInTheDOM(container?: HTMLElement | SVGElement): R;
    toBeInTheDocument(): R;
    toBeVisible(): R;
    toBeEmpty(): R;
    toBeEmptyDOMElement(): R;
    toBeDisabled(): R;
    toBeEnabled(): R;
    toBeInvalid(): R;
    toBeRequired(): R;
    toBeValid(): R;
    toContainElement(element: HTMLElement | SVGElement | null): R;
    toContainHTML(htmlText: string): R;
    toHaveAttribute(attr: string, value?: unknown): R;
    toHaveClass(...classNames: string[]): R;
    toHaveClass(classNames: string, options?: { exact: boolean }): R;
    toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
    toHaveFocus(): R;
    toHaveFormValues(expectedValues: Record<string, unknown>): R;
    toHaveStyle(css: string | Record<string, unknown>): R;
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
    toHaveValue(value?: string | string[] | number | null): R;
    toBeChecked(): R;
    toHaveDescription(text?: string | RegExp | E): R;
    toHaveAccessibleDescription(text?: string | RegExp | E): R;
    toHaveAccessibleErrorMessage(text?: string | RegExp | E): R;
    toHaveAccessibleName(text?: string | RegExp | E): R;
    toBePartiallyChecked(): R;
    toHaveErrorMessage(text?: string | RegExp | E): R;
}
