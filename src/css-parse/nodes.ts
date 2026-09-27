import type { AtRule } from "./at-rule-nodes.js";
import type { IParseError } from "./parse-error.js";
import type { INodePosition } from "./position.js";

export interface IBaseNode {
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

export type StyleNode = IRule | IComment | AtRule;

export interface IStyleRules {
    source: string | undefined;
    rules: StyleNode[];
    parsingErrors: IParseError[];
}

export interface IStylesheet extends IBaseNode {
    type: "stylesheet";
    stylesheet: IStyleRules;
}
