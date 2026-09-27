import { comments } from "./comments.js";
import type { IComment, IDeclaration } from "./nodes.js";
import type { ParserContext } from "./parser-context.js";
import { trim } from "./trim.js";

// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
const commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

/**
 * Parse declaration.
 */

export function declaration(ctx: ParserContext): IDeclaration | undefined {
    const pos = ctx.position();

    // prop

    const propMatch = ctx.match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
    if (!propMatch) return;
    const prop = trim(propMatch[0]);

    // :
    if (!ctx.match(/^:\s*/)) return ctx.error("property missing ':'");

    // val

    const val = ctx.match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);

    const ret = pos({
        type: "declaration",
        property: prop.replace(commentre, ""),
        value: val ? trim(val[0]).replace(commentre, "") : "",
    });

    // ;
    ctx.match(/^[;\s]*/);

    return ret;
}

/**
 * Parse declarations.
 */

export function declarations(ctx: ParserContext): Array<IDeclaration | IComment> | undefined {
    const decls: Array<IDeclaration | IComment> = [];

    if (!ctx.open()) return ctx.error("missing '{'");
    comments(ctx, decls);

    // declarations
    let decl: IDeclaration | undefined;
    while ((decl = declaration(ctx))) {
        decls.push(decl);
        comments(ctx, decls);
    }

    if (!ctx.close()) return ctx.error("missing '}'");
    return decls;
}
