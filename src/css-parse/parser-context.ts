import type { IBaseNode } from "./nodes.js";
import type { IParserOptions } from "./options.js";
import type { IParseError } from "./parse-error.js";
import { createPositionClass } from "./position.js";

/**
 * Parser state (the remaining css and the current position in it) shared by
 * all parsing functions, plus the low-level scanning primitives.
 */
export class ParserContext {
    /**
     * The css that remains to be parsed.
     */
    css: string;

    readonly options: IParserOptions;

    /**
     * Positional.
     */

    lineno = 1;
    column = 1;

    readonly errorsList: IParseError[] = [];

    private readonly Position: ReturnType<typeof createPositionClass>;

    constructor(css: string, options: IParserOptions) {
        this.css = css;
        this.options = options;
        this.Position = createPositionClass(css);
    }

    /**
     * Update lineno and column based on `str`.
     */

    updatePosition(str: string) {
        const lines = str.match(/\n/g);
        if (lines) this.lineno += lines.length;
        const i = str.lastIndexOf("\n");
        this.column = ~i ? str.length - i : this.column + str.length;
    }

    /**
     * Mark position and patch `node.position`.
     */

    position() {
        const start = { line: this.lineno, column: this.column };
        return <const T extends IBaseNode>(node: T): T => {
            node.position = new this.Position(
                start,
                { line: this.lineno, column: this.column },
                this.options.source,
            );
            this.whitespace();
            return node;
        };
    }

    /**
     * Error `msg`.
     */

    error(msg: string): undefined {
        const err: IParseError = Object.assign(
            new Error(this.options.source + ":" + this.lineno + ":" + this.column + ": " + msg),
            {
                reason: msg,
                filename: this.options.source,
                line: this.lineno,
                column: this.column,
                source: this.css,
            },
        );

        if (this.options.silent) {
            this.errorsList.push(err);
        } else {
            throw err;
        }
    }

    /**
     * Match `re` and return captures.
     */

    match(re: RegExp) {
        const m = re.exec(this.css);
        if (!m) return;
        const str = m[0];
        this.updatePosition(str);
        this.css = this.css.slice(str.length);
        return m;
    }

    /**
     * Parse whitespace.
     */

    whitespace() {
        this.match(/^\s*/);
    }

    /**
     * Opening brace.
     */

    open() {
        return this.match(/^{\s*/);
    }

    /**
     * Closing brace.
     */

    close() {
        return this.match(/^}/);
    }
}
