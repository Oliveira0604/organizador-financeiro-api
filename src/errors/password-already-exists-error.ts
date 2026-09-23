import { AppError } from "./app-error";

export class PasswordAlreadyExistsError extends AppError {
    constructor() {
        super("password already exists", 409);
        this.name = "password already exists";
    }
}