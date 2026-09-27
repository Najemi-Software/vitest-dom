// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
const commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

export interface IParserOptions {
    /** Silently fail on parse errors */
    silent?: boolean | undefined;
    /** The path to the file containing css. Makes errors and source maps more helpful, by letting them know where code comes from. */
    source?: string | undefined;
}

interface ILineColumn {
    line: number;
    column: number;
}

/** Information about the position in the source string that corresponds to the node. */
interface INodePosition {
    start: ILineColumn;
    end: ILineColumn;
    /** The value of options.source if passed to css.parse. Otherwise undefined. */
    source: string | undefined;
    /** The full source string passed to css.parse. */
    content: string;
}

interface IBaseNode {
    /** The possible values are the ones listed in the Types section on https://github.com/reworkcss/css page. */
    type: string;
    position?: INodePosition;
    /** A reference to the parent node, or null if the node has no parent. */
    parent?: IBaseNode | null;
}

export interface IComment extends IBaseNode {
    type: "comment";
    comment: string;
}

export interface IDeclaration extends IBaseNode {
    type: "declaration";
    property: string;
    value: string;
}

export interface IRule extends IBaseNode {
    type: "rule";
    selectors: string[];
    declarations: Array<IDeclaration | IComment> | undefined;
}

export interface IKeyframe extends IBaseNode {
    type: "keyframe";
    values: string[];
    declarations: Array<IDeclaration | IComment> | undefined;
}

export interface IKeyframes extends IBaseNode {
    type: "keyframes";
    name: string;
    vendor: string | undefined;
    keyframes: Array<IKeyframe | IComment>;
}

export interface ISupports extends IBaseNode {
    type: "supports";
    supports: string;
    rules: StyleNode[];
}

export interface IHost extends IBaseNode {
    type: "host";
    rules: StyleNode[];
}

export interface IMedia extends IBaseNode {
    type: "media";
    media: string;
    rules: StyleNode[];
}

export interface ICustomMedia extends IBaseNode {
    type: "custom-media";
    name: string;
    media: string;
}

export interface IPage extends IBaseNode {
    type: "page";
    selectors: string[];
    declarations: Array<IDeclaration | IComment>;
}

export interface IDocument extends IBaseNode {
    type: "document";
    document: string;
    vendor: string;
    rules: StyleNode[];
}

export interface IFontFace extends IBaseNode {
    type: "font-face";
    declarations: Array<IDeclaration | IComment>;
}

type SimpleAtRuleName = "import" | "charset" | "namespace";

export interface ISimpleAtRule extends IBaseNode {
    type: SimpleAtRuleName;
    import?: string;
    charset?: string;
    namespace?: string;
}

export type AtRule =
    | IKeyframes
    | IMedia
    | ICustomMedia
    | ISupports
    | ISimpleAtRule
    | IDocument
    | IPage
    | IHost
    | IFontFace;

export type StyleNode = IRule | IComment | AtRule;

export interface IParseError extends Error {
    reason: string;
    filename: string | undefined;
    line: number;
    column: number;
    source: string;
}

export interface IStyleRules {
    source: string | undefined;
    rules: StyleNode[];
    parsingErrors: IParseError[];
}

export interface IStylesheet extends IBaseNode {
    type: "stylesheet";
    stylesheet: IStyleRules;
}

