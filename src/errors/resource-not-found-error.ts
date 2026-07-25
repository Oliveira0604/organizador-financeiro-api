import { AppError } from "./app-error";

export class ResourceNotFoundError extends AppError {
    constructor() {
        super("Resource not found error", 404);
    }
}