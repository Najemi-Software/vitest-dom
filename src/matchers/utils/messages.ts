import redent from "redent";

import type { MatcherState } from "../types.js";

function display(context: MatcherState, value: unknown) {
    return typeof value === "string" ? value : context.utils.stringify(value);
}

export function getMessage<ExpectedValueType, ReceivedValueType>(
    context: MatcherState,
    matcher: string,
    expectedLabel: string,
    expectedValue: ExpectedValueType,
    receivedLabel: string,
    receivedValue: ReceivedValueType,
) {
    return [
        `${matcher}\n`,
        `${expectedLabel}:\n${context.utils.EXPECTED_COLOR(redent(display(context, expectedValue), 2))}`,
        `${receivedLabel}:\n${context.utils.RECEIVED_COLOR(redent(display(context, receivedValue), 2))}`,
    ].join("\n");
}
