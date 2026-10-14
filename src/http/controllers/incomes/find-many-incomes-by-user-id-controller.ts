import type { FindManyIncomesByUserIdUseCase } from "@/use-cases/income/find-many-incomes-by-user-id-use-case";
import type { Controller } from "../controller";
import z from "zod";
import type { HttpRequest, HttpResponse } from "../http";

const findManyIncomesSchema = z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().min(1).positive()
});

export class FindManyIncomesByUserIdController implements Controller {
    constructor(
        private findManyIncomesByUserIdUseCase: FindManyIncomesByUserIdUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { startDate, endDate, page } = findManyIncomesSchema.parse(request.query);
        const userId = request.user!.id;

        const { incomes: result } = await this.findManyIncomesByUserIdUseCase.execute({
            userId,
            ...(startDate !== undefined && { startDate }),
            ...(endDate !== undefined && { endDate }),
            page
        });

        const incomes = result.map((income) => ({
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