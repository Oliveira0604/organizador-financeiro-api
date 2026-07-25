import { AppError } from "./app-error";

export class NotAllowedError extends AppError {
    constructor() {
        super("You are not allowed.", 401);
    }
}