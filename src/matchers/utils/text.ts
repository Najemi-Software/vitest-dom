export function matches(textToMatch: string, matcher: string | RegExp) {
    if (matcher instanceof RegExp) {
        return matcher.test(textToMatch);
    } else {
        return textToMatch.includes(String(matcher));
    }
}

export function normalize(text: string) {
    return text.replace(/\s+/g, " ").trim();
}

export function toSentence(array: string[], { wordConnector = ", ", lastWordConnector = " and " } = {}) {
    return [array.slice(0, -1).join(wordConnector), array[array.length - 1]].join(
        array.length > 1 ? lastWordConnector : "",
    );
}
