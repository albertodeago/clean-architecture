
const InputParseError = class extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "InputParseError";
    }
}

export { InputParseError }