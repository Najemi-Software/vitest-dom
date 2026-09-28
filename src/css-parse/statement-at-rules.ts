import type { ICustomMedia, ISimpleAtRule, SimpleAtRuleName } from "./at-rule-nodes.js";
import type { ParserContext } from "./parser-context.js";
import { trim } from "./trim.js";

// At-rules without a block, terminated by a semicolon.

/**
 * Parse custom-media.
 */

export function atcustommedia(ctx: ParserContext): ICustomMedia | undefined {
    const pos = ctx.position();
    const m = ctx.match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
    if (!m) return;

    return pos({
        type: "custom-media",
        name: trim(m[1]),
        media: trim(m[2]),
    });
}

/**
 * Parse non-block at-rules
 */

function _compileAtrule(name: SimpleAtRuleName) {
    const re = new RegExp("^@" + name + "\\s*([^;]+);");
    return function (ctx: ParserContext): ISimpleAtRule | undefined {
        const pos = ctx.position();
        const m = ctx.match(re);
        if (!m) return;
        const ret: ISimpleAtRule = { type: name };
        ret[name] = m[1]!.trim();
        return pos(ret);
    };
}

/**
 * Parse import
 */

export const atimport = _compileAtrule("import");

/**
 * Parse charset
 */

export const atcharset = _compileAtrule("charset");

/**
 * Parse namespace
 */

export const atnamespace = _compileAtrule("namespace");
