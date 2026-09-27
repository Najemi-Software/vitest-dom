// @vitest-environment happy-dom

import { expect, it } from "vitest";

import { render } from "./render.test.utils.js";
import { toHaveClass } from "./to-have-class.js";

expect.extend({ toHaveClass });

const renderElementWithClasses = () =>
    render(`
<div>
  <button data-testid="delete-button" class="btn extra btn-danger">
    Delete item
  </button>
  <button data-testid="cancel-button">
    Cancel
  </button>
  <svg data-testid="svg-spinner" class="spinner clockwise">
    <path />
  </svg>
  <div data-testid="only-one-class" class="alone"></div>
  <div data-testid="no-classes"></div>
</div>
`);

it(".toHaveClass", () => {
    const { queryByTestId } = renderElementWithClasses();

    expect(queryByTestId("delete-button")).toHaveClass("btn");
    expect(queryByTestId("delete-button")).toHaveClass("btn-danger");
    expect(queryByTestId("delete-button")).toHaveClass("extra");
    expect(queryByTestId("delete-button")).not.toHaveClass("xtra");
    expect(queryByTestId("delete-button")).not.toHaveClass("btn xtra");
    expect(queryByTestId("delete-button")).not.toHaveClass("btn", "xtra");
    expect(queryByTestId("delete-button")).not.toHaveClass("btn", "extra xtra");
    expect(queryByTestId("delete-button")).toHaveClass("btn btn-danger");
    expect(queryByTestId("delete-button")).toHaveClass("btn", "btn-danger");
    expect(queryByTestId("delete-button")).toHaveClass("btn extra", "btn-danger extra");
    expect(queryByTestId("delete-button")).not.toHaveClass("btn-link");
    expect(queryByTestId("cancel-button")).not.toHaveClass("btn-danger");
    expect(queryByTestId("svg-spinner")).toHaveClass("spinner");
    expect(queryByTestId("svg-spinner")).toHaveClass("clockwise");
    expect(queryByTestId("svg-spinner")).not.toHaveClass("wise");
    expect(queryByTestId("no-classes")).not.toHaveClass();
    expect(queryByTestId("no-classes")).not.toHaveClass(" ");

    expect(() => expect(queryByTestId("delete-button")).not.toHaveClass("btn")).toThrow(
        "Expected the element not to have class",
    );
    expect(() => expect(queryByTestId("delete-button")).not.toHaveClass("btn-danger")).toThrow(
        "Expected the element not to have class",
    );
    expect(() => expect(queryByTestId("delete-button")).not.toHaveClass("extra")).toThrow(
        "Expected the element not to have class",
    );
    expect(() => expect(queryByTestId("delete-button")).toHaveClass("xtra")).toThrow(
        "Expected the element to have class",
    );
    expect(() => expect(queryByTestId("delete-button")).toHaveClass("btn", "extra xtra")).toThrow(
        "Expected the element to have class",
    );
    expect(() => expect(queryByTestId("delete-button")).not.toHaveClass("btn btn-danger")).toThrow(
        "Expected the element not to have class",
    );
    expect(() => expect(queryByTestId("delete-button")).not.toHaveClass("btn", "btn-danger")).toThrow(
        "Expected the element not to have class",
    );
    expect(() => expect(queryByTestId("delete-button")).toHaveClass("btn-link")).toThrow(
        "Expected the element to have class",
    );
    expect(() => expect(queryByTestId("cancel-button")).toHaveClass("btn-danger")).toThrow(
        "Expected the element to have class",
    );
    expect(() => expect(queryByTestId("svg-spinner")).not.toHaveClass("spinner")).toThrow(
        "Expected the element not to have class",
    );
    expect(() => expect(queryByTestId("svg-spinner")).toHaveClass("wise")).toThrow(
        "Expected the element to have class",
    );
    expect(() => expect(queryByTestId("delete-button")).toHaveClass()).toThrow(
        /At least one expected class must be provided/,
    );
    expect(() => expect(queryByTestId("delete-button")).toHaveClass("")).toThrow(
        /At least one expected class must be provided/,
    );
    expect(() => expect(queryByTestId("no-classes")).toHaveClass()).toThrow(
        /At least one expected class must be provided/,
    );
    expect(() => expect(queryByTestId("delete-button")).not.toHaveClass()).toThrow(/(none)/);
    expect(() => expect(queryByTestId("delete-button")).not.toHaveClass("  ")).toThrow(/(none)/);
});

it(".toHaveClass with exact mode option", () => {
    const { queryByTestId } = renderElementWithClasses();

    expect(queryByTestId("delete-button")).toHaveClass("btn extra btn-danger", {
        exact: true,
    });
    expect(queryByTestId("delete-button")).not.toHaveClass("btn extra", {
        exact: true,
    });
    expect(queryByTestId("delete-button")).not.toHaveClass("btn extra btn-danger foo", { exact: true });

    expect(queryByTestId("delete-button")).toHaveClass("btn extra btn-danger", {
        exact: false,
    });
    expect(queryByTestId("delete-button")).toHaveClass("btn extra", {
        exact: false,
    });
    expect(queryByTestId("delete-button")).not.toHaveClass("btn extra btn-danger foo", { exact: false });

    // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
    expect(queryByTestId("delete-button")).toHaveClass("btn", "extra", "btn-danger", { exact: true });
    // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
    expect(queryByTestId("delete-button")).not.toHaveClass("btn", "extra", {
        exact: true,
    });
    // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
    expect(queryByTestId("delete-button")).not.toHaveClass("btn", "extra", "btn-danger", "foo", {
        exact: true,
    });

    // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
    expect(queryByTestId("delete-button")).toHaveClass("btn", "extra", "btn-danger", { exact: false });
    // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
    expect(queryByTestId("delete-button")).toHaveClass("btn", "extra", {
        exact: false,
    });
    // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
    expect(queryByTestId("delete-button")).not.toHaveClass("btn", "extra", "btn-danger", "foo", {
        exact: false,
    });

    expect(queryByTestId("only-one-class")).toHaveClass("alone", { exact: true });
    expect(queryByTestId("only-one-class")).not.toHaveClass("alone foo", {
        exact: true,
    });
    // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
    expect(queryByTestId("only-one-class")).not.toHaveClass("alone", "foo", {
        exact: true,
    });

    expect(queryByTestId("only-one-class")).toHaveClass("alone", {
        exact: false,
    });
    expect(queryByTestId("only-one-class")).not.toHaveClass("alone foo", {
        exact: false,
    });
    // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
    expect(queryByTestId("only-one-class")).not.toHaveClass("alone", "foo", {
        exact: false,
    });

    expect(() =>
        expect(queryByTestId("only-one-class")).not.toHaveClass("alone", {
            exact: true,
        }),
    ).toThrow(/Expected the element not to have EXACTLY defined classes/);

    expect(() =>
        // @ts-expect-error: options after multiple class names are supported at runtime but not by the types
        expect(queryByTestId("only-one-class")).toHaveClass("alone", "foo", {
            exact: true,
        }),
    ).toThrow(/Expected the element to have EXACTLY defined classes/);
});
