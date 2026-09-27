import type { IStylesheet } from "./nodes.js";
import type { IParserOptions } from "./options.js";
import { addParent } from "./parent-references.js";
import { ParserContext } from "./parser-context.js";
import { rules } from "./rules.js";

export function cssParse(css: string, options?: IParserOptions): IStylesheet {
    const ctx = new ParserContext(css, options || {});

    return addParent(stylesheet(ctx));
}

/**
 * Parse stylesheet.
 */

function stylesheet(ctx: ParserContext): IStylesheet {
    const rulesList = rules(ctx);

    return {
        type: "stylesheet",
        stylesheet: {
            source: ctx.options.source,
            rules: rulesList,
            parsingErrors: ctx.errorsList,
        },
    };
}
