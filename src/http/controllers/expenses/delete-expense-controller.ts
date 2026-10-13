import type { DeleteExpenseUseCase } from "@/use-cases/expense/delete-expense-use-case";
import type { Controller } from "../controller";
import type { HttpRequest, HttpResponse } from "../http";
import z from "zod";

const deleteExpenseSchema = z.object({
    expenseId: z.uuid()
});

export class DeleteExpenseController implements Controller {
    constructor(
        private deleteExpenseUseCase: DeleteExpenseUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { expenseId } = deleteExpenseSchema.parse(request.query);
        const userId = request.user!.id;

        await this.deleteExpenseUseCase.execute({
            id: expenseId,
            userId
        });

        return {
            statusCode: 204,
        };
    }
}