/**
 * Trim `str`.
 */

export function trim(str: string | undefined) {
    return str ? str.replace(/^\s+|\s+$/g, "") : "";
}
