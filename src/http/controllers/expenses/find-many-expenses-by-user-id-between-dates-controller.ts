
import type { FindManyExpensesByUserIdUseCase } from "@/use-cases/expense/find-many-expenses-by-user-id-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const findManyExpensesSchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1)
});

export class FindManyExpensesByUserIdController implements Controller {
    constructor(
        private findManyExpensesByUserIdUseCase: FindManyExpensesByUserIdUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { startDate, endDate, page } = findManyExpensesSchema.parse(request.query);
        const userId = request.user!.id;

        const { expenses: result } = await this.findManyExpensesByUserIdUseCase.execute({
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