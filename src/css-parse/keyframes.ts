import type { IKeyframe, IKeyframes } from "./at-rule-nodes.js";
import { comments } from "./comments.js";
import { declarations } from "./declarations.js";
import type { ParserContext } from "./parser-context.js";

/**
 * Parse keyframe.
 */

export function keyframe(ctx: ParserContext): IKeyframe | undefined {
    let m;
    const vals: string[] = [];
    const pos = ctx.position();

    while ((m = ctx.match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/))) {
        vals.push(m[1]);
        ctx.match(/^,\s*/);
    }

    if (!vals.length) return;

    return pos({
        type: "keyframe",
        values: vals,
        declarations: declarations(ctx),
    });
}

/**
 * Parse keyframes.
 */

export function atkeyframes(ctx: ParserContext): IKeyframes | undefined {
    const pos = ctx.position();
    let m = ctx.match(/^@([-\w]+)?keyframes\s*/);

    if (!m) return;
    const vendor = m[1];

    // identifier
    m = ctx.match(/^([-\w]+)\s*/);
    if (!m) return ctx.error("@keyframes missing name");
    const name = m[1];

    if (!ctx.open()) return ctx.error("@keyframes missing '{'");

    let frame: IKeyframe | undefined;
    let frames = comments<IKeyframe>(ctx);
    while ((frame = keyframe(ctx))) {
        frames.push(frame);
        frames = frames.concat(comments<IKeyframe>(ctx));
    }

    if (!ctx.close()) return ctx.error("@keyframes missing '}'");

    return pos({
        type: "keyframes",
        name: name,
        vendor: vendor,
        keyframes: frames,
    });
}
