import { AppError } from "./app-error";

export class JwtError extends AppError {
    constructor() {
        super("Unauthorized", 401);
        this.name = "JwtError";
    }
}