import { AppError } from "./app-error";

export class UserAlreadyExistsError extends AppError {
    constructor() {
        super("User Already exists", 409);
    }
}