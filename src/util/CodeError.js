export default class CodeError extends Error {
    constructor({ message, code, data }) {
        super(message);
        this.name = "CodeError";
        this.code = code;
        this.data = data;
    }
}
