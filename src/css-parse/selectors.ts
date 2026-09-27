import type { ParserContext } from "./parser-context.js";
import { trim } from "./trim.js";

/**
 * Parse selector.
 */

export function selector(ctx: ParserContext): string[] | undefined {
    const m = ctx.match(/^([^{]+)/);
    if (!m) return;
    /* @fix Remove all comments from selectors
     * http://ostermiller.org/findcomment.html */
    return trim(m[0])
        .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, "")
        .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function (m) {
            return m.replace(/,/g, "\u200C");
        })
        .split(/\s*(?![^(]*\)),\s*/)
        .map(function (s) {
            return s.replace(/\u200C/g, ",");
        });
}
