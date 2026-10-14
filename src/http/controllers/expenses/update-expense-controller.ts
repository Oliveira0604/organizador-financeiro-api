import type { UpdateExpenseUseCase } from "@/use-cases/expense/update-expense-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const updateExpenseQuerySchema = z.object({
    categoryId: z.uuid()
});

const updateExpenseBodySchema = z.object({
    title: z.string().optional(),
    categoryName: z.string().optional(),
    amount: z.number().min(1)
});

export class UpdateExpenseController implements Controller {
    constructor(
        private updateExpenseUseCase: UpdateExpenseUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { categoryId } = updateExpenseQuerySchema.parse(request.query);
        const { title, categoryName, amount } = updateExpenseBodySchema.parse(request.body);
        const userId = request.user!.id;

        const { expense: updatedExpense } = await this.updateExpenseUseCase.execute({
            id: categoryId,
            userId,
            ...(title !== undefined && { title }),
            ...(categoryName !== undefined && { categoryName }),
            ...(amount !== undefined && { amount })
        });

        return {
            statusCode: 200,
            body: {
                title: updatedExpense!.title,
                amount: updatedExpense!.amount,
                categoryName: categoryName
            }
        };
    }
}