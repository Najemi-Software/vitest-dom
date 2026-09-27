/**
 * Adds non-enumerable parent node reference to each node.
 */

export function addParent<T>(obj: T, parent?: object): T {
    const record = obj as Record<string, unknown>;
    const isNode = obj && typeof record.type === "string";
    const childParent = isNode ? record : parent;

    for (const k in record) {
        const value = record[k];
        if (Array.isArray(value)) {
            value.forEach(function (v) {
                addParent(v, childParent);
            });
        } else if (value && typeof value === "object") {
            addParent(value, childParent);
        }
    }

    if (isNode) {
        Object.defineProperty(obj, "parent", {
            configurable: true,
            writable: true,
            enumerable: false,
            value: parent || null,
        });
    }

    return obj;
}
