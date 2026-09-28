import isEqual from "lodash-es/isEqual.js";

export function isNonEmptyArray<T>(array: T[] | null | undefined): array is [T, ...T[]] {
    return !!array && array.length > 0;
}

export function compareArraysAsSet(a: unknown, b: unknown) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return isEqual(new Set(a), new Set(b));
    }
    return undefined;
}
