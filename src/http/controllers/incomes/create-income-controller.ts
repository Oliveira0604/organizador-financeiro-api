import type { CreateIncomeUseCase } from "@/use-cases/income/create-income-use-case";
import z from "zod";
import type { HttpRequest, HttpResponse } from "../http";
import type { Controller } from "../controller";

const createIncomeQuerySchema = z.object({
    categoryId: z.uuid()
});

const createIncomeBodySchema = z.object({
    title: z.string().min(1).trim(),
    amount: z.number().multipleOf(0.01).positive()
});

export class CreateIncomeController implements Controller {
    constructor(
        private createIncomeUseCase: CreateIncomeUseCase
    ) { }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const { categoryId } = createIncomeQuerySchema.parse(request.query);
        const { title, amount } = createIncomeBodySchema.parse(request.body);
        const userId = request.user!.id;

        const { income } = await this.createIncomeUseCase.execute({
            userId,
            categoryId,
            title,
            amount
        });

        return {
            statusCode: 201,
            body: {
                title: income.title,
                amount: income.amount
            }
        };
    }
}