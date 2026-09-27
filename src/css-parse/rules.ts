import type { AtRule } from "./at-rule-nodes.js";
import { comments } from "./comments.js";
import { atfontface, atpage } from "./declaration-block-at-rules.js";
import { declarations } from "./declarations.js";
import { atkeyframes } from "./keyframes.js";
import { atdocument, athost, atmedia, atsupports } from "./nested-rule-at-rules.js";
import type { IRule, StyleNode } from "./nodes.js";
import type { ParserContext } from "./parser-context.js";
import { selector } from "./selectors.js";
import { atcharset, atcustommedia, atimport, atnamespace } from "./statement-at-rules.js";

/**
 * Parse ruleset.
 */

export function rules(ctx: ParserContext): StyleNode[] {
    let node: StyleNode | undefined;
    const rules: StyleNode[] = [];
    ctx.whitespace();
    comments(ctx, rules);
    while (ctx.css.length && ctx.css.charAt(0) != "}" && (node = atrule(ctx) || rule(ctx))) {
        rules.push(node);
        comments(ctx, rules);
    }
    return rules;
}

/**
 * Parse at rule.
 */

function atrule(ctx: ParserContext): AtRule | undefined {
    if (ctx.css[0] != "@") return;

    const nestedRules = () => rules(ctx);

    return (
        atkeyframes(ctx) ||
        atmedia(ctx, nestedRules) ||
        atcustommedia(ctx) ||
        atsupports(ctx, nestedRules) ||
        atimport(ctx) ||
        atcharset(ctx) ||
        atnamespace(ctx) ||
        atdocument(ctx, nestedRules) ||
        atpage(ctx) ||
        athost(ctx, nestedRules) ||
        atfontface(ctx)
    );
}

/**
 * Parse rule.
 */

function rule(ctx: ParserContext): IRule | undefined {
    const pos = ctx.position();
    const sel = selector(ctx);

    if (!sel) return ctx.error("selector missing");
    comments(ctx);

    return pos({
        type: "rule",
        selectors: sel,
        declarations: declarations(ctx),
    });
}
