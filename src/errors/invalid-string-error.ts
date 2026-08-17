import { AppError } from "./app-error";

export class InvalidStringError extends AppError {
    constructor(fieldName?: string) {
        super(fieldName ? `${fieldName} não pode ser vázio` : "Invalid fiel", 422);
        this.name = "InvalidStringError";
    }
}