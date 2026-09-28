export function deprecate(name: string, replacementText?: string) {
    // Notify user that they are using deprecated functionality.
    console.warn(
        `Warning: ${name} has been deprecated and will be removed in future updates.`,
        replacementText,
    );
}
