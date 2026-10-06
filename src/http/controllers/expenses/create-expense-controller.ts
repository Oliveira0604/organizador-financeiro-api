import type { CreateExpenseUseCase } from "@/use-cases/expense/create-expense-use-case";
import type { Controller } from "../controller";
import z from "zod";
import type { HttpRequest } from "../http";
import type { HttpResponse } from "../http";

const createExpenseSchema = z.object({
    title: z.string(),
    amount: z.number().multipleOf(0.01).positive()
});

const createCategoryIdSchema = z.object({
    categoryId: z.string()
});

export class CreateExpenseController implements Controller {
    constructor(
        private createExpenseUseCase: CreateExpenseUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { title, amount } = createExpenseSchema.parse(request.body);
        const { categoryId } = createCategoryIdSchema.parse(request.params);
        const userId = request.user!.id;

        const { expense } = await this.createExpenseUseCase.execute({
            title,
            amount,
            categoryId,
            userId
        });

        return {
            statusCode: 201,
            body: {
                id: expense.id,
                name: expense.title
            }
        };
    }
}

//TODO: Finish this controller. 
// Create the factory for it.