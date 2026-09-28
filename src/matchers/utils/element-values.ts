import { isNonEmptyArray } from "./arrays.js";

function getSelectValue({ multiple, options }: HTMLSelectElement) {
    const selectedOptions = Array.from(options).filter((option) => option.selected);

    if (multiple) {
        return [...selectedOptions].map((opt) => opt.value);
    }

    if (isNonEmptyArray(selectedOptions)) {
        return selectedOptions[0].value;
    }

    return undefined; // Couldn't make this happen, but just in case
}

function getInputValue(inputElement: HTMLInputElement) {
    switch (inputElement.type) {
        case "number":
            return inputElement.value === "" ? null : Number(inputElement.value);
        case "checkbox":
            return inputElement.checked;
        default:
            return inputElement.value;
    }
}

export function getSingleElementValue(element: undefined | null): undefined;
export function getSingleElementValue(element: HTMLInputElement): ReturnType<typeof getInputValue>;
export function getSingleElementValue(element: HTMLSelectElement): ReturnType<typeof getSelectValue>;
export function getSingleElementValue(element: HTMLMeterElement | HTMLProgressElement): number;
export function getSingleElementValue(
    element:
        | HTMLButtonElement
        | HTMLDataElement
        | HTMLOptionElement
        | HTMLOutputElement
        | HTMLTextAreaElement,
): string;
export function getSingleElementValue(
    element: Element,
): undefined | string | string[] | number | boolean | null;

export function getSingleElementValue(element: Element | undefined | null) {
    if (!element) {
        return undefined;
    }

    switch (element.tagName.toLowerCase()) {
        case "input":
            return getInputValue(element as HTMLInputElement);
        case "select":
            return getSelectValue(element as HTMLSelectElement);
        default:
            return "value" in element ? element.value : undefined;
    }
}
