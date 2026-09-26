// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
const commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;

export interface ParserOptions {
    /** Silently fail on parse errors */
    silent?: boolean | undefined;
    /** The path to the file containing css. Makes errors and source maps more helpful, by letting them know where code comes from. */
    source?: string | undefined;
}

interface LineColumn {
    line: number;
    column: number;
}

/** Information about the position in the source string that corresponds to the node. */
interface NodePosition {
    start: LineColumn;
    end: LineColumn;
    /** The value of options.source if passed to css.parse. Otherwise undefined. */
    source: string | undefined;
    /** The full source string passed to css.parse. */
    content: string;
}

interface BaseNode {
    /** The possible values are the ones listed in the Types section on https://github.com/reworkcss/css page. */
    type: string;
    position?: NodePosition;
    /** A reference to the parent node, or null if the node has no parent. */
    parent?: BaseNode | null;
}

export interface Comment extends BaseNode {
    type: "comment";
    comment: string;
}

export interface Declaration extends BaseNode {
    type: "declaration";
    property: string;
    value: string;
}

export interface Rule extends BaseNode {
    type: "rule";
    selectors: string[];
    declarations: Array<Declaration | Comment> | undefined;
}

export interface Keyframe extends BaseNode {
    type: "keyframe";
    values: string[];
    declarations: Array<Declaration | Comment> | undefined;
}

export interface Keyframes extends BaseNode {
    type: "keyframes";
    name: string;
    vendor: string | undefined;
    keyframes: Array<Keyframe | Comment>;
}

export interface Supports extends BaseNode {
    type: "supports";
    supports: string;
    rules: StyleNode[];
}

export interface Host extends BaseNode {
    type: "host";
    rules: StyleNode[];
}

export interface Media extends BaseNode {
    type: "media";
    media: string;
    rules: StyleNode[];
}

export interface CustomMedia extends BaseNode {
    type: "custom-media";
    name: string;
    media: string;
}

export interface Page extends BaseNode {
    type: "page";
    selectors: string[];
    declarations: Array<Declaration | Comment>;
}

export interface Document extends BaseNode {
    type: "document";
    document: string;
    vendor: string;
    rules: StyleNode[];
}

export interface FontFace extends BaseNode {
    type: "font-face";
    declarations: Array<Declaration | Comment>;
}

type SimpleAtRuleName = "import" | "charset" | "namespace";

export interface SimpleAtRule extends BaseNode {
    type: SimpleAtRuleName;
    import?: string;
    charset?: string;
    namespace?: string;
}

export type AtRule =
    | Keyframes
    | Media
    | CustomMedia
    | Supports
    | SimpleAtRule
    | Document
    | Page
    | Host
    | FontFace;

export type StyleNode = Rule | Comment | AtRule;

export interface ParseError extends Error {
    reason: string;
    filename: string | undefined;
    line: number;
    column: number;
    source: string;
}

export interface StyleRules {
    source: string | undefined;
    rules: StyleNode[];
    parsingErrors: ParseError[];
}

export interface Stylesheet extends BaseNode {
    type: "stylesheet";
    stylesheet: StyleRules;
}

