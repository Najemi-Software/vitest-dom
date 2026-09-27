export interface IParseError extends Error {
    reason: string;
    filename: string | undefined;
    line: number;
    column: number;
    source: string;
}
