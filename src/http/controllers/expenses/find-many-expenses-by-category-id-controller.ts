import type { FindManyExpensesByCategoryIdUseCase } from "@/use-cases/expense/find-many-expenses-by-category-id-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const findManyExpensesSchema = z.object({
    categoryId: z.uuid(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1)
});

export class FindManyExpensesByCategoryIdController implements Controller {
    constructor(
        private findManyByCategoryIdUseCase: FindManyExpensesByCategoryIdUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { categoryId, startDate, endDate, page } = findManyExpensesSchema.parse(request.query);
        const userId = request.user!.id;

        const { expenses: result } = await this.findManyByCategoryIdUseCase.execute({
            categoryId,
            userId,
            ...(startDate !== undefined && { startDate }),
            ...(endDate !== undefined && { endDate }),
            page
        });

        const expenses = result.map((expense) => ({
            title: expense.title,
            amount: expense.amount
        }));

        return {
            statusCode: 200,
            body: expenses
        };
    }
}