export function cssParse(css: string, options?: IParserOptions): IStylesheet {
    const opts: IParserOptions = options || {};

    /**
     * Positional.
     */

    let lineno = 1;
    let column = 1;

    /**
     * Update lineno and column based on `str`.
     */

    function updatePosition(str: string) {
        const lines = str.match(/\n/g);
        if (lines) lineno += lines.length;
        const i = str.lastIndexOf("\n");
        column = ~i ? str.length - i : column + str.length;
    }

    /**
     * Mark position and patch `node.position`.
     */

    function position() {
        const start = { line: lineno, column: column };
        return function <const T extends IBaseNode>(node: T): T {
            node.position = new Position(start);
            whitespace();
            return node;
        };
    }

    /**
     * Store position information for a node
     */

    class Position implements INodePosition {
        start: ILineColumn;
        end: ILineColumn;
        source: string | undefined;
        declare content: string;

        constructor(start: ILineColumn) {
            this.start = start;
            this.end = { line: lineno, column: column };
            this.source = opts.source;
        }
    }

    /**
     * Non-enumerable source string
     */

    Position.prototype.content = css;

    /**
     * Error `msg`.
     */

    const errorsList: IParseError[] = [];

    function error(msg: string): undefined {
        const err: IParseError = Object.assign(
            new Error(opts.source + ":" + lineno + ":" + column + ": " + msg),
            {
                reason: msg,
                filename: opts.source,
                line: lineno,
                column: column,
                source: css,
            },
        );

        if (opts.silent) {
            errorsList.push(err);
        } else {
            throw err;
        }
    }

    /**
     * Parse stylesheet.
     */

    function stylesheet(): IStylesheet {
        const rulesList = rules();

        return {
            type: "stylesheet",
            stylesheet: {
                source: opts.source,
                rules: rulesList,
                parsingErrors: errorsList,
            },
        };
    }

    /**
     * Opening brace.
     */

    function open() {
        return match(/^{\s*/);
    }

    /**
     * Closing brace.
     */

    function close() {
        return match(/^}/);
    }

    /**
     * Parse ruleset.
     */

    function rules(): StyleNode[] {
        let node: StyleNode | undefined;
        const rules: StyleNode[] = [];
        whitespace();
        comments(rules);
        while (css.length && css.charAt(0) != "}" && (node = atrule() || rule())) {
            rules.push(node);
            comments(rules);
        }
        return rules;
    }

    /**
     * Match `re` and return captures.
     */

    function match(re: RegExp) {
        const m = re.exec(css);
        if (!m) return;
        const str = m[0];
        updatePosition(str);
        css = css.slice(str.length);
        return m;
    }

    /**
     * Parse whitespace.
     */

    function whitespace() {
        match(/^\s*/);
    }

    /**
     * Parse comments;
     */

    function comments<T>(rules: Array<T | IComment> = []): Array<T | IComment> {
        let c: IComment | undefined;
        while ((c = comment())) {
            rules.push(c);
        }
        return rules;
    }

    /**
     * Parse comment.
     */

    function comment(): IComment | undefined {
        const pos = position();
        if ("/" != css.charAt(0) || "*" != css.charAt(1)) return;

        let i = 2;
        while ("" != css.charAt(i) && ("*" != css.charAt(i) || "/" != css.charAt(i + 1))) ++i;
        i += 2;

        if ("" === css.charAt(i - 1)) {
            return error("End of comment missing");
        }

        const str = css.slice(2, i - 2);
        column += 2;
        updatePosition(str);
        css = css.slice(i);
        column += 2;

        return pos({
            type: "comment",
            comment: str,
        });
    }

    /**
     * Parse selector.
     */

    function selector(): string[] | undefined {
        const m = match(/^([^{]+)/);
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

    /**
     * Parse declaration.
     */

    function declaration(): IDeclaration | undefined {
        const pos = position();

        // prop

        const propMatch = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!propMatch) return;
        const prop = trim(propMatch[0]);

        // :
        if (!match(/^:\s*/)) return error("property missing ':'");

        // val

        const val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);

        const ret = pos({
            type: "declaration",
            property: prop.replace(commentre, ""),
            value: val ? trim(val[0]).replace(commentre, "") : "",
        });

        // ;
        match(/^[;\s]*/);

        return ret;
    }

    /**
     * Parse declarations.
     */

    function declarations(): Array<IDeclaration | IComment> | undefined {
        const decls: Array<IDeclaration | IComment> = [];

        if (!open()) return error("missing '{'");
        comments(decls);

        // declarations
        let decl: IDeclaration | undefined;
        while ((decl = declaration())) {
            decls.push(decl);
            comments(decls);
        }

        if (!close()) return error("missing '}'");
        return decls;
    }

    /**
     * Parse keyframe.
     */

    function keyframe(): IKeyframe | undefined {
        let m;
        const vals: string[] = [];
        const pos = position();

        while ((m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/))) {
            vals.push(m[1]);
            match(/^,\s*/);
        }

        if (!vals.length) return;

        return pos({
            type: "keyframe",
            values: vals,
            declarations: declarations(),
        });
    }

    /**
     * Parse keyframes.
     */

    function atkeyframes(): IKeyframes | undefined {
        const pos = position();
        let m = match(/^@([-\w]+)?keyframes\s*/);

        if (!m) return;
        const vendor = m[1];

        // identifier
        m = match(/^([-\w]+)\s*/);
        if (!m) return error("@keyframes missing name");
        const name = m[1];

        if (!open()) return error("@keyframes missing '{'");

        let frame: IKeyframe | undefined;
        let frames = comments<IKeyframe>();
        while ((frame = keyframe())) {
            frames.push(frame);
            frames = frames.concat(comments<IKeyframe>());
        }

        if (!close()) return error("@keyframes missing '}'");

        return pos({
            type: "keyframes",
            name: name,
            vendor: vendor,
            keyframes: frames,
        });
    }

    /**
     * Parse supports.
     */

    function atsupports(): ISupports | undefined {
        const pos = position();
        const m = match(/^@supports *([^{]+)/);

        if (!m) return;
        const supports = trim(m[1]);

        if (!open()) return error("@supports missing '{'");

        const style = comments<StyleNode>().concat(rules());

        if (!close()) return error("@supports missing '}'");

        return pos({
            type: "supports",
            supports: supports,
            rules: style,
        });
    }

    /**
     * Parse host.
     */

    function athost(): IHost | undefined {
        const pos = position();
        const m = match(/^@host\s*/);

        if (!m) return;

        if (!open()) return error("@host missing '{'");

        const style = comments<StyleNode>().concat(rules());

        if (!close()) return error("@host missing '}'");

        return pos({
            type: "host",
            rules: style,
        });
    }

    /**
     * Parse media.
     */

    function atmedia(): IMedia | undefined {
        const pos = position();
        const m = match(/^@media *([^{]+)/);

        if (!m) return;
        const media = trim(m[1]);

        if (!open()) return error("@media missing '{'");

        const style = comments<StyleNode>().concat(rules());

        if (!close()) return error("@media missing '}'");

        return pos({
            type: "media",
            media: media,
            rules: style,
        });
    }

    /**
     * Parse custom-media.
     */

    function atcustommedia(): ICustomMedia | undefined {
        const pos = position();
        const m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (!m) return;

        return pos({
            type: "custom-media",
            name: trim(m[1]),
            media: trim(m[2]),
        });
    }

    /**
     * Parse paged media.
     */

    function atpage(): IPage | undefined {
        const pos = position();
        const m = match(/^@page */);
        if (!m) return;

        const sel = selector() || [];

        if (!open()) return error("@page missing '{'");
        let decls = comments<IDeclaration>();

        // declarations
        let decl: IDeclaration | undefined;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments<IDeclaration>());
        }

        if (!close()) return error("@page missing '}'");

        return pos({
            type: "page",
            selectors: sel,
            declarations: decls,
        });
    }

    /**
     * Parse document.
     */

    function atdocument(): IDocument | undefined {
        const pos = position();
        const m = match(/^@([-\w]+)?document *([^{]+)/);
        if (!m) return;

        const vendor = trim(m[1]);
        const doc = trim(m[2]);

        if (!open()) return error("@document missing '{'");

        const style = comments<StyleNode>().concat(rules());

        if (!close()) return error("@document missing '}'");

        return pos({
            type: "document",
            document: doc,
            vendor: vendor,
            rules: style,
        });
    }

    /**
     * Parse font-face.
     */

    function atfontface(): IFontFace | undefined {
        const pos = position();
        const m = match(/^@font-face\s*/);
        if (!m) return;

        if (!open()) return error("@font-face missing '{'");
        let decls = comments<IDeclaration>();

        // declarations
        let decl: IDeclaration | undefined;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments<IDeclaration>());
        }

        if (!close()) return error("@font-face missing '}'");

        return pos({
            type: "font-face",
            declarations: decls,
        });
    }

    /**
     * Parse import
     */

    const atimport = _compileAtrule("import");

    /**
     * Parse charset
     */

    const atcharset = _compileAtrule("charset");

    /**
     * Parse namespace
     */

    const atnamespace = _compileAtrule("namespace");

    /**
     * Parse non-block at-rules
     */

    function _compileAtrule(name: SimpleAtRuleName) {
        const re = new RegExp("^@" + name + "\\s*([^;]+);");
        return function (): ISimpleAtRule | undefined {
            const pos = position();
            const m = match(re);
            if (!m) return;
            const ret: ISimpleAtRule = { type: name };
            ret[name] = m[1].trim();
            return pos(ret);
        };
    }

    /**
     * Parse at rule.
     */

    function atrule(): AtRule | undefined {
        if (css[0] != "@") return;

        return (
            atkeyframes() ||
            atmedia() ||
            atcustommedia() ||
            atsupports() ||
            atimport() ||
            atcharset() ||
            atnamespace() ||
            atdocument() ||
            atpage() ||
            athost() ||
            atfontface()
        );
    }

    /**
     * Parse rule.
     */

    function rule(): IRule | undefined {
        const pos = position();
        const sel = selector();

        if (!sel) return error("selector missing");
        comments();

        return pos({
            type: "rule",
            selectors: sel,
            declarations: declarations(),
        });
    }

    return addParent(stylesheet());
}

/**
 * Trim `str`.
 */

function trim(str: string | undefined) {
    return str ? str.replace(/^\s+|\s+$/g, "") : "";
}

/**
 * Adds non-enumerable parent node reference to each node.
 */

function addParent<T>(obj: T, parent?: object): T {
    const record = obj as Record<string, unknown>;
    const isNode = obj && typeof record.type === "string";
    const childParent = isNode ? record : parent;

    for (const k in record) {
        const value = record[k];
        if (Array.isArray(value)) {
            value.forEach(function (v) {
                addParent(v, childParent);
            });
        } else if (value && typeof value === "object") {
            addParent(value, childParent);
        }
    }

    if (isNode) {
        Object.defineProperty(obj, "parent", {
            configurable: true,
            writable: true,
            enumerable: false,
            value: parent || null,
        });
    }

    return obj;
}
