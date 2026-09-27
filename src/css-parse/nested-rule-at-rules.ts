import type { IDocument, IHost, IMedia, ISupports } from "./at-rule-nodes.js";
import { comments } from "./comments.js";
import type { StyleNode } from "./nodes.js";
import type { ParserContext } from "./parser-context.js";
import { trim } from "./trim.js";

// At-rules whose block contains nested rules. The rules parser is passed in
// (rather than imported) because it in turn parses these at-rules.

/**
 * Parse supports.
 */

export function atsupports(ctx: ParserContext, rules: () => StyleNode[]): ISupports | undefined {
    const pos = ctx.position();
    const m = ctx.match(/^@supports *([^{]+)/);

    if (!m) return;
    const supports = trim(m[1]);

    if (!ctx.open()) return ctx.error("@supports missing '{'");

    const style = comments<StyleNode>(ctx).concat(rules());

    if (!ctx.close()) return ctx.error("@supports missing '}'");

    return pos({
        type: "supports",
        supports: supports,
        rules: style,
    });
}

/**
 * Parse host.
 */

export function athost(ctx: ParserContext, rules: () => StyleNode[]): IHost | undefined {
    const pos = ctx.position();
    const m = ctx.match(/^@host\s*/);

    if (!m) return;

    if (!ctx.open()) return ctx.error("@host missing '{'");

    const style = comments<StyleNode>(ctx).concat(rules());

    if (!ctx.close()) return ctx.error("@host missing '}'");

    return pos({
        type: "host",
        rules: style,
    });
}

/**
 * Parse media.
 */

export function atmedia(ctx: ParserContext, rules: () => StyleNode[]): IMedia | undefined {
    const pos = ctx.position();
    const m = ctx.match(/^@media *([^{]+)/);

    if (!m) return;
    const media = trim(m[1]);

    if (!ctx.open()) return ctx.error("@media missing '{'");

    const style = comments<StyleNode>(ctx).concat(rules());

    if (!ctx.close()) return ctx.error("@media missing '}'");

    return pos({
        type: "media",
        media: media,
        rules: style,
    });
}

/**
 * Parse document.
 */

export function atdocument(ctx: ParserContext, rules: () => StyleNode[]): IDocument | undefined {
    const pos = ctx.position();
    const m = ctx.match(/^@([-\w]+)?document *([^{]+)/);
    if (!m) return;

    const vendor = trim(m[1]);
    const doc = trim(m[2]);

    if (!ctx.open()) return ctx.error("@document missing '{'");

    const style = comments<StyleNode>(ctx).concat(rules());

    if (!ctx.close()) return ctx.error("@document missing '}'");

    return pos({
        type: "document",
        document: doc,
        vendor: vendor,
        rules: style,
    });
}
