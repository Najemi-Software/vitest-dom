import type { IBaseNode, IComment, IDeclaration, StyleNode } from "./nodes.js";

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

export type SimpleAtRuleName = "import" | "charset" | "namespace";

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
