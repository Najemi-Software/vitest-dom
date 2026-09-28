import { getType } from "./get-type.js";

export function printWithType<T>(name: string, value: T, print: (value: T) => string): string {
    const type = getType(value);
    const hasType = type !== "null" && type !== "undefined" ? `${name} has type:  ${type}\n` : "";
    const hasValue = `${name} has value: ${print(value)}`;
    return hasType + hasValue;
}
