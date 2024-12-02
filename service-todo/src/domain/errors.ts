
const InputParseError = class extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "InputParseError";
    }
}

const TodoNotFoundError = class extends Error { 
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = "TodoNotFoundError";
    }
}

export { InputParseError, TodoNotFoundError }