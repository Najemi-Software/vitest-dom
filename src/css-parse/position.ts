export interface ILineColumn {
    line: number;
    column: number;
}

/** Information about the position in the source string that corresponds to the node. */
export interface INodePosition {
    start: ILineColumn;
    end: ILineColumn;
    /** The value of options.source if passed to css.parse. Otherwise undefined. */
    source: string | undefined;
    /** The full source string passed to css.parse. */
    content: string;
}

/**
 * Store position information for a node
 */

export function createPositionClass(content: string) {
    class Position implements INodePosition {
        start: ILineColumn;
        end: ILineColumn;
        source: string | undefined;
        declare content: string;

        constructor(start: ILineColumn, end: ILineColumn, source: string | undefined) {
            this.start = start;
            this.end = end;
            this.source = source;
        }
    }

    /**
     * Non-enumerable source string
     */

    Position.prototype.content = content;

    return Position;
}
