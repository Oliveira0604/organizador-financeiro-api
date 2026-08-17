import { AppError } from "./app-error";

export class InvalidAmountError extends AppError {
    constructor() {
        super("The amount needs to be greater than 0", 422);
        this.name = "InvalidAmountError";
    }
}