export interface IParserOptions {
    /** Silently fail on parse errors */
    silent?: boolean | undefined;
    /** The path to the file containing css. Makes errors and source maps more helpful, by letting them know where code comes from. */
    source?: string | undefined;
}
