import type { IComment } from "./nodes.js";
import type { ParserContext } from "./parser-context.js";

/**
 * Parse comments;
 */

export function comments<T>(ctx: ParserContext, rules: Array<T | IComment> = []): Array<T | IComment> {
    let c: IComment | undefined;
    while ((c = comment(ctx))) {
        rules.push(c);
    }
    return rules;
}

/**
 * Parse comment.
 */

export function comment(ctx: ParserContext): IComment | undefined {
    const pos = ctx.position();
    if ("/" != ctx.css.charAt(0) || "*" != ctx.css.charAt(1)) return;

    let i = 2;
    while ("" != ctx.css.charAt(i) && ("*" != ctx.css.charAt(i) || "/" != ctx.css.charAt(i + 1))) ++i;
    i += 2;

    if ("" === ctx.css.charAt(i - 1)) {
        return ctx.error("End of comment missing");
    }

    const str = ctx.css.slice(2, i - 2);
    ctx.column += 2;
    ctx.updatePosition(str);
    ctx.css = ctx.css.slice(i);
    ctx.column += 2;

    return pos({
        type: "comment",
        comment: str,
    });
}
