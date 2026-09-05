import { AppError } from "./app-error";

export class CategoryAlreadyExistsError extends AppError {
    constructor() {
        super("Category already exists", 409);
        this.name = "CategoryAlreadyExistError";
    }
}