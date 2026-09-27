import type { IFontFace, IPage } from "./at-rule-nodes.js";
import { comments } from "./comments.js";
import { declaration } from "./declarations.js";
import type { IDeclaration } from "./nodes.js";
import type { ParserContext } from "./parser-context.js";
import { selector } from "./selectors.js";

// At-rules whose block contains declarations.

/**
 * Parse paged media.
 */

export function atpage(ctx: ParserContext): IPage | undefined {
    const pos = ctx.position();
    const m = ctx.match(/^@page */);
    if (!m) return;

    const sel = selector(ctx) || [];

    if (!ctx.open()) return ctx.error("@page missing '{'");
    let decls = comments<IDeclaration>(ctx);

    // declarations
    let decl: IDeclaration | undefined;
    while ((decl = declaration(ctx))) {
        decls.push(decl);
        decls = decls.concat(comments<IDeclaration>(ctx));
    }

    if (!ctx.close()) return ctx.error("@page missing '}'");

    return pos({
        type: "page",
        selectors: sel,
        declarations: decls,
    });
}

/**
 * Parse font-face.
 */

export function atfontface(ctx: ParserContext): IFontFace | undefined {
    const pos = ctx.position();
    const m = ctx.match(/^@font-face\s*/);
    if (!m) return;

    if (!ctx.open()) return ctx.error("@font-face missing '{'");
    let decls = comments<IDeclaration>(ctx);

    // declarations
    let decl: IDeclaration | undefined;
    while ((decl = declaration(ctx))) {
        decls.push(decl);
        decls = decls.concat(comments<IDeclaration>(ctx));
    }

    if (!ctx.close()) return ctx.error("@font-face missing '}'");

    return pos({
        type: "font-face",
        declarations: decls,
    });
}
