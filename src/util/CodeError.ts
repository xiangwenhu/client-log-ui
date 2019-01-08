export default class CodeError extends Error {

    code?: number
    data?: any

    constructor({ message, code, data }: {
        message: string,
        code?: number,
        data?: any
    }) {
        super(message);
        this.name = "CodeError";
        this.code = code
        this.data = data
    }
}