function cssParse(css: string, options?: ParserOptions): Stylesheet {
    const opts: ParserOptions = options || {};

    /**
     * Positional.
     */

    let lineno = 1;
    let column = 1;

    /**
     * Update lineno and column based on `str`.
     */

    function updatePosition(str: string) {
        let lines = str.match(/\n/g);
        if (lines) lineno += lines.length;
        let i = str.lastIndexOf("\n");
        column = ~i ? str.length - i : column + str.length;
    }

    /**
     * Mark position and patch `node.position`.
     */

    function position() {
        let start = { line: lineno, column: column };
        return function <const T extends BaseNode>(node: T): T {
            node.position = new Position(start);
            whitespace();
            return node;
        };
    }

    /**
     * Store position information for a node
     */

    class Position implements NodePosition {
        start: LineColumn;
        end: LineColumn;
        source: string | undefined;
        declare content: string;

        constructor(start: LineColumn) {
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

    let errorsList: ParseError[] = [];

    function error(msg: string): undefined {
        let err: ParseError = Object.assign(
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

    function stylesheet(): Stylesheet {
        let rulesList = rules();

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
        let rules: StyleNode[] = [];
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
        let m = re.exec(css);
        if (!m) return;
        let str = m[0];
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

    function comments<T>(rules: Array<T | Comment> = []): Array<T | Comment> {
        let c: Comment | undefined;
        while ((c = comment())) {
            rules.push(c);
        }
        return rules;
    }

    /**
     * Parse comment.
     */

    function comment(): Comment | undefined {
        let pos = position();
        if ("/" != css.charAt(0) || "*" != css.charAt(1)) return;

        let i = 2;
        while ("" != css.charAt(i) && ("*" != css.charAt(i) || "/" != css.charAt(i + 1))) ++i;
        i += 2;

        if ("" === css.charAt(i - 1)) {
            return error("End of comment missing");
        }

        let str = css.slice(2, i - 2);
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
        let m = match(/^([^{]+)/);
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

    function declaration(): Declaration | undefined {
        let pos = position();

        // prop
        // eslint-disable-next-line no-useless-escape
        let propMatch = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!propMatch) return;
        let prop = trim(propMatch[0]);

        // :
        if (!match(/^:\s*/)) return error("property missing ':'");

        // val
        // eslint-disable-next-line no-useless-escape
        let val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);

        let ret = pos({
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

    function declarations(): Array<Declaration | Comment> | undefined {
        let decls: Array<Declaration | Comment> = [];

        if (!open()) return error("missing '{'");
        comments(decls);

        // declarations
        let decl: Declaration | undefined;
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

    function keyframe(): Keyframe | undefined {
        let m;
        let vals: string[] = [];
        let pos = position();

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

    function atkeyframes(): Keyframes | undefined {
        let pos = position();
        let m = match(/^@([-\w]+)?keyframes\s*/);

        if (!m) return;
        let vendor = m[1];

        // identifier
        m = match(/^([-\w]+)\s*/);
        if (!m) return error("@keyframes missing name");
        let name = m[1];

        if (!open()) return error("@keyframes missing '{'");

        let frame: Keyframe | undefined;
        let frames = comments<Keyframe>();
        while ((frame = keyframe())) {
            frames.push(frame);
            frames = frames.concat(comments<Keyframe>());
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

    function atsupports(): Supports | undefined {
        let pos = position();
        let m = match(/^@supports *([^{]+)/);

        if (!m) return;
        let supports = trim(m[1]);

        if (!open()) return error("@supports missing '{'");

        let style = comments<StyleNode>().concat(rules());

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

    function athost(): Host | undefined {
        let pos = position();
        let m = match(/^@host\s*/);

        if (!m) return;

        if (!open()) return error("@host missing '{'");

        let style = comments<StyleNode>().concat(rules());

        if (!close()) return error("@host missing '}'");

        return pos({
            type: "host",
            rules: style,
        });
    }

    /**
     * Parse media.
     */

    function atmedia(): Media | undefined {
        let pos = position();
        let m = match(/^@media *([^{]+)/);

        if (!m) return;
        let media = trim(m[1]);

        if (!open()) return error("@media missing '{'");

        let style = comments<StyleNode>().concat(rules());

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

    function atcustommedia(): CustomMedia | undefined {
        let pos = position();
        let m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
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

    function atpage(): Page | undefined {
        let pos = position();
        let m = match(/^@page */);
        if (!m) return;

        let sel = selector() || [];

        if (!open()) return error("@page missing '{'");
        let decls = comments<Declaration>();

        // declarations
        let decl: Declaration | undefined;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments<Declaration>());
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

    function atdocument(): Document | undefined {
        let pos = position();
        let m = match(/^@([-\w]+)?document *([^{]+)/);
        if (!m) return;

        let vendor = trim(m[1]);
        let doc = trim(m[2]);

        if (!open()) return error("@document missing '{'");

        let style = comments<StyleNode>().concat(rules());

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

    function atfontface(): FontFace | undefined {
        let pos = position();
        let m = match(/^@font-face\s*/);
        if (!m) return;

        if (!open()) return error("@font-face missing '{'");
        let decls = comments<Declaration>();

        // declarations
        let decl: Declaration | undefined;
        while ((decl = declaration())) {
            decls.push(decl);
            decls = decls.concat(comments<Declaration>());
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

    let atimport = _compileAtrule("import");

    /**
     * Parse charset
     */

    let atcharset = _compileAtrule("charset");

    /**
     * Parse namespace
     */

    let atnamespace = _compileAtrule("namespace");

    /**
     * Parse non-block at-rules
     */

    function _compileAtrule(name: SimpleAtRuleName) {
        let re = new RegExp("^@" + name + "\\s*([^;]+);");
        return function (): SimpleAtRule | undefined {
            let pos = position();
            let m = match(re);
            if (!m) return;
            let ret: SimpleAtRule = { type: name };
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

    function rule(): Rule | undefined {
        let pos = position();
        let sel = selector();

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
    let record = obj as Record<string, unknown>;
    let isNode = obj && typeof record.type === "string";
    let childParent = isNode ? record : parent;

    for (var k in record) {
        let value = record[k];
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

export default cssParse;
