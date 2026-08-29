import { AppError } from "./app-error";

export class InvalidDateError extends AppError {
    constructor() {
        super("This date is not valid.", 422);
        this.name = "InvalidDateError";
    }
}