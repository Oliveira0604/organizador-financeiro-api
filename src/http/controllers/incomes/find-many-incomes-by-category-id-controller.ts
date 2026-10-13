import type { FindManyIncomesByCategoryIdUseCase } from "@/use-cases/income/find-many-incomes-by-category-id-use-case";
import type { Controller } from "../controller";
import z from "zod";
import type { HttpRequest, HttpResponse } from "../http";

const findManyIncomesSchema = z.object({
    categoryId: z.uuid(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().min(1).positive()
});

export class FindManyIncomesByCategoryIdController implements Controller {
    constructor(
        private findManyIncomesByCategoryIdUseCase: FindManyIncomesByCategoryIdUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { categoryId, startDate, endDate, page } = findManyIncomesSchema.parse(request.query);
        const userId = request.user!.id;

        const result = await this.findManyIncomesByCategoryIdUseCase.execute({
            userId,
            categoryId,
            ...(startDate !== undefined && { startDate }),
            ...(endDate !== undefined && { endDate }),
            page
        });

        const incomes = result.incomes.map((income) => ({
            title: income.title,
            amount: income.amount,
            receivedAt: income.receivedAt
        }));

        return {
            statusCode: 200,
            body: incomes
        };
    }
}