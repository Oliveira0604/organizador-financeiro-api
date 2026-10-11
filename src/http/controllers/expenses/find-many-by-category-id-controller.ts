import type { FindManyExpensesByCategoryIdUseCase } from "@/use-cases/expense/find-many-expenses-by-category-id-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const rangeOfDateSchema = z.object({
    categoryId: z.uuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    page: z.coerce.number()
});

export class FindManyExpensesByCategoryIdController implements Controller {
    constructor(
        private findManyByCategoryIdUseCase: FindManyExpensesByCategoryIdUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { categoryId, startDate, endDate, page } = rangeOfDateSchema.parse(request.query);
        const userId = request.user!.id;

        const { expenses: result } = await this.findManyByCategoryIdUseCase.execute({
            categoryId,
            userId,
            startDate,
            endDate,
